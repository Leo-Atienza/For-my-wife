import { pullFromSupabase } from './sync';
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
import type {
  LoveNote,
  Memory,
  CountdownEvent,
  Milestone,
  BucketItem,
  MoodEntry,
  LocationEntry,
  Nickname,
  CoupleProfile,
  IndividualProfile,
  DateIdea,
  JournalLetter,
  DailyQuestionEntry,
  SongDedicationEntry,
  PartnerRole,
} from '@/lib/types';

/**
 * Pull all existing data from Supabase and populate local stores.
 * Called once after successful authentication + space join.
 */
export const loadAllDataFromSupabase = async (): Promise<void> => {
  try {
    const [
      notes,
      memories,
      countdowns,
      milestones,
      bucketItems,
      moodEntries,
      locations,
      nicknames,
      coupleProfiles,
      individualProfiles,
      dateIdeas,
      journalLetters,
      questionEntries,
      songs,
      partnerNotes,
      thinkingTaps,
      sleepWakeEntries,
    ] = await Promise.all([
      pullFromSupabase<LoveNote>('love_notes'),
      pullFromSupabase<Memory>('memories'),
      pullFromSupabase<CountdownEvent>('countdown_events'),
      pullFromSupabase<Milestone>('milestones'),
      pullFromSupabase<BucketItem>('bucket_items'),
      pullFromSupabase<MoodEntry>('mood_entries'),
      pullFromSupabase<LocationEntry>('location_entries'),
      pullFromSupabase<Nickname>('nicknames'),
      pullFromSupabase<CoupleProfile>('couple_profiles'),
      pullFromSupabase<IndividualProfile & { role: PartnerRole }>('individual_profiles'),
      pullFromSupabase<DateIdea>('date_ideas'),
      pullFromSupabase<JournalLetter>('journal_letters'),
      pullFromSupabase<DailyQuestionEntry>('daily_question_entries'),
      pullFromSupabase<SongDedicationEntry>('song_dedications'),
      pullFromSupabase<Record<string, unknown>>('partner_notes'),
      pullFromSupabase<{ id: string; from_partner: PartnerRole; created_at: string }>('thinking_of_you'),
      pullFromSupabase<{ id: string; partner: PartnerRole; status: 'sleeping' | 'awake'; created_at: string }>('sleep_wake_status'),
    ]);

    // Populate all stores
    useNotesStore.getState().loadFromRemote(notes);
    useMemoriesStore.getState().loadFromRemote(memories);
    useCountdownsStore.getState().loadFromRemote(countdowns);
    useTimelineStore.getState().loadFromRemote(milestones);
    useBucketStore.getState().loadFromRemote(bucketItems);
    useMoodStore.getState().loadFromRemote(moodEntries);
    useLocationStore.getState().loadFromRemote(locations);
    useNicknameStore.getState().loadFromRemote(nicknames);
    useCoupleStore.getState().loadFromRemote(coupleProfiles);
    useProfileStore.getState().loadFromRemote(individualProfiles);
    useDateIdeasStore.getState().loadFromRemote(dateIdeas);
    useJournalStore.getState().loadFromRemote(journalLetters);
    useQuestionsStore.getState().loadFromRemote(questionEntries);
    useSongStore.getState().loadFromRemote(songs);
    usePartnerNotesStore.getState().loadFromRemote(partnerNotes);

    // Map remote field names to local for thinking taps
    const mappedTaps = thinkingTaps.map((t) => ({
      id: t.id,
      fromPartner: t.from_partner,
      createdAt: t.created_at,
    }));
    useThinkingStore.getState().loadFromRemote(mappedTaps);

    // Map remote field names to local for sleep/wake
    const mappedSleepWake = sleepWakeEntries.map((e) => ({
      id: e.id,
      partner: e.partner,
      status: e.status,
      createdAt: e.created_at,
    }));
    useSleepWakeStore.getState().loadFromRemote(mappedSleepWake);

    console.log('Initial data load from Supabase complete');
  } catch (error) {
    console.error('Failed to load initial data from Supabase:', error);
  }
};
