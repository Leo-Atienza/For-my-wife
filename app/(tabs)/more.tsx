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
  ChevronRight,
  UserPlus,
  Plane,
  HeartHandshake,
  Film,
  FileDown,
  ListMusic,
  PenTool,
  Ticket,
  BarChart3,
  Sun,
  Gift,
  Lightbulb,
  Brain,
  CircleDot,
  Handshake,
  ShoppingBag,
  Map,
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

const MenuItem = ({
  item,
  isLast,
  onPress,
}: {
  item: MenuItemData;
  isLast: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {/* Row container — plain View ensures flexDirection: 'row' is never overridden */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.accent + '60',
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: theme.primarySoft,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
          }}
        >
          {item.icon}
        </View>

        {/* Label + subtitle */}
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
            }}
            numberOfLines={1}
          >
            {item.emoji} {item.label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {item.subtitle}
          </Text>
        </View>

        {/* Chevron */}
        <ChevronRight size={18} color={theme.textMuted + '80'} />
      </View>
    </Pressable>
  );
};

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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {items.map((item, index) => (
        <MenuItem
          key={item.label}
          item={item}
          isLast={index === items.length - 1}
          onPress={() => onNavigate(item.route)}
        />
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
      emoji: '🎉',
      items: [
        {
          icon: <BookOpen size={22} color={theme.primary} />,
          label: 'Timeline',
          subtitle: 'Your relationship milestones',
          route: '/timeline',
          emoji: '📖',
        },
        {
          icon: <CalendarHeart size={22} color={theme.primary} />,
          label: 'Date Ideas',
          subtitle: 'Plan your next date',
          route: '/dates',
          emoji: '💕',
        },
        {
          icon: <CheckSquare size={22} color={theme.primary} />,
          label: 'Bucket List',
          subtitle: 'Things to do together',
          route: '/bucket-list',
          emoji: '\u2728',
        },
        {
          icon: <MessageCircle size={22} color={theme.primary} />,
          label: 'Daily Questions',
          subtitle: 'Answer together, then reveal',
          route: '/questions',
          emoji: '💬',
        },
        {
          icon: <Film size={22} color={theme.primary} />,
          label: 'Watch Party',
          subtitle: 'Shared timers for movie nights',
          route: '/watch-party',
          emoji: '🎬',
        },
        {
          icon: <HeartHandshake size={22} color={theme.primary} />,
          label: 'Love Languages',
          subtitle: 'Discover how you feel loved',
          route: '/love-language',
          emoji: '💝',
        },
        {
          icon: <PenTool size={22} color={theme.primary} />,
          label: 'Love Letters',
          subtitle: 'Generate romantic letters',
          route: '/letter-generator',
          emoji: '💌',
        },
        {
          icon: <Ticket size={22} color={theme.primary} />,
          label: 'Love Coupons',
          subtitle: 'Give & redeem romantic coupons',
          route: '/coupons',
          emoji: '🎫',
        },
        {
          icon: <Sun size={22} color={theme.primary} />,
          label: 'Greetings',
          subtitle: 'Send morning & night messages',
          route: '/greetings',
          emoji: '🌞',
        },
        {
          icon: <Gift size={22} color={theme.primary} />,
          label: 'Card Maker',
          subtitle: 'Create & send greeting cards',
          route: '/card-maker',
          emoji: '💌',
        },
        {
          icon: <Lightbulb size={22} color={theme.primary} />,
          label: 'Dream Board',
          subtitle: 'Shared dreams & goals',
          route: '/dreams',
          emoji: '🌠',
        },
        {
          icon: <Brain size={22} color={theme.primary} />,
          label: 'Know Me Quiz',
          subtitle: 'How well do you know each other?',
          route: '/quiz',
          emoji: '🧠',
        },
        {
          icon: <CircleDot size={22} color={theme.primary} />,
          label: 'Would You Rather',
          subtitle: 'Fun dilemmas for couples',
          route: '/would-you-rather',
          emoji: '🤷',
        },
      ],
    },
    {
      title: 'Stay Connected',
      emoji: '💞',
      items: [
        {
          icon: <Smile size={22} color={theme.primary} />,
          label: 'Mood Check-In',
          subtitle: 'Share how you\'re feeling',
          route: '/mood',
          emoji: '😊',
        },
        {
          icon: <Palette size={22} color={theme.primary} />,
          label: 'Status Board',
          subtitle: 'Your current vibe',
          route: '/status',
          emoji: '🎨',
        },
        {
          icon: <Mail size={22} color={theme.primary} />,
          label: 'Letter Box',
          subtitle: 'Weekly sealed letters',
          route: '/journal',
          emoji: '💌',
        },
        {
          icon: <Music size={22} color={theme.primary} />,
          label: 'Song Dedications',
          subtitle: 'Build your shared playlist',
          route: '/songs',
          emoji: '🎵',
        },
        {
          icon: <ListMusic size={22} color={theme.primary} />,
          label: 'Our Soundtrack',
          subtitle: 'Your shared playlist',
          route: '/playlist',
          emoji: '🎶',
        },
        {
          icon: <NotebookPen size={22} color={theme.primary} />,
          label: 'Partner Notes',
          subtitle: 'Notes about your partner',
          route: '/partner-notes',
          emoji: '📝',
        },
        {
          icon: <Fingerprint size={22} color={theme.primary} />,
          label: 'Virtual Touch',
          subtitle: 'Touch screens together',
          route: '/touch',
          emoji: '🤝',
        },
        {
          icon: <MapPin size={22} color={theme.primary} />,
          label: 'Distance',
          subtitle: 'See how far apart you are',
          route: '/distance',
          emoji: '📍',
        },
        {
          icon: <Plane size={22} color={theme.primary} />,
          label: 'Next Visit',
          subtitle: 'Plan your next time together',
          route: '/next-visit',
          emoji: '\u2708\ufe0f',
        },
        {
          icon: <Handshake size={22} color={theme.primary} />,
          label: 'Our Promises',
          subtitle: 'Commitments to each other',
          route: '/promises',
          emoji: '🤝',
        },
        {
          icon: <ShoppingBag size={22} color={theme.primary} />,
          label: 'Wish List',
          subtitle: 'Gift ideas for each other',
          route: '/wish-list',
          emoji: '🎁',
        },
        {
          icon: <Map size={22} color={theme.primary} />,
          label: 'Love Map',
          subtitle: 'Places special to your story',
          route: '/love-map',
          emoji: '🗺\ufe0f',
        },
      ],
    },
    {
      title: 'You & Me',
      emoji: '💑',
      items: [
        {
          icon: <UserPlus size={22} color={theme.primary} />,
          label: 'Invite Partner',
          subtitle: 'Connect with your partner',
          route: '/invite-partner',
          emoji: '💍',
        },
        {
          icon: <Heart size={22} color={theme.primary} />,
          label: 'Couple Profile',
          subtitle: 'Your shared profile',
          route: '/profile/couple',
          emoji: '💖',
        },
        {
          icon: <User size={22} color={theme.primary} />,
          label: 'My Profile',
          subtitle: 'View and edit your profile',
          route: '/profile/partner1',
          emoji: '🙋',
        },
        {
          icon: <Sparkles size={22} color={theme.primary} />,
          label: 'Nicknames',
          subtitle: 'Your nickname history',
          route: '/profile/nicknames',
          emoji: '🌟',
        },
        {
          icon: <BarChart3 size={22} color={theme.primary} />,
          label: 'Our Stats',
          subtitle: 'Your relationship by the numbers',
          route: '/stats',
          emoji: '📊',
        },
        {
          icon: <FileDown size={22} color={theme.primary} />,
          label: 'Export Yearbook',
          subtitle: 'PDF of your love story',
          route: '/export',
          emoji: '📖',
        },
        {
          icon: <Settings size={22} color={theme.primary} />,
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
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View
            key={section.title}
            style={{ marginTop: sectionIndex === 0 ? 4 : 28 }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
                marginLeft: 4,
                marginBottom: 10,
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
