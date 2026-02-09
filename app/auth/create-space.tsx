import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { InviteCodeDisplay } from '@/components/auth/InviteCodeDisplay';

export default function CreateSpaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const createSpace = useAuthStore((state) => state.createSpace);
  const joinSpace = useAuthStore((state) => state.joinSpace);
  const spaceId = useAuthStore((state) => state.spaceId);
  const inviteCode = useAuthStore((state) => state.inviteCode);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');

  useEffect(() => {
    if (spaceId) {
      router.replace('/');
    }
  }, [spaceId, router]);

  const handleCreateSpace = async () => {
    const code = await createSpace();
    if (code) {
      setGeneratedCode(code);
    }
  };

  const handleContinue = () => {
    router.replace('/');
  };

  if (mode === 'choose') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
          justifyContent: 'center',
        }}
      >
        <View style={{ alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <Text style={{ fontSize: 48 }}>{'\ud83c\udfe0'}</Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Your Shared Space
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
            Create a private space for you and your partner, or join one they&apos;ve already made.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Button
            title="Create a Space"
            onPress={() => setMode('create')}
          />
          <Button
            title="Join Partner's Space"
            variant="secondary"
            onPress={() => router.push('/auth/join-space')}
          />
        </View>
      </ScrollView>
    );
  }

  // Create mode
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + 60,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        justifyContent: 'center',
      }}
    >
      <View style={{ alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <Text style={{ fontSize: 48 }}>{'\ud83d\udd17'}</Text>
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          {generatedCode ? 'Space Created!' : 'Create Your Space'}
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
          {generatedCode
            ? 'Your partner can join using this code.'
            : 'You\'ll get an invite code to share with your partner.'}
        </Text>
      </View>

      {generatedCode ? (
        <View style={{ gap: 32 }}>
          <InviteCodeDisplay code={generatedCode} />
          <Button title="Continue to Setup" onPress={handleContinue} />
        </View>
      ) : (
        <View style={{ gap: 16 }}>
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
          <Button
            title="Create Space"
            onPress={handleCreateSpace}
            loading={isLoading}
          />
          <Button
            title="Back"
            variant="ghost"
            onPress={() => setMode('choose')}
          />
        </View>
      )}
    </ScrollView>
  );
}
