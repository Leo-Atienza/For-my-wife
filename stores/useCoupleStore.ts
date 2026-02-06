import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import type { CoupleProfile, ThemeName } from '@/lib/types';

interface CoupleState {
  profile: CoupleProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: CoupleProfile) => void;
  updateProfile: (updates: Partial<CoupleProfile>) => void;
  setTheme: (theme: ThemeName) => void;
  setOnboarded: (value: boolean) => void;
  reset: () => void;
}

export const useCoupleStore = create<CoupleState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profile) => set({ profile, isOnboarded: true }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      setTheme: (theme) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, theme } : null,
        })),

      setOnboarded: (value) => set({ isOnboarded: value }),

      reset: () => set({ profile: null, isOnboarded: false }),
    }),
    {
      name: 'couple-storage',
      storage: zustandStorage,
    }
  )
);
