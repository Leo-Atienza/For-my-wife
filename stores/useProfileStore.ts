import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import type { IndividualProfile, PartnerRole } from '@/lib/types';

interface ProfileState {
  partner1: IndividualProfile | null;
  partner2: IndividualProfile | null;
  setPartner: (role: PartnerRole, profile: IndividualProfile) => void;
  updatePartner: (role: PartnerRole, updates: Partial<IndividualProfile>) => void;
  getPartner: (role: PartnerRole) => IndividualProfile | null;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner1: null,
      partner2: null,

      setPartner: (role, profile) =>
        set({ [role]: profile }),

      updatePartner: (role, updates) =>
        set((state) => {
          const current = state[role];
          if (!current) return state;
          return { [role]: { ...current, ...updates } };
        }),

      getPartner: (role) => get()[role],

      reset: () => set({ partner1: null, partner2: null }),
    }),
    {
      name: 'profile-storage',
      storage: zustandStorage,
    }
  )
);
