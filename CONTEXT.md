# Session Context — Animations, NativeWind Bug Sweep & Polish

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `main`
- **Status**: Clean working tree, 3 commits ahead of origin (not yet pushed).
- **Last 3 commits**:
  - `624e560` — Add celebration animation when countdown reaches zero
  - `3cfba02` — Add delightful animations across four features
  - `2812c4f` — Fix NativeWind Pressable layout bug across 5 components

---

## What Was Done (This Session — Slot Machine Animation)

### Slot-Machine Animation for "Surprise Me" Date Picker

Added a slot-machine style animation to the "Surprise Me" button in `app/dates/index.tsx`. Previously, tapping "Surprise Me" instantly showed a random date idea. Now it:

1. **Cycles through 12 random ideas** with a flickering opacity animation, showing "SHUFFLING..." label
2. **Gradually slows down** (80ms → 250ms between cycles) for that classic slot-machine feel
3. **Reveals the final pick** with a spring scale-up + fade-in animation
4. **Prevents double-taps** during the spin (`isSpinning` guard)

Uses the same `Animated` API pattern as all other animations in the codebase. No new dependencies.

### Checkmark Draw Animation for Bucket List

Added an animated checkmark to `app/bucket-list/index.tsx` with a new `components/bucket/CheckmarkDraw.tsx` component. When completing a bucket list item:

1. **Circle fills** with a scale animation (0 → 1) over 200ms
2. **Checkmark draws** itself with a spring pop + rotation (100ms delay after circle)
3. **Confetti fires** 500ms later, after the checkmark is fully drawn

Previously the checkmark appeared instantly and confetti fired simultaneously. Now there's a satisfying sequential reveal: fill → draw → burst.

---

## What Was Done (Previous Session)

### 1. NativeWind Pressable Bug — Full Codebase Sweep

Audited **every `.tsx` file** in the project for the NativeWind + Pressable callback layout bug. Fixed all 5 remaining files that had layout properties inside `({ pressed }) => ({...})` callback styles:

| File | What Was Broken |
|------|----------------|
| `components/home/SleepWakeToggle.tsx` | `flexDirection: 'row'` in callback — toggle stacking vertically |
| `app/dates/index.tsx` | "Surprise Me" button row layout broken |
| `components/home/QuickActions.tsx` | `alignItems` + `gap` in callback — icons misaligned |
| `components/ui/Card.tsx` | `cardStyle` spread in callback — pressable cards losing styles |
| `components/partner-notes/PartnerNoteCard.tsx` | All card styling in callback — notes cards losing layout |

**Verified**: No other files in the codebase have this bug. All remaining Pressables either use static `style={{...}}` (safe) or already follow the View wrapper pattern.

### 2. Four Delightful Animations Added

| Animation | Component | Where Used |
|-----------|-----------|------------|
| **Envelope opening** | `components/notes/EnvelopeAnimation.tsx` | `app/notes/[id].tsx` — plays when opening an unread note. Flap lifts, note slides out, envelope fades. |
| **Confetti burst** | `components/bucket/ConfettiBurst.tsx` | `app/bucket-list/index.tsx` — 12 colored particles explode outward when checking off an item. |
| **Flip number** | `components/countdowns/FlipNumber.tsx` | `app/(tabs)/countdowns.tsx` + `components/home/DurationCounter.tsx` — numbers slide and fade when changing. Enclosed in a bordered card-style container. |
| **Floating hearts** | `components/home/FloatingHearts.tsx` | `app/(tabs)/index.tsx` — 5 hearts float gently upward around the "Together for X days" counter on the home dashboard. |

### 3. Countdown Celebration Animation

When a countdown reaches zero (`isExpired`), the static "It's here!" text was replaced with a `CelebrationBadge` component inside `app/(tabs)/countdowns.tsx` that:
- Shows a bouncing party emoji (scale 0 → 1.2 → 1)
- Fires a confetti burst (reuses `ConfettiBurst` component)

### 4. Also Committed (From Previous Session)

- `app/invite-partner.tsx` — Partner invite/connection screen
- `app/setup/_layout.tsx` — Fixes "setup" route warning

---

## What Was Done (Earlier Sessions)

### Button Component Rewrite
- Replaced `Pressable` with `TouchableOpacity` in `components/ui/Button.tsx`
- Buttons render correctly on Android (solid background, white text)

### Auth System (Fully Working)
- Sign-in, sign-up, forgot password, reset password, email confirmation screens
- Fixed RLS infinite recursion on `space_members` using `user_space_ids()` SECURITY DEFINER
- Fixed `onAuthStateChange` race condition (skip SIGNED_IN during `signIn()` loading)
- Post-login navigation to `/auth/create-space` when no spaceId

### Bug Fixes
- **Invalid date crash**: `isNaN(date.getTime())` guards in `lib/dates.ts`
- **camelCase→snake_case sync failure**: Centralized conversion in `lib/sync.ts` with alias maps
- **"setup" route warning**: Added `app/setup/_layout.tsx`

### UI Polish
- Toast.tsx — Lucide icons instead of emoji
- Input.tsx — `error?: string` prop with red border
- EmptyState.tsx — Gentle bobbing animation
- Card.tsx — `loading?: boolean` prop
- PageHeader.tsx — 44x44px touch target
- Pull-to-refresh on Notes, Memories, Countdowns
- NaN duration counter guard with fallback card
- SleepWake hardcoded colors → theme-aware
- Require cycle fix via `lib/store-reset.ts`
- QuickActions redesign — horizontal scrollable row of 56px circular icon buttons

### More Screen & Invite Partner
- Full rewrite of `more.tsx` with MenuItem component and MenuCard groups
- Invite partner screen with Supabase integration, clipboard, share
- Settings screen enhancements (invite shortcut, sign out)

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

---

## What Still Needs to Be Done

### Priority 1: Real Device Testing
- [ ] Test auth flows on real device (sign up, sign in, forgot password)
- [ ] Test invite partner flow end-to-end on two devices
- [ ] Test data sync between two devices (camelCase fix should resolve sync errors)
- [ ] Test offline queue and reconnection behavior
- [ ] Verify Couple Profile screen no longer crashes with invalid dates
- [ ] Test all new animations on device (envelope, confetti, flip numbers, floating hearts)
- [ ] Verify NativeWind fixes render correctly on Android and iOS

### Priority 2: Phase 3 Completion (Supabase)
- [ ] Conflict resolution for simultaneous edits (currently last-write-wins)
- [ ] Cloud photo storage — migrate images from AsyncStorage to Supabase Storage
- [ ] Photo compression + thumbnail generation
- [ ] Push notifications for key events (new note, thinking of you, countdown reached zero)
- [ ] "This Day in Our History" feature (Phase 4.2 in APP_PLAN.md)

### Priority 3: Remaining Features
- [ ] Next Visit planner (LDR feature — Phase 1.7 in APP_PLAN.md)
- [ ] Love Language Quiz (Phase 4.3)
- [ ] Export/PDF Yearbook (Phase 4.5)
- [ ] Watch Party / Sync Timer (Phase 4.4)
- [ ] Spotify Shared Playlist integration (Phase 4.7)

### Priority 4: Additional Polish
- [x] Slot-machine animation for "Surprise Me" random date picker
- [x] Satisfying checkmark draw animation on bucket list (before confetti)
- [ ] Nickname card-flip reveal animation
- [ ] Photo challenge feature in Daily Questions

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
| Daily Questions | `app/questions/` | `useQuestionsStore` |
| Song Dedications | `app/songs/` | `useSongStore` |
| Status Board | `app/status/` | `useStatusStore` |
| Letter Box (Journal) | `app/journal/` | `useJournalStore` |
| Partner Notes | `app/partner-notes/` | `usePartnerNotesStore` |
| Virtual Touch | `app/touch/` | — (realtime) |
| Distance Tracker | `app/distance/` | `useLocationStore` |
| Couple Profile | `app/profile/couple.tsx` | `useCoupleStore` |
| Individual Profiles | `app/profile/[partner].tsx` | `useProfileStore` |
| Nicknames | `app/profile/nicknames.tsx` | `useNicknameStore` |
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

### Codebase Stats
- **120 source files** (`.ts` + `.tsx`)
- **48 routes** (Expo Router auto-discovery)
- **18+ Zustand stores** with AsyncStorage persistence
- **4 color themes**: Rose, Lavender, Sunset, Ocean
- **3 font families**: Playfair Display, Inter, Dancing Script
- **9 animation components** using React Native Animated API
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
| `hooks/useSync.ts` | Realtime subscriptions — auto-converted by subscribeToTable |
| `lib/types.ts` | TypeScript interfaces (camelCase) |
| `supabase/schema.sql` | DB schema (snake_case columns) |
| `app/_layout.tsx` | Root layout — route guard, auth listener, Stack screens |
| `app/setup/_layout.tsx` | Setup route layout (fixes route warning) |
| `app/(tabs)/more.tsx` | More screen — grouped menu cards with MenuItem component |
| `app/(tabs)/countdowns.tsx` | Countdowns — FlipNumber + CelebrationBadge |
| `app/invite-partner.tsx` | Partner invite/connection screen |
| `app/settings/index.tsx` | Settings — theme picker, invite shortcut, sign out |
| `components/home/QuickActions.tsx` | Quick actions — horizontal scrollable circles |
| `components/home/DurationCounter.tsx` | Dashboard counter — uses FlipNumber |
| `components/home/FloatingHearts.tsx` | Floating hearts around duration counter |
| `components/notes/EnvelopeAnimation.tsx` | Envelope opening for unread notes |
| `components/bucket/ConfettiBurst.tsx` | Confetti burst (reused in bucket list + countdowns) |
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
