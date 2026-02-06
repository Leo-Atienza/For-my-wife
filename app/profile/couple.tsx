import { View, Text, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/dates';

export default function CoupleProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const profile = useCoupleStore((state) => state.profile);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const getActiveNickname = useNicknameStore((state) => state.getActiveNickname);

  if (!profile) return null;

  const nickname1 = getActiveNickname('partner1');
  const nickname2 = getActiveNickname('partner2');

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Our Profile" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
          alignItems: 'center',
        }}
      >
        {/* Couple photo */}
        {profile.couplePhoto ? (
          <Image
            source={{ uri: profile.couplePhoto }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: theme.accent,
            }}
          />
        ) : (
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.primarySoft,
              borderWidth: 3,
              borderColor: theme.accent,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>{'\u2764\ufe0f'}</Text>
          </View>
        )}

        {/* Couple names */}
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'DancingScript_400Regular',
            color: theme.primary,
            textAlign: 'center',
          }}
        >
          {nickname1 ?? partner1?.name ?? 'You'} & {nickname2 ?? partner2?.name ?? 'Partner'}
        </Text>

        {/* Info cards */}
        <Card style={{ width: '100%' }}>
          <View style={{ gap: 16 }}>
            <InfoRow label="Anniversary" value={formatDate(profile.anniversaryDate)} />
            <InfoRow
              label="Relationship"
              value={profile.relationshipType === 'ldr' ? 'Long Distance' : 'Same City'}
            />
            <InfoRow label="Theme" value={profile.theme.charAt(0).toUpperCase() + profile.theme.slice(1)} />
            {profile.sharedBio && <InfoRow label="Our Motto" value={profile.sharedBio} />}
            {profile.ourSong && (
              <InfoRow
                label="Our Song"
                value={`${profile.ourSong.title} by ${profile.ourSong.artist}`}
              />
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.textMuted, flex: 1 }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Inter_400Regular',
          color: theme.textPrimary,
          flex: 2,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
    </View>
  );
};
