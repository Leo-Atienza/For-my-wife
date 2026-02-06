import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { MoodEntry, PartnerRole } from '@/lib/types';

interface MoodState {
  entries: MoodEntry[];
  addEntry: (partner: PartnerRole, mood: string, note?: string) => void;
  removeEntry: (id: string) => void;
  getEntriesByPartner: (partner: PartnerRole) => MoodEntry[];
  getTodayEntry: (partner: PartnerRole) => MoodEntry | undefined;
  getRecentEntries: (partner: PartnerRole, count: number) => MoodEntry[];
  reset: () => void;
}

const getTodayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (partner, mood, note) => {
        const todayKey = getTodayKey();
        set((state) => {
          const existing = state.entries.find(
            (e) => e.partner === partner && e.date === todayKey
          );
          if (existing) {
            return {
              entries: state.entries.map((e) =>
                e.id === existing.id ? { ...e, mood, note } : e
              ),
            };
          }
          return {
            entries: [
              {
                id: generateId(),
                partner,
                mood,
                note,
                date: todayKey,
              },
              ...state.entries,
            ],
          };
        });
      },

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      getEntriesByPartner: (partner) =>
        get().entries.filter((e) => e.partner === partner),

      getTodayEntry: (partner) => {
        const todayKey = getTodayKey();
        return get().entries.find(
          (e) => e.partner === partner && e.date === todayKey
        );
      },

      getRecentEntries: (partner, count) =>
        get()
          .entries.filter((e) => e.partner === partner)
          .slice(0, count),

      reset: () => set({ entries: [] }),
    }),
    {
      name: 'mood-storage',
      storage: zustandStorage,
    }
  )
);
