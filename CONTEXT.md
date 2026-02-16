# "Us" App — Current State

> **Read this FIRST.** This is the single source of truth for the app's current state.
> For architectural decisions and rationale, see `DECISIONS.md`.
> For feature plans and data models, see `APP_PLAN.md`.

## Quick Stats

- **Zustand stores**: 26 (all with AsyncStorage persistence + Supabase sync)
- **Supabase tables**: 29 (all with RLS + realtime)
- **Route files**: 64 screens
- **Components**: 45 reusable components
- **Lib modules**: 26 utility files
- **Hooks**: 7 custom hooks
- **Animations**: 25+ using React Native Animated API
- **Push notification triggers**: 17
- **Home screen widgets**: 19

---

## Stores → Tables Mapping (26 stores, 29 tables)

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
| `useLoveMapStore` | `love_map_pins` | `pins` |
| `usePromiseStore` | `couple_promises` | `promises` |
| `useWishListStore` | `wish_items` | `wishes` |

---

## All Routes

### Tab Screens (5)
`app/(tabs)/index.tsx` (Home), `notes.tsx`, `memories.tsx`, `countdowns.tsx`, `more.tsx`

### Auth (7)
`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `confirm`, `create-space`, `join-space`

### Feature Screens (38)
`bucket-list`, `card-maker`, `coupons`, `dates`, `distance`, `dreams`, `export`, `greetings`, `invite-partner`, `journal`, `letter-generator`, `love-language`, `love-map`, `mood`, `next-visit`, `partner-notes`, `playlist`, `promises`, `questions`, `quiz`, `recap`, `settings`, `songs`, `stats`, `status`, `timeline`, `touch`, `watch-party`, `wish-list`, `would-you-rather`

### Detail/Create Screens
`notes/[id]`, `notes/new`, `memories/[id]`, `memories/new`, `countdowns/new`, `partner-notes/[id]`, `partner-notes/new`, `profile/couple`, `profile/[partner]`, `profile/nicknames`, `setup/index`

---

## Home Screen Widgets (19, in order)

1. `SyncStatusIndicator` — online/offline indicator
2. Header (couple photo, greeting, names)
3. `CountdownCelebration` — celebration when a countdown reaches today
4. `ValentinesDayCard` — Feb 14 only
5. `MilestoneAlert` — upcoming/today milestones
6. `QuickGreeting` — one-tap good morning/good night to partner
7. `ThinkingOfYouButton` — tap to send
8. `PartnerSleepStatus` — inline sleep status
9. `DurationCounter` + `FloatingHearts` — days together
10. `QuickActions` — horizontal scroll (8 shortcuts)
11. `StreakCounter` — consecutive activity days
12. `RelationshipHealth` — weekly activity score
13. `SleepWakeToggle` — sleep/awake toggle
14. `ThisDayInHistory` — same-date memories from past years
15. `RelationshipTrivia` — fun facts from your data
16. `LoveLanguageTip` — actionable tips based on partner's love language
17. `DailyCompliment` — rotating partner compliment
18. `DailyQuote` — rotating love quote
19. `LoveFortune` — interactive fortune cookie
20. `WeeklyRecapCard` — weekly activity summary

---

## Push Notifications (17 triggers)

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
| Dream added | `useDreamStore` |
| Dream achieved | `useDreamStore` |
| New map pin | `useLoveMapStore` |
| New promise made | `usePromiseStore` |
| Promise kept | `usePromiseStore` |
| Wish added for partner | `useWishListStore` |
| Wish fulfilled | `useWishListStore` |
| Good morning/night | `QuickGreeting` component |
| This Day in History | `lib/history-notification.ts` |

---

## Known Warnings (Non-Blocking)

1. `expo-notifications` error in Expo Go — works in standalone builds only
2. Realtime `send()` fallback — Supabase auto-falls back to REST
3. Reanimated v4.1.1 installed but unused — all animations use built-in Animated API

---

## Production Progress

### Code Completion: 100%

| Area | Status | Details |
|------|--------|---------|
| Routes | 64/64 | All screens built and navigable |
| Stores | 26/26 | All with persistence + sync methods |
| Sync (initial-load) | 25/25 | All stores pull from Supabase on login |
| Sync (realtime) | 25/25 | All stores subscribe to realtime changes |
| Sync (store-reset) | 25/25 | All stores reset on sign-out |
| Supabase tables | 27/27 | All with RLS policies + realtime publication |
| Push notifications | 17/17 | All triggers wired with `sendPushToPartner()` |
| Home widgets | 19/19 | All rendering on home screen |
| TypeScript | 0 errors | `npx tsc --noEmit` passes clean |
| Bundle | Compiles | `npx expo export --platform ios` succeeds |
| TODOs/FIXMEs | 0 | No stubs or incomplete code |

### What Still Needs Doing

#### Must Do
- [ ] Real device testing (auth flows, 2-device sync, offline queue, all animations)
- [ ] Test invite partner flow end-to-end on two devices

#### Nice to Have
- [ ] Field-level conflict resolution (currently last-write-wins)
- [ ] Accessibility audit (all tap targets 44px, screen reader labels)
- [ ] Performance profiling on mid-range Android
