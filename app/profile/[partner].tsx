import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useLoveLanguageStore } from '@/stores/useLoveLanguageStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LOVE_LANGUAGE_LABELS, LOVE_LANGUAGE_EMOJIS, LOVE_LANGUAGE_DESCRIPTIONS } from '@/lib/love-languages';
import type { PartnerRole } from '@/lib/types';

export default function PartnerProfileScreen() {
  const { partner } = useLocalSearchParams<{ partner: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const role = partner as PartnerRole;
  const profileData = useProfileStore((state) => state[role]);
  const getActiveNickname = useNicknameStore((state) => state.getActiveNickname);
  const loveLanguageResult = useLoveLanguageStore((state) => state.getResult(role));

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

        {/* Love Language */}
        {loveLanguageResult ? (
          <Pressable
            onPress={() => router.push('/love-language')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Card>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 36 }}>
                  {LOVE_LANGUAGE_EMOJIS[loveLanguageResult.primary]}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter_600SemiBold',
                    color: theme.textPrimary,
                  }}
                >
                  {LOVE_LANGUAGE_LABELS[loveLanguageResult.primary]}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    textAlign: 'center',
                    lineHeight: 18,
                  }}
                >
                  {LOVE_LANGUAGE_DESCRIPTIONS[loveLanguageResult.primary]}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'Inter_400Regular',
                    color: theme.primary,
                    marginTop: 4,
                  }}
                >
                  Tap to view full results
                </Text>
              </View>
            </Card>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push('/love-language')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Card>
              <View style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 28 }}>{'\u{1F49D}'}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium',
                    color: theme.textMuted,
                  }}
                >
                  Love language not discovered yet
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter_400Regular',
                    color: theme.primary,
                  }}
                >
                  Take the quiz
                </Text>
              </View>
            </Card>
          </Pressable>
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
