import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { registerForPushNotifications, savePushToken } from '@/lib/notifications';
import type { EventSubscription } from 'expo-modules-core';

export const useNotifications = () => {
  const session = useAuthStore((s) => s.session);
  const spaceId = useAuthStore((s) => s.spaceId);
  const router = useRouter();

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    if (!session || !spaceId) return;

    // Register and save push token
    registerForPushNotifications().then((token) => {
      if (token) {
        savePushToken(token);
      }
    });

    // Listen for incoming notifications (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {
        // The handler config in notifications.ts will show it as an alert
      }
    );

    // Listen for notification taps (user interaction)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.route && typeof data.route === 'string') {
          router.push(data.route as never);
        }
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [session, spaceId, router]);
};
