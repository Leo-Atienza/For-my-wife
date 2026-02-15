import { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Heart, Camera, CheckSquare, Music, NotebookPen } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { generateWeeklyRecap, type WeeklyRecapData } from '@/lib/weekly-recap';

export const WeeklyRecapCard = () => {
  const theme = useTheme();
  const router = useRouter();
  const [recap, setRecap] = useState<WeeklyRecapData | null>(null);

  useEffect(() => {
    setRecap(generateWeeklyRecap());
  }, []);

  if (!recap) return null;

  const totalActivity =
    recap.notesCount +
    recap.memoriesCount +
    recap.bucketCompletedCount +
    recap.thinkingTapsCount +
    recap.partnerNotesCount +
    recap.songsCount;

  if (totalActivity === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/recap')}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.accent,
          gap: 16,
        }}
      >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Sparkles size={20} color={theme.primary} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
          }}
        >
          Last Week
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            marginLeft: 'auto',
          }}
        >
          {recap.dateRange}
        </Text>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {recap.notesCount > 0 && (
          <StatChip icon={<Heart size={14} color={theme.primary} />} value={recap.notesCount} label="Notes" theme={theme} />
        )}
        {recap.memoriesCount > 0 && (
          <StatChip icon={<Camera size={14} color={theme.primary} />} value={recap.memoriesCount} label="Memories" theme={theme} />
        )}
        {recap.bucketCompletedCount > 0 && (
          <StatChip icon={<CheckSquare size={14} color={theme.primary} />} value={recap.bucketCompletedCount} label="Done" theme={theme} />
        )}
        {recap.songsCount > 0 && (
          <StatChip icon={<Music size={14} color={theme.primary} />} value={recap.songsCount} label="Songs" theme={theme} />
        )}
        {recap.partnerNotesCount > 0 && (
          <StatChip icon={<NotebookPen size={14} color={theme.primary} />} value={recap.partnerNotesCount} label="Notes" theme={theme} />
        )}
      </View>

      {/* Highlight */}
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'Inter_400Regular',
          color: theme.textMuted,
          lineHeight: 20,
        }}
      >
        {recap.highlightText}
      </Text>

      {/* Mood summary */}
      {recap.moodSummary && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
            color: theme.primary,
          }}
        >
          Most common mood: {recap.moodSummary}
        </Text>
      )}
      </View>
    </Pressable>
  );
};

interface StatChipProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  theme: ReturnType<typeof useTheme>;
}

const StatChip = ({ icon, value, label, theme }: StatChipProps) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.primarySoft,
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
    }}
  >
    {icon}
    <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
      {value}
    </Text>
    <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
      {label}
    </Text>
  </View>
);
