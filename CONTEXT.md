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
2. `SafeAreaView` deprecation warning — comes from a dependency, NOT our code (all our code uses `react-native-safe-area-context`)
3. Realtime `send()` fallback — Supabase auto-falls back to REST
4. Background location limited in Expo Go — works in dev builds
5. Reanimated v4.1.1 installed but unused — all animations use built-in Animated API

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

---

## Bug Fixes Completed (Sessions 1-3)

### 1. NativeWind + Pressable Layout Override Bug (CRITICAL — mass fix)

**Problem:** Layout properties (`flex`, `flexDirection`, `alignItems`, `justifyContent`, `gap`, `padding`, `borderRadius`, `backgroundColor`, `width`, `height`, `overflow`) placed inside Pressable callback-style `style={({ pressed }) => ({...})}` were silently overridden by NativeWind's `@tailwind base` reset. This caused buttons to be invisible, unsized, or missing their background/border styling across the entire app.

**Fix:** Moved ALL layout properties out of Pressable callbacks into child `<View>` wrappers. Only `opacity` and `transform` remain in callbacks (these are animation-safe and not overridden by NativeWind).

**Files fixed (15+ instances across 13 files):**
- `app/card-maker/index.tsx` — Send button, Random button, Send Card button
- `app/greetings/index.tsx` — Shuffle button, template message cards, Send button
- `app/quiz/index.tsx` — Start Quiz, Next Question, Play Again buttons
- `app/dreams/index.tsx` — Achieve/Delete icon buttons, Add Dream button
- `app/watch-party/index.tsx` — Type selector buttons (movie/dinner/activity)
- `app/letter-generator/index.tsx` — Copy and Send as Note buttons
- `app/wish-list/index.tsx` — Cancel/Add Wish modal buttons
- `app/promises/index.tsx` — Cancel/Promise modal buttons
- `app/invite-partner.tsx` — Copy/Share buttons
- `app/love-map/index.tsx` — Cancel/Add Pin modal buttons
- `app/(tabs)/memories.tsx` — Memory thumbnail grid items
- `components/home/QuickGreeting.tsx` — Morning/Night greeting buttons

### 2. `love_language_results` Supabase Sync Error

**Problem:** `Sync push error: Could not find the 'primary' column of 'love_language_results' in the schema cache`. The Supabase table uses `primary_language` as the column name, but the TypeScript interface uses `primary` as the field name. The standard camelCase→snake_case converter turned `primary` into `primary` (no change), not `primary_language`.

**Fix:** Added explicit alias mapping in `lib/sync.ts`:
- `primary` → `primary_language` (camelCase → snake_case push)
- `primary_language` → `primary` (snake_case → camelCase pull)

Also added `useLoveLanguageStore` to `lib/initial-load.ts` and `hooks/useSync.ts` for full sync support.

### 3. `RangeError: Invalid time value` in PartnerNoteCard

**Problem:** `usePartnerNotesStore.ts` had a custom `mapRemoteToLocal` function that accessed snake_case fields (`record.created_at`, `record.about_partner`, `record.is_discovered`), but `pullFromSupabase` already converts to camelCase (`createdAt`, `aboutPartner`, `isDiscovered`). This meant `createdAt` was `undefined` after initial load, causing `new Date(undefined)` → `Invalid Date` → `format()` crash.

**Fix:**
- Updated `mapRemoteToLocal` in `stores/usePartnerNotesStore.ts` to handle both camelCase and snake_case with `??` fallbacks (e.g., `record.createdAt ?? record.created_at`)
- Added `safeFormatDate` helper using `date-fns/isValid` in `components/partner-notes/PartnerNoteCard.tsx` and `app/partner-notes/[id].tsx` to prevent crashes from invalid dates

### 4. Emoji Rendering Fix (Session 1)

**Problem:** Extended Unicode emoji sequences using `\u{XXXXX}` syntax (e.g., `\u{1F48C}`) caused rendering issues on some devices.

**Fix:** Replaced all `\u{XXXXX}` extended syntax with standard surrogate pair syntax (`\uXXXX\uXXXX`) across 28 files.

---

## Outstanding Issues (To Fix Next Session)

### HIGH PRIORITY

#### 1. Home Screen Initial Load — UI Elements Not Rendering

**Symptom:** On initial load after login, certain home screen widgets/elements that should be visible do not appear. Tapping the two buttons at the top of the home screen (Quick Greeting buttons) causes some elements to display, but not all become visible as intended.

**Likely cause:** Conditional rendering based on store state that hasn't finished hydrating from AsyncStorage or Supabase. Widgets may depend on data from stores that are still loading, causing them to render as empty/hidden.

**Investigation needed:**
- Check which specific widgets are missing on first render
- Audit home screen widget visibility conditions in `app/(tabs)/index.tsx`
- Check if `initial-load.ts` completes before home screen renders
- Verify that Zustand hydration from AsyncStorage completes before widget mount
- Consider adding loading states or skeleton placeholders for widgets that depend on remote data

#### 2. Memory Creation — New Entry Not Appearing

**Symptom:** When creating a new memory, the entry does not appear in the memories list after confirming the action.

**Likely cause:** Could be one of:
- Image upload to Supabase Storage failing silently
- Store not updating after successful creation
- `imageUri` ↔ `image_url` alias mapping issue in `lib/sync.ts`
- FlatList not re-rendering when store updates
- Navigation back to list happening before state update propagates

**Investigation needed:**
- Check `useMemoriesStore.addMemory()` — does it update local state and push to Supabase?
- Check `app/memories/new.tsx` — does it call the store correctly and navigate back?
- Check Supabase logs for failed inserts or storage uploads
- Check if `image_url` ↔ `imageUri` alias works correctly in both directions
- Test with console logs in the store mutation to verify state change

### MEDIUM PRIORITY

#### 3. Full UI/UX Audit Across All Features

While the NativeWind + Pressable bug has been fixed comprehensively, a full manual walkthrough of every screen is needed to catch:
- Any remaining layout/styling issues
- Screens that don't scroll properly on smaller devices
- Modals that don't display correctly
- Any other date formatting issues in other components
- Empty states that need better messaging

---

## Testing Requirements (Next Session)

### User Flow Tests (Manual/E2E)

The following comprehensive user tests should be created to simulate real user interactions. These should cover the full happy path and common error states:

#### Auth & Onboarding
1. Sign up → create space → invite partner → partner joins → both see home
2. Sign in → forgot password → reset → sign in again
3. Sign out → sign back in → all data persists

#### Core Features (test each create/read/update/delete)
4. Love Notes: create note → appears in list → partner sees it via sync → delete note
5. Memories: create memory with photo → appears in grid → tap to view detail → delete
6. Countdowns: create countdown → timer ticking → reaches zero → celebration shown
7. Partner Notes: write note about partner → partner discovers it → reveal animation
8. Bucket List: add item → mark complete → filter by status
9. Dreams: add dream → mark achieved → star animation
10. Promises: make promise → keep promise → shows kept status
11. Wish List: add wish → partner fulfills it → status updates
12. Coupons: create custom coupon → give to partner → partner redeems

#### Interactive Features
13. Quiz: start quiz → answer all questions → see results
14. Love Language: take quiz → results saved → tips appear on home screen
15. Card Maker: customize card → preview → send to partner
16. Greetings: select/write greeting → send → partner receives push notification
17. Would You Rather: see prompt → swipe/choose → see partner's answer
18. Watch Party: create session → select type → start timer → end session
19. Letter Generator: generate letter → customize → copy/send as note
20. Mood Tracker: log mood → see mood history chart

#### Home Screen Widgets
21. Quick Greeting: tap morning/night → partner receives notification
22. Thinking of You: tap button → counter increments → partner notified
23. Sleep/Wake Toggle: toggle sleep → partner sees status
24. Love Fortune: tap cookie → fortune reveals → can crack another
25. Duration Counter: verify days/hours/minutes counting correctly
26. Streak Counter: verify streak increments with daily activity

#### Sync & Offline
27. Create item offline → go online → item syncs to Supabase
28. Partner creates item → appears in real-time on other device
29. Both partners edit same item → last-write-wins resolves
30. Sign out → all stores reset → sign back in → data loads from Supabase

### Unit Tests (Key Functions)

The following unit tests should be created to verify core function behavior:

#### Sync Engine (`lib/sync.ts`)
- `camelToSnake()` converts all standard cases correctly
- `snakeToCamel()` converts all standard cases correctly
- Alias mappings work: `imageUri` ↔ `image_url`, `couplePhoto` ↔ `couple_photo_url`, `primary` ↔ `primary_language`
- `pushToSupabase()` handles network failures gracefully (queues for retry)
- `pullFromSupabase()` returns empty array on error (doesn't crash)

#### Date Utilities
- `safeFormatDate()` returns empty string for undefined/null/invalid dates
- `safeFormatDate()` formats valid ISO strings correctly
- `safeFormatDate()` handles Supabase `TIMESTAMPTZ` format

#### Store Mapping Functions
- `mapRemoteToLocal()` in `usePartnerNotesStore` handles camelCase input (from `pullFromSupabase`)
- `mapRemoteToLocal()` in `usePartnerNotesStore` handles snake_case input (from realtime)
- `mapLocalToRemote()` produces correct snake_case output for Supabase

#### Utility Functions (`lib/utils.ts`)
- `generateId()` produces unique IDs
- `truncateText()` truncates at correct length with ellipsis
- `mergeById()` deduplicates correctly, preferring remote data

#### Store Actions
- Each store's `addX()` method updates local state AND calls `pushToSupabase()`
- Each store's `loadFromRemote()` replaces state correctly
- Each store's `syncRemoteInsert()` doesn't duplicate existing records
- Each store's `syncRemoteDelete()` removes the correct record
- Each store's `reset()` clears all state

#### Notifications (`lib/notifications.ts`)
- `sendPushToPartner()` handles missing push token gracefully
- `sendPushToPartner()` sends correct payload format

---

## What Still Needs Doing

### Must Do (Next Session)
- [ ] Fix home screen initial load — widgets not rendering until user interaction
- [ ] Fix memory creation — new entry not appearing after confirmation
- [ ] Create comprehensive user flow tests (see Testing Requirements above)
- [ ] Create unit tests for all key functions (see Testing Requirements above)
- [ ] Real device testing (auth flows, 2-device sync, offline queue, all animations)
- [ ] Test invite partner flow end-to-end on two devices

### Nice to Have
- [ ] Field-level conflict resolution (currently last-write-wins)
- [ ] Accessibility audit (all tap targets 44px, screen reader labels)
- [ ] Performance profiling on mid-range Android
- [ ] Loading skeleton placeholders for home screen widgets during data hydration
- [ ] Better empty state illustrations for Promises, Wish List, Dreams, etc.
