import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { SongDedicationEntry, PartnerRole } from '@/lib/types';

interface SongState {
  songs: SongDedicationEntry[];
  addSong: (dedicatedBy: PartnerRole, title: string, artist: string, url?: string, message?: string) => void;
  removeSong: (id: string) => void;
  getLatestSong: () => SongDedicationEntry | undefined;
  loadFromRemote: (records: SongDedicationEntry[]) => void;
  syncRemoteInsert: (record: SongDedicationEntry) => void;
  syncRemoteUpdate: (record: SongDedicationEntry) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useSongStore = create<SongState>()(
  persist(
    (set, get) => ({
      songs: [],

      addSong: (dedicatedBy, title, artist, url, message) => {
        const song: SongDedicationEntry = {
          id: generateId(),
          dedicatedBy,
          title,
          artist,
          url,
          message,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          songs: [song, ...state.songs],
        }));
        pushToSupabase('song_dedications', song);
      },

      removeSong: (id) => {
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== id),
        }));
        deleteFromSupabase('song_dedications', id);
      },

      getLatestSong: () => get().songs[0],

      loadFromRemote: (records) => set({ songs: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.songs.some((s) => s.id === record.id)) return state;
          return { songs: [record, ...state.songs] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          songs: state.songs.map((s) =>
            s.id === record.id ? { ...s, ...record } : s
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== id),
        })),

      reset: () => set({ songs: [] }),
    }),
    {
      name: 'songs-storage',
      storage: zustandStorage,
    }
  )
);
