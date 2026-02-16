import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import type { WatchPartySession, PartnerRole } from '@/lib/types';

interface WatchPartyState {
  sessions: WatchPartySession[];
  createSession: (
    title: string,
    type: 'movie' | 'dinner' | 'activity',
    startedBy: PartnerRole,
    duration?: number
  ) => string;
  startSession: (id: string) => void;
  stopSession: (id: string) => void;
  removeSession: (id: string) => void;
  getActiveSession: () => WatchPartySession | undefined;
  loadFromRemote: (records: WatchPartySession[]) => void;
  syncRemoteInsert: (record: WatchPartySession) => void;
  syncRemoteUpdate: (record: WatchPartySession) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useWatchPartyStore = create<WatchPartyState>()(
  persist(
    (set, get) => ({
      sessions: [],

      createSession: (title, type, startedBy, duration) => {
        const now = new Date().toISOString();
        const session: WatchPartySession = {
          id: generateId(),
          title,
          type,
          startedBy,
          duration,
          isActive: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ sessions: [...state.sessions, session] }));
        pushToSupabase('watch_party_sessions', session);
        return session.id;
      },

      startSession: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isActive: true, startedAt: now, updatedAt: now } : s
          ),
        }));
        const updated = get().sessions.find((s) => s.id === id);
        if (updated) {
          pushToSupabase('watch_party_sessions', updated);
          sendPushToPartner('Watch Party Started', `"${updated.title}" is starting! Join in 🎬`, '/watch-party');
        }
      },

      stopSession: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isActive: false, updatedAt: now } : s
          ),
        }));
        const updated = get().sessions.find((s) => s.id === id);
        if (updated) pushToSupabase('watch_party_sessions', updated);
      },

      removeSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }));
        deleteFromSupabase('watch_party_sessions', id);
      },

      getActiveSession: () => {
        return get().sessions.find((s) => s.isActive);
      },

      loadFromRemote: (records) => set({ sessions: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.sessions.some((s) => s.id === record.id)) return state;
          return { sessions: [...state.sessions, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== record.id) return s;
            return isNewerRecord(s, record) ? { ...s, ...record } : s;
          }),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      reset: () => set({ sessions: [] }),
    }),
    {
      name: 'watch-party-storage',
      storage: zustandStorage,
    }
  )
);
