import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { Nickname, PartnerRole } from '@/lib/types';

interface NicknameState {
  nicknames: Nickname[];
  addNickname: (forPartner: PartnerRole, givenBy: PartnerRole, nickname: string) => void;
  getActiveNickname: (forPartner: PartnerRole) => string | null;
  getNicknameHistory: (forPartner: PartnerRole) => Nickname[];
  reset: () => void;
}

export const useNicknameStore = create<NicknameState>()(
  persist(
    (set, get) => ({
      nicknames: [],

      addNickname: (forPartner, givenBy, nickname) =>
        set((state) => {
          const deactivated = state.nicknames.map((n) =>
            n.forPartner === forPartner ? { ...n, isActive: false } : n
          );
          const newNickname: Nickname = {
            id: generateId(),
            forPartner,
            givenBy,
            nickname,
            isActive: true,
            givenAt: new Date().toISOString(),
          };
          return { nicknames: [...deactivated, newNickname] };
        }),

      getActiveNickname: (forPartner) => {
        const active = get().nicknames.find(
          (n) => n.forPartner === forPartner && n.isActive
        );
        return active?.nickname ?? null;
      },

      getNicknameHistory: (forPartner) => {
        return get().nicknames.filter((n) => n.forPartner === forPartner);
      },

      reset: () => set({ nicknames: [] }),
    }),
    {
      name: 'nickname-storage',
      storage: zustandStorage,
    }
  )
);
