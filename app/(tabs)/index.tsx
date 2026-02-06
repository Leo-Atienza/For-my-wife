import { View, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useTheme } from '@/hooks/useTheme';
import { DurationCounter } from '@/components/home/DurationCounter';
import { QuickActions } from '@/components/home/QuickActions';
import { DailyQuote } from '@/components/home/DailyQuote';
import { getGreeting } from '@/lib/utils';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const isOnboarded = useCoupleStore((state) => state.isOnboarded);
  const profile = useCoupleStore((state) => state.profile);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const getActiveNickname = useNicknameStore((state) => state.getActiveNickname);

  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/setup');
    }
  }, [isOnboarded, router]);

  if (!isOnboarded || !profile || !partner1) {
    return null;
  }

  const nickname = getActiveNickname('partner2');
  const partnerDisplayName = nickname ?? partner2?.name ?? 'Your love';
  const greeting = getGreeting();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80,
        paddingHorizontal: 24,
        gap: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with couple photo and names */}
      <View style={{ alignItems: 'center', gap: 12 }}>
        {profile.couplePhoto ? (
          <Image
            source={{ uri: profile.couplePhoto }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: theme.accent,
            }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.primarySoft,
              borderWidth: 3,
              borderColor: theme.accent,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 36 }}>{'\u2764\ufe0f'}</Text>
          </View>
        )}

        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          {greeting}, {partner1.name}
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontFamily: 'DancingScript_400Regular',
            color: theme.primary,
            textAlign: 'center',
          }}
        >
          {partner1.name} & {partnerDisplayName}
        </Text>
      </View>

      {/* Duration counter */}
      <DurationCounter anniversaryDate={profile.anniversaryDate} />

      {/* Quick actions */}
      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
          }}
        >
          Quick Actions
        </Text>
        <QuickActions />
      </View>

      {/* Daily quote */}
      <DailyQuote />
    </ScrollView>
  );
}
