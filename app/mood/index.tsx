import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMoodStore } from '@/stores/useMoodStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOOD_EMOJIS } from '@/lib/constants';
import type { MoodEntry, PartnerRole } from '@/lib/types';

// Map mood emojis to a happiness score (0-4) for the trend chart
const MOOD_SCORE: Record<string, number> = {
  '\u2764\ufe0f': 4,     // In love
  '\ud83d\ude0a': 4,     // Happy
  '\ud83e\udd70': 4,     // Adoring
  '\ud83d\ude04': 4,     // Excited
  '\ud83d\ude18': 3,     // Kissy
  '\ud83e\udd17': 3,     // Hugging
  '\ud83e\udee0': 3,     // Grateful
  '\ud83d\ude0c': 3,     // Peaceful
  '\ud83e\udd14': 2,     // Thinking
  '\ud83d\ude34': 2,     // Sleepy
  '\ud83d\ude14': 1,     // Missing you
  '\ud83d\ude22': 0,     // Sad
};

const CHART_HEIGHT = 120;
const DOT_SIZE = 8;

const MoodTrendChart = ({
  entries,
  partnerName,
  color,
}: {
  entries: MoodEntry[];
  partnerName: string;
  color: string;
}) => {
  const theme = useTheme();

  // Take last 14 entries and reverse so oldest is first (left to right)
  const chartData = useMemo(() => {
    return [...entries].slice(0, 14).reverse();
  }, [entries]);

  if (chartData.length < 2) return null;

  const maxScore = 4;
  const chartWidth = chartData.length * 24;

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
        {partnerName}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <View style={{ width: chartWidth, height: CHART_HEIGHT + 30, position: 'relative' }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((level) => {
            const y = CHART_HEIGHT - (level / maxScore) * CHART_HEIGHT;
            return (
              <View
                key={level}
                style={{
                  position: 'absolute',
                  top: y,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: theme.accent + '40',
                }}
              />
            );
          })}

          {/* Connecting lines */}
          {chartData.map((entry, i) => {
            if (i === 0) return null;
            const prevScore = MOOD_SCORE[chartData[i - 1].mood] ?? 2;
            const currScore = MOOD_SCORE[entry.mood] ?? 2;
            const x1 = (i - 1) * 24 + 12;
            const y1 = CHART_HEIGHT - (prevScore / maxScore) * CHART_HEIGHT;
            const x2 = i * 24 + 12;
            const y2 = CHART_HEIGHT - (currScore / maxScore) * CHART_HEIGHT;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <View
                key={`line-${i}`}
                style={{
                  position: 'absolute',
                  left: x1,
                  top: y1,
                  width: length,
                  height: 2,
                  backgroundColor: color + '60',
                  transform: [{ rotate: `${angle}deg` }],
                  transformOrigin: 'left center',
                }}
              />
            );
          })}

          {/* Dots and emojis */}
          {chartData.map((entry, i) => {
            const score = MOOD_SCORE[entry.mood] ?? 2;
            const x = i * 24 + 12 - DOT_SIZE / 2;
            const y = CHART_HEIGHT - (score / maxScore) * CHART_HEIGHT - DOT_SIZE / 2;

            return (
              <View key={entry.id}>
                <View
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: DOT_SIZE / 2,
                    backgroundColor: color,
                  }}
                />
                <Text
                  style={{
                    position: 'absolute',
                    left: i * 24 + 12 - 8,
                    top: CHART_HEIGHT + 4,
                    fontSize: 10,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                  }}
                >
                  {entry.date.slice(8)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

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
                How are you feeling
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

        {/* Mood Trend Chart */}
        {(recentP1.length >= 2 || recentP2.length >= 2) && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              Mood Trends
            </Text>
            <Card>
              <View style={{ gap: 16 }}>
                <MoodTrendChart
                  entries={recentP1}
                  partnerName={partner1?.name ?? 'Me'}
                  color={theme.primary}
                />
                <MoodTrendChart
                  entries={recentP2}
                  partnerName={partner2?.name ?? 'Partner'}
                  color={theme.accent}
                />
              </View>
            </Card>
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
                      width: 48,
                      gap: 2,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{entry.mood}</Text>
                    <Text
                      style={{
                        fontSize: 10,
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
                      width: 48,
                      gap: 2,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{entry.mood}</Text>
                    <Text
                      style={{
                        fontSize: 10,
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
