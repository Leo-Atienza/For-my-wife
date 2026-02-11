import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { CountdownEvent } from '@/lib/types';

interface CountdownsState {
  countdowns: CountdownEvent[];
  addCountdown: (title: string, targetDate: string, emoji?: string, isRecurring?: boolean) => void;
  removeCountdown: (id: string) => void;
  updateCountdown: (id: string, updates: Partial<CountdownEvent>) => void;
  loadFromRemote: (records: CountdownEvent[]) => void;
  syncRemoteInsert: (record: CountdownEvent) => void;
  syncRemoteUpdate: (record: CountdownEvent) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useCountdownsStore = create<CountdownsState>()(
  persist(
    (set, get) => ({
      countdowns: [],

      addCountdown: (title, targetDate, emoji, isRecurring = false) => {
        const now = new Date().toISOString();
        const countdown: CountdownEvent = {
          id: generateId(),
          title,
          targetDate,
          emoji,
          isRecurring,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          countdowns: [...state.countdowns, countdown],
        }));
        pushToSupabase('countdown_events', countdown);
      },

      removeCountdown: (id) => {
        set((state) => ({
          countdowns: state.countdowns.filter((c) => c.id !== id),
        }));
        deleteFromSupabase('countdown_events', id);
      },

      updateCountdown: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          countdowns: state.countdowns.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: now } : c
          ),
        }));
        const updated = get().countdowns.find((c) => c.id === id);
        if (updated) pushToSupabase('countdown_events', updated);
      },

      loadFromRemote: (records) => set({ countdowns: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.countdowns.some((c) => c.id === record.id)) return state;
          return { countdowns: [...state.countdowns, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          countdowns: state.countdowns.map((c) => {
            if (c.id !== record.id) return c;
            return isNewerRecord(c, record) ? { ...c, ...record } : c;
          }),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          countdowns: state.countdowns.filter((c) => c.id !== id),
        })),

      reset: () => set({ countdowns: [] }),
    }),
    {
      name: 'countdowns-storage',
      storage: zustandStorage,
    }
  )
);
