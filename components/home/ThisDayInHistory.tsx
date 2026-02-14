import { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Camera, BookOpen, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useNotesStore } from '@/stores/useNotesStore';
import type { HistoryEntry } from '@/lib/types';

export const ThisDayInHistory = () => {
  const theme = useTheme();
  const router = useRouter();
  const memories = useMemoriesStore((state) => state.memories);
  const milestones = useTimelineStore((state) => state.milestones);
  const notes = useNotesStore((state) => state.notes);

  const todayEntries = useMemo(() => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    const currentYear = today.getFullYear();

    const entries: HistoryEntry[] = [];

    // Check memories
    for (const memory of memories) {
      const memDate = new Date(memory.date);
      if (
        memDate.getMonth() === month &&
        memDate.getDate() === day &&
        memDate.getFullYear() < currentYear
      ) {
        entries.push({
          type: 'memory',
          title: memory.caption || 'A memory together',
          date: memory.date,
          imageUri: memory.imageUri,
          id: memory.id,
        });
      }
    }

    // Check milestones
    for (const milestone of milestones) {
      const msDate = new Date(milestone.date);
      if (
        msDate.getMonth() === month &&
        msDate.getDate() === day &&
        msDate.getFullYear() < currentYear
      ) {
        entries.push({
          type: 'milestone',
          title: milestone.title,
          date: milestone.date,
          imageUri: milestone.imageUri,
          id: milestone.id,
        });
      }
    }

    // Check notes (by creation date)
    for (const note of notes) {
      const noteDate = new Date(note.createdAt);
      if (
        noteDate.getMonth() === month &&
        noteDate.getDate() === day &&
        noteDate.getFullYear() < currentYear
      ) {
        entries.push({
          type: 'note',
          title: note.content.length > 60 ? note.content.slice(0, 60) + '\u2026' : note.content,
          date: note.createdAt,
          id: note.id,
        });
      }
    }

    // Sort by year (oldest first)
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return entries;
  }, [memories, milestones, notes]);

  if (todayEntries.length === 0) return null;

  const getYearsAgo = (dateStr: string): number => {
    return new Date().getFullYear() - new Date(dateStr).getFullYear();
  };

  const getIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'memory': return Camera;
      case 'milestone': return BookOpen;
      case 'note': return Heart;
      default: return Calendar;
    }
  };

  const handlePress = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'memory':
        router.push(`/memories/${entry.id}`);
        break;
      case 'note':
        router.push(`/notes/${entry.id}`);
        break;
      case 'milestone':
        router.push('/timeline');
        break;
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.accent,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Calendar size={18} color={theme.primary} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
          }}
        >
          This Day in Our History
        </Text>
      </View>

      {/* Entries */}
      {todayEntries.map((entry) => {
        const yearsAgo = getYearsAgo(entry.date);
        const Icon = getIcon(entry.type);

        return (
          <Pressable
            key={entry.id}
            onPress={() => handlePress(entry)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: theme.primarySoft,
                borderRadius: 14,
                padding: 12,
              }}
            >
              {entry.imageUri ? (
                <Image
                  source={{ uri: entry.imageUri }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: theme.accent + '40',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon size={22} color={theme.primary} />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium',
                    color: theme.textPrimary,
                  }}
                  numberOfLines={2}
                >
                  {entry.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    marginTop: 2,
                  }}
                >
                  {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago today
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
