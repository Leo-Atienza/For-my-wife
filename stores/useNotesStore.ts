import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import type { LoveNote, PartnerRole } from '@/lib/types';

interface NotesState {
  notes: LoveNote[];
  addNote: (author: PartnerRole, content: string, mood?: string) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<LoveNote>) => void;
  markAsRead: (id: string) => void;
  getNoteById: (id: string) => LoveNote | undefined;
  loadFromRemote: (records: LoveNote[]) => void;
  syncRemoteInsert: (record: LoveNote) => void;
  syncRemoteUpdate: (record: LoveNote) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (author, content, mood) => {
        const note: LoveNote = {
          id: generateId(),
          author,
          content,
          mood,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({
          notes: [note, ...state.notes],
        }));
        pushToSupabase('love_notes', note);
        sendPushToPartner('New Love Note', 'Your partner left you a love note 💌');
      },

      removeNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
        deleteFromSupabase('love_notes', id);
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }));
        const updated = get().notes.find((n) => n.id === id);
        if (updated) pushToSupabase('love_notes', updated);
      },

      markAsRead: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
        const updated = get().notes.find((n) => n.id === id);
        if (updated) pushToSupabase('love_notes', updated);
      },

      getNoteById: (id) => get().notes.find((n) => n.id === id),

      loadFromRemote: (records) => set({ notes: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.notes.some((n) => n.id === record.id)) return state;
          return { notes: [record, ...state.notes] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === record.id ? { ...n, ...record } : n
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      reset: () => set({ notes: [] }),
    }),
    {
      name: 'notes-storage',
      storage: zustandStorage,
    }
  )
);
