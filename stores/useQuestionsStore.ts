import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { DAILY_QUESTIONS } from '@/lib/constants';
import type { DailyQuestionEntry, PartnerRole } from '@/lib/types';

interface QuestionsState {
  entries: DailyQuestionEntry[];
  getTodayEntry: () => DailyQuestionEntry | undefined;
  createTodayEntry: () => DailyQuestionEntry;
  answerQuestion: (entryId: string, partner: PartnerRole, answer: string) => void;
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

        return newEntry;
      },

      answerQuestion: (entryId, partner, answer) =>
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
        })),

      reset: () => set({ entries: [] }),
    }),
    {
      name: 'questions-storage',
      storage: zustandStorage,
    }
  )
);
