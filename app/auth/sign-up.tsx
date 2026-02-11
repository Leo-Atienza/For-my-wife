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
  const setError = useAuthStore((state) => state.setError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const [validationError, setValidationError] = useState('');

  const handleSignUp = async () => {
    // Validate and show clear error instead of silently disabling
    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setValidationError(`Password must be at least 6 characters (currently ${password.length}).`);
      return;
    }
    if (!passwordsMatch) {
      setValidationError('Passwords do not match.');
      return;
    }
    setValidationError('');
    try {
      const result = await signUp(email.trim(), password);
      if (result === 'session') {
        router.replace('/auth/create-space');
      } else if (result === 'confirmation') {
        setConfirmationSent(true);
      }
      // result === false means error was already set in the store
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(message);
    }
  };

  if (confirmationSent) {
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
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 48 }}>{'\u2709\ufe0f'}</Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          Check Your Email
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
          We sent a confirmation link to{' '}
          <Text style={{ fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
            {email.trim()}
          </Text>
          . Tap the link to activate your account, then come back and sign in.
        </Text>
        <View style={{ marginTop: 16, width: '100%' }}>
          <Button
            title="Go to Sign In"
            onPress={() => router.replace('/auth/sign-in')}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
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
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Start your shared journey together
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 12 }}>
          <Input
            value={email}
            onChangeText={(v) => { setEmail(v); setValidationError(''); }}
            placeholder="Email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={(v) => { setPassword(v); setValidationError(''); }}
            placeholder="At least 6 characters"
            label="Password"
            secureTextEntry
            autoCapitalize="none"
          />
          <Input
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setValidationError(''); }}
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

          {(error || validationError) && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.danger,
                textAlign: 'center',
              }}
            >
              {error || validationError}
            </Text>
          )}

          <View style={{ marginTop: 8 }}>
            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
              style={{
                backgroundColor: '#E11D48',
                borderRadius: 9999,
                paddingHorizontal: 24,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 52,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  fontFamily: 'Inter_600SemiBold',
                  fontWeight: '600',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Switch to sign in */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
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
