import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import type { Nickname, PartnerRole } from '@/lib/types';

interface NicknameState {
  nicknames: Nickname[];
  addNickname: (forPartner: PartnerRole, givenBy: PartnerRole, nickname: string) => void;
  getActiveNickname: (forPartner: PartnerRole) => string | null;
  getNicknameHistory: (forPartner: PartnerRole) => Nickname[];
  loadFromRemote: (records: Nickname[]) => void;
  syncRemoteInsert: (record: Nickname) => void;
  syncRemoteUpdate: (record: Nickname) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useNicknameStore = create<NicknameState>()(
  persist(
    (set, get) => ({
      nicknames: [],

      addNickname: (forPartner, givenBy, nickname) => {
        set((state) => {
          const deactivated = state.nicknames.map((n) =>
            n.forPartner === forPartner ? { ...n, isActive: false } : n
          );
          // Push deactivated nicknames to Supabase
          deactivated
            .filter((n) => n.forPartner === forPartner && !n.isActive)
            .forEach((n) => pushToSupabase('nicknames', n));

          const newNickname: Nickname = {
            id: generateId(),
            forPartner,
            givenBy,
            nickname,
            isActive: true,
            givenAt: new Date().toISOString(),
          };
          pushToSupabase('nicknames', newNickname);
          sendPushToPartner('New Nickname', 'Your partner gave you a new nickname 💕');
          return { nicknames: [...deactivated, newNickname] };
        });
      },

      getActiveNickname: (forPartner) => {
        const active = get().nicknames.find(
          (n) => n.forPartner === forPartner && n.isActive
        );
        return active?.nickname ?? null;
      },

      getNicknameHistory: (forPartner) => {
        return get().nicknames.filter((n) => n.forPartner === forPartner);
      },

      loadFromRemote: (records) => set({ nicknames: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.nicknames.some((n) => n.id === record.id)) return state;
          return { nicknames: [...state.nicknames, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          nicknames: state.nicknames.map((n) =>
            n.id === record.id ? { ...n, ...record } : n
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          nicknames: state.nicknames.filter((n) => n.id !== id),
        })),

      reset: () => set({ nicknames: [] }),
    }),
    {
      name: 'nickname-storage',
      storage: zustandStorage,
    }
  )
);
