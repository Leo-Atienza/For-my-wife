import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { pushToSupabase } from '@/lib/sync';
import type { LoveLanguageResult, LoveLanguageType, PartnerRole } from '@/lib/types';

interface LoveLanguageState {
  results: LoveLanguageResult[];
  saveResult: (
    partner: PartnerRole,
    scores: Record<LoveLanguageType, number>
  ) => void;
  getResult: (partner: PartnerRole) => LoveLanguageResult | undefined;
  loadFromRemote: (records: LoveLanguageResult[]) => void;
  syncRemoteInsert: (record: LoveLanguageResult) => void;
  syncRemoteUpdate: (record: LoveLanguageResult) => void;
  syncRemoteDelete: (partner: PartnerRole) => void;
  reset: () => void;
}

const getPrimaryLanguage = (
  scores: Record<LoveLanguageType, number>
): LoveLanguageType => {
  const entries = Object.entries(scores) as [LoveLanguageType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
};

export const useLoveLanguageStore = create<LoveLanguageState>()(
  persist(
    (set, get) => ({
      results: [],

      saveResult: (partner, scores) => {
        const result: LoveLanguageResult = {
          partner,
          primary: getPrimaryLanguage(scores),
          scores,
          completedAt: new Date().toISOString(),
        };
        set((state) => ({
          results: [
            ...state.results.filter((r) => r.partner !== partner),
            result,
          ],
        }));
        pushToSupabase('love_language_results', { ...result, id: partner });
      },

      getResult: (partner) => {
        return get().results.find((r) => r.partner === partner);
      },

      loadFromRemote: (records) => set({ results: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.results.some((r) => r.partner === record.partner)) return state;
          return { results: [...state.results, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          results: state.results.map((r) =>
            r.partner === record.partner ? record : r
          ),
        })),

      syncRemoteDelete: (partner) =>
        set((state) => ({
          results: state.results.filter((r) => r.partner !== partner),
        })),

      reset: () => set({ results: [] }),
    }),
    {
      name: 'love-language-storage',
      storage: zustandStorage,
    }
  )
);
