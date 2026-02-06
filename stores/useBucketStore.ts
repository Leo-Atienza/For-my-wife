import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { BucketItem, BucketCategory } from '@/lib/types';

interface BucketState {
  items: BucketItem[];
  addItem: (title: string, category: BucketCategory) => void;
  removeItem: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateItem: (id: string, updates: Partial<BucketItem>) => void;
  reset: () => void;
}

export const useBucketStore = create<BucketState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (title, category) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: generateId(),
              title,
              category,
              isCompleted: false,
            },
          ],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  isCompleted: !i.isCompleted,
                  completedDate: !i.isCompleted
                    ? new Date().toISOString()
                    : undefined,
                }
              : i
          ),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),

      reset: () => set({ items: [] }),
    }),
    {
      name: 'bucket-storage',
      storage: zustandStorage,
    }
  )
);
