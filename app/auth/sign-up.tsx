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

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const signUp = useAuthStore((state) => state.signUp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword;
  const canSubmit = email.trim().length > 0 && password.length >= 6 && passwordsMatch;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    const success = await signUp(email.trim(), password);
    if (success) {
      router.replace('/auth/create-space');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <Text style={{ fontSize: 48 }}>{'\u2764\ufe0f'}</Text>
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Start your shared journey together
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
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
            placeholder="At least 6 characters"
            label="Password"
            secureTextEntry
            autoCapitalize="none"
          />
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            label="Confirm Password"
            secureTextEntry
            autoCapitalize="none"
          />

          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.danger,
              }}
            >
              Passwords don&apos;t match
            </Text>
          )}

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

          {!canSubmit && email.trim().length > 0 && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                textAlign: 'center',
              }}
            >
              {password.length < 6
                ? 'Password must be at least 6 characters'
                : !passwordsMatch && confirmPassword.length > 0
                ? ''
                : confirmPassword.length === 0
                ? 'Please confirm your password'
                : ''}
            </Text>
          )}

          <View style={{ marginTop: 8 }}>
            <Button
              title={canSubmit ? 'Continue' : 'Create Account'}
              onPress={handleSignUp}
              disabled={!canSubmit}
              loading={isLoading}
            />
          </View>
        </View>

        {/* Switch to sign in */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Pressable onPress={() => router.replace('/auth/sign-in')}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
              }}
            >
              Already have an account?{' '}
              <Text style={{ color: theme.primary, fontFamily: 'Inter_600SemiBold' }}>
                Sign In
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
