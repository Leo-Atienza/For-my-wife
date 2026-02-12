import { useState } from 'react';
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
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const handleUpdate = async () => {
    Keyboard.dismiss();
    if (password.length < 6) {
      setError(`Password must be at least 6 characters (currently ${password.length}).`);
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.replace('/auth/sign-in');
      }, 2000);
    }
  };

  if (success) {
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
        <Text style={{ fontSize: 48 }}>{'\u2705'}</Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          Password Updated!
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            textAlign: 'center',
          }}
        >
          Redirecting to sign in...
        </Text>
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
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <Text style={{ fontSize: 36 }}>{'\ud83d\udd11'}</Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            New Password
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Choose a new password for your account
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 12 }}>
          <Input
            value={password}
            onChangeText={(v) => { setPassword(v); setError(''); }}
            placeholder="At least 6 characters"
            label="New Password"
            secureTextEntry
            autoCapitalize="none"
            autoFocus
          />
          <Input
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setError(''); }}
            placeholder="Confirm your new password"
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

          {error ? (
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
          ) : null}

          <View style={{ marginTop: 8 }}>
            <Button
              title={isLoading ? 'Updating...' : 'Update Password'}
              onPress={handleUpdate}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </View>

        {/* Back to sign in */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Pressable onPress={() => router.replace('/auth/sign-in')}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
              }}
            >
              Back to{' '}
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
