import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Linking } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  DancingScript_400Regular,
} from '@expo-google-fonts/dancing-script';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useSync } from '@/hooks/useSync';
import { useNotifications } from '@/hooks/useNotifications';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { loadAllDataFromSupabase } from '@/lib/initial-load';
import { migrateLocalDataToCloud } from '@/lib/migration';
import { checkThisDayInHistory } from '@/lib/history-notification';
import { migratePhotosToCloud, flushPendingUploads } from '@/lib/photo-storage';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { isBackgroundLocationEnabled, startBackgroundLocation } from '@/lib/background-location';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { syncEvents } from '@/lib/sync-events';
import { THEMES } from '@/lib/constants';

import '../global.css';

SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();

  const session = useAuthStore((state) => state.session);
  const spaceId = useAuthStore((state) => state.spaceId);
  const isOnboarded = useCoupleStore((state) => state.isOnboarded);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Zustand persisted stores to fully rehydrate before routing
    const unsubs = [
      useAuthStore.persist.onFinishHydration(() => checkReady()),
      useCoupleStore.persist.onFinishHydration(() => checkReady()),
    ];
    function checkReady() {
      if (useAuthStore.persist.hasHydrated() && useCoupleStore.persist.hasHydrated()) {
        setIsReady(true);
      }
    }
    // Check immediately in case stores already hydrated
    checkReady();
    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'auth';
    const inSetupGroup = segments[0] === 'setup';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/auth/sign-in');
      }
    } else if (!spaceId) {
      if (!inAuthGroup) {
        router.replace('/auth/create-space');
      }
    } else if (!isOnboarded) {
      if (!inSetupGroup) {
        router.replace('/setup');
      }
    } else {
      if (inAuthGroup || inSetupGroup) {
        router.replace('/');
      }
    }
  }, [session, spaceId, isOnboarded, segments, isReady, router]);

  return isReady;
}

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    DancingScript_400Regular,
  });

  const setSession = useAuthStore((state) => state.setSession);
  const loadSpaceInfo = useAuthStore((state) => state.loadSpaceInfo);
  const spaceId = useAuthStore((state) => state.spaceId);
  const session = useAuthStore((state) => state.session);
  const initialLoadDone = useRef(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Initialize sync, notifications, and location tracking when authenticated
  useSync();
  useNotifications();
  useLocationTracking();

  // Connect sync error events to toast system
  const { showToast } = useToast();
  useEffect(() => {
    return syncEvents.addListener((message) => {
      showToast(message, 'error');
    });
  }, [showToast]);

  // Protected route navigation
  const isRouteReady = useProtectedRoute();

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        loadSpaceInfo().finally(() => setIsAuthChecking(false));
      } else {
        setIsAuthChecking(false);
      }
    }).catch(() => {
      // If getSession fails (e.g. network issue), still proceed to auth screens
      setIsAuthChecking(false);
    });

    // Listen for changes — but skip SIGNED_IN events when the store's signIn()
    // is actively running, since it loads space info before setting session to
    // prevent the route guard from seeing session-without-spaceId and redirecting.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (_event === 'SIGNED_IN' && useAuthStore.getState().isLoading) {
          // signIn() is loading space info before setting session — don't interfere
          return;
        }
        setSession(s);
        if (s) {
          loadSpaceInfo();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, loadSpaceInfo]);

  // Handle deep links from Supabase email confirmation / password reset
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Supabase sends tokens in the URL fragment: ...#access_token=...&refresh_token=...
      const hashIndex = url.indexOf('#');
      if (hashIndex === -1) return;

      const fragment = url.substring(hashIndex + 1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && data.session) {
          setSession(data.session);
        }
      }
    };

    // Handle the URL that launched the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle URLs while the app is already open (warm start)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, [setSession]);

  // Pull existing data from Supabase after auth + space are ready
  useEffect(() => {
    if (session && spaceId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllDataFromSupabase()
        .then(() => {
          migrateLocalDataToCloud();
          // Check for "This Day in History" entries after data is loaded
          checkThisDayInHistory();
          // Migrate local photos to Supabase Storage + flush any pending uploads
          const memState = useMemoriesStore.getState();
          migratePhotosToCloud(
            memState.memories,
            (id, uri) => memState.updateMemory(id, { imageUri: uri }),
          );
          flushPendingUploads((id, uri) => memState.updateMemory(id, { imageUri: uri }));
          // Restart background location if previously enabled
          isBackgroundLocationEnabled().then((enabled) => {
            if (enabled) startBackgroundLocation();
          });
        })
        .catch((err) => {
          console.error('Initial load failed, skipping migration to prevent data loss:', err);
          initialLoadDone.current = false;
        });
    }
    if (!session) {
      initialLoadDone.current = false;
    }
  }, [session, spaceId]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isAuthChecking) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isAuthChecking]);

  // Show loading screen while fonts load or auth is checking
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isAuthChecking || !isRouteReady) {
    const theme = THEMES.rose;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 48 }}>{'\u2764\ufe0f'}</Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'DancingScript_400Regular',
            color: theme.primary,
          }}
        >
          Us
        </Text>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="auth"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="setup"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
