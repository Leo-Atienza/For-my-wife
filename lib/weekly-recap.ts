import { useNotesStore } from '@/stores/useNotesStore';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useBucketStore } from '@/stores/useBucketStore';
import { useMoodStore } from '@/stores/useMoodStore';
import { useThinkingStore } from '@/stores/useThinkingStore';
import { usePartnerNotesStore } from '@/stores/usePartnerNotesStore';
import { useSongStore } from '@/stores/useSongStore';

export interface WeeklyRecapData {
  weekKey: string;
  dateRange: string;
  notesCount: number;
  memoriesCount: number;
  bucketCompletedCount: number;
  thinkingTapsCount: number;
  partnerNotesCount: number;
  songsCount: number;
  moodSummary: string | null;
  highlightText: string;
}

const getWeekStartEnd = (): { start: Date; end: Date; weekKey: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek - 7); // Last week's Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Last week's Saturday
  end.setHours(23, 59, 59, 999);

  const weekKey = `${start.getFullYear()}-W${Math.ceil(
    (start.getDate() + new Date(start.getFullYear(), start.getMonth(), 1).getDay()) / 7
  )}`;

  return { start, end, weekKey };
};

const isInRange = (dateStr: string, start: Date, end: Date): boolean => {
  const d = new Date(dateStr);
  return d >= start && d <= end;
};

const getMostCommonMood = (moods: string[]): string | null => {
  if (moods.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const m of moods) {
    counts[m] = (counts[m] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};

export const generateWeeklyRecap = (): WeeklyRecapData => {
  const { start, end, weekKey } = getWeekStartEnd();

  const dateRange = `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;

  const notes = useNotesStore.getState().notes;
  const memories = useMemoriesStore.getState().memories;
  const bucketItems = useBucketStore.getState().items;
  const moodEntries = useMoodStore.getState().entries;
  const taps = useThinkingStore.getState().taps;
  const partnerNotes = usePartnerNotesStore.getState().notes;
  const songs = useSongStore.getState().songs;

  const weekNotes = notes.filter((n) => isInRange(n.createdAt, start, end));
  const weekMemories = memories.filter((m) => isInRange(m.createdAt, start, end));
  const weekBucketCompleted = bucketItems.filter(
    (b) => b.isCompleted && b.completedDate && isInRange(b.completedDate, start, end)
  );
  const weekMoods = moodEntries.filter((m) => isInRange(m.date, start, end));
  const weekTaps = taps.filter((t) => isInRange(t.createdAt, start, end));
  const weekPartnerNotes = partnerNotes.filter((n) => isInRange(n.createdAt, start, end));
  const weekSongs = songs.filter((s) => isInRange(s.createdAt, start, end));

  const mostCommonMood = getMostCommonMood(weekMoods.map((m) => m.mood));

  // Generate a highlight text
  const highlights: string[] = [];
  if (weekNotes.length > 0) highlights.push(`${weekNotes.length} love note${weekNotes.length > 1 ? 's' : ''} shared`);
  if (weekMemories.length > 0) highlights.push(`${weekMemories.length} memor${weekMemories.length > 1 ? 'ies' : 'y'} captured`);
  if (weekTaps.length > 0) highlights.push(`${weekTaps.length} thinking-of-you tap${weekTaps.length > 1 ? 's' : ''}`);
  if (weekBucketCompleted.length > 0) highlights.push(`${weekBucketCompleted.length} bucket list item${weekBucketCompleted.length > 1 ? 's' : ''} completed`);

  const highlightText =
    highlights.length > 0
      ? highlights.join(', ')
      : 'A quiet week together. Every moment counts.';

  return {
    weekKey,
    dateRange,
    notesCount: weekNotes.length,
    memoriesCount: weekMemories.length,
    bucketCompletedCount: weekBucketCompleted.length,
    thinkingTapsCount: weekTaps.length,
    partnerNotesCount: weekPartnerNotes.length,
    songsCount: weekSongs.length,
    moodSummary: mostCommonMood,
    highlightText,
  };
};
