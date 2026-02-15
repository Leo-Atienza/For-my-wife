import AsyncStorage from '@react-native-async-storage/async-storage';
import { pushToSupabase } from './sync';
import type { LocationEntry } from '@/lib/types';
import { useNotesStore } from '@/stores/useNotesStore';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useCountdownsStore } from '@/stores/useCountdownsStore';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useBucketStore } from '@/stores/useBucketStore';
import { useMoodStore } from '@/stores/useMoodStore';
import { useLocationStore } from '@/stores/useLocationStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useDateIdeasStore } from '@/stores/useDateIdeasStore';
import { useJournalStore } from '@/stores/useJournalStore';
import { useQuestionsStore } from '@/stores/useQuestionsStore';
import { useSongStore } from '@/stores/useSongStore';
import { usePartnerNotesStore } from '@/stores/usePartnerNotesStore';
import { useThinkingStore } from '@/stores/useThinkingStore';
import { useSleepWakeStore } from '@/stores/useSleepWakeStore';

const MIGRATION_KEY = 'migration-complete';

/**
 * One-time migration: push all local AsyncStorage data to Supabase.
 * Only runs once per device (flagged via AsyncStorage).
 * Call this AFTER loadAllDataFromSupabase() so we don't overwrite
 * cloud data that was just pulled down.
 */
export const migrateLocalDataToCloud = async (): Promise<void> => {
  const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_KEY);
  if (alreadyMigrated === 'true') return;

  // Starting one-time local-to-cloud migration

  try {
    // Love notes
    const notes = useNotesStore.getState().notes;
    for (const note of notes) {
      await pushToSupabase('love_notes', note);
    }

    // Memories
    const memories = useMemoriesStore.getState().memories;
    for (const memory of memories) {
      await pushToSupabase('memories', memory);
    }

    // Countdowns
    const countdowns = useCountdownsStore.getState().countdowns;
    for (const countdown of countdowns) {
      await pushToSupabase('countdown_events', countdown);
    }

    // Timeline milestones
    const milestones = useTimelineStore.getState().milestones;
    for (const milestone of milestones) {
      await pushToSupabase('milestones', milestone);
    }

    // Bucket list
    const items = useBucketStore.getState().items;
    for (const item of items) {
      await pushToSupabase('bucket_items', item);
    }

    // Mood entries
    const moodEntries = useMoodStore.getState().entries;
    for (const entry of moodEntries) {
      await pushToSupabase('mood_entries', entry);
    }

    // Location entries (map camelCase to snake_case for Supabase)
    const { locations } = useLocationStore.getState();
    const mapLocation = (loc: LocationEntry) => ({
      id: loc.id,
      partner: loc.partner,
      latitude: loc.latitude,
      longitude: loc.longitude,
      city_name: loc.cityName,
      updated_at: loc.updatedAt,
    });
    if (locations.partner1) {
      await pushToSupabase('location_entries', mapLocation(locations.partner1));
    }
    if (locations.partner2) {
      await pushToSupabase('location_entries', mapLocation(locations.partner2));
    }

    // Nicknames
    const nicknames = useNicknameStore.getState().nicknames;
    for (const nickname of nicknames) {
      await pushToSupabase('nicknames', nickname);
    }

    // Couple profile
    const coupleProfile = useCoupleStore.getState().profile;
    if (coupleProfile) {
      await pushToSupabase('couple_profiles', coupleProfile);
    }

    // Individual profiles
    const { partner1, partner2 } = useProfileStore.getState();
    if (partner1) {
      await pushToSupabase('individual_profiles', { ...partner1, role: 'partner1' });
    }
    if (partner2) {
      await pushToSupabase('individual_profiles', { ...partner2, role: 'partner2' });
    }

    // Date ideas (custom only)
    const customIdeas = useDateIdeasStore.getState().customIdeas;
    for (const idea of customIdeas) {
      await pushToSupabase('date_ideas', idea);
    }

    // Journal letters
    const letters = useJournalStore.getState().letters;
    for (const letter of letters) {
      await pushToSupabase('journal_letters', letter);
    }

    // Question entries
    const questionEntries = useQuestionsStore.getState().entries;
    for (const entry of questionEntries) {
      await pushToSupabase('daily_question_entries', entry);
    }

    // Song dedications
    const songs = useSongStore.getState().songs;
    for (const song of songs) {
      await pushToSupabase('song_dedications', song);
    }

    // Partner notes
    const partnerNotes = usePartnerNotesStore.getState().notes;
    for (const note of partnerNotes) {
      await pushToSupabase('partner_notes', note);
    }

    // Thinking of you taps
    const thinkingTaps = useThinkingStore.getState().taps;
    for (const tap of thinkingTaps) {
      await pushToSupabase('thinking_of_you', tap);
    }

    // Sleep/wake entries
    const sleepWakeEntries = useSleepWakeStore.getState().entries;
    for (const entry of sleepWakeEntries) {
      await pushToSupabase('sleep_wake_status', entry);
    }

    // Mark migration as complete
    await AsyncStorage.setItem(MIGRATION_KEY, 'true');
    // Migration complete
  } catch (error) {
    console.error('Migration failed (will retry on next launch):', error);
  }
};
