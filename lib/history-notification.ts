import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useNotesStore } from '@/stores/useNotesStore';
import type { HistoryEntry } from './types';

const LAST_CHECK_KEY = 'this-day-history-last-check';

/**
 * Check if there are entries from this day in previous years.
 * If found, schedule a local notification (once per day).
 */
export const checkThisDayInHistory = async (): Promise<void> => {
  try {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Only check once per day
    const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
    if (lastCheck === todayKey) return;

    const month = today.getMonth();
    const day = today.getDate();
    const currentYear = today.getFullYear();

    const entries: HistoryEntry[] = [];

    // Check memories
    const memories = useMemoriesStore.getState().memories;
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
    const milestones = useTimelineStore.getState().milestones;
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

    // Check notes
    const notes = useNotesStore.getState().notes;
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

    // Mark as checked for today
    await AsyncStorage.setItem(LAST_CHECK_KEY, todayKey);

    if (entries.length === 0) return;

    // Build notification message
    const yearsAgo = currentYear - new Date(entries[0].date).getFullYear();
    const count = entries.length;
    const body =
      count === 1
        ? `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago: "${entries[0].title}"`
        : `${count} memories from this day in years past`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'This Day in Our History',
        body,
        data: { route: '/' },
        sound: 'default',
      },
      trigger: null, // Show immediately
    });
  } catch (err) {
    console.error('Failed to check This Day in History:', err);
  }
};
