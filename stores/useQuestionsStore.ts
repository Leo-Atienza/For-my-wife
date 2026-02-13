import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase } from '@/lib/sync';
import { DAILY_QUESTIONS } from '@/lib/constants';
import type { DailyQuestionEntry, PartnerRole } from '@/lib/types';

interface QuestionsState {
  entries: DailyQuestionEntry[];
  getTodayEntry: () => DailyQuestionEntry | undefined;
  createTodayEntry: () => DailyQuestionEntry;
  answerQuestion: (entryId: string, partner: PartnerRole, answer: string) => void;
  submitPhoto: (entryId: string, partner: PartnerRole, photoUri: string) => void;
  loadFromRemote: (records: DailyQuestionEntry[]) => void;
  syncRemoteInsert: (record: DailyQuestionEntry) => void;
  syncRemoteUpdate: (record: DailyQuestionEntry) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

const getTodayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getDailyQuestionIndex = (): number => {
  const start = new Date(2024, 0, 1);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff % DAILY_QUESTIONS.length;
};

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      entries: [],

      getTodayEntry: () => {
        const todayKey = getTodayKey();
        return get().entries.find((e) => e.dateKey === todayKey);
      },

      createTodayEntry: () => {
        const todayKey = getTodayKey();
        const existing = get().entries.find((e) => e.dateKey === todayKey);
        if (existing) return existing;

        const idx = getDailyQuestionIndex();
        const question = DAILY_QUESTIONS[idx];
        const newEntry: DailyQuestionEntry = {
          id: generateId(),
          questionId: question.id,
          question: question.question,
          category: question.category,
          dateKey: todayKey,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));
        pushToSupabase('daily_question_entries', newEntry);

        return newEntry;
      },

      answerQuestion: (entryId, partner, answer) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  ...(partner === 'partner1'
                    ? { partner1Answer: answer }
                    : { partner2Answer: answer }),
                }
              : e
          ),
        }));
        const updated = get().entries.find((e) => e.id === entryId);
        if (updated) pushToSupabase('daily_question_entries', updated);
      },

      submitPhoto: (entryId, partner, photoUri) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  ...(partner === 'partner1'
                    ? { partner1Photo: photoUri }
                    : { partner2Photo: photoUri }),
                }
              : e
          ),
        }));
        const updated = get().entries.find((e) => e.id === entryId);
        if (updated) pushToSupabase('daily_question_entries', updated);
      },

      loadFromRemote: (records) => set({ entries: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.entries.some((e) => e.id === record.id)) return state;
          return { entries: [record, ...state.entries] };
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
      name: 'questions-storage',
      storage: zustandStorage,
    }
  )
);
