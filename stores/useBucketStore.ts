import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { BucketItem, BucketCategory } from '@/lib/types';

interface BucketState {
  items: BucketItem[];
  addItem: (title: string, category: BucketCategory) => void;
  removeItem: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateItem: (id: string, updates: Partial<BucketItem>) => void;
  loadFromRemote: (records: BucketItem[]) => void;
  syncRemoteInsert: (record: BucketItem) => void;
  syncRemoteUpdate: (record: BucketItem) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useBucketStore = create<BucketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (title, category) => {
        const now = new Date().toISOString();
        const item: BucketItem = {
          id: generateId(),
          title,
          category,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          items: [...state.items, item],
        }));
        pushToSupabase('bucket_items', item);
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
        deleteFromSupabase('bucket_items', id);
      },

      toggleComplete: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  isCompleted: !i.isCompleted,
                  completedDate: !i.isCompleted ? now : undefined,
                  updatedAt: now,
                }
              : i
          ),
        }));
        const updated = get().items.find((i) => i.id === id);
        if (updated) pushToSupabase('bucket_items', updated);
      },

      updateItem: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: now } : i
          ),
        }));
        const updated = get().items.find((i) => i.id === id);
        if (updated) pushToSupabase('bucket_items', updated);
      },

      loadFromRemote: (records) => set({ items: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.items.some((i) => i.id === record.id)) return state;
          return { items: [...state.items, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== record.id) return i;
            return isNewerRecord(i, record) ? { ...i, ...record } : i;
          }),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      reset: () => set({ items: [] }),
    }),
    {
      name: 'bucket-storage',
      storage: zustandStorage,
    }
  )
);
