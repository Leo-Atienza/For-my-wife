import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { Milestone } from '@/lib/types';

interface TimelineState {
  milestones: Milestone[];
  addMilestone: (title: string, date: string, description?: string, icon?: string, imageUri?: string) => void;
  removeMilestone: (id: string) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  getMilestoneById: (id: string) => Milestone | undefined;
  loadFromRemote: (records: Milestone[]) => void;
  syncRemoteInsert: (record: Milestone) => void;
  syncRemoteUpdate: (record: Milestone) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      milestones: [],

      addMilestone: (title, date, description, icon, imageUri) => {
        const now = new Date().toISOString();
        const milestone: Milestone = {
          id: generateId(),
          title,
          date,
          description,
          icon,
          imageUri,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          milestones: [
            ...state.milestones,
            milestone,
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        }));
        pushToSupabase('milestones', milestone);
      },

      removeMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        }));
        deleteFromSupabase('milestones', id);
      },

      updateMilestone: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          milestones: state.milestones
            .map((m) => (m.id === id ? { ...m, ...updates, updatedAt: now } : m))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        }));
        const updated = get().milestones.find((m) => m.id === id);
        if (updated) pushToSupabase('milestones', updated);
      },

      getMilestoneById: (id) => get().milestones.find((m) => m.id === id),

      loadFromRemote: (records) =>
        set({
          milestones: records.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.milestones.some((m) => m.id === record.id)) return state;
          return {
            milestones: [...state.milestones, record].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
          };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          milestones: state.milestones
            .map((m) => {
              if (m.id !== record.id) return m;
              return isNewerRecord(m, record) ? { ...m, ...record } : m;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),

      reset: () => set({ milestones: [] }),
    }),
    {
      name: 'timeline-storage',
      storage: zustandStorage,
    }
  )
);
