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

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="More" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 80,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MenuItem
          icon={<MapPin size={22} color={theme.primary} />}
          label="Distance"
          subtitle="See how far apart you are"
          onPress={() => router.push('/distance')}
        />
        <MenuItem
          icon={<BookOpen size={22} color={theme.primary} />}
          label="Timeline"
          subtitle="Your relationship milestones"
          onPress={() => router.push('/timeline')}
        />
        <MenuItem
          icon={<Heart size={22} color={theme.primary} />}
          label="Couple Profile"
          subtitle="Your shared profile"
          onPress={() => router.push('/profile/couple')}
        />
        <MenuItem
          icon={<User size={22} color={theme.primary} />}
          label="My Profile"
          subtitle="View and edit your profile"
          onPress={() => router.push('/profile/partner1')}
        />
        <MenuItem
          icon={<Sparkles size={22} color={theme.primary} />}
          label="Nicknames"
          subtitle="Your nickname history"
          onPress={() => router.push('/profile/nicknames')}
        />
        <MenuItem
          icon={<Settings size={22} color={theme.primary} />}
          label="Settings"
          subtitle="Theme, export, preferences"
          onPress={() => router.push('/settings')}
        />
      </ScrollView>
    </View>
  );
}
