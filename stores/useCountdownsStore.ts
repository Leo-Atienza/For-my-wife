import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { CountdownEvent } from '@/lib/types';

interface CountdownsState {
  countdowns: CountdownEvent[];
  addCountdown: (title: string, targetDate: string, emoji?: string, isRecurring?: boolean) => void;
  removeCountdown: (id: string) => void;
  updateCountdown: (id: string, updates: Partial<CountdownEvent>) => void;
  reset: () => void;
}

export const useCountdownsStore = create<CountdownsState>()(
  persist(
    (set) => ({
      countdowns: [],

      addCountdown: (title, targetDate, emoji, isRecurring = false) =>
        set((state) => ({
          countdowns: [
            ...state.countdowns,
            {
              id: generateId(),
              title,
              targetDate,
              emoji,
              isRecurring,
            },
          ],
        })),

      removeCountdown: (id) =>
        set((state) => ({
          countdowns: state.countdowns.filter((c) => c.id !== id),
        })),

      updateCountdown: (id, updates) =>
        set((state) => ({
          countdowns: state.countdowns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      reset: () => set({ countdowns: [] }),
    }),
    {
      name: 'countdowns-storage',
      storage: zustandStorage,
    }
  )
);
