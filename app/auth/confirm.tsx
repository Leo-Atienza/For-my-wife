import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

export default function ConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const setSession = useAuthStore((state) => state.setSession);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      // Give the deep link handler a moment to exchange tokens
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }
        if (session) {
          setSession(session);
          setStatus('success');
          setTimeout(() => {
            router.replace('/auth/create-space');
          }, 1500);
        } else {
          // No session — confirmation worked but user needs to sign in manually
          setStatus('success');
        }
      } catch {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try signing in.');
      }
    };

    checkSession();
  }, [setSession, router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        gap: 16,
      }}
    >
      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter_500Medium',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Confirming your account...
          </Text>
        </>
      )}

      {status === 'success' && (
        <>
          <Text style={{ fontSize: 48 }}>{'\u2705'}</Text>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Email Confirmed!
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Your account is ready. You can now sign in.
          </Text>
          <View style={{ marginTop: 8, width: '100%' }}>
            <Button
              title="Go to Sign In"
              onPress={() => router.replace('/auth/sign-in')}
            />
          </View>
        </>
      )}

      {status === 'error' && (
        <>
          <Text style={{ fontSize: 48 }}>{'\u274c'}</Text>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Something Went Wrong
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {errorMessage || 'Please try signing in manually.'}
          </Text>
          <View style={{ marginTop: 8, width: '100%' }}>
            <Button
              title="Go to Sign In"
              onPress={() => router.replace('/auth/sign-in')}
            />
          </View>
        </>
      )}
    </View>
  );
}
