import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { NicknameReveal } from '@/components/profile/NicknameReveal';
import { formatDate } from '@/lib/dates';
import type { Nickname, PartnerRole } from '@/lib/types';

export default function NicknamesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const nicknames = useNicknameStore((state) => state.nicknames);
  const addNickname = useNicknameStore((state) => state.addNickname);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [newNickname, setNewNickname] = useState('');
  const [revealVisible, setRevealVisible] = useState(false);
  const [revealNickname, setRevealNickname] = useState('');
  const [revealGivenBy, setRevealGivenBy] = useState('');

  const getPartnerName = (role: string) => {
    if (role === 'partner1') return partner1?.name ?? 'Partner 1';
    return partner2?.name ?? 'Partner 2';
  };

  const handleGiveNickname = () => {
    const trimmed = newNickname.trim();
    if (!trimmed) return;

    // partner1 gives nickname to partner2 (per design: your partner picks your nickname)
    addNickname('partner2', 'partner1', trimmed);

    setRevealNickname(trimmed);
    setRevealGivenBy(getPartnerName('partner1'));
    setRevealVisible(true);
    setNewNickname('');
  };

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

  const ListHeader = () => (
    <Card style={{ borderColor: theme.accent, borderWidth: 1 }}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', color: theme.textPrimary }}>
          Give a new nickname
        </Text>
        <Input
          value={newNickname}
          onChangeText={setNewNickname}
          placeholder="e.g., Sunshine, My Love, Babe"
          maxLength={30}
        />
        <Button
          title="Give Nickname"
          onPress={handleGiveNickname}
          disabled={!newNickname.trim()}
        />
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Nicknames" showBack />
      {nicknames.length === 0 ? (
        <View style={{ flex: 1, paddingHorizontal: 24, gap: 16 }}>
          <ListHeader />
          <EmptyState
            emoji={'\ud83d\udc95'}
            title="No nicknames yet"
            subtitle="Give your partner a special nickname!"
          />
        </View>
      ) : (
        <FlatList
          data={nicknames}
          keyExtractor={(item) => item.id}
          renderItem={renderNickname}
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            gap: 12,
            paddingBottom: insets.bottom + 20,
          }}
        />
      )}

      <NicknameReveal
        nickname={revealNickname}
        givenBy={revealGivenBy}
        visible={revealVisible}
        onDismiss={() => setRevealVisible(false)}
      />
    </View>
  );
}
