/**
 * Lazy store reset — breaks the require cycle between useAuthStore and feature stores.
 * Instead of importing all 17 stores at the top of useAuthStore, we dynamically
 * import them here only when signOut() is called.
 */
export const resetAllStores = async (): Promise<void> => {
  const stores = await Promise.all([
    import('@/stores/useNotesStore'),
    import('@/stores/useMemoriesStore'),
    import('@/stores/useCountdownsStore'),
    import('@/stores/useTimelineStore'),
    import('@/stores/useBucketStore'),
    import('@/stores/useMoodStore'),
    import('@/stores/useLocationStore'),
    import('@/stores/useNicknameStore'),
    import('@/stores/useCoupleStore'),
    import('@/stores/useProfileStore'),
    import('@/stores/useDateIdeasStore'),
    import('@/stores/useJournalStore'),
    import('@/stores/useQuestionsStore'),
    import('@/stores/useSongStore'),
    import('@/stores/usePartnerNotesStore'),
    import('@/stores/useThinkingStore'),
    import('@/stores/useSleepWakeStore'),
    import('@/stores/useNextVisitStore'),
    import('@/stores/useLoveLanguageStore'),
    import('@/stores/useWatchPartyStore'),
    import('@/stores/useCouponStore'),
  ]);

  const storeKeys = [
    'useNotesStore',
    'useMemoriesStore',
    'useCountdownsStore',
    'useTimelineStore',
    'useBucketStore',
    'useMoodStore',
    'useLocationStore',
    'useNicknameStore',
    'useCoupleStore',
    'useProfileStore',
    'useDateIdeasStore',
    'useJournalStore',
    'useQuestionsStore',
    'useSongStore',
    'usePartnerNotesStore',
    'useThinkingStore',
    'useSleepWakeStore',
    'useNextVisitStore',
    'useLoveLanguageStore',
    'useWatchPartyStore',
    'useCouponStore',
  ];

  for (let i = 0; i < stores.length; i++) {
    const mod = stores[i] as Record<string, { getState: () => { reset: () => void } }>;
    const key = storeKeys[i];
    mod[key].getState().reset();
  }
};
