import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { JournalLetter, PartnerRole } from '@/lib/types';

interface JournalState {
  letters: JournalLetter[];
  addLetter: (author: PartnerRole, content: string, weekKey: string, revealDate: string) => void;
  removeLetter: (id: string) => void;
  getLettersByWeek: (weekKey: string) => JournalLetter[];
  getLetterForWeek: (author: PartnerRole, weekKey: string) => JournalLetter | undefined;
  isRevealed: (weekKey: string) => boolean;
  getAllWeekKeys: () => string[];
  loadFromRemote: (records: JournalLetter[]) => void;
  syncRemoteInsert: (record: JournalLetter) => void;
  syncRemoteUpdate: (record: JournalLetter) => void;
  syncRemoteDelete: (id: string) => void;
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
            const updated = { ...existing, content };
            pushToSupabase('journal_letters', updated);
            return {
              letters: state.letters.map((l) =>
                l.id === existing.id ? updated : l
              ),
            };
          }
          const newLetter: JournalLetter = {
            id: generateId(),
            author,
            content,
            weekKey,
            revealDate,
            createdAt: new Date().toISOString(),
          };
          pushToSupabase('journal_letters', newLetter);
          return {
            letters: [newLetter, ...state.letters],
          };
        });
      },

      removeLetter: (id) => {
        set((state) => ({
          letters: state.letters.filter((l) => l.id !== id),
        }));
        deleteFromSupabase('journal_letters', id);
      },

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

      loadFromRemote: (records) => set({ letters: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.letters.some((l) => l.id === record.id)) return state;
          return { letters: [record, ...state.letters] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          letters: state.letters.map((l) =>
            l.id === record.id ? { ...l, ...record } : l
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          letters: state.letters.filter((l) => l.id !== id),
        })),

      reset: () => set({ letters: [] }),
    }),
    {
      name: 'journal-storage',
      storage: zustandStorage,
    }
  )
);
