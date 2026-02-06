import { View, FlatList, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCountdownsStore } from '@/stores/useCountdownsStore';
import { useTheme } from '@/hooks/useTheme';
import { useCountdown } from '@/hooks/useCountdown';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CountdownEvent } from '@/lib/types';

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
          <View
            style={{
              backgroundColor: theme.primarySoft,
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter_600SemiBold',
                color: theme.success,
              }}
            >
              {'\ud83c\udf89'} It&apos;s here!
            </Text>
          </View>
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
            <CountdownUnit value={values.days} label="days" />
            <CountdownUnit value={values.hours} label="hrs" />
            <CountdownUnit value={values.minutes} label="min" />
            <CountdownUnit value={values.seconds} label="sec" />
          </View>
        )}
      </View>
    </Card>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'PlayfairDisplay_700Bold',
          color: theme.primary,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Inter_400Regular',
          color: theme.textMuted,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default function CountdownsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const countdowns = useCountdownsStore((state) => state.countdowns);

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
