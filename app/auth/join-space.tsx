import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { InviteCodeInput } from '@/components/auth/InviteCodeInput';
import { PageHeader } from '@/components/layout/PageHeader';

export default function JoinSpaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const joinSpace = useAuthStore((state) => state.joinSpace);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [code, setCode] = useState('');

  const handleJoin = async () => {
    if (code.length !== 6) return;
    // useProtectedRoute in _layout.tsx handles navigation after spaceId is set
    await joinSpace(code);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <PageHeader title="Join Space" showBack />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          justifyContent: 'center',
          gap: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 48 }}>{'\ud83d\udc9e'}</Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Join Your Partner
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
            Ask your partner for their invite code to connect your accounts.
          </Text>
        </View>

        {/* Code input */}
        <InviteCodeInput value={code} onChangeText={setCode} />

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

        {/* Join button */}
        <Button
          title="Join Space"
          onPress={handleJoin}
          disabled={code.length !== 6}
          loading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
