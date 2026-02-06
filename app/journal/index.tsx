import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PenLine, Lock, Unlock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useJournalStore } from '@/stores/useJournalStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { PartnerRole } from '@/lib/types';

const getWeekKey = (): string => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

const getNextSunday = (): string => {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next.toISOString();
};

export default function JournalScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addLetter = useJournalStore((state) => state.addLetter);
  const getLetterForWeek = useJournalStore((state) => state.getLetterForWeek);
  const getLettersByWeek = useJournalStore((state) => state.getLettersByWeek);
  const isRevealed = useJournalStore((state) => state.isRevealed);
  const getAllWeekKeys = useJournalStore((state) => state.getAllWeekKeys);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [selectedPartner, setSelectedPartner] = useState<PartnerRole>('partner1');
  const [content, setContent] = useState('');

  const currentWeek = getWeekKey();
  const myLetter = getLetterForWeek(selectedPartner, currentWeek);
  const weekKeys = getAllWeekKeys();

  const handleSave = () => {
    if (!content.trim()) return;
    const revealDate = getNextSunday();
    addLetter(selectedPartner, content.trim(), currentWeek, revealDate);
    setContent('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Letter Box" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Partner selector */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setSelectedPartner('partner1')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor:
                selectedPartner === 'partner1' ? theme.primary : theme.primarySoft,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: selectedPartner === 'partner1' ? '#FFFFFF' : theme.textPrimary,
              }}
            >
              {partner1?.name ?? 'Me'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedPartner('partner2')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor:
                selectedPartner === 'partner2' ? theme.primary : theme.primarySoft,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: selectedPartner === 'partner2' ? '#FFFFFF' : theme.textPrimary,
              }}
            >
              {partner2?.name ?? 'Partner'}
            </Text>
          </Pressable>
        </View>

        {/* This week's letter */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <PenLine size={18} color={theme.primary} />
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              This Week's Letter
            </Text>
          </View>
          <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
            Write a letter to your love. Both letters are sealed and revealed on Sunday.
          </Text>

          {myLetter ? (
            <Card>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Lock size={24} color={theme.primary} />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter_500Medium',
                    color: theme.textPrimary,
                    textAlign: 'center',
                  }}
                >
                  Your letter is sealed
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    textAlign: 'center',
                  }}
                >
                  It will be revealed on Sunday along with your partner's letter.
                </Text>
              </View>
            </Card>
          ) : (
            <View style={{ gap: 12 }}>
              <Input
                value={content}
                onChangeText={setContent}
                placeholder="Dear love..."
                multiline
                numberOfLines={6}
                maxLength={2000}
              />
              <Button
                title="Seal Letter"
                onPress={handleSave}
                disabled={!content.trim()}
              />
            </View>
          )}
        </View>

        {/* Past letters */}
        {weekKeys.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              Past Letters
            </Text>
            {weekKeys.map((weekKey) => {
              const revealed = isRevealed(weekKey);
              const letters = getLettersByWeek(weekKey);
              return (
                <Card key={weekKey}>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {revealed ? (
                        <Unlock size={16} color={theme.success} />
                      ) : (
                        <Lock size={16} color={theme.textMuted} />
                      )}
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Inter_600SemiBold',
                          color: theme.textPrimary,
                        }}
                      >
                        {weekKey}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Inter_400Regular',
                          color: revealed ? theme.success : theme.textMuted,
                        }}
                      >
                        {revealed ? 'Revealed' : 'Sealed'}
                      </Text>
                    </View>
                    {revealed ? (
                      letters.map((letter) => {
                        const authorName =
                          letter.author === 'partner1'
                            ? partner1?.name ?? 'Partner 1'
                            : partner2?.name ?? 'Partner 2';
                        return (
                          <View key={letter.id} style={{ gap: 4, marginTop: 4 }}>
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: 'DancingScript_400Regular',
                                color: theme.primary,
                              }}
                            >
                              From {authorName}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'Inter_400Regular',
                                color: theme.textPrimary,
                                lineHeight: 21,
                              }}
                            >
                              {letter.content}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Inter_400Regular',
                          color: theme.textMuted,
                          fontStyle: 'italic',
                        }}
                      >
                        {letters.length} letter{letters.length !== 1 ? 's' : ''} sealed...
                      </Text>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {weekKeys.length === 0 && !myLetter && (
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{'\ud83d\udc8c'}</Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                textAlign: 'center',
              }}
            >
              Write your first weekly letter above. It's like a shared diary!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
