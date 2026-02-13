import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  PenLine,
  Camera,
  Clock,
  BookOpen,
  CalendarHeart,
  CheckSquare,
  Smile,
  Music,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { ReactNode } from 'react';

interface ActionItem {
  icon: ReactNode;
  label: string;
  route: string;
  emoji: string;
}

export const QuickActions = () => {
  const router = useRouter();
  const theme = useTheme();

  const actions: ActionItem[] = [
    {
      icon: <PenLine size={22} color={theme.primary} />,
      label: 'Notes',
      route: '/(tabs)/notes',
      emoji: '\u{1F48C}',
    },
    {
      icon: <Camera size={22} color={theme.primary} />,
      label: 'Memories',
      route: '/(tabs)/memories',
      emoji: '\u{1F4F8}',
    },
    {
      icon: <Clock size={22} color={theme.primary} />,
      label: 'Countdowns',
      route: '/(tabs)/countdowns',
      emoji: '\u{23F3}',
    },
    {
      icon: <BookOpen size={22} color={theme.primary} />,
      label: 'Timeline',
      route: '/timeline',
      emoji: '\u{1F4D6}',
    },
    {
      icon: <CalendarHeart size={22} color={theme.primary} />,
      label: 'Dates',
      route: '/dates',
      emoji: '\u{1F495}',
    },
    {
      icon: <CheckSquare size={22} color={theme.primary} />,
      label: 'Bucket List',
      route: '/bucket-list',
      emoji: '\u2728',
    },
    {
      icon: <Smile size={22} color={theme.primary} />,
      label: 'Mood',
      route: '/mood',
      emoji: '\u{1F60A}',
    },
    {
      icon: <Music size={22} color={theme.primary} />,
      label: 'Songs',
      route: '/songs',
      emoji: '\u{1F3B5}',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 14, paddingRight: 8 }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => router.push(action.route as never)}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.92 : 1 }],
          })}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.primarySoft,
                borderWidth: 1.5,
                borderColor: theme.accent,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {action.icon}
            </View>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Inter_500Medium',
                color: theme.textMuted,
                textAlign: 'center',
                maxWidth: 64,
              }}
              numberOfLines={1}
            >
              {action.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};
