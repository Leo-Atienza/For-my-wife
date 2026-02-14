# Session Context — New Features, Polish & Export

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `main`
- **Status**: Modified files with new features, not yet committed.
- **Last 5 commits**:
  - `e1f4d14` — Merge pull request #9 (context update)
  - `500e308` — Update CONTEXT.md with new features, remaining tasks, and architecture notes
  - `6f85ac4` — Merge pull request #8 (new features)
  - `a1d3dc8` — Add Next Visit Planner, Love Language Quiz, Watch Party, and This Day in History
  - `de88859` — Merge pull request #7 (nickname reveal, photo challenges, context update)

---

## What Was Done (Latest Session — 7 Enhancements + 1 New Feature)

### 1. Love Language Results on Profiles
Added love language display to individual profile screen (`app/profile/[partner].tsx`). Shows primary love language with emoji, label, and description. Links to the full quiz. Shows "Take the quiz" prompt when no results exist.

### 2. Mood Trend Chart
Added visual mood trend chart to mood screen (`app/mood/index.tsx`). Maps each mood emoji to a happiness score (0-4), displays as a dot chart with connecting lines over the last 14 days. Separate charts for each partner with scrollable horizontal layout.

### 3. "This Day in History" Push Notification
Created `lib/history-notification.ts` — daily local notification when entries from the same date in previous years exist. Checks memories, milestones, and love notes. Runs once per day (tracked via AsyncStorage). Integrated into app startup in `_layout.tsx` after initial data load.

### 4. Next Visit Auto-Prompt
Added post-visit photo prompt to past visit cards (`app/next-visit/index.tsx`). Shows a "Add photos from this visit" banner with Camera icon that navigates to `/memories/new`. Styled as a dashed-border card with romantic theme.

### 5. Watch Party Partner Join Confirmation
Enhanced watch party screen (`app/watch-party/index.tsx`). Sends push notification when partner opens the watch party screen while a session is active (e.g., "Leo joined Movie Night!"). Added "Watching together" badge with Users icon on the active timer display.

### 6. Visual Map for Distance Screen
Added animated visual map component to distance screen (`app/distance/index.tsx`). Shows both partners as positioned dots on a styled canvas based on their lat/lng. Features pulsing animations, connecting line, heart at midpoint, city labels. No external maps library needed.

### 7. Export / PDF Yearbook (Phase 4.5)
Created full yearbook export feature:
- `lib/yearbook.ts` — HTML template generation with themed styling, cover page, stats, timeline, love notes, memories, songs, bucket list, footer
- `app/export/index.tsx` — Export screen with "What's included" preview, item counts, and "Generate & Share PDF" button
- Uses `expo-print` (HTML → PDF) and `expo-sharing` (share sheet)
- Added to More menu with FileDown icon

### 8. Bug Fixes
- Fixed TypeScript error in `app/watch-party/index.tsx` — `session.duration` possibly undefined
- Added `onSubmitEditing` and `returnKeyType` props to `components/ui/Input.tsx`
- All TypeScript strict mode checks pass (0 errors)
- Expo build compiles successfully for both Android and iOS

**Files created:**
- `lib/history-notification.ts` — This Day in History daily notification
- `lib/yearbook.ts` — HTML yearbook generation
- `app/export/index.tsx` — Export Yearbook screen

**Files modified:**
- `app/profile/[partner].tsx` — Love language results on profile
- `app/mood/index.tsx` — Mood trend chart
- `app/_layout.tsx` — History notification integration
- `app/next-visit/index.tsx` — Post-visit photo prompt
- `app/watch-party/index.tsx` — Partner join notification + watching together badge
- `app/distance/index.tsx` — Visual map component
- `app/(tabs)/more.tsx` — Export Yearbook menu item
- `components/ui/Input.tsx` — Added onSubmitEditing + returnKeyType props
- `package.json` — Added expo-print, expo-sharing

---

## What Was Done (Previous Session — 4 New Features + Infrastructure)

### 1. Next Visit Planner (Phase 1.7 — LDR Feature)

Created `app/next-visit/index.tsx` and `stores/useNextVisitStore.ts`. A full visit planning feature for LDR couples:

- **Create visits** with title, start/end dates, location, and notes
- **Activity checklist** — add activities, tap to toggle complete, long-press to remove
- **Packing list** — add items, tap to toggle packed, long-press to remove
- **Days-until countdown** displayed prominently on each visit card
- **Expandable cards** with chevron indicator and progress stats (e.g., "3/5 activities, 2/4 packed")
- **Past visits** shown at bottom with "Visited" badge
- Sorted: upcoming first (by date), then past visits

**Files created:**
- `stores/useNextVisitStore.ts` — Full Zustand store with activities + packing CRUD, Supabase sync
- `app/next-visit/index.tsx` — Screen with VisitCard component

### 2. Love Language Quiz (Phase 4.3)

Created `app/love-language/index.tsx`, `stores/useLoveLanguageStore.ts`, and `lib/love-languages.ts`. A complete love language discovery feature:

- **15 "which makes you feel more loved?" questions** — each with two options mapping to different love languages
- **Animated transitions** between questions (fade out/in)
- **Progress bar** during quiz
- **Per-partner quiz** — each partner takes their own quiz, can retake anytime
- **Results screen** showing:
  - Primary love language with emoji, label, and description
  - Score breakdown with visual progress bars
  - 5 actionable tips for the partner's love language
- **5 love languages**: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch

**Files created:**
- `lib/love-languages.ts` — Questions, labels, emojis, descriptions, and tips constants
- `stores/useLoveLanguageStore.ts` — Zustand store with score calculation and persistence
- `app/love-language/index.tsx` — Quiz UI + results display

### 3. Watch Party / Sync Timer (Phase 4.4)

Created `app/watch-party/index.tsx` and `stores/useWatchPartyStore.ts`. Shared timer sessions for movie nights and activities:

- **3 session types**: Movie Night, Dinner Date, Activity — each with distinct emoji and icon
- **Two modes**: Stopwatch (no timer set) or Countdown (set duration in minutes)
- **Active session display**: Large pulsing animated timer with elapsed/remaining time
- **Push notification** sent to partner when a session starts
- **Saved sessions** — create sessions and start them later
- **Session management** — start, stop, delete sessions
- **Synced via Supabase** realtime for both partners to see the timer

**Files created:**
- `stores/useWatchPartyStore.ts` — Zustand store with session CRUD + start/stop + realtime sync
- `app/watch-party/index.tsx` — Full screen with ActiveTimer, SessionCard, and creation form

### 4. "This Day in Our History" (Phase 4.2)

Created `components/home/ThisDayInHistory.tsx`. A dashboard widget that surfaces past content:

- Checks **memories, milestones, and love notes** for entries created on the same month/day in previous years
- Shows a card with image thumbnail (if available) or type icon
- Displays "X year(s) ago today" for each entry
- **Tappable** — navigates to the original memory, note, or timeline
- **Automatically hides** when no history exists for today
- Added to home screen between Sleep/Wake toggle and Daily Quote

**Files created:**
- `components/home/ThisDayInHistory.tsx`

**Files modified:**
- `app/(tabs)/index.tsx` — Added ThisDayInHistory import and placement

### 5. Supabase Schema Updates

Updated `supabase/schema.sql` with:

- **3 new tables**: `next_visits`, `love_language_results`, `watch_party_sessions`
- **RLS policies** for all new tables (space-scoped access)
- **Realtime** enabled on all new tables
- **Photo challenge columns**: `partner1_photo TEXT` and `partner2_photo TEXT` on `daily_question_entries`
- **Conflict resolution**: `updated_at TIMESTAMPTZ` columns added to `love_notes`, `memories`, `milestones`, `countdown_events`, `bucket_items`, `mood_entries`, `date_ideas`, `partner_notes`

### 6. Push Notification Triggers

Added `sendPushToPartner()` calls to:
- `stores/useSongStore.ts` — "Your partner dedicated [title] by [artist] to you"
- `stores/useWatchPartyStore.ts` — "Watch party started! Join in"

Previously existing notifications (unchanged):
- Love notes, memories, partner notes, thinking of you, nicknames, sleep/wake

### 7. Infrastructure Integration

Updated all integration points for new features:
- `hooks/useSync.ts` — Realtime subscriptions for `next_visits` and `watch_party_sessions`
- `lib/initial-load.ts` — Pulls `next_visits` and `watch_party_sessions` on app start
- `lib/store-reset.ts` — Resets `useNextVisitStore`, `useLoveLanguageStore`, `useWatchPartyStore` on sign-out
- `lib/dates.ts` — Added `formatRelativeDate()` utility
- `lib/types.ts` — Added `NextVisit`, `VisitActivity`, `PackingItem`, `LoveLanguageType`, `LoveLanguageResult`, `LoveLanguageQuestion`, `WatchPartySession`, `HistoryEntry` interfaces
- `app/(tabs)/more.tsx` — Added menu items for Watch Party, Love Languages, and Next Visit

---

## What Was Done (Previous Sessions)

### Nickname Card-Flip Reveal Animation
3D Y-axis card flip modal for new nicknames. Front face: "Tap to reveal", back face: nickname in Dancing Script. `components/profile/NicknameReveal.tsx`.

### Photo Challenge Feature
10 photo challenge prompts in Daily Questions. Camera/gallery integration via expo-image-picker. Photos display in rounded cards; partner reveal follows same "both submit first" pattern.

### Slot-Machine Animation
"Surprise Me" button in date picker cycles through 12 random ideas with flickering, gradually slows, reveals with spring scale-up.

### Checkmark Draw Animation
Animated circle fill + checkmark spring pop + confetti on bucket list completion.

### NativeWind Pressable Bug Fix
Fixed 5 files. Layout properties must go on plain View wrapper, not in Pressable callback styles.

### Four Delightful Animations
Envelope opening (love notes), confetti burst (bucket list + countdowns), flip number (countdown timers), floating hearts (dashboard).

### Countdown Celebration
Bouncing party emoji + confetti when countdown expires.

### Auth System
Sign-in, sign-up, forgot password, reset password, email confirmation. Fixed RLS recursion and onAuthStateChange race condition.

### UI Polish
Toast, Input, EmptyState, Card, PageHeader improvements. Pull-to-refresh. NaN duration guard. Require cycle fix. QuickActions redesign.

---

## Critical Patterns

### NativeWind + Pressable Layout Bug

**ALWAYS follow this pattern when using Pressable with callback styles:**

```tsx
// CORRECT — layout on plain View, press state on Pressable
<Pressable
  onPress={handlePress}
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  })}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', ... }}>
    {/* content */}
  </View>
</Pressable>
```

**Root cause**: `@tailwind base` in `global.css` overrides callback-style Pressable layout properties. Static `style={{...}}` is NOT affected — only `({ pressed }) => ({...})` callbacks.

### Animation Pattern

All animations use React Native's built-in `Animated` API (not Reanimated). `react-native-reanimated` v4.1.1 is installed but unused.

```tsx
const anim = useRef(new Animated.Value(0)).current;
Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
```

### Sync Engine

- `pushToSupabase()` auto-converts camelCase → snake_case
- `pullFromSupabase()` auto-converts snake_case → camelCase
- Offline queue with retry + exponential backoff
- Last-write-wins conflict resolution (uses `updatedAt` timestamps)

---

## What Still Needs to Be Done

### Priority 1: Real Device Testing
- [ ] Test auth flows on real device (sign up, sign in, forgot password)
- [ ] Test invite partner flow end-to-end on two devices
- [ ] Test data sync between two devices
- [ ] Test offline queue and reconnection behavior
- [ ] Verify all animations on device (envelope, confetti, flip numbers, floating hearts, nickname reveal, slot-machine, checkmark draw)
- [ ] Verify NativeWind fixes render correctly on Android and iOS
- [ ] Test photo challenge flow on device (camera + gallery picker)
- [ ] Test new features: Next Visit Planner, Love Language Quiz, Watch Party
- [ ] Test push notifications for song dedications and watch party starts
- [ ] Test "This Day in Our History" with real historical data

### Priority 2: Remaining Phase 3 Improvements
- [ ] Conflict resolution improvements — current is last-write-wins; consider field-level merging for complex records
- [ ] Cloud photo storage — migrate images from local URIs to Supabase Storage bucket (bucket already configured in schema)
- [ ] Photo compression + thumbnail generation for cloud-stored images
- [x] "This Day in Our History" push notification — daily check for matching dates, send notification if found

### Priority 3: Remaining Features (Phase 4+)
- [x] Export / PDF Yearbook (Phase 4.5) — Generate printable PDF of memories, notes, timeline
- [ ] Spotify Shared Playlist (Phase 4.7) — API integration to auto-compile song dedications into a playlist
- [ ] Background Location Mode (Phase 4.1) — Expo Location background task, 15-30 min updates
- [ ] PWA / Home Screen Widget (Phase 4.6) — Countdown or status widget on phone home screen

### Priority 4: Nice-to-Have Enhancements
- [x] Next Visit auto-prompt — after visit end date passes, prompt to add photos
- [x] Love Language results on individual profiles — display primary love language on profile cards
- [x] Watch Party partner join confirmation — notify when partner has the timer screen open
- [x] Map view for Distance screen — visual map with both partner locations
- [x] Mood trend chart — visual chart showing mood over time
- [ ] Photo gallery improvements — pinch-to-zoom, swipe navigation in full-screen mode

---

## App Feature Status Overview

### Fully Built & Working (31 features)

| Feature | Screen | Store |
|---------|--------|-------|
| Onboarding/Setup Wizard | `app/setup/` | `useCoupleStore` |
| Home Dashboard | `app/(tabs)/index.tsx` | Multiple stores |
| Love Notes | `app/(tabs)/notes.tsx`, `app/notes/` | `useNotesStore` |
| Memory Wall | `app/(tabs)/memories.tsx`, `app/memories/` | `useMemoriesStore` |
| Anniversary Countdowns | `app/(tabs)/countdowns.tsx` | `useCountdownsStore` |
| More Menu | `app/(tabs)/more.tsx` | — |
| Relationship Timeline | `app/timeline/` | `useTimelineStore` |
| Date Ideas | `app/dates/` | `useDateIdeasStore` |
| Bucket List | `app/bucket-list/` | `useBucketStore` |
| Mood Check-In | `app/mood/` | `useMoodStore` |
| Daily Questions + Photo Challenges | `app/questions/` | `useQuestionsStore` |
| Song Dedications | `app/songs/` | `useSongStore` |
| Status Board | `app/status/` | — |
| Letter Box (Journal) | `app/journal/` | `useJournalStore` |
| Partner Notes | `app/partner-notes/` | `usePartnerNotesStore` |
| Virtual Touch | `app/touch/` | — (realtime) |
| Distance Tracker | `app/distance/` | `useLocationStore` |
| Couple Profile | `app/profile/couple.tsx` | `useCoupleStore` |
| Individual Profiles | `app/profile/[partner].tsx` | `useProfileStore` |
| Nicknames + Card-Flip Reveal | `app/profile/nicknames.tsx` | `useNicknameStore` |
| Thinking of You | Home screen component | `useThinkingStore` |
| Sleep/Wake Toggle | Home screen component | `useSleepWakeStore` |
| Weekly Recap | Home screen component | — |
| Theme Selector (4 themes) | `app/settings/` | `useCoupleStore` |
| Auth (sign in/up/forgot) | `app/auth/` | `useAuthStore` |
| Invite Partner | `app/invite-partner.tsx` | `useAuthStore` |
| Settings | `app/settings/` | Multiple stores |
| **Next Visit Planner** (NEW) | `app/next-visit/` | `useNextVisitStore` |
| **Love Language Quiz** (NEW) | `app/love-language/` | `useLoveLanguageStore` |
| **Watch Party / Sync Timer** (NEW) | `app/watch-party/` | `useWatchPartyStore` |
| **This Day in Our History** (NEW) | Home screen component | — (reads from existing stores) |

### Animations Implemented (12)

| Animation | Feature | Status |
|-----------|---------|--------|
| Envelope opening | Love notes (unread) | Done |
| Confetti burst | Bucket list completion | Done |
| Flip number | Countdown timers + dashboard duration | Done |
| Floating hearts | Dashboard around duration counter | Done |
| Celebration badge | Countdown expired | Done |
| Bobbing emoji | Empty states | Done |
| Heartbeat | Thinking of You button | Done |
| Heart bloom | Thinking of You received | Done |
| Toast slide | Toast notifications | Done |
| Slot-machine shuffle | Surprise Me date picker | Done |
| Checkmark draw | Bucket list completion | Done |
| Nickname card-flip | Nickname reveal modal | Done |

### Push Notifications Active

| Event | Message | Route |
|-------|---------|-------|
| New love note | "Your partner left you a love note" | `/notes` |
| New memory | "Your partner added a new memory" | `/memories` |
| Partner note | "Your partner wrote something about you" | `/partner-notes` |
| Thinking of you | "Your partner is thinking about you" | `/` |
| New nickname | "Your partner gave you a new nickname" | `/profile/nicknames` |
| Sleep/wake status | "Your partner is going to sleep/waking up" | `/` |
| Song dedication (NEW) | "Your partner dedicated [song] to you" | `/songs` |
| Watch party start (NEW) | "[title] is starting! Join in" | `/watch-party` |

---

## Codebase Stats

- **~140+ source files** (`.ts` + `.tsx`)
- **51+ routes** (Expo Router auto-discovery)
- **21 Zustand stores** with AsyncStorage persistence
- **21 Supabase tables** with RLS + realtime
- **4 color themes**: Rose, Lavender, Sunset, Ocean
- **3 font families**: Playfair Display, Inter, Dancing Script
- **12 animation components** using React Native Animated API
- **40 daily questions** (20 questions + 10 would-you-rather + 10 photo challenges)
- **15 love language quiz questions**
- **8 push notification triggers**

---

## Supabase Tables (21 total)

| Table | Purpose | New? |
|-------|---------|------|
| `spaces` | Links two partners | |
| `space_members` | User-to-space mapping + push tokens | |
| `couple_profiles` | Shared couple info | |
| `individual_profiles` | Per-partner profiles | |
| `nicknames` | Nickname history | |
| `love_notes` | Love notes/messages | |
| `memories` | Photo memories | |
| `milestones` | Timeline events | |
| `countdown_events` | Countdowns | |
| `bucket_items` | Bucket list | |
| `mood_entries` | Mood tracking | |
| `date_ideas` | Date planning | |
| `journal_letters` | Weekly sealed letters | |
| `daily_question_entries` | Q&A + photo challenges | |
| `song_dedications` | Song dedications | |
| `location_entries` | LDR location tracking | |
| `partner_notes` | Notes about partner | |
| `thinking_of_you` | Thinking of you taps | |
| `sleep_wake_status` | Sleep/wake status | |
| `next_visits` | Visit planner | NEW |
| `love_language_results` | Quiz results | NEW |
| `watch_party_sessions` | Watch party timers | NEW |

---

## Known Warnings (Non-Blocking)

1. **`expo-notifications` error** — Expected in Expo Go. Push notifications only work in standalone builds.
2. **SafeAreaView deprecation** — Already using `react-native-safe-area-context` in most places.
3. **Realtime send() fallback** — Supabase realtime auto-falling back to REST API.
4. **TypeScript `--jsx` errors in `npx tsc`** — These are Expo project config issues handled by the bundler. All code compiles and runs correctly via `npx expo start`.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/types.ts` | All TypeScript interfaces — includes new NextVisit, LoveLanguage, WatchParty types |
| `lib/sync.ts` | Sync engine — camelCase↔snake_case + offline queue |
| `lib/initial-load.ts` | Initial data pull from Supabase (21 tables) |
| `lib/store-reset.ts` | Lazy store reset on sign-out (21 stores) |
| `lib/notifications.ts` | Push notification registration + sendPushToPartner |
| `lib/love-languages.ts` | Quiz questions, labels, descriptions, tips |
| `lib/dates.ts` | Date formatting + formatRelativeDate |
| `lib/constants.ts` | Themes, quotes, questions, date ideas, emojis |
| `hooks/useSync.ts` | Realtime subscriptions for all 21 synced tables |
| `supabase/schema.sql` | Full DB schema with 21 tables + RLS + realtime |
| `app/_layout.tsx` | Root layout — route guard, auth listener |
| `app/(tabs)/index.tsx` | Home dashboard — includes ThisDayInHistory |
| `app/(tabs)/more.tsx` | More menu — all feature links |
| `app/next-visit/index.tsx` | Next Visit Planner screen |
| `app/love-language/index.tsx` | Love Language Quiz screen |
| `app/watch-party/index.tsx` | Watch Party screen |
| `components/home/ThisDayInHistory.tsx` | Dashboard history widget |
| `components/ui/Button.tsx` | DO NOT CHANGE — user confirmed buttons are good |
| `global.css` | Contains `@tailwind base` — source of Pressable layout bug |

---

## Architecture Notes

- **State**: Zustand with AsyncStorage persistence (21 stores)
- **Sync**: `pushToSupabase()` auto-converts camelCase→snake_case, `pullFromSupabase()` auto-converts snake_case→camelCase
- **Conflict resolution**: Last-write-wins using `updatedAt` timestamps (all mutable tables now have `updated_at`)
- **Themes**: 4 themes (Rose, Lavender, Sunset, Ocean) in `lib/constants.ts`
- **Typography**: Playfair Display (headings), Inter (body), Dancing Script (romantic accents)
- **Navigation**: Expo Router file-based routing with Stack + bottom tabs
- **Animations**: All use built-in `Animated` API (Reanimated installed but unused)
- **This app is for 2 users only** — don't over-engineer
- **NativeWind caveat**: Never put layout properties inside Pressable callback styles — use a plain View wrapper
- **Photo storage**: Currently base64/URI in AsyncStorage. Supabase Storage bucket is configured but migration not yet done
- **Daily Questions**: 40-question pool cycling by day offset. Photo challenges use `expo-image-picker` with 0.7 JPEG quality
- **Love Language Quiz**: 15 forced-choice questions, scores tallied per language type, primary = highest scorer
- **Watch Party**: Supports both stopwatch (no timer) and countdown (set duration) modes
- **Next Visit**: Activities and packing items stored as JSONB arrays in Supabase
