import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMoodStore } from '@/stores/useMoodStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOOD_EMOJIS } from '@/lib/constants';
import type { PartnerRole } from '@/lib/types';

export default function MoodScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addEntry = useMoodStore((state) => state.addEntry);
  const getTodayEntry = useMoodStore((state) => state.getTodayEntry);
  const getRecentEntries = useMoodStore((state) => state.getRecentEntries);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [selectedPartner, setSelectedPartner] = useState<PartnerRole>('partner1');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const todayEntry = getTodayEntry(selectedPartner);
  const recentP1 = getRecentEntries('partner1', 14);
  const recentP2 = getRecentEntries('partner2', 14);

  const handleSave = () => {
    if (!selectedMood) return;
    addEntry(selectedPartner, selectedMood, note.trim() || undefined);
    setSelectedMood(null);
    setNote('');
  };

  const getMoodEmoji = (mood: string) => {
    return MOOD_EMOJIS.find((m) => m.emoji === mood)?.label ?? mood;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Mood Check-In" showBack />
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

        {/* Today's status */}
        {todayEntry && (
          <Card>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                TODAY'S MOOD
              </Text>
              <Text style={{ fontSize: 40 }}>{todayEntry.mood}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.textPrimary }}>
                {getMoodEmoji(todayEntry.mood)}
              </Text>
              {todayEntry.note && (
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  "{todayEntry.note}"
                </Text>
              )}
            </View>
          </Card>
        )}

        {/* Mood picker */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            {todayEntry ? 'Update your mood' : 'How are you feeling?'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {MOOD_EMOJIS.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => setSelectedMood(item.emoji)}
                style={{
                  width: 60,
                  height: 68,
                  borderRadius: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    selectedMood === item.emoji ? theme.primarySoft : theme.surface,
                  borderWidth: 2,
                  borderColor:
                    selectedMood === item.emoji ? theme.primary : theme.accent,
                  gap: 2,
                }}
                accessibilityLabel={item.label}
              >
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: 'Inter_500Medium',
                    color: theme.textMuted,
                  }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Optional note */}
        {selectedMood && (
          <View style={{ gap: 12 }}>
            <Input
              label="Add a note (optional)"
              value={note}
              onChangeText={setNote}
              placeholder="What's on your mind?"
              multiline
              numberOfLines={2}
              maxLength={200}
            />
            <Button title="Save Mood" onPress={handleSave} />
          </View>
        )}

        {/* Mood history / trend */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            Mood History
          </Text>

          {/* Partner 1 mood strip */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
              {partner1?.name ?? 'Me'}
            </Text>
            {recentP1.length === 0 ? (
              <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                No mood entries yet
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {recentP1.map((entry) => (
                  <View
                    key={entry.id}
                    style={{
                      alignItems: 'center',
                      width: 40,
                      gap: 2,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{entry.mood}</Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontFamily: 'Inter_400Regular',
                        color: theme.textMuted,
                      }}
                    >
                      {entry.date.slice(5)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Partner 2 mood strip */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
              {partner2?.name ?? 'Partner'}
            </Text>
            {recentP2.length === 0 ? (
              <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                No mood entries yet
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {recentP2.map((entry) => (
                  <View
                    key={entry.id}
                    style={{
                      alignItems: 'center',
                      width: 40,
                      gap: 2,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{entry.mood}</Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontFamily: 'Inter_400Regular',
                        color: theme.textMuted,
                      }}
                    >
                      {entry.date.slice(5)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
