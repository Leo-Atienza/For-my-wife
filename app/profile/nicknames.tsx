import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/dates';
import type { Nickname } from '@/lib/types';

export default function NicknamesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const nicknames = useNicknameStore((state) => state.nicknames);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const getPartnerName = (role: string) => {
    if (role === 'partner1') return partner1?.name ?? 'Partner 1';
    return partner2?.name ?? 'Partner 2';
  };

  if (nicknames.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Nicknames" showBack />
        <EmptyState
          emoji={'\ud83d\udc95'}
          title="No nicknames yet"
          subtitle="Give your partner a special nickname!"
        />
      </View>
    );
  }

  const renderNickname = ({ item }: { item: Nickname }) => (
    <Card>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
            }}
          >
            {item.nickname}
          </Text>
          {item.isActive && (
            <View
              style={{
                backgroundColor: theme.primarySoft,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                Active
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
          For {getPartnerName(item.forPartner)} &middot; Given by {getPartnerName(item.givenBy)} &middot; {formatDate(item.givenAt)}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Nicknames" showBack />
      <FlatList
        data={nicknames}
        keyExtractor={(item) => item.id}
        renderItem={renderNickname}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
          paddingBottom: insets.bottom + 20,
        }}
      />
    </View>
  );
}
