import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
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
import { useDreamStore } from '@/stores/useDreamStore';
import { subscribeToTable, flushPendingOperations } from '@/lib/sync';
import { flushPendingUploads } from '@/lib/photo-storage';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoteRecord = Record<string, any> & { id: string };

export const useSync = () => {
  const session = useAuthStore((state) => state.session);
  const spaceId = useAuthStore((state) => state.spaceId);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!session || !spaceId) return;

    // Flush any pending offline operations
    flushPendingOperations();

    // Flush pending photo uploads — update memory URIs on success
    const updateMemoryUri = (memoryId: string, newUri: string) => {
      useMemoriesStore.getState().updateMemory(memoryId, { imageUri: newUri });
    };
    flushPendingUploads(updateMemoryUri);

    // Set up Realtime subscriptions for all synced tables
    const channels: RealtimeChannel[] = [];

    // Love Notes
    const notesChannel = subscribeToTable<RemoteRecord>('love_notes', {
      onInsert: (record) => useNotesStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useNotesStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useNotesStore.getState().syncRemoteDelete(old.id),
    });
    if (notesChannel) channels.push(notesChannel);

    // Memories
    const memoriesChannel = subscribeToTable<RemoteRecord>('memories', {
      onInsert: (record) => useMemoriesStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useMemoriesStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useMemoriesStore.getState().syncRemoteDelete(old.id),
    });
    if (memoriesChannel) channels.push(memoriesChannel);

    // Countdowns
    const countdownsChannel = subscribeToTable<RemoteRecord>('countdown_events', {
      onInsert: (record) => useCountdownsStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useCountdownsStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useCountdownsStore.getState().syncRemoteDelete(old.id),
    });
    if (countdownsChannel) channels.push(countdownsChannel);

    // Timeline / Milestones
    const milestonesChannel = subscribeToTable<RemoteRecord>('milestones', {
      onInsert: (record) => useTimelineStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useTimelineStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useTimelineStore.getState().syncRemoteDelete(old.id),
    });
    if (milestonesChannel) channels.push(milestonesChannel);

    // Bucket List
    const bucketChannel = subscribeToTable<RemoteRecord>('bucket_items', {
      onInsert: (record) => useBucketStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useBucketStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useBucketStore.getState().syncRemoteDelete(old.id),
    });
    if (bucketChannel) channels.push(bucketChannel);

    // Mood
    const moodChannel = subscribeToTable<RemoteRecord>('mood_entries', {
      onInsert: (record) => useMoodStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useMoodStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useMoodStore.getState().syncRemoteDelete(old.id),
    });
    if (moodChannel) channels.push(moodChannel);

    // Nicknames
    const nicknamesChannel = subscribeToTable<RemoteRecord>('nicknames', {
      onInsert: (record) => useNicknameStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useNicknameStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useNicknameStore.getState().syncRemoteDelete(old.id),
    });
    if (nicknamesChannel) channels.push(nicknamesChannel);

    // Location
    const locationChannel = subscribeToTable<RemoteRecord>('location_entries', {
      onInsert: (record) => useLocationStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useLocationStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useLocationStore.getState().syncRemoteDelete(old.id),
    });
    if (locationChannel) channels.push(locationChannel);

    // Date Ideas
    const dateIdeasChannel = subscribeToTable<RemoteRecord>('date_ideas', {
      onInsert: (record) => useDateIdeasStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useDateIdeasStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useDateIdeasStore.getState().syncRemoteDelete(old.id),
    });
    if (dateIdeasChannel) channels.push(dateIdeasChannel);

    // Journal
    const journalChannel = subscribeToTable<RemoteRecord>('journal_letters', {
      onInsert: (record) => useJournalStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useJournalStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useJournalStore.getState().syncRemoteDelete(old.id),
    });
    if (journalChannel) channels.push(journalChannel);

    // Questions
    const questionsChannel = subscribeToTable<RemoteRecord>('daily_question_entries', {
      onInsert: (record) => useQuestionsStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useQuestionsStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useQuestionsStore.getState().syncRemoteDelete(old.id),
    });
    if (questionsChannel) channels.push(questionsChannel);

    // Songs
    const songsChannel = subscribeToTable<RemoteRecord>('song_dedications', {
      onInsert: (record) => useSongStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useSongStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useSongStore.getState().syncRemoteDelete(old.id),
    });
    if (songsChannel) channels.push(songsChannel);

    // Partner Notes
    const partnerNotesChannel = subscribeToTable<RemoteRecord>('partner_notes', {
      onInsert: (record) => usePartnerNotesStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => usePartnerNotesStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => usePartnerNotesStore.getState().syncRemoteDelete(old.id),
    });
    if (partnerNotesChannel) channels.push(partnerNotesChannel);

    // Thinking of You — snake_case auto-converted by subscribeToTable
    const thinkingChannel = subscribeToTable<RemoteRecord>('thinking_of_you', {
      onInsert: (record) => useThinkingStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useThinkingStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useThinkingStore.getState().syncRemoteDelete(old.id),
    });
    if (thinkingChannel) channels.push(thinkingChannel);

    // Sleep/Wake Status — snake_case auto-converted by subscribeToTable
    const sleepWakeChannel = subscribeToTable<RemoteRecord>('sleep_wake_status', {
      onInsert: (record) => useSleepWakeStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useSleepWakeStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useSleepWakeStore.getState().syncRemoteDelete(old.id),
    });
    if (sleepWakeChannel) channels.push(sleepWakeChannel);

    // Couple Profile (single record per space)
    const coupleProfileChannel = subscribeToTable<RemoteRecord>('couple_profiles', {
      onInsert: (record) => useCoupleStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useCoupleStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useCoupleStore.getState().syncRemoteDelete(old.id),
    });
    if (coupleProfileChannel) channels.push(coupleProfileChannel);

    // Individual Profiles (one per partner per space)
    const individualProfileChannel = subscribeToTable<RemoteRecord>('individual_profiles', {
      onInsert: (record) => useProfileStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useProfileStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useProfileStore.getState().syncRemoteDelete(old.id),
    });
    if (individualProfileChannel) channels.push(individualProfileChannel);

    // Next Visits
    const nextVisitChannel = subscribeToTable<RemoteRecord>('next_visits', {
      onInsert: (record) => useNextVisitStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useNextVisitStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useNextVisitStore.getState().syncRemoteDelete(old.id),
    });
    if (nextVisitChannel) channels.push(nextVisitChannel);

    // Watch Party Sessions
    const watchPartyChannel = subscribeToTable<RemoteRecord>('watch_party_sessions', {
      onInsert: (record) => useWatchPartyStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useWatchPartyStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useWatchPartyStore.getState().syncRemoteDelete(old.id),
    });
    if (watchPartyChannel) channels.push(watchPartyChannel);

    // Love Coupons
    const couponsChannel = subscribeToTable<RemoteRecord>('love_coupons', {
      onInsert: (record) => useCouponStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useCouponStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useCouponStore.getState().syncRemoteDelete(old.id),
    });
    if (couponsChannel) channels.push(couponsChannel);

    const dreamsChannel = subscribeToTable<RemoteRecord>('dreams', {
      onInsert: (record) => useDreamStore.getState().syncRemoteInsert(record as never),
      onUpdate: (record) => useDreamStore.getState().syncRemoteUpdate(record as never),
      onDelete: (old) => useDreamStore.getState().syncRemoteDelete(old.id),
    });
    if (dreamsChannel) channels.push(dreamsChannel);

    channelsRef.current = channels;

    // Flush pending ops when app comes back to foreground
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        flushPendingOperations();
        flushPendingUploads(updateMemoryUri);
      }
    });

    return () => {
      // Cleanup all subscriptions
      channels.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
      appStateListener.remove();
    };
  }, [session, spaceId]);
};
