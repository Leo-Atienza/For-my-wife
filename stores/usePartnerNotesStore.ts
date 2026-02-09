import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import { generateId } from '@/lib/utils';
import type { PartnerNote, PartnerNoteCategory, PartnerRole } from '@/lib/types';

interface PartnerNotesState {
  notes: PartnerNote[];

  addNote: (author: PartnerRole, content: string, category: PartnerNoteCategory) => void;
  updateNote: (id: string, updates: Partial<PartnerNote>) => void;
  removeNote: (id: string) => void;
  discoverNote: (id: string) => void;

  getNotesByAuthor: (author: PartnerRole) => PartnerNote[];
  getNotesAboutMe: (myRole: PartnerRole) => PartnerNote[];
  getUndiscoveredNotes: (myRole: PartnerRole) => PartnerNote[];
  getNotesByCategory: (category: PartnerNoteCategory) => PartnerNote[];
  getNoteById: (id: string) => PartnerNote | undefined;

  loadFromRemote: (records: Record<string, unknown>[]) => void;
  syncRemoteInsert: (record: Record<string, unknown>) => void;
  syncRemoteUpdate: (record: Record<string, unknown>) => void;
  syncRemoteDelete: (id: string) => void;

  reset: () => void;
}

const mapRemoteToLocal = (record: Record<string, unknown>): PartnerNote => ({
  id: record.id as string,
  author: record.author as PartnerRole,
  aboutPartner: record.about_partner as PartnerRole,
  content: record.content as string,
  category: record.category as PartnerNoteCategory,
  isDiscovered: record.is_discovered as boolean,
  discoveredAt: record.discovered_at as string | undefined,
  createdAt: record.created_at as string,
});

const mapLocalToRemote = (note: PartnerNote): Record<string, unknown> => ({
  id: note.id,
  author: note.author,
  about_partner: note.aboutPartner,
  content: note.content,
  category: note.category,
  is_discovered: note.isDiscovered,
  discovered_at: note.discoveredAt,
  created_at: note.createdAt,
});

export const usePartnerNotesStore = create<PartnerNotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (author, content, category) => {
        const aboutPartner: PartnerRole = author === 'partner1' ? 'partner2' : 'partner1';
        const note: PartnerNote = {
          id: generateId(),
          author,
          aboutPartner,
          content,
          category,
          isDiscovered: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
        pushToSupabase('partner_notes', mapLocalToRemote(note));
        sendPushToPartner('Partner Note', 'Your partner wrote something about you 💝');
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }));
        const updated = get().notes.find((n) => n.id === id);
        if (updated) {
          pushToSupabase('partner_notes', mapLocalToRemote(updated));
        }
      },

      removeNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
        deleteFromSupabase('partner_notes', id);
      },

      discoverNote: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isDiscovered: true, discoveredAt: now } : n
          ),
        }));
        const updated = get().notes.find((n) => n.id === id);
        if (updated) {
          pushToSupabase('partner_notes', mapLocalToRemote(updated));
        }
      },

      getNotesByAuthor: (author) => get().notes.filter((n) => n.author === author),
      getNotesAboutMe: (myRole) => get().notes.filter((n) => n.aboutPartner === myRole),
      getUndiscoveredNotes: (myRole) =>
        get().notes.filter((n) => n.aboutPartner === myRole && !n.isDiscovered),
      getNotesByCategory: (category) => get().notes.filter((n) => n.category === category),
      getNoteById: (id) => get().notes.find((n) => n.id === id),

      loadFromRemote: (records) =>
        set({ notes: records.map(mapRemoteToLocal) }),

      syncRemoteInsert: (record) => {
        const note = mapRemoteToLocal(record);
        set((state) => {
          if (state.notes.some((n) => n.id === note.id)) return state;
          return { notes: [note, ...state.notes] };
        });
      },

      syncRemoteUpdate: (record) => {
        const note = mapRemoteToLocal(record);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === note.id ? note : n)),
        }));
      },

      syncRemoteDelete: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      reset: () => set({ notes: [] }),
    }),
    {
      name: 'partner-notes-storage',
      storage: zustandStorage,
    }
  )
);
