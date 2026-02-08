import { View, Text, Pressable } from 'react-native';
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
  MessageCircle,
  NotebookPen,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { ReactNode } from 'react';

interface ActionItem {
  icon: ReactNode;
  label: string;
  route: string;
}

export const QuickActions = () => {
  const router = useRouter();
  const theme = useTheme();

  const actions: ActionItem[] = [
    {
      icon: <PenLine size={24} color={theme.primary} />,
      label: 'Love Notes',
      route: '/(tabs)/notes',
    },
    {
      icon: <Camera size={24} color={theme.primary} />,
      label: 'Memories',
      route: '/(tabs)/memories',
    },
    {
      icon: <Clock size={24} color={theme.primary} />,
      label: 'Countdowns',
      route: '/(tabs)/countdowns',
    },
    {
      icon: <BookOpen size={24} color={theme.primary} />,
      label: 'Timeline',
      route: '/timeline',
    },
    {
      icon: <CalendarHeart size={24} color={theme.primary} />,
      label: 'Date Ideas',
      route: '/dates',
    },
    {
      icon: <CheckSquare size={24} color={theme.primary} />,
      label: 'Bucket List',
      route: '/bucket-list',
    },
    {
      icon: <Smile size={24} color={theme.primary} />,
      label: 'Mood',
      route: '/mood',
    },
    {
      icon: <Music size={24} color={theme.primary} />,
      label: 'Songs',
      route: '/songs',
    },
    {
      icon: <MessageCircle size={24} color={theme.primary} />,
      label: 'Questions',
      route: '/questions',
    },
    {
      icon: <NotebookPen size={24} color={theme.primary} />,
      label: 'Partner Notes',
      route: '/partner-notes',
    },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => router.push(action.route as never)}
          style={({ pressed }) => ({
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '31%',
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
              fontSize: 12,
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
