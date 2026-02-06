import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import type { PartnerRole } from '@/lib/types';

export default function PartnerProfileScreen() {
  const { partner } = useLocalSearchParams<{ partner: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const role = partner as PartnerRole;
  const profileData = useProfileStore((state) => state[role]);
  const getActiveNickname = useNicknameStore((state) => state.getActiveNickname);

  if (!profileData) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Profile" showBack />
        <EmptyState title="Profile not found" />
      </View>
    );
  }

  const nickname = getActiveNickname(role);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title={nickname ?? profileData.name} showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
        }}
      >
        {/* Name display */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.primarySoft,
              borderWidth: 2,
              borderColor: theme.accent,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>
              {profileData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
            }}
          >
            {nickname ?? profileData.name}
          </Text>
          {nickname && (
            <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
              ({profileData.name})
            </Text>
          )}
        </View>

        {/* Status */}
        {profileData.currentStatus && (
          <Card>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 28 }}>{profileData.currentStatus.emoji}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textPrimary }}>
                {profileData.currentStatus.text}
              </Text>
            </View>
          </Card>
        )}

        {/* Fun facts */}
        {profileData.funFacts.length > 0 && (
          <Card>
            <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary, marginBottom: 12 }}>
              Fun Facts
            </Text>
            {profileData.funFacts.map((fact, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                  {fact.label}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textPrimary }}>
                  {fact.value}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Best quality */}
        {profileData.bestQualityByPartner && (
          <Card>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 14, fontFamily: 'DancingScript_400Regular', color: theme.textMuted }}>
                Best quality (by partner)
              </Text>
              <Text style={{ fontSize: 16, fontFamily: 'Inter_400Regular', color: theme.textPrimary, fontStyle: 'italic' }}>
                &ldquo;{profileData.bestQualityByPartner}&rdquo;
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
