import { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);
  const setLoading = useAuthStore((state) => state.setLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Reset loading/error state on mount in case it got stuck from a previous screen
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [setLoading, setError]);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await signIn(email.trim(), password);
      // If successful, the protected route in _layout.tsx will handle navigation
      // If failed, signIn sets the error in the store
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <Text style={{ fontSize: 36 }}>{'\u2764\ufe0f'}</Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Sign in to your shared space
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 12 }}>
          <Input
            value={email}
            onChangeText={(v) => { setEmail(v); setError(null); }}
            placeholder="Email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={(v) => { setPassword(v); setError(null); }}
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

          <View style={{ marginTop: 8 }}>
            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              style={({ pressed }) => ({
                backgroundColor: '#E11D48',
                borderRadius: 9999,
                paddingHorizontal: 24,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 52,
                opacity: isLoading ? 0.5 : pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  fontFamily: 'Inter_600SemiBold',
                  fontWeight: '600',
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Switch to sign up */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Pressable onPress={() => router.replace('/auth/sign-up')}>
            <Text
              style={{
                fontSize: 14,
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
