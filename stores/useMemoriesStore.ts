import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { Memory } from '@/lib/types';

interface MemoriesState {
  memories: Memory[];
  addMemory: (imageUri: string, caption: string, date: string, location?: string) => void;
  removeMemory: (id: string) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  getMemoryById: (id: string) => Memory | undefined;
  reset: () => void;
}

export const useMemoriesStore = create<MemoriesState>()(
  persist(
    (set, get) => ({
      memories: [],

      addMemory: (imageUri, caption, date, location) =>
        set((state) => ({
          memories: [
            {
              id: generateId(),
              imageUri,
              caption,
              date,
              location,
              createdAt: new Date().toISOString(),
            },
            ...state.memories,
          ],
        })),

      removeMemory: (id) =>
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        })),

      updateMemory: (id, updates) =>
        set((state) => ({
          memories: state.memories.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      getMemoryById: (id) => get().memories.find((m) => m.id === id),

      reset: () => set({ memories: [] }),
    }),
    {
      name: 'memories-storage',
      storage: zustandStorage,
    }
  )
);
