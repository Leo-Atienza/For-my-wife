# "Us" App — Current State

> **Read this FIRST.** This is the single source of truth for the app's current state.
> For architectural decisions and rationale, see `DECISIONS.md`.
> For feature plans and data models, see `APP_PLAN.md`.

## Quick Stats

- **Source files**: ~170+ (`.ts` + `.tsx`)
- **Zustand stores**: 23 (all with AsyncStorage persistence + Supabase sync)
- **Supabase tables**: 24 (all with RLS + realtime)
- **Route files**: 60 screens
- **Components**: 39 reusable components
- **Lib modules**: 25 utility files
- **Animations**: 20+ using React Native Animated API
- **Push notification triggers**: 11

---

## Stores → Tables Mapping (23 stores, 24 tables)

| Store | Supabase Table | Key Field |
|-------|---------------|-----------|
| `useAuthStore` | `spaces`, `space_members` | — |
| `useCoupleStore` | `couple_profiles` | `profile` |
| `useProfileStore` | `individual_profiles` | `partner1`, `partner2` |
| `useNicknameStore` | `nicknames` | `nicknames` |
| `useNotesStore` | `love_notes` | `notes` |
| `useMemoriesStore` | `memories` | `memories` |
| `useTimelineStore` | `milestones` | `milestones` |
| `useCountdownsStore` | `countdown_events` | `countdowns` |
| `useBucketStore` | `bucket_items` | `items` |
| `useMoodStore` | `mood_entries` | `entries` |
| `useLocationStore` | `location_entries` | — |
| `useDateIdeasStore` | `date_ideas` | `customIdeas` |
| `useJournalStore` | `journal_letters` | `letters` |
| `useQuestionsStore` | `daily_question_entries` | `entries` |
| `useSongStore` | `song_dedications` | `songs` |
| `usePartnerNotesStore` | `partner_notes` | `notes` |
| `useThinkingStore` | `thinking_of_you` | `taps` |
| `useSleepWakeStore` | `sleep_wake_status` | `entries` |
| `useNextVisitStore` | `next_visits` | `visits` |
| `useLoveLanguageStore` | `love_language_results` | — |
| `useWatchPartyStore` | `watch_party_sessions` | `sessions` |
| `useCouponStore` | `love_coupons` | `coupons` |
| `useDreamStore` | `dreams` | `dreams` |

---

## All Routes

### Tab Screens (5)
`app/(tabs)/index.tsx` (Home), `notes.tsx`, `memories.tsx`, `countdowns.tsx`, `more.tsx`

### Auth (7)
`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `confirm`, `create-space`, `join-space`

### Feature Screens (26)
`bucket-list`, `card-maker`, `coupons`, `dates`, `distance`, `dreams`, `export`, `greetings`, `invite-partner`, `journal`, `letter-generator`, `love-language`, `mood`, `next-visit`, `partner-notes`, `playlist`, `questions`, `quiz`, `recap`, `settings`, `songs`, `stats`, `status`, `timeline`, `touch`, `watch-party`

### Detail/Create Screens
`notes/[id]`, `notes/new`, `memories/[id]`, `memories/new`, `countdowns/new`, `partner-notes/[id]`, `partner-notes/new`, `profile/couple`, `profile/[partner]`, `profile/nicknames`, `setup/index`

---

## Home Screen Widgets (in order)
1. `SyncStatusIndicator` — online/offline indicator
2. Header (couple photo, greeting, names)
3. `ValentinesDayCard` — Feb 14 only
4. `MilestoneAlert` — upcoming/today milestones
5. `ThinkingOfYouButton` — tap to send
6. `PartnerSleepStatus` — inline sleep status
7. `DurationCounter` + `FloatingHearts` — days together
8. `QuickActions` — horizontal scroll (8 shortcuts)
9. `StreakCounter` — consecutive activity days
10. `SleepWakeToggle` — sleep/awake toggle
11. `ThisDayInHistory` — same-date memories from past years
12. `DailyCompliment` — rotating partner compliment
13. `DailyQuote` — rotating love quote
14. `WeeklyRecapCard` — weekly activity summary

---

## Push Notifications (11 triggers)

| Event | Store/File |
|-------|-----------|
| New love note | `useNotesStore` |
| New memory | `useMemoriesStore` |
| Partner note written | `usePartnerNotesStore` |
| Thinking of you tap | `useThinkingStore` |
| New nickname given | `useNicknameStore` |
| Sleep/wake status | `useSleepWakeStore` |
| Song dedication | `useSongStore` |
| Watch party start | `useWatchPartyStore` |
| Love coupon given | `useCouponStore` |
| Dream added/achieved | `useDreamStore` |
| This Day in History | `lib/history-notification.ts` |

---

## Known Warnings (Non-Blocking)

1. `expo-notifications` error in Expo Go — works in standalone builds only
2. Realtime `send()` fallback — Supabase auto-falls back to REST
3. Reanimated v4.1.1 installed but unused — all animations use built-in Animated API

---

## What Still Needs Doing

### Must Do
- [ ] Real device testing (auth flows, 2-device sync, offline queue, all animations)
- [ ] Test invite partner flow end-to-end on two devices

### Nice to Have
- [ ] Field-level conflict resolution (currently last-write-wins)
- [ ] Accessibility audit (all tap targets 44px, screen reader labels)
- [ ] Performance profiling on mid-range Android
