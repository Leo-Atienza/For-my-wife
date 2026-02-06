import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { Milestone } from '@/lib/types';

interface TimelineState {
  milestones: Milestone[];
  addMilestone: (title: string, date: string, description?: string, icon?: string, imageUri?: string) => void;
  removeMilestone: (id: string) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  getMilestoneById: (id: string) => Milestone | undefined;
  reset: () => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      milestones: [],

      addMilestone: (title, date, description, icon, imageUri) =>
        set((state) => ({
          milestones: [
            ...state.milestones,
            {
              id: generateId(),
              title,
              date,
              description,
              icon,
              imageUri,
            },
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        })),

      removeMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),

      updateMilestone: (id, updates) =>
        set((state) => ({
          milestones: state.milestones
            .map((m) => (m.id === id ? { ...m, ...updates } : m))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        })),

      getMilestoneById: (id) => get().milestones.find((m) => m.id === id),

      reset: () => set({ milestones: [] }),
    }),
    {
      name: 'timeline-storage',
      storage: zustandStorage,
    }
  )
);
