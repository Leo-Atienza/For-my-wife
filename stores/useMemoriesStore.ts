import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import { deletePhoto, isRemoteUrl } from '@/lib/photo-storage';
import type { Memory } from '@/lib/types';

interface MemoriesState {
  memories: Memory[];
  addMemory: (imageUri: string, caption: string, date: string, location?: string) => void;
  removeMemory: (id: string) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  getMemoryById: (id: string) => Memory | undefined;
  loadFromRemote: (records: Memory[]) => void;
  syncRemoteInsert: (record: Memory) => void;
  syncRemoteUpdate: (record: Memory) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useMemoriesStore = create<MemoriesState>()(
  persist(
    (set, get) => ({
      memories: [],

      addMemory: (imageUri, caption, date, location) => {
        const now = new Date().toISOString();
        const memory: Memory = {
          id: generateId(),
          imageUri,
          caption,
          date,
          location,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          memories: [memory, ...state.memories],
        }));
        pushToSupabase('memories', memory);
        sendPushToPartner('New Memory', 'Your partner added a new memory 📸', '/memories');
      },

      removeMemory: (id) => {
        const memory = get().memories.find((m) => m.id === id);
        if (memory && isRemoteUrl(memory.imageUri)) {
          deletePhoto(memory.imageUri);
        }
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        }));
        deleteFromSupabase('memories', id);
      },

      updateMemory: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          memories: state.memories.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: now } : m
          ),
        }));
        const updated = get().memories.find((m) => m.id === id);
        if (updated) pushToSupabase('memories', updated);
      },

      getMemoryById: (id) => get().memories.find((m) => m.id === id),

      loadFromRemote: (records) => set({ memories: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.memories.some((m) => m.id === record.id)) return state;
          return { memories: [record, ...state.memories] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          memories: state.memories.map((m) => {
            if (m.id !== record.id) return m;
            return isNewerRecord(m, record) ? { ...m, ...record } : m;
          }),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        })),

      reset: () => set({ memories: [] }),
    }),
    {
      name: 'memories-storage',
      storage: zustandStorage,
    }
  )
);
