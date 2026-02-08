import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { pushToSupabase } from '@/lib/sync';
import type { IndividualProfile, PartnerRole } from '@/lib/types';

interface ProfileState {
  partner1: IndividualProfile | null;
  partner2: IndividualProfile | null;
  setPartner: (role: PartnerRole, profile: IndividualProfile) => void;
  updatePartner: (role: PartnerRole, updates: Partial<IndividualProfile>) => void;
  getPartner: (role: PartnerRole) => IndividualProfile | null;
  loadFromRemote: (records: (IndividualProfile & { role: PartnerRole })[]) => void;
  syncRemoteInsert: (record: IndividualProfile & { role: PartnerRole }) => void;
  syncRemoteUpdate: (record: IndividualProfile & { role: PartnerRole }) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner1: null,
      partner2: null,

      setPartner: (role, profile) => {
        set({ [role]: profile });
        pushToSupabase('individual_profiles', { ...profile, role });
      },

      updatePartner: (role, updates) => {
        set((state) => {
          const current = state[role];
          if (!current) return state;
          return { [role]: { ...current, ...updates } };
        });
        const updated = get()[role];
        if (updated) pushToSupabase('individual_profiles', { ...updated, role });
      },

      getPartner: (role) => get()[role],

      loadFromRemote: (records) => {
        const update: Partial<ProfileState> = {};
        for (const record of records) {
          if (record.role === 'partner1') update.partner1 = record;
          if (record.role === 'partner2') update.partner2 = record;
        }
        set(update);
      },

      syncRemoteInsert: (record) => {
        const { role, ...profile } = record;
        set({ [role]: profile });
      },

      syncRemoteUpdate: (record) => {
        const { role, ...updates } = record;
        set((state) => {
          const current = state[role];
          if (!current) return { [role]: updates };
          return { [role]: { ...current, ...updates } };
        });
      },

      syncRemoteDelete: (id) =>
        set((state) => {
          const newState: Partial<ProfileState> = {};
          if (state.partner1 && (state.partner1 as IndividualProfile & { id?: string }).id === id) {
            newState.partner1 = null;
          }
          if (state.partner2 && (state.partner2 as IndividualProfile & { id?: string }).id === id) {
            newState.partner2 = null;
          }
          return newState;
        }),

      reset: () => set({ partner1: null, partner2: null }),
    }),
    {
      name: 'profile-storage',
      storage: zustandStorage,
    }
  )
);
