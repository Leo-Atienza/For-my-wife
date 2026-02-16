import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import type { PartnerRole } from '@/lib/types';

type SleepStatus = 'sleeping' | 'awake';

interface SleepWakeEntry {
  id: string;
  partner: PartnerRole;
  status: SleepStatus;
  createdAt: string;
}

interface SleepWakeState {
  entries: SleepWakeEntry[];
  getLatestStatus: (partner: PartnerRole) => SleepStatus | null;
  setStatus: (partner: PartnerRole, status: SleepStatus) => void;
  loadFromRemote: (records: SleepWakeEntry[]) => void;
  syncRemoteInsert: (record: SleepWakeEntry) => void;
  syncRemoteUpdate: (record: SleepWakeEntry) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useSleepWakeStore = create<SleepWakeState>()(
  persist(
    (set, get) => ({
      entries: [],

      getLatestStatus: (partner) => {
        const partnerEntries = get().entries.filter((e) => e.partner === partner);
        if (partnerEntries.length === 0) return null;
        // Sort by createdAt descending to guarantee latest entry
        const sorted = [...partnerEntries].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sorted[0].status;
      },

      setStatus: (partner, status) => {
        const entry: SleepWakeEntry = {
          id: generateId(),
          partner,
          status,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          // Keep only the latest entry per partner + new entry
          entries: [
            entry,
            ...state.entries.filter((e) => e.partner !== partner),
          ],
        }));
        pushToSupabase('sleep_wake_status', {
          id: entry.id,
          partner: entry.partner,
          status: entry.status,
          created_at: entry.createdAt,
        });
        const message =
          status === 'sleeping'
            ? '🌜 Your partner is going to sleep. Goodnight!'
            : '☀\ufe0f Your partner just woke up. Good morning!';
        sendPushToPartner(
          status === 'sleeping' ? 'Goodnight' : 'Good Morning',
          message,
          '/'
        );
      },

      loadFromRemote: (records) => set({ entries: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.entries.some((e) => e.id === record.id)) return state;
          return {
            entries: [
              record,
              ...state.entries.filter((e) => e.partner !== record.partner),
            ],
          };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === record.id ? { ...e, ...record } : e
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      reset: () => set({ entries: [] }),
    }),
    {
      name: 'sleep-wake-storage',
      storage: zustandStorage,
    }
  )
);
