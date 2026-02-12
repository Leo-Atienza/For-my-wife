import { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const signIn = useAuthStore((state) => state.signIn);
  const storeError = useAuthStore((state) => state.error);
  const setStoreError = useAuthStore((state) => state.setError);
  const setStoreLoading = useAuthStore((state) => state.setLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || storeError;

  // Reset store loading/error on mount in case it got stuck from a previous screen
  useEffect(() => {
    setStoreLoading(false);
    setStoreError(null);
  }, [setStoreLoading, setStoreError]);

  const clearError = () => {
    setLocalError(null);
    setStoreError(null);
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    clearError();
    try {
      const result = await signIn(email.trim(), password);
      const state = useAuthStore.getState();
      if (result && state.session) {
        if (!state.spaceId) {
          // Signed in but no space — go to create-space
          router.replace('/auth/create-space');
        }
        // If spaceId exists, the route guard in _layout will handle navigation
      } else if (!result && state.error) {
        setLocalError(state.error);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 28,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <Text style={{ fontSize: 48 }}>{'\u2764\ufe0f'}</Text>
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              marginTop: 4,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Sign in to your shared space
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            value={email}
            onChangeText={(v) => { setEmail(v); clearError(); }}
            placeholder="Email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={(v) => { setPassword(v); clearError(); }}
            placeholder="Password"
            label="Password"
            secureTextEntry
            autoCapitalize="none"
          />

          {error && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.danger,
                textAlign: 'center',
              }}
            >
              {error}
            </Text>
          )}

          <View style={{ marginTop: 4 }}>
            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </View>

        {/* Forgot password */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Pressable
            onPress={() => router.push('/auth/forgot-password')}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_500Medium',
                color: theme.primary,
              }}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Switch to sign up */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Pressable
            onPress={() => router.replace('/auth/sign-up')}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
              }}
            >
              Don&apos;t have an account?{' '}
              <Text style={{ color: theme.primary, fontFamily: 'Inter_600SemiBold' }}>
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
