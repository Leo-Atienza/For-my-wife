import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  Camera,
  CheckSquare,
  Music,
  NotebookPen,
  Sparkles,
  HandHeart,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { generateWeeklyRecap, type WeeklyRecapData } from '@/lib/weekly-recap';

export default function RecapScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [recap, setRecap] = useState<WeeklyRecapData | null>(null);

  useEffect(() => {
    setRecap(generateWeeklyRecap());
  }, []);

  if (!recap) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Weekly Recap" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
            Loading recap...
          </Text>
        </View>
      </View>
    );
  }

  const stats = [
    { icon: <Heart size={22} color={theme.primary} />, label: 'Love Notes', value: recap.notesCount },
    { icon: <Camera size={22} color={theme.primary} />, label: 'Memories', value: recap.memoriesCount },
    { icon: <CheckSquare size={22} color={theme.primary} />, label: 'Bucket Items Done', value: recap.bucketCompletedCount },
    { icon: <HandHeart size={22} color={theme.primary} />, label: 'Thinking of You', value: recap.thinkingTapsCount },
    { icon: <NotebookPen size={22} color={theme.primary} />, label: 'Partner Notes', value: recap.partnerNotesCount },
    { icon: <Music size={22} color={theme.primary} />, label: 'Songs Dedicated', value: recap.songsCount },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Weekly Recap" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 8, marginTop: 8 }}>
          <Sparkles size={32} color={theme.primary} />
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Your Week Together
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            {recap.dateRange}
          </Text>
        </View>

        {/* Highlight */}
        <Card>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            {recap.highlightText}
          </Text>
        </Card>

        {/* Stats grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={{
                width: '47%',
                backgroundColor: theme.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: theme.accent,
                alignItems: 'center',
                gap: 8,
              }}
            >
              {stat.icon}
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: stat.value > 0 ? theme.textPrimary : theme.textMuted,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter_500Medium',
                  color: theme.textMuted,
                  textAlign: 'center',
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Mood */}
        {recap.moodSummary && (
          <Card>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  color: theme.textMuted,
                }}
              >
                Most Common Mood
              </Text>
              <Text style={{ fontSize: 32 }}>{recap.moodSummary}</Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
