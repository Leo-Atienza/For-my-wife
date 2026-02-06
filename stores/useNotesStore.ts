import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { LoveNote, PartnerRole } from '@/lib/types';

interface NotesState {
  notes: LoveNote[];
  addNote: (author: PartnerRole, content: string, mood?: string) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<LoveNote>) => void;
  markAsRead: (id: string) => void;
  getNoteById: (id: string) => LoveNote | undefined;
  reset: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (author, content, mood) =>
        set((state) => ({
          notes: [
            {
              id: generateId(),
              author,
              content,
              mood,
              createdAt: new Date().toISOString(),
              isRead: false,
            },
            ...state.notes,
          ],
        })),

      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),

      markAsRead: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      getNoteById: (id) => get().notes.find((n) => n.id === id),

      reset: () => set({ notes: [] }),
    }),
    {
      name: 'notes-storage',
      storage: zustandStorage,
    }
  )
);
