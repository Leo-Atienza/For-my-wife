import { View, FlatList, Text, Pressable, RefreshControl, Animated } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCountdownsStore } from '@/stores/useCountdownsStore';
import { useTheme } from '@/hooks/useTheme';
import { useCountdown } from '@/hooks/useCountdown';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FlipNumber } from '@/components/countdowns/FlipNumber';
import { ConfettiBurst } from '@/components/bucket/ConfettiBurst';
import type { CountdownEvent } from '@/lib/types';

const CelebrationBadge = () => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  return (
    <View
      style={{
        backgroundColor: theme.primarySoft,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <ConfettiBurst active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Animated.Text
        style={{
          fontSize: 32,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {'\ud83c\udf89'}
      </Animated.Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Inter_600SemiBold',
          color: theme.success,
          marginTop: 4,
        }}
      >
        It&apos;s here!
      </Text>
    </View>
  );
};

const CountdownCard = ({ countdown }: { countdown: CountdownEvent }) => {
  const theme = useTheme();
  const values = useCountdown(countdown.targetDate);

  return (
    <Card>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {countdown.emoji && <Text style={{ fontSize: 24 }}>{countdown.emoji}</Text>}
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              flex: 1,
            }}
          >
            {countdown.title}
          </Text>
        </View>

        {values.isExpired ? (
          <CelebrationBadge />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              backgroundColor: theme.primarySoft,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <FlipNumber value={values.days} label="days" />
            <FlipNumber value={values.hours} label="hrs" />
            <FlipNumber value={values.minutes} label="min" />
            <FlipNumber value={values.seconds} label="sec" />
          </View>
        )}
      </View>
    </Card>
  );
};

export default function CountdownsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const countdowns = useCountdownsStore((state) => state.countdowns);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (countdowns.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Countdowns" />
        <EmptyState
          emoji={'\u23f3'}
          title="Nothing to count down to... yet"
          subtitle="Set your first special date."
          actionLabel="Add Countdown"
          onAction={() => router.push('/countdowns/new')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Countdowns"
        rightElement={
          <Pressable
            onPress={() => router.push('/countdowns/new')}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Add a new countdown"
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />
      <FlatList
        data={countdowns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CountdownCard countdown={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
