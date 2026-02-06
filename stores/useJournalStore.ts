import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { JournalLetter, PartnerRole } from '@/lib/types';

interface JournalState {
  letters: JournalLetter[];
  addLetter: (author: PartnerRole, content: string, weekKey: string, revealDate: string) => void;
  removeLetter: (id: string) => void;
  getLettersByWeek: (weekKey: string) => JournalLetter[];
  getLetterForWeek: (author: PartnerRole, weekKey: string) => JournalLetter | undefined;
  isRevealed: (weekKey: string) => boolean;
  getAllWeekKeys: () => string[];
  reset: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      letters: [],

      addLetter: (author, content, weekKey, revealDate) => {
        set((state) => {
          const existing = state.letters.find(
            (l) => l.author === author && l.weekKey === weekKey
          );
          if (existing) {
            return {
              letters: state.letters.map((l) =>
                l.id === existing.id ? { ...l, content } : l
              ),
            };
          }
          return {
            letters: [
              {
                id: generateId(),
                author,
                content,
                weekKey,
                revealDate,
                createdAt: new Date().toISOString(),
              },
              ...state.letters,
            ],
          };
        });
      },

      removeLetter: (id) =>
        set((state) => ({
          letters: state.letters.filter((l) => l.id !== id),
        })),

      getLettersByWeek: (weekKey) =>
        get().letters.filter((l) => l.weekKey === weekKey),

      getLetterForWeek: (author, weekKey) =>
        get().letters.find((l) => l.author === author && l.weekKey === weekKey),

      isRevealed: (weekKey) => {
        const letters = get().letters.filter((l) => l.weekKey === weekKey);
        if (letters.length === 0) return false;
        const revealDate = letters[0].revealDate;
        return new Date() >= new Date(revealDate);
      },

      getAllWeekKeys: () => {
        const keys = new Set(get().letters.map((l) => l.weekKey));
        return Array.from(keys).sort().reverse();
      },

      reset: () => set({ letters: [] }),
    }),
    {
      name: 'journal-storage',
      storage: zustandStorage,
    }
  )
);
