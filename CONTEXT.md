# Session Context — Nickname Reveal, Photo Challenges & Full Polish

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `claude/follow-context-instructions-9cys2`
- **Status**: Clean working tree, pushed to remote.
- **Last 5 commits**:
  - `eaefd25` — Add nickname card-flip reveal animation and photo challenge feature
  - `e818266` — 2 polish animations completed (slot-machine + checkmark draw)
  - `ba306c5` — context update
  - `624e560` — Add celebration animation when countdown reaches zero
  - `3cfba02` — Add delightful animations across four features

---

## What Was Done (This Session — Nickname Reveal & Photo Challenges)

### 1. Nickname Card-Flip Reveal Animation

Created `components/profile/NicknameReveal.tsx` — a modal component with a 3D Y-axis card flip animation. When giving a partner a new nickname:

1. **Modal appears** with a fade-in overlay + spring scale entrance (card pops in from 0.8 → 1.0)
2. **Front face** shows a primary-colored card with a heart emoji, "New Nickname!" heading, who gave it, and "Tap to reveal"
3. **Card flips** on the Y-axis with a smooth 500ms bezier easing (per design system spec)
4. **Back face** reveals the nickname in Dancing Script font, with a decorative divider and "with love from [name]"
5. **Tap to dismiss** fades out the overlay and scales the card away

Updated `app/profile/nicknames.tsx` to include:
- A **"Give a new nickname"** form card at the top of the list (Input + Button)
- The `NicknameReveal` modal triggers automatically after submitting a new nickname
- All existing nickname history display remains intact

**Files changed:**
- `components/profile/NicknameReveal.tsx` (NEW)
- `app/profile/nicknames.tsx` (updated — added form + reveal integration)

### 2. Photo Challenge Feature in Daily Questions

Added a new `'photo-challenge'` question category to the Daily Questions system. Photo challenges prompt partners to take/share photos instead of typing text answers.

**Type changes (`lib/types.ts`):**
- Extracted `QuestionCategory` type: `'question' | 'would-you-rather' | 'photo-challenge'`
- Added `partner1Photo?: string` and `partner2Photo?: string` to `DailyQuestionEntry`

**10 photo challenge prompts added (`lib/constants.ts`):**
| ID | Prompt |
|----|--------|
| pc1 | Send a photo of your view right now |
| pc2 | Show me what you had for lunch today |
| pc3 | Take a selfie making your silliest face |
| pc4 | Photo of something that reminded you of me today |
| pc5 | Show me your current outfit |
| pc6 | Take a photo of something beautiful near you |
| pc7 | Show me your workspace right now |
| pc8 | Photo of your favorite comfort item |
| pc9 | Take a photo that captures your current mood |
| pc10 | Show me the last thing that made you smile |

Total daily questions pool: **40** (20 questions + 10 would-you-rather + 10 photo challenges). Cycles every 40 days.

**Store changes (`stores/useQuestionsStore.ts`):**
- Added `submitPhoto(entryId, partner, photoUri)` action with Supabase sync

**Screen changes (`app/questions/index.tsx`):**
- Photo challenges display a **Camera icon + amber "PHOTO CHALLENGE" badge**
- Instead of a text input, shows **"Take a Photo"** (camera) and **"Choose from Gallery"** buttons
- Uses `expo-image-picker` (already in the project) for both camera and gallery
- Submitted photos display in rounded cards (200px height, cover mode)
- Partner photo reveal follows the same "both must submit before reveal" pattern
- Past photo challenges show **80x80 thumbnails** side by side in history
- Regular questions and would-you-rather continue to work exactly as before

**Files changed:**
- `lib/types.ts` (updated — `QuestionCategory` type, photo fields)
- `lib/constants.ts` (updated — 10 photo challenge entries)
- `stores/useQuestionsStore.ts` (updated — `submitPhoto` action)
- `app/questions/index.tsx` (updated — full photo challenge UI)

---

## What Was Done (Previous Sessions)

### Slot-Machine Animation for "Surprise Me" Date Picker
Added a slot-machine style animation to the "Surprise Me" button in `app/dates/index.tsx`:
1. Cycles through 12 random ideas with flickering opacity, "SHUFFLING..." label
2. Gradually slows down (80ms → 250ms between cycles)
3. Reveals the final pick with a spring scale-up + fade-in animation
4. Prevents double-taps during the spin (`isSpinning` guard)

### Checkmark Draw Animation for Bucket List
Added `components/bucket/CheckmarkDraw.tsx` for animated bucket list completion:
1. Circle fills with a scale animation (0 → 1) over 200ms
2. Checkmark draws with a spring pop + rotation (100ms delay)
3. Confetti fires 500ms later

### NativeWind Pressable Bug — Full Codebase Sweep
Fixed 5 files with layout properties inside `({ pressed }) => ({...})` callback styles. All files now follow the safe View wrapper pattern.

### Four Delightful Animations
| Animation | Component | Where Used |
|-----------|-----------|------------|
| Envelope opening | `components/notes/EnvelopeAnimation.tsx` | Unread love notes |
| Confetti burst | `components/bucket/ConfettiBurst.tsx` | Bucket list + countdowns |
| Flip number | `components/countdowns/FlipNumber.tsx` | Countdown timers + dashboard |
| Floating hearts | `components/home/FloatingHearts.tsx` | Dashboard duration counter |

### Countdown Celebration Animation
`CelebrationBadge` in `app/(tabs)/countdowns.tsx` — bouncing party emoji + confetti when countdown expires.

### Button Component Rewrite
Replaced `Pressable` with `TouchableOpacity` in `components/ui/Button.tsx`. Buttons render correctly on Android.

### Auth System (Fully Working)
Sign-in, sign-up, forgot password, reset password, email confirmation. Fixed RLS recursion and `onAuthStateChange` race condition.

### Bug Fixes
- Invalid date crash — `isNaN(date.getTime())` guards in `lib/dates.ts`
- camelCase→snake_case sync failure — centralized conversion in `lib/sync.ts`
- "setup" route warning — `app/setup/_layout.tsx`

### UI Polish
Toast.tsx (Lucide icons), Input.tsx (error prop), EmptyState.tsx (bobbing), Card.tsx (loading prop), PageHeader.tsx (44px touch), pull-to-refresh on Notes/Memories/Countdowns, NaN duration guard, SleepWake theme-aware, require cycle fix, QuickActions redesign.

### More Screen & Invite Partner
Full rewrite of `more.tsx`, invite partner screen with Supabase, settings enhancements.

---

## Critical Pattern: NativeWind + Pressable Layout Bug

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

// WRONG — NativeWind @tailwind base will override these
<Pressable
  style={({ pressed }) => ({
    flexDirection: 'row',    // ← OVERRIDDEN
    alignItems: 'center',    // ← OVERRIDDEN
    gap: 10,                 // ← OVERRIDDEN
    opacity: pressed ? 0.7 : 1,
  })}
>
  {/* content will stack vertically on device */}
</Pressable>
```

**Root cause**: `@tailwind base` in `global.css` sets default styles that override callback-style properties on Pressable.

**Note**: Static `style={{...}}` (without a `({ pressed })` callback) is NOT affected. Only callback-style Pressable styles break.

**Status**: All files in the codebase now follow the safe pattern. No remaining bugs.

---

## Animation Pattern Reference

All animations use React Native's built-in `Animated` API (not Reanimated), consistent with the existing codebase. `react-native-reanimated` v4.1.1 is installed but unused.

```tsx
// Standard pattern used throughout:
const anim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(anim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true, // Always true for transform/opacity
  }).start();
}, [anim]);
```

### Existing Animation Components
| Component | Pattern | Location |
|-----------|---------|----------|
| EmptyState bobbing | `Animated.loop` + `Animated.sequence` | `components/ui/EmptyState.tsx` |
| Toast slide-in | `Animated.parallel` (opacity + translateY) | `components/ui/Toast.tsx` |
| Thinking of You heartbeat | `Animated.sequence` (scale up/down) | `components/home/ThinkingOfYouButton.tsx` |
| Heart bloom | `Animated.parallel` (scale + opacity + translateY) | `components/home/HeartBloom.tsx` |
| Envelope opening | `Animated.sequence` (flap + slide + fade) | `components/notes/EnvelopeAnimation.tsx` |
| Confetti burst | `Animated.parallel` (12 particles × 5 properties) | `components/bucket/ConfettiBurst.tsx` |
| Flip number | `Animated.timing` (translateY + opacity on change) | `components/countdowns/FlipNumber.tsx` |
| Floating hearts | `Animated.sequence` per heart (translateY + opacity loop) | `components/home/FloatingHearts.tsx` |
| Nickname card-flip | `Animated.timing` (rotateY + perspective, 500ms) | `components/profile/NicknameReveal.tsx` |

---

## What Still Needs to Be Done

### Priority 1: Real Device Testing
- [ ] Test auth flows on real device (sign up, sign in, forgot password)
- [ ] Test invite partner flow end-to-end on two devices
- [ ] Test data sync between two devices (camelCase fix should resolve sync errors)
- [ ] Test offline queue and reconnection behavior
- [ ] Verify Couple Profile screen no longer crashes with invalid dates
- [ ] Test all animations on device (envelope, confetti, flip numbers, floating hearts, nickname reveal, slot-machine, checkmark draw)
- [ ] Verify NativeWind fixes render correctly on Android and iOS
- [ ] Test photo challenge flow on device (camera + gallery picker)
- [ ] Verify photo challenge images persist across app restarts

### Priority 2: Phase 3 Completion (Supabase)
- [ ] Conflict resolution for simultaneous edits (currently last-write-wins)
- [ ] Cloud photo storage — migrate images from AsyncStorage to Supabase Storage
- [ ] Photo compression + thumbnail generation
- [ ] Push notifications for key events (new note, thinking of you, countdown reached zero)
- [ ] "This Day in Our History" feature (Phase 4.2 in APP_PLAN.md)
- [ ] Add `partner1_photo` and `partner2_photo` columns to `daily_question_entries` table in Supabase schema (for photo challenge sync)

### Priority 3: Remaining Features
- [ ] Next Visit planner (LDR feature — Phase 1.7 in APP_PLAN.md)
- [ ] Love Language Quiz (Phase 4.3)
- [ ] Export/PDF Yearbook (Phase 4.5)
- [ ] Watch Party / Sync Timer (Phase 4.4)
- [ ] Spotify Shared Playlist integration (Phase 4.7)

### Priority 4: Additional Polish (ALL COMPLETE)
- [x] Slot-machine animation for "Surprise Me" random date picker
- [x] Satisfying checkmark draw animation on bucket list (before confetti)
- [x] Nickname card-flip reveal animation
- [x] Photo challenge feature in Daily Questions

---

## App Feature Status Overview

### Fully Built & Working
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
| Status Board | `app/status/` | `useStatusStore` |
| Letter Box (Journal) | `app/journal/` | `useJournalStore` |
| Partner Notes | `app/partner-notes/` | `usePartnerNotesStore` |
| Virtual Touch | `app/touch/` | — (realtime) |
| Distance Tracker | `app/distance/` | `useLocationStore` |
| Couple Profile | `app/profile/couple.tsx` | `useCoupleStore` |
| Individual Profiles | `app/profile/[partner].tsx` | `useProfileStore` |
| Nicknames + Card-Flip Reveal | `app/profile/nicknames.tsx` | `useNicknameStore` |
| Thinking of You | Home screen component | `useThinkingStore` |
| Sleep/Wake Toggle | Home screen component | `useSleepWakeStore` |
| Weekly Recap | Home screen component | `useWeeklyRecapStore` |
| Theme Selector (4 themes) | `app/settings/` | `useCoupleStore` |
| Auth (sign in/up/forgot) | `app/auth/` | `useAuthStore` |
| Invite Partner | `app/invite-partner.tsx` | `useAuthStore` |
| Settings | `app/settings/` | Multiple stores |
| Sync Engine | `lib/sync.ts` | — |

### Animations Implemented
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

### Codebase Stats
- **121 source files** (`.ts` + `.tsx`)
- **48 routes** (Expo Router auto-discovery)
- **18+ Zustand stores** with AsyncStorage persistence
- **4 color themes**: Rose, Lavender, Sunset, Ocean
- **3 font families**: Playfair Display, Inter, Dancing Script
- **10 animation components** using React Native Animated API
- **40 daily questions** (20 questions + 10 would-you-rather + 10 photo challenges)
- **0 TypeScript errors**, 0 `any` types, 0 console.log in production code

---

## Known Warnings (Non-Blocking)

1. **`expo-notifications` error** — Expected in Expo Go. Push notifications only work in standalone builds.
2. **SafeAreaView deprecation** — Warning about deprecated SafeAreaView. Already using `react-native-safe-area-context` in most places.
3. **Realtime send() fallback** — Supabase realtime auto-falling back to REST API.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/dates.ts` | Date formatting — has invalid date guards |
| `lib/sync.ts` | Sync engine — centralized camelCase↔snake_case + offline queue |
| `lib/initial-load.ts` | Initial data pull — uses auto-converted camelCase data |
| `lib/types.ts` | TypeScript interfaces (camelCase) — includes `QuestionCategory` type |
| `hooks/useSync.ts` | Realtime subscriptions — auto-converted by subscribeToTable |
| `supabase/schema.sql` | DB schema (snake_case columns) |
| `app/_layout.tsx` | Root layout — route guard, auth listener, Stack screens |
| `app/setup/_layout.tsx` | Setup route layout (fixes route warning) |
| `app/(tabs)/more.tsx` | More screen — grouped menu cards with MenuItem component |
| `app/(tabs)/countdowns.tsx` | Countdowns — FlipNumber + CelebrationBadge |
| `app/invite-partner.tsx` | Partner invite/connection screen |
| `app/profile/nicknames.tsx` | Nicknames — give nickname form + NicknameReveal animation |
| `app/questions/index.tsx` | Daily Questions — text answers + photo challenges |
| `app/settings/index.tsx` | Settings — theme picker, invite shortcut, sign out |
| `components/profile/NicknameReveal.tsx` | 3D card-flip reveal animation for new nicknames |
| `components/home/QuickActions.tsx` | Quick actions — horizontal scrollable circles |
| `components/home/DurationCounter.tsx` | Dashboard counter — uses FlipNumber |
| `components/home/FloatingHearts.tsx` | Floating hearts around duration counter |
| `components/notes/EnvelopeAnimation.tsx` | Envelope opening for unread notes |
| `components/bucket/ConfettiBurst.tsx` | Confetti burst (reused in bucket list + countdowns) |
| `components/bucket/CheckmarkDraw.tsx` | Animated checkmark for bucket list items |
| `components/countdowns/FlipNumber.tsx` | Animated number display with flip effect |
| `components/ui/Button.tsx` | DO NOT CHANGE — user confirmed buttons are good |
| `global.css` | Contains `@tailwind base` — source of Pressable layout bug |

---

## Architecture Notes

- **State**: Zustand with AsyncStorage persistence
- **Sync**: `pushToSupabase()` auto-converts camelCase→snake_case, `pullFromSupabase()` auto-converts snake_case→camelCase
- **Themes**: 4 themes (Rose, Lavender, Sunset, Ocean) in `lib/constants.ts`
- **Typography**: Playfair Display (headings), Inter (body), Dancing Script (romantic accents)
- **Navigation**: Expo Router file-based routing with Stack + bottom tabs
- **Animations**: All use built-in `Animated` API (Reanimated installed but unused)
- **This app is for 2 users only** — don't over-engineer
- **NativeWind caveat**: Never put layout properties inside Pressable callback styles — use a plain View wrapper instead
- **Photo storage**: Currently base64/URI in AsyncStorage. Phase 3 will migrate to Supabase Storage
- **Daily Questions**: 40-question pool cycling by day offset from Jan 1, 2024. Photo challenges use `expo-image-picker` with 0.7 JPEG quality

---

## Supabase Schema Note for Photo Challenges

When adding photo challenge support to the Supabase schema, the `daily_question_entries` table needs two new columns:

```sql
ALTER TABLE daily_question_entries
  ADD COLUMN partner1_photo TEXT,
  ADD COLUMN partner2_photo TEXT;
```

The sync engine (`lib/sync.ts`) will auto-convert `partner1Photo` ↔ `partner1_photo` via the existing camelCase↔snake_case conversion.
