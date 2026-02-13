import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Heart,
  User,
  Sparkles,
  Settings,
  BookOpen,
  CalendarHeart,
  CheckSquare,
  Smile,
  Mail,
  MessageCircle,
  Music,
  Palette,
  NotebookPen,
  Fingerprint,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import type { ReactNode } from 'react';

interface MenuItemData {
  icon: ReactNode;
  label: string;
  subtitle: string;
  route: string;
  emoji: string;
}

interface MenuSection {
  title: string;
  emoji: string;
  items: MenuItemData[];
}

const MenuCard = ({
  items,
  onNavigate,
}: {
  items: MenuItemData[];
  onNavigate: (route: string) => void;
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.accent,
        overflow: 'hidden',
      }}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          onPress={() => onNavigate(item.route)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: pressed ? theme.primarySoft : 'transparent',
            borderBottomWidth: index < items.length - 1 ? 1 : 0,
            borderBottomColor: theme.accent,
          })}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: theme.primarySoft,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.icon}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textPrimary,
              }}
            >
              {item.emoji} {item.label}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                marginTop: 1,
              }}
            >
              {item.subtitle}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const sections: MenuSection[] = [
    {
      title: 'Fun Activities',
      emoji: '\u{1F389}',
      items: [
        {
          icon: <BookOpen size={20} color={theme.primary} />,
          label: 'Timeline',
          subtitle: 'Your relationship milestones',
          route: '/timeline',
          emoji: '\u{1F4D6}',
        },
        {
          icon: <CalendarHeart size={20} color={theme.primary} />,
          label: 'Date Ideas',
          subtitle: 'Plan your next date',
          route: '/dates',
          emoji: '\u{1F495}',
        },
        {
          icon: <CheckSquare size={20} color={theme.primary} />,
          label: 'Bucket List',
          subtitle: 'Things to do together',
          route: '/bucket-list',
          emoji: '\u2728',
        },
        {
          icon: <MessageCircle size={20} color={theme.primary} />,
          label: 'Daily Questions',
          subtitle: 'Answer together, then reveal',
          route: '/questions',
          emoji: '\u{1F4AC}',
        },
      ],
    },
    {
      title: 'Stay Connected',
      emoji: '\u{1F49E}',
      items: [
        {
          icon: <Smile size={20} color={theme.primary} />,
          label: 'Mood Check-In',
          subtitle: 'Share how you\'re feeling',
          route: '/mood',
          emoji: '\u{1F60A}',
        },
        {
          icon: <Palette size={20} color={theme.primary} />,
          label: 'Status Board',
          subtitle: 'Your current vibe',
          route: '/status',
          emoji: '\u{1F3A8}',
        },
        {
          icon: <Mail size={20} color={theme.primary} />,
          label: 'Letter Box',
          subtitle: 'Weekly sealed letters',
          route: '/journal',
          emoji: '\u{1F48C}',
        },
        {
          icon: <Music size={20} color={theme.primary} />,
          label: 'Song Dedications',
          subtitle: 'Build your shared playlist',
          route: '/songs',
          emoji: '\u{1F3B5}',
        },
        {
          icon: <NotebookPen size={20} color={theme.primary} />,
          label: 'Partner Notes',
          subtitle: 'Notes about your partner',
          route: '/partner-notes',
          emoji: '\u{1F4DD}',
        },
        {
          icon: <Fingerprint size={20} color={theme.primary} />,
          label: 'Virtual Touch',
          subtitle: 'Touch screens together',
          route: '/touch',
          emoji: '\u{1F91D}',
        },
        {
          icon: <MapPin size={20} color={theme.primary} />,
          label: 'Distance',
          subtitle: 'See how far apart you are',
          route: '/distance',
          emoji: '\u{1F4CD}',
        },
      ],
    },
    {
      title: 'You & Me',
      emoji: '\u{1F491}',
      items: [
        {
          icon: <Heart size={20} color={theme.primary} />,
          label: 'Couple Profile',
          subtitle: 'Your shared profile',
          route: '/profile/couple',
          emoji: '\u{1F496}',
        },
        {
          icon: <User size={20} color={theme.primary} />,
          label: 'My Profile',
          subtitle: 'View and edit your profile',
          route: '/profile/partner1',
          emoji: '\u{1F64B}',
        },
        {
          icon: <Sparkles size={20} color={theme.primary} />,
          label: 'Nicknames',
          subtitle: 'Your nickname history',
          route: '/profile/nicknames',
          emoji: '\u{1F31F}',
        },
        {
          icon: <Settings size={20} color={theme.primary} />,
          label: 'Settings',
          subtitle: 'Theme & preferences',
          route: '/settings',
          emoji: '\u2699\ufe0f',
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="More" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
                marginLeft: 4,
              }}
            >
              {section.emoji} {section.title}
            </Text>
            <MenuCard
              items={section.items}
              onNavigate={(route) => router.push(route as never)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
