import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/useAuthStore';

// Configure notification handler (show notifications when app is in foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotifications = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission not granted');
    return null;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E8A0BF',
    });
  }

  // Get the Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  });

  return tokenData.data;
};

export const savePushToken = async (token: string): Promise<void> => {
  const { spaceId, session } = useAuthStore.getState();
  if (!spaceId || !session) return;

  const { error } = await supabase
    .from('space_members')
    .update({ push_token: token })
    .eq('space_id', spaceId)
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Failed to save push token:', error.message);
  }
};

export const getPartnerPushToken = async (): Promise<string | null> => {
  const { spaceId, session } = useAuthStore.getState();
  if (!spaceId || !session) return null;

  const { data, error } = await supabase
    .from('space_members')
    .select('push_token')
    .eq('space_id', spaceId)
    .neq('user_id', session.user.id)
    .single();

  if (error || !data?.push_token) return null;
  return data.push_token;
};

export const sendPushToPartner = async (
  title: string,
  body: string,
  route?: string
): Promise<void> => {
  const partnerToken = await getPartnerPushToken();
  if (!partnerToken) return;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Include Expo Access Token if configured (required for production)
    const accessToken = process.env.EXPO_PUBLIC_ACCESS_TOKEN;
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: partnerToken,
        title,
        body,
        sound: 'default',
        data: route ? { route } : undefined,
      }),
    });
  } catch (err) {
    console.error('Failed to send push notification:', err);
  }
};
