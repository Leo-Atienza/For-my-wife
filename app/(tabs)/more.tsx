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
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import type { ReactNode } from 'react';

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  subtitle: string;
  onPress: () => void;
}

const MenuItem = ({ icon, label, subtitle, onPress }: MenuItemProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.accent,
        opacity: pressed ? 0.9 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: theme.primarySoft,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
};

interface MenuSection {
  title: string;
  items: {
    icon: ReactNode;
    label: string;
    subtitle: string;
    route: string;
  }[];
}

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const sections: MenuSection[] = [
    {
      title: 'Activities',
      items: [
        {
          icon: <BookOpen size={22} color={theme.primary} />,
          label: 'Timeline',
          subtitle: 'Your relationship milestones',
          route: '/timeline',
        },
        {
          icon: <CalendarHeart size={22} color={theme.primary} />,
          label: 'Date Ideas',
          subtitle: 'Plan your next date',
          route: '/dates',
        },
        {
          icon: <CheckSquare size={22} color={theme.primary} />,
          label: 'Bucket List',
          subtitle: 'Things to do together',
          route: '/bucket-list',
        },
        {
          icon: <MessageCircle size={22} color={theme.primary} />,
          label: 'Daily Questions',
          subtitle: 'Answer together, then reveal',
          route: '/questions',
        },
      ],
    },
    {
      title: 'Connection',
      items: [
        {
          icon: <Smile size={22} color={theme.primary} />,
          label: 'Mood Check-In',
          subtitle: 'Share how you\'re feeling',
          route: '/mood',
        },
        {
          icon: <Palette size={22} color={theme.primary} />,
          label: 'Status Board',
          subtitle: 'Your current vibe',
          route: '/status',
        },
        {
          icon: <Mail size={22} color={theme.primary} />,
          label: 'Letter Box',
          subtitle: 'Weekly sealed letters',
          route: '/journal',
        },
        {
          icon: <Music size={22} color={theme.primary} />,
          label: 'Song Dedications',
          subtitle: 'Build your shared playlist',
          route: '/songs',
        },
        {
          icon: <MapPin size={22} color={theme.primary} />,
          label: 'Distance',
          subtitle: 'See how far apart you are',
          route: '/distance',
        },
      ],
    },
    {
      title: 'Profile & Settings',
      items: [
        {
          icon: <Heart size={22} color={theme.primary} />,
          label: 'Couple Profile',
          subtitle: 'Your shared profile',
          route: '/profile/couple',
        },
        {
          icon: <User size={22} color={theme.primary} />,
          label: 'My Profile',
          subtitle: 'View and edit your profile',
          route: '/profile/partner1',
        },
        {
          icon: <Sparkles size={22} color={theme.primary} />,
          label: 'Nicknames',
          subtitle: 'Your nickname history',
          route: '/profile/nicknames',
        },
        {
          icon: <Settings size={22} color={theme.primary} />,
          label: 'Settings',
          subtitle: 'Theme & preferences',
          route: '/settings',
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="More" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
          gap: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 8, marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginTop: 8,
                marginBottom: 2,
              }}
            >
              {section.title}
            </Text>
            {section.items.map((item) => (
              <MenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                subtitle={item.subtitle}
                onPress={() => router.push(item.route as never)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
