import { useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { AppState } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocationStore } from '@/stores/useLocationStore';

const UPDATE_INTERVAL_MS = 30_000; // 30 seconds

export const useLocationTracking = () => {
  const myRole = useAuthStore((s) => s.myRole);
  const session = useAuthStore((s) => s.session);
  const spaceId = useAuthStore((s) => s.spaceId);
  const setLocation = useLocationStore((s) => s.setLocation);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLocation = useCallback(async () => {
    if (!myRole) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Try to reverse geocode for city name
      let cityName: string | undefined;
      try {
        const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address) {
          cityName = address.city ?? address.subregion ?? address.region ?? undefined;
        }
      } catch {
        // Reverse geocoding can fail, that's fine
      }

      setLocation(myRole, latitude, longitude, cityName);
    } catch (err) {
      console.error('Location update failed:', err);
    }
  }, [myRole, setLocation]);

  useEffect(() => {
    if (!session || !spaceId || !myRole) return;

    let mounted = true;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      // Initial update
      if (mounted) {
        updateLocation();
      }

      // Periodic updates
      intervalRef.current = setInterval(() => {
        if (mounted) updateLocation();
      }, UPDATE_INTERVAL_MS);
    };

    startTracking();

    // Also update when app comes to foreground
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active' && mounted) {
        updateLocation();
      }
    });

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      appStateListener.remove();
    };
  }, [session, spaceId, myRole, updateLocation]);
};
