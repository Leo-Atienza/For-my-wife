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
import { useNextVisitStore } from '@/stores/useNextVisitStore';
import { useWatchPartyStore } from '@/stores/useWatchPartyStore';
import { useCouponStore } from '@/stores/useCouponStore';
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
  NextVisit,
  WatchPartySession,
  LoveCoupon,
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
      nextVisits,
      watchPartySessions,
      loveCoupons,
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
      pullFromSupabase<{ id: string; fromPartner: PartnerRole; createdAt: string }>('thinking_of_you'),
      pullFromSupabase<{ id: string; partner: PartnerRole; status: 'sleeping' | 'awake'; createdAt: string }>('sleep_wake_status'),
      pullFromSupabase<NextVisit>('next_visits'),
      pullFromSupabase<WatchPartySession>('watch_party_sessions'),
      pullFromSupabase<LoveCoupon>('love_coupons'),
    ]);

    // Merge remote data with local data (preserving offline-created records)
    // For each store, we merge by ID — remote wins for conflicts, local-only records are kept
    const mergeById = <T extends { id: string }>(local: T[], remote: T[]): T[] => {
      const remoteMap = new Map(remote.map((r) => [r.id, r]));
      const merged = [...remote];
      for (const localItem of local) {
        if (!remoteMap.has(localItem.id)) {
          merged.push(localItem); // Keep local-only records (created offline)
        }
      }
      return merged;
    };

    // Populate all stores with merged data
    useNotesStore.getState().loadFromRemote(
      mergeById(useNotesStore.getState().notes, notes)
    );
    useMemoriesStore.getState().loadFromRemote(
      mergeById(useMemoriesStore.getState().memories, memories)
    );
    useCountdownsStore.getState().loadFromRemote(
      mergeById(useCountdownsStore.getState().countdowns, countdowns)
    );
    useTimelineStore.getState().loadFromRemote(
      mergeById(useTimelineStore.getState().milestones, milestones)
    );
    useBucketStore.getState().loadFromRemote(
      mergeById(useBucketStore.getState().items, bucketItems)
    );
    useMoodStore.getState().loadFromRemote(
      mergeById(useMoodStore.getState().entries, moodEntries)
    );
    useLocationStore.getState().loadFromRemote(locations);
    useNicknameStore.getState().loadFromRemote(
      mergeById(useNicknameStore.getState().nicknames, nicknames)
    );
    useCoupleStore.getState().loadFromRemote(coupleProfiles);
    useProfileStore.getState().loadFromRemote(individualProfiles);
    useDateIdeasStore.getState().loadFromRemote(
      mergeById(useDateIdeasStore.getState().customIdeas, dateIdeas)
    );
    useJournalStore.getState().loadFromRemote(
      mergeById(useJournalStore.getState().letters, journalLetters)
    );
    useQuestionsStore.getState().loadFromRemote(
      mergeById(useQuestionsStore.getState().entries, questionEntries)
    );
    useSongStore.getState().loadFromRemote(
      mergeById(useSongStore.getState().songs, songs)
    );
    usePartnerNotesStore.getState().loadFromRemote(
      mergeById(usePartnerNotesStore.getState().notes, partnerNotes as { id: string }[])
    );

    // pullFromSupabase auto-converts snake_case → camelCase
    useThinkingStore.getState().loadFromRemote(thinkingTaps);
    useSleepWakeStore.getState().loadFromRemote(sleepWakeEntries);
    useNextVisitStore.getState().loadFromRemote(
      mergeById(useNextVisitStore.getState().visits, nextVisits)
    );
    useWatchPartyStore.getState().loadFromRemote(
      mergeById(useWatchPartyStore.getState().sessions, watchPartySessions)
    );
    useCouponStore.getState().loadFromRemote(
      mergeById(useCouponStore.getState().coupons, loveCoupons)
    );

    console.log('Initial data load from Supabase complete');
  } catch (error) {
    console.error('Failed to load initial data from Supabase:', error);
  }
};
