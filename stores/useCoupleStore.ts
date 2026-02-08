import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { pushToSupabase } from '@/lib/sync';
import type { CoupleProfile, ThemeName } from '@/lib/types';

interface CoupleState {
  profile: CoupleProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: CoupleProfile) => void;
  updateProfile: (updates: Partial<CoupleProfile>) => void;
  setTheme: (theme: ThemeName) => void;
  setOnboarded: (value: boolean) => void;
  loadFromRemote: (records: CoupleProfile[]) => void;
  syncRemoteInsert: (record: CoupleProfile) => void;
  syncRemoteUpdate: (record: CoupleProfile) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useCoupleStore = create<CoupleState>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profile) => {
        set({ profile, isOnboarded: true });
        pushToSupabase('couple_profiles', profile);
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
        const updated = get().profile;
        if (updated) pushToSupabase('couple_profiles', updated);
      },

      setTheme: (theme) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, theme } : null,
        }));
        const updated = get().profile;
        if (updated) pushToSupabase('couple_profiles', updated);
      },

      setOnboarded: (value) => set({ isOnboarded: value }),

      loadFromRemote: (records) => {
        if (records.length > 0) {
          set({ profile: records[0], isOnboarded: true });
        }
      },

      syncRemoteInsert: (record) =>
        set({ profile: record, isOnboarded: true }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...record } : record,
        })),

      syncRemoteDelete: (_id) =>
        set({ profile: null, isOnboarded: false }),

      reset: () => set({ profile: null, isOnboarded: false }),
    }),
    {
      name: 'couple-storage',
      storage: zustandStorage,
    }
  )
);
