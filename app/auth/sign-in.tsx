import { useState } from 'react';
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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) return;
    const success = await signIn(email.trim(), password);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
            onChangeText={setEmail}
            placeholder="Email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={setPassword}
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
            <Button
              title="Sign In"
              onPress={handleSignIn}
              disabled={!email.trim() || !password.trim()}
              loading={isLoading}
            />
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
