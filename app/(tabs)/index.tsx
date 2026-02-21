import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { DurationCounter } from '@/components/home/DurationCounter';
import { FloatingHearts } from '@/components/home/FloatingHearts';
import { QuickActions } from '@/components/home/QuickActions';
import { DailyQuote } from '@/components/home/DailyQuote';
import { ThinkingOfYouButton } from '@/components/home/ThinkingOfYouButton';
import { ThinkingOfYouReceiver } from '@/components/home/ThinkingOfYouReceiver';
import { SleepWakeToggle } from '@/components/home/SleepWakeToggle';
import { PartnerSleepStatus } from '@/components/home/PartnerSleepStatus';
import { WeeklyRecapCard } from '@/components/home/WeeklyRecapCard';
import { SyncStatusIndicator } from '@/components/home/SyncStatusIndicator';
import { ThisDayInHistory } from '@/components/home/ThisDayInHistory';
import { ValentinesDayCard } from '@/components/home/ValentinesDayCard';
import { MilestoneAlert } from '@/components/home/MilestoneAlert';
import { StreakCounter } from '@/components/home/StreakCounter';
import { DailyCompliment } from '@/components/home/DailyCompliment';
import { RelationshipHealth } from '@/components/home/RelationshipHealth';
import { LoveFortune } from '@/components/home/LoveFortune';
import { RelationshipTrivia } from '@/components/home/RelationshipTrivia';
import { QuickGreeting } from '@/components/home/QuickGreeting';
import { LoveLanguageTip } from '@/components/home/LoveLanguageTip';
import { CountdownCelebration } from '@/components/home/CountdownCelebration';
import { getGreeting } from '@/lib/utils';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const session = useAuthStore((state) => state.session);
  const spaceId = useAuthStore((state) => state.spaceId);
  const initialLoadComplete = useAuthStore((state) => state.initialLoadComplete);
  const isOnboarded = useCoupleStore((state) => state.isOnboarded);
  const profile = useCoupleStore((state) => state.profile);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const getActiveNickname = useNicknameStore((state) => state.getActiveNickname);

  // Auth redirects are handled by _layout.tsx useProtectedRoute
  // Show loading state while waiting for data
  if (!session || !spaceId || !isOnboarded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  // Wait for initial Supabase load to complete before rendering widgets
  // This prevents empty/missing widgets on first render after login
  if (!initialLoadComplete || !profile || !partner1) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 48 }}>{'\u2764\ufe0f'}</Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          Setting things up...
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            textAlign: 'center',
          }}
        >
          Loading your shared space. This may take a moment.
        </Text>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  const nickname = getActiveNickname('partner2');
  const partnerDisplayName = nickname ?? partner2?.name ?? 'Your love';
  const myName = partner1.name ?? 'You';
  const greeting = getGreeting();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
    <ThinkingOfYouReceiver />
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80,
        paddingHorizontal: 24,
        gap: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Sync status — only shows when offline or syncing */}
      <SyncStatusIndicator />

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
          {greeting}, {myName}
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontFamily: 'DancingScript_400Regular',
            color: theme.primary,
            textAlign: 'center',
          }}
        >
          {myName} & {partnerDisplayName}
        </Text>
      </View>

      {/* Countdown celebration (shows when a countdown reaches today) */}
      <CountdownCelebration />

      {/* Valentine's Day celebration (only shows on Feb 14) */}
      <ValentinesDayCard />

      {/* Relationship milestone alert (upcoming/today milestones) */}
      <MilestoneAlert />

      {/* Quick morning/night greeting */}
      <QuickGreeting />

      {/* Thinking of You */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <ThinkingOfYouButton />
      </View>

      {/* Partner sleep status — subtle inline */}
      <PartnerSleepStatus />

      {/* Duration counter with floating hearts */}
      {profile.anniversaryDate ? (
        <View style={{ position: 'relative' }}>
          <FloatingHearts />
          <DurationCounter anniversaryDate={profile.anniversaryDate} />
        </View>
      ) : null}

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

      {/* Relationship streak counter */}
      <StreakCounter />

      {/* Weekly relationship health pulse */}
      <RelationshipHealth />

      {/* Sleep/Wake toggle */}
      <SleepWakeToggle />

      {/* This Day in Our History */}
      <ThisDayInHistory />

      {/* Relationship trivia */}
      <RelationshipTrivia />

      {/* Love language tip for partner */}
      <LoveLanguageTip />

      {/* Daily compliment for partner */}
      <DailyCompliment />

      {/* Daily quote */}
      <DailyQuote />

      {/* Love fortune cookie */}
      <LoveFortune />

      {/* Weekly Recap */}
      <WeeklyRecapCard />
    </ScrollView>
    </View>
  );
}
