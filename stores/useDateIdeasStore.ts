import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { DATE_IDEAS } from '@/lib/constants';
import type { DateIdea, DateIdeaCategory } from '@/lib/types';

interface DateIdeasState {
  customIdeas: DateIdea[];
  favoriteIds: string[];
  addCustomIdea: (title: string, description: string, category: DateIdeaCategory) => void;
  removeCustomIdea: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getAllIdeas: () => DateIdea[];
  reset: () => void;
}

const builtInIdeas: DateIdea[] = DATE_IDEAS.map((idea, index) => ({
  id: `builtin-${index}`,
  ...idea,
  isFavorite: false,
  isCustom: false,
}));

export const useDateIdeasStore = create<DateIdeasState>()(
  persist(
    (set, get) => ({
      customIdeas: [],
      favoriteIds: [],

      addCustomIdea: (title, description, category) =>
        set((state) => ({
          customIdeas: [
            ...state.customIdeas,
            {
              id: generateId(),
              title,
              description,
              category,
              isFavorite: false,
              isCustom: true,
            },
          ],
        })),

      removeCustomIdea: (id) =>
        set((state) => ({
          customIdeas: state.customIdeas.filter((i) => i.id !== id),
          favoriteIds: state.favoriteIds.filter((fId) => fId !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((fId) => fId !== id)
            : [...state.favoriteIds, id],
        })),

      isFavorite: (id) => get().favoriteIds.includes(id),

      getAllIdeas: () => {
        const state = get();
        const favs = state.favoriteIds;
        return [...builtInIdeas, ...state.customIdeas].map((idea) => ({
          ...idea,
          isFavorite: favs.includes(idea.id),
        }));
      },

      reset: () => set({ customIdeas: [], favoriteIds: [] }),
    }),
    {
      name: 'date-ideas-storage',
      storage: zustandStorage,
    }
  )
);
