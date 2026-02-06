import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { LocationEntry, PartnerRole } from '@/lib/types';

interface LocationState {
  locations: Record<PartnerRole, LocationEntry | null>;
  setLocation: (partner: PartnerRole, lat: number, lng: number, cityName?: string) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      locations: {
        partner1: null,
        partner2: null,
      },

      setLocation: (partner, latitude, longitude, cityName) =>
        set((state) => ({
          locations: {
            ...state.locations,
            [partner]: {
              id: generateId(),
              partner,
              latitude,
              longitude,
              cityName,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      reset: () => set({ locations: { partner1: null, partner2: null } }),
    }),
    {
      name: 'location-storage',
      storage: zustandStorage,
    }
  )
);
