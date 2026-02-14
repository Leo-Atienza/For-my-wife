import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId, isNewerRecord } from '@/lib/utils';
import { pushToSupabase, deleteFromSupabase } from '@/lib/sync';
import type { NextVisit, VisitActivity, PackingItem, PartnerRole } from '@/lib/types';

interface NextVisitState {
  visits: NextVisit[];
  addVisit: (title: string, startDate: string, endDate?: string, location?: string) => void;
  removeVisit: (id: string) => void;
  updateVisit: (id: string, updates: Partial<NextVisit>) => void;
  addActivity: (visitId: string, title: string, date?: string) => void;
  toggleActivity: (visitId: string, activityId: string) => void;
  removeActivity: (visitId: string, activityId: string) => void;
  addPackingItem: (visitId: string, item: string, partner: PartnerRole) => void;
  togglePackingItem: (visitId: string, itemId: string) => void;
  removePackingItem: (visitId: string, itemId: string) => void;
  loadFromRemote: (records: NextVisit[]) => void;
  syncRemoteInsert: (record: NextVisit) => void;
  syncRemoteUpdate: (record: NextVisit) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useNextVisitStore = create<NextVisitState>()(
  persist(
    (set, get) => ({
      visits: [],

      addVisit: (title, startDate, endDate, location) => {
        const now = new Date().toISOString();
        const visit: NextVisit = {
          id: generateId(),
          title,
          startDate,
          endDate,
          location,
          activities: [],
          packingItems: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ visits: [...state.visits, visit] }));
        pushToSupabase('next_visits', visit);
      },

      removeVisit: (id) => {
        set((state) => ({ visits: state.visits.filter((v) => v.id !== id) }));
        deleteFromSupabase('next_visits', id);
      },

      updateVisit: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: now } : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === id);
        if (updated) pushToSupabase('next_visits', updated);
      },

      addActivity: (visitId, title, date) => {
        const now = new Date().toISOString();
        const activity: VisitActivity = {
          id: generateId(),
          title,
          date,
          isCompleted: false,
        };
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? { ...v, activities: [...v.activities, activity], updatedAt: now }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      toggleActivity: (visitId, activityId) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? {
                  ...v,
                  updatedAt: now,
                  activities: v.activities.map((a) =>
                    a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a
                  ),
                }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      removeActivity: (visitId, activityId) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? {
                  ...v,
                  updatedAt: now,
                  activities: v.activities.filter((a) => a.id !== activityId),
                }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      addPackingItem: (visitId, item, partner) => {
        const now = new Date().toISOString();
        const packingItem: PackingItem = {
          id: generateId(),
          item,
          isPacked: false,
          partner,
        };
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? { ...v, packingItems: [...v.packingItems, packingItem], updatedAt: now }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      togglePackingItem: (visitId, itemId) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? {
                  ...v,
                  updatedAt: now,
                  packingItems: v.packingItems.map((p) =>
                    p.id === itemId ? { ...p, isPacked: !p.isPacked } : p
                  ),
                }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      removePackingItem: (visitId, itemId) => {
        const now = new Date().toISOString();
        set((state) => ({
          visits: state.visits.map((v) =>
            v.id === visitId
              ? {
                  ...v,
                  updatedAt: now,
                  packingItems: v.packingItems.filter((p) => p.id !== itemId),
                }
              : v
          ),
        }));
        const updated = get().visits.find((v) => v.id === visitId);
        if (updated) pushToSupabase('next_visits', updated);
      },

      loadFromRemote: (records) => set({ visits: records }),

      syncRemoteInsert: (record) =>
        set((state) => {
          if (state.visits.some((v) => v.id === record.id)) return state;
          return { visits: [...state.visits, record] };
        }),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          visits: state.visits.map((v) => {
            if (v.id !== record.id) return v;
            return isNewerRecord(v, record) ? { ...v, ...record } : v;
          }),
        })),

      syncRemoteDelete: (id) =>
        set((state) => ({
          visits: state.visits.filter((v) => v.id !== id),
        })),

      reset: () => set({ visits: [] }),
    }),
    {
      name: 'next-visit-storage',
      storage: zustandStorage,
    }
  )
);
