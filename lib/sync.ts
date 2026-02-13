import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { syncEvents } from './sync-events';

// ============================================
// camelCase ↔ snake_case transformation
// ============================================

// Special field aliases where simple camelCase→snake_case doesn't match the DB column
const CAMEL_TO_SNAKE_ALIASES: Record<string, string> = {
  imageUri: 'image_url',
  couplePhoto: 'couple_photo_url',
  photoUrl: 'photo_url',
};

const SNAKE_TO_CAMEL_ALIASES: Record<string, string> = {
  image_url: 'imageUri',
  couple_photo_url: 'couplePhoto',
  photo_url: 'photoUrl',
};

const camelToSnakeKey = (key: string): string => {
  if (CAMEL_TO_SNAKE_ALIASES[key]) return CAMEL_TO_SNAKE_ALIASES[key];
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const snakeToCamelKey = (key: string): string => {
  if (SNAKE_TO_CAMEL_ALIASES[key]) return SNAKE_TO_CAMEL_ALIASES[key];
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelToSnake = (obj: Record<string, any>): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    result[camelToSnakeKey(key)] = obj[key];
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const snakeToCamel = (obj: Record<string, any>): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    result[snakeToCamelKey(key)] = obj[key];
  }
  return result;
};

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

  const snakeRecord = camelToSnake({ ...record, space_id: spaceId });

  const online = await isOnline();
  if (!online) {
    await addPendingOp({ table, operation: 'upsert', record: snakeRecord });
    return;
  }

  const { error } = await supabase.from(table).upsert(snakeRecord);

  if (error) {
    console.error(`Sync push error (${table}):`, error.message);
    syncEvents.emit("Couldn't save \u2014 we'll retry later");
    await addPendingOp({ table, operation: 'upsert', record: snakeRecord });
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

  return (data ?? []).map((row) => snakeToCamel(row)) as T[];
};

// ============================================
// Flush Pending Operations
// ============================================

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const executeOpWithRetry = async (op: PendingOperation): Promise<boolean> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await delay(BASE_DELAY_MS * Math.pow(2, attempt - 1));
    }

    if (op.operation === 'upsert' && op.record) {
      const { error } = await supabase.from(op.table).upsert(op.record);
      if (!error) return true;
    } else if (op.operation === 'delete' && op.recordId) {
      const spaceId = getSpaceId();
      if (spaceId) {
        const { error } = await supabase
          .from(op.table)
          .delete()
          .eq('id', op.recordId)
          .eq('space_id', spaceId);
        if (!error) return true;
      }
    }
  }
  return false;
};

export const flushPendingOperations = async (): Promise<void> => {
  const ops = await loadPendingOps();
  if (ops.length === 0) return;

  const online = await isOnline();
  if (!online) return;

  const remaining: PendingOperation[] = [];

  for (const op of ops) {
    const succeeded = await executeOpWithRetry(op);
    if (!succeeded) {
      remaining.push(op);
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
          callbacks.onInsert(snakeToCamel(payload.new as Record<string, unknown>) as T);
        } else if (payload.eventType === 'UPDATE' && callbacks.onUpdate) {
          callbacks.onUpdate(snakeToCamel(payload.new as Record<string, unknown>) as T);
        } else if (payload.eventType === 'DELETE' && callbacks.onDelete) {
          callbacks.onDelete(payload.old as { id: string });
        }
      }
    )
    .subscribe();

  return channel;
};
