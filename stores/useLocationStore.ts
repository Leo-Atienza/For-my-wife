import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { pushToSupabase } from '@/lib/sync';
import type { LocationEntry, PartnerRole } from '@/lib/types';

interface LocationState {
  locations: Record<PartnerRole, LocationEntry | null>;
  setLocation: (partner: PartnerRole, lat: number, lng: number, cityName?: string) => void;
  loadFromRemote: (records: LocationEntry[]) => void;
  syncRemoteInsert: (record: LocationEntry) => void;
  syncRemoteUpdate: (record: LocationEntry) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: {
        partner1: null,
        partner2: null,
      },

      setLocation: (partner, latitude, longitude, cityName) => {
        // Reuse existing ID for this partner to avoid creating duplicate entries
        const existingId = get().locations[partner]?.id;
        const entry: LocationEntry = {
          id: existingId ?? generateId(),
          partner,
          latitude,
          longitude,
          cityName,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          locations: {
            ...state.locations,
            [partner]: entry,
          },
        }));
        // Map camelCase fields to snake_case for Supabase
        pushToSupabase('location_entries', {
          id: entry.id,
          partner: entry.partner,
          latitude: entry.latitude,
          longitude: entry.longitude,
          city_name: entry.cityName,
          updated_at: entry.updatedAt,
        });
      },

      loadFromRemote: (records) => {
        const locations: Record<PartnerRole, LocationEntry | null> = {
          partner1: null,
          partner2: null,
        };
        for (const record of records) {
          locations[record.partner] = record;
        }
        set({ locations });
      },

      syncRemoteInsert: (record) =>
        set((state) => ({
          locations: {
            ...state.locations,
            [record.partner]: record,
          },
        })),

      syncRemoteUpdate: (record) =>
        set((state) => ({
          locations: {
            ...state.locations,
            [record.partner]: record,
          },
        })),

      syncRemoteDelete: (id) =>
        set((state) => {
          const newLocations = { ...state.locations };
          if (newLocations.partner1?.id === id) newLocations.partner1 = null;
          if (newLocations.partner2?.id === id) newLocations.partner2 = null;
          return { locations: newLocations };
        }),

      reset: () => set({ locations: { partner1: null, partner2: null } }),
    }),
    {
      name: 'location-storage',
      storage: zustandStorage,
    }
  )
);
