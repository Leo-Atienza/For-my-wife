import { View, Text, Pressable, Dimensions } from 'react-native';
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
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 10;
const COLS = 4;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLS - 1)) / COLS;

export const QuickActions = () => {
  const router = useRouter();
  const theme = useTheme();

  const actions: ActionItem[] = [
    {
      icon: <PenLine size={20} color={theme.primary} />,
      label: 'Notes',
      route: '/(tabs)/notes',
    },
    {
      icon: <Camera size={20} color={theme.primary} />,
      label: 'Memories',
      route: '/(tabs)/memories',
    },
    {
      icon: <Clock size={20} color={theme.primary} />,
      label: 'Countdowns',
      route: '/(tabs)/countdowns',
    },
    {
      icon: <BookOpen size={20} color={theme.primary} />,
      label: 'Timeline',
      route: '/timeline',
    },
    {
      icon: <CalendarHeart size={20} color={theme.primary} />,
      label: 'Dates',
      route: '/dates',
    },
    {
      icon: <CheckSquare size={20} color={theme.primary} />,
      label: 'Bucket List',
      route: '/bucket-list',
    },
    {
      icon: <Smile size={20} color={theme.primary} />,
      label: 'Mood',
      route: '/mood',
    },
    {
      icon: <Music size={20} color={theme.primary} />,
      label: 'Songs',
      route: '/songs',
    },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
      }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => router.push(action.route as never)}
          style={({ pressed }) => ({
            backgroundColor: theme.surface,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: ITEM_WIDTH,
            borderWidth: 1,
            borderColor: theme.accent,
            transform: [{ scale: pressed ? 0.96 : 1 }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          })}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          {action.icon}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Inter_500Medium',
              color: theme.textPrimary,
            }}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
