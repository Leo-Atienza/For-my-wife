import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { syncEvents } from './sync-events';

// ============================================
// Offline Queue
// ============================================

interface PendingOperation {
  id: string;
  table: string;
  operation: 'upsert' | 'delete';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record?: Record<string, any>;
  recordId?: string;
  createdAt: string;
}

const PENDING_OPS_KEY = 'sync-pending-operations';
const MAX_PENDING_OPS = 200;

const loadPendingOps = async (): Promise<PendingOperation[]> => {
  const raw = await AsyncStorage.getItem(PENDING_OPS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const savePendingOps = async (ops: PendingOperation[]): Promise<void> => {
  await AsyncStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
};

const addPendingOp = async (op: Omit<PendingOperation, 'id' | 'createdAt'>): Promise<void> => {
  let ops = await loadPendingOps();

  // Deduplicate: if an op for the same table + record already exists, replace it
  if (op.operation === 'upsert' && op.record?.id) {
    ops = ops.filter(
      (existing) => !(existing.table === op.table && existing.record?.id === op.record?.id)
    );
  } else if (op.operation === 'delete' && op.recordId) {
    ops = ops.filter(
      (existing) => !(existing.table === op.table && existing.recordId === op.recordId)
    );
  }

  ops.push({
    ...op,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  });
  // Cap queue size to prevent unbounded memory growth — drop oldest entries
  if (ops.length > MAX_PENDING_OPS) {
    ops = ops.slice(ops.length - MAX_PENDING_OPS);
  }
  await savePendingOps(ops);
};

// ============================================
// Core Sync Functions
// ============================================

const getSpaceId = (): string | null => {
  return useAuthStore.getState().spaceId;
};

const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const pushToSupabase = async (
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: Record<string, any>
): Promise<void> => {
  const spaceId = getSpaceId();
  if (!spaceId) return;

  const recordWithSpace = { ...record, space_id: spaceId };

  const online = await isOnline();
  if (!online) {
    await addPendingOp({ table, operation: 'upsert', record: recordWithSpace });
    return;
  }

  const { error } = await supabase.from(table).upsert(recordWithSpace);

  if (error) {
    console.error(`Sync push error (${table}):`, error.message);
    syncEvents.emit("Couldn't save \u2014 we'll retry later");
    await addPendingOp({ table, operation: 'upsert', record: recordWithSpace });
  }
};

export const deleteFromSupabase = async (
  table: string,
  id: string
): Promise<void> => {
  const spaceId = getSpaceId();
  if (!spaceId) return;

  const online = await isOnline();
  if (!online) {
    await addPendingOp({ table, operation: 'delete', recordId: id });
    return;
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('space_id', spaceId);

  if (error) {
    console.error(`Sync delete error (${table}):`, error.message);
    syncEvents.emit("Couldn't save \u2014 we'll retry later");
    await addPendingOp({ table, operation: 'delete', recordId: id });
  }
};

export const pullFromSupabase = async <T>(
  table: string
): Promise<T[]> => {
  const spaceId = getSpaceId();
  if (!spaceId) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('space_id', spaceId);

  if (error) {
    console.error(`Sync pull error (${table}):`, error.message);
    return [];
  }

  return (data ?? []) as T[];
};

// ============================================
// Flush Pending Operations
// ============================================

export const flushPendingOperations = async (): Promise<void> => {
  const ops = await loadPendingOps();
  if (ops.length === 0) return;

  const online = await isOnline();
  if (!online) return;

  const remaining: PendingOperation[] = [];

  for (const op of ops) {
    if (op.operation === 'upsert' && op.record) {
      const { error } = await supabase.from(op.table).upsert(op.record);
      if (error) {
        remaining.push(op);
      }
    } else if (op.operation === 'delete' && op.recordId) {
      const spaceId = getSpaceId();
      if (spaceId) {
        const { error } = await supabase
          .from(op.table)
          .delete()
          .eq('id', op.recordId)
          .eq('space_id', spaceId);
        if (error) {
          remaining.push(op);
        }
      }
    }
  }

  await savePendingOps(remaining);
};

// ============================================
// Realtime Subscription Helper
// ============================================

export interface RealtimeCallbacks<T> {
  onInsert?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onDelete?: (oldRecord: { id: string }) => void;
}

export const subscribeToTable = <T extends { id: string }>(
  table: string,
  callbacks: RealtimeCallbacks<T>
) => {
  const spaceId = getSpaceId();
  if (!spaceId) return null;

  const channel = supabase
    .channel(`${table}-${spaceId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter: `space_id=eq.${spaceId}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT' && callbacks.onInsert) {
          callbacks.onInsert(payload.new as T);
        } else if (payload.eventType === 'UPDATE' && callbacks.onUpdate) {
          callbacks.onUpdate(payload.new as T);
        } else if (payload.eventType === 'DELETE' && callbacks.onDelete) {
          callbacks.onDelete(payload.old as { id: string });
        }
      }
    )
    .subscribe();

  return channel;
};
