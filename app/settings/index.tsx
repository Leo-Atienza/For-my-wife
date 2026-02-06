import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { THEMES } from '@/lib/constants';
import { clearAllData } from '@/lib/storage';
import type { ThemeName } from '@/lib/types';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const currentTheme = useCoupleStore((state) => state.profile?.theme ?? 'rose');
  const setTheme = useCoupleStore((state) => state.setTheme);

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
        {/* Theme selector */}
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
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {(Object.keys(THEMES) as ThemeName[]).map((themeName) => {
              const colors = THEMES[themeName];
              const isSelected = currentTheme === themeName;
              return (
                <Pressable
                  key={themeName}
                  onPress={() => setTheme(themeName)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    gap: 6,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : 'transparent',
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.primary,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Inter_500Medium',
                      color: colors.primary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {themeName}
                  </Text>
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
              A private app for the two of you. Version 1.0.0
            </Text>
          </View>
        </Card>

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
