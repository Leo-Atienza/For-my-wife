import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase } from '@/lib/sync';
import { sendPushToPartner } from '@/lib/notifications';
import type { PartnerRole } from '@/lib/types';

interface ThinkingTap {
  id: string;
  fromPartner: PartnerRole;
  createdAt: string;
}

interface ThinkingState {
  taps: ThinkingTap[];
  lastReceivedAt: string | null;
  sendTap: (fromPartner: PartnerRole) => void;
  getTodayCount: (partner: PartnerRole) => number;
  loadFromRemote: (records: ThinkingTap[]) => void;
  syncRemoteInsert: (record: ThinkingTap) => void;
  syncRemoteUpdate: (record: ThinkingTap) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useThinkingStore = create<ThinkingState>()(
  persist(
    (set, get) => ({
      taps: [],
      lastReceivedAt: null,

      sendTap: (fromPartner) => {
        const tap: ThinkingTap = {
          id: generateId(),
          fromPartner,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          taps: [tap, ...state.taps],
        }));
        pushToSupabase('thinking_of_you', {
          id: tap.id,
          from_partner: tap.fromPartner,
          created_at: tap.createdAt,
        });
        sendPushToPartner('Thinking of You', '\u2764\ufe0f Your partner is thinking about you right now', '/');
      },

      getTodayCount: (partner) => {
        const today = new Date().toISOString().split('T')[0];
        return get().taps.filter(
          (t) => t.fromPartner === partner && t.createdAt.startsWith(today)
        ).length;
      },

      loadFromRemote: (records) => set({ taps: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.taps.some((t) => t.id === record.id)) return state;
          return {
            taps: [record, ...state.taps],
            lastReceivedAt: new Date().toISOString(),
          };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          taps: state.taps.map((t) =>
            t.id === record.id ? { ...t, ...record } : t
          ),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          taps: state.taps.filter((t) => t.id !== id),
        })),

      reset: () => set({ taps: [], lastReceivedAt: null }),
    }),
    {
      name: 'thinking-storage',
      storage: zustandStorage,
    }
  )
);
