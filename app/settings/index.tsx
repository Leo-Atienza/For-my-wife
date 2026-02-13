import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPlus, ChevronRight, LogOut } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { THEMES } from '@/lib/constants';
import { clearAllData } from '@/lib/storage';
import type { ThemeName } from '@/lib/types';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const currentTheme = useCoupleStore((state) => state.profile?.theme ?? 'rose');
  const setTheme = useCoupleStore((state) => state.setTheme);
  const signOut = useAuthStore((state) => state.signOut);

  const handleReset = () => {
    Alert.alert(
      'Reset Everything?',
      'This will delete all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out?',
      'You can sign back in anytime with your email and password.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Settings" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 24,
        }}
      >
        {/* Invite partner shortcut */}
        <Pressable
          onPress={() => router.push('/invite-partner')}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Invite partner"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.primarySoft,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1.5,
              borderColor: theme.accent,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: theme.primary + '15',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <UserPlus size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Inter_600SemiBold',
                  color: theme.textPrimary,
                }}
              >
                {'\u{1F48D}'} Invite Partner
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  marginTop: 2,
                }}
              >
                Share your invite code or check connection status
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted + '80'} />
          </View>
        </Pressable>

        {/* Theme selector with live preview */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            Theme
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            Pick a color palette for your space. Changes apply instantly.
          </Text>
          <View style={{ gap: 10 }}>
            {(Object.keys(THEMES) as ThemeName[]).map((themeName) => {
              const colors = THEMES[themeName];
              const isSelected = currentTheme === themeName;
              return (
                <Pressable
                  key={themeName}
                  onPress={() => setTheme(themeName)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    padding: 14,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : theme.accent,
                    backgroundColor: isSelected ? colors.primarySoft : theme.surface,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primary,
                      }}
                    />
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.accent,
                      }}
                    />
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primarySoft,
                        borderWidth: 1,
                        borderColor: colors.accent,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Inter_600SemiBold',
                        color: isSelected ? colors.primary : theme.textPrimary,
                        textTransform: 'capitalize',
                      }}
                    >
                      {themeName}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{'\u2713'}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* About */}
        <Card>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
              Us
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
              A private app for the two of you. Version 2.0.0
            </Text>
          </View>
        </Card>

        {/* Account */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            Account
          </Text>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: theme.accent,
              }}
            >
              <LogOut size={20} color={theme.textMuted} />
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.textPrimary, flex: 1, marginLeft: 12 }}>
                Sign Out
              </Text>
              <ChevronRight size={18} color={theme.textMuted + '80'} />
            </View>
          </Pressable>
        </View>

        {/* Danger zone */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.danger,
            }}
          >
            Danger Zone
          </Text>
          <Pressable
            onPress={handleReset}
            style={{
              backgroundColor: '#FEF2F2',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: '#FECACA',
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: theme.danger }}>
              Reset All Data
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted, marginTop: 2 }}>
              Delete everything and start fresh
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
