import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { SongDedicationEntry, PartnerRole } from '@/lib/types';

interface SongState {
  songs: SongDedicationEntry[];
  addSong: (dedicatedBy: PartnerRole, title: string, artist: string, url?: string, message?: string) => void;
  removeSong: (id: string) => void;
  getLatestSong: () => SongDedicationEntry | undefined;
  reset: () => void;
}

export const useSongStore = create<SongState>()(
  persist(
    (set, get) => ({
      songs: [],

      addSong: (dedicatedBy, title, artist, url, message) =>
        set((state) => ({
          songs: [
            {
              id: generateId(),
              dedicatedBy,
              title,
              artist,
              url,
              message,
              createdAt: new Date().toISOString(),
            },
            ...state.songs,
          ],
        })),

      removeSong: (id) =>
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== id),
        })),

      getLatestSong: () => get().songs[0],

      reset: () => set({ songs: [] }),
    }),
    {
      name: 'songs-storage',
      storage: zustandStorage,
    }
  )
);
