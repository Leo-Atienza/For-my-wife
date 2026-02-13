# Session Context — UI Polish, Invite Partner Feature & NativeWind Fix

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `main`
- **Status**: Uncommitted changes — 2 modified files + 2 new files (see below).

### Uncommitted Changes

| File | Status | What Changed |
|------|--------|-------------|
| `app/(tabs)/more.tsx` | Modified | Full rewrite — MenuItem component, NativeWind fix, bigger elements, invite partner item |
| `app/settings/index.tsx` | Modified | Added invite partner shortcut card, sign out button, NativeWind fix |
| `app/invite-partner.tsx` | **New** | Partner invite/connection screen with Supabase integration |
| `app/setup/_layout.tsx` | **New** | Minimal Stack layout to fix "setup" route warning |

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

### Bug Fixes (Previous Session)
- **Invalid date crash**: Added `isNaN(date.getTime())` guards to `formatDate()`, `formatDateShort()`, `formatRelativeTime()` in `lib/dates.ts` — returns `'Not set'` instead of throwing `RangeError`
- **camelCase→snake_case sync failure**: Centralized `camelToSnake()` / `snakeToCamel()` in `lib/sync.ts` with alias maps for non-standard fields (`imageUri` ↔ `image_url`, `couplePhoto` ↔ `couple_photo_url`, `photoUrl` ↔ `photo_url`). All push/pull/subscribe operations auto-convert.
- **"setup" route warning**: Added `app/setup/_layout.tsx` (minimal Stack + ErrorBoundary)

### UI Polish (Previous Session)
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

---

## What Was Done (This Session)

### 1. More Screen Complete Rewrite
- **Problem**: Menu items were stacking vertically instead of horizontal rows on device
- **Root cause**: NativeWind's `@tailwind base` (in `global.css`) overrides `flexDirection: 'row'` when applied inside Pressable's callback style function `style={({ pressed }) => ({...})}`
- **Fix**: Extracted all layout into a plain `View` inside Pressable; Pressable only handles opacity/background on press
- **New `MenuItem` component** in `more.tsx` follows the safe pattern:
  ```tsx
  <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
    <View style={{ flexDirection: 'row', alignItems: 'center', ... }}>
      {/* content here */}
    </View>
  </Pressable>
  ```
- **Bigger elements**: icon container 44×44px, icon size 22, label 16px, subtitle 13px
- **MenuCard component**: groups items with rounded card, shared border, dividers
- **3 sections**: "Fun Activities", "Stay Connected", "You & Me"
- Added ChevronRight indicator on every item
- Added "Invite Partner" menu item under "You & Me" section

### 2. Invite Partner Feature (`app/invite-partner.tsx`)
- **NEW SCREEN** — allows partners to connect their devices
- Queries `space_members` count from Supabase to show connection status
- **Connected state**: green checkmark, partner name, "2 of 2 partners joined"
- **Waiting state**: amber indicator, "Waiting for your partner", "1 of 2 joined"
- Invite code display with dashed border styling
- Copy to clipboard (Expo Clipboard) and Share (React Native Share API) buttons
- "How it works" 4-step guide
- Refresh status button with ActivityIndicator
- Handles edge case: partner2 (who joined via code) doesn't have the invite code
- All buttons use the View wrapper pattern to avoid NativeWind bug

### 3. Settings Screen Enhancements (`app/settings/index.tsx`)
- **Invite Partner shortcut card** at top with UserPlus icon, ring emoji, and ChevronRight
- **Account section** with Sign Out button (Alert confirmation before signing out)
- Sign Out calls `useAuthStore.signOut()` which resets all stores
- Both new interactive elements use View wrapper pattern for NativeWind compatibility

---

## Critical Pattern: NativeWind + Pressable Layout Bug

**ALWAYS follow this pattern when using Pressable with row layouts:**

```tsx
// CORRECT — layout on plain View, press state on Pressable
<Pressable
  onPress={handlePress}
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? theme.primarySoft : 'transparent',
  })}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* content */}
  </View>
</Pressable>

// WRONG — NativeWind will override flexDirection
<Pressable
  onPress={handlePress}
  style={({ pressed }) => ({
    flexDirection: 'row',  // ← THIS WILL BE OVERRIDDEN
    opacity: pressed ? 0.7 : 1,
  })}
>
  {/* content will stack vertically on device */}
</Pressable>
```

**Root cause**: `@tailwind base` in `global.css` sets default styles that override callback-style properties on Pressable.

### Files already fixed:
- `app/(tabs)/more.tsx` ✅
- `app/invite-partner.tsx` ✅
- `app/settings/index.tsx` ✅

### Files that still have this bug:
- `components/home/SleepWakeToggle.tsx` ⚠️
- `app/dates/index.tsx` ⚠️

---

## What Still Needs to Be Done

### Priority 1: Remaining NativeWind Bug Fixes
- [ ] Fix `flexDirection: 'row'` on Pressable in `SleepWakeToggle.tsx`
- [ ] Fix `flexDirection: 'row'` on Pressable in `app/dates/index.tsx`
- [ ] Audit all other files for the same pattern (search for `flexDirection` inside Pressable callback styles)

### Priority 2: Testing
- [ ] Test auth flows on real device (sign up, sign in, forgot password)
- [ ] Test invite partner flow end-to-end on two devices
- [ ] Test data sync between two devices (camelCase fix should resolve sync errors)
- [ ] Test offline queue and reconnection behavior
- [ ] Verify Couple Profile screen no longer crashes with invalid dates

### Priority 3: Phase 3 Completion
- [ ] Conflict resolution for simultaneous edits (currently last-write-wins)
- [ ] Cloud photo storage — migrate images from AsyncStorage to Supabase Storage
- [ ] Photo compression + thumbnail generation
- [ ] Push notifications for key events (new note, thinking of you, countdown reached zero)
- [ ] "This Day in Our History" feature

### Priority 4: Polish & Missing Features
- [ ] Envelope opening animation for love notes (planned but not implemented)
- [ ] Confetti animation for bucket list completion
- [ ] Number flip animation for countdown timer digits
- [ ] Heart floating micro-interactions on dashboard
- [ ] Next Visit planner (LDR feature from Phase 1.7)
- [ ] Love Language Quiz (Phase 4)
- [ ] Export/PDF Yearbook (Phase 4)

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

### Codebase Stats
- **115 source files** (`.ts` + `.tsx`)
- **48 routes** (Expo Router auto-discovery)
- **18+ Zustand stores** with AsyncStorage persistence
- **4 color themes**: Rose, Lavender, Sunset, Ocean
- **3 font families**: Playfair Display, Inter, Dancing Script

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
| `app/invite-partner.tsx` | Partner invite/connection screen |
| `app/settings/index.tsx` | Settings — theme picker, invite shortcut, sign out |
| `components/home/QuickActions.tsx` | Quick actions — horizontal scrollable circles |
| `components/ui/Button.tsx` | DO NOT CHANGE — user confirmed buttons are good |
| `global.css` | Contains `@tailwind base` — source of Pressable layout bug |

---

## Architecture Notes

- **State**: Zustand with AsyncStorage persistence
- **Sync**: `pushToSupabase()` auto-converts camelCase→snake_case, `pullFromSupabase()` auto-converts snake_case→camelCase
- **Themes**: 4 themes (Rose, Lavender, Sunset, Ocean) in `lib/constants.ts`
- **Typography**: Playfair Display (headings), Inter (body), Dancing Script (romantic accents)
- **Navigation**: Expo Router file-based routing with Stack + bottom tabs
- **This app is for 2 users only** — don't over-engineer
- **NativeWind caveat**: Never put layout properties (`flexDirection`, etc.) inside Pressable callback styles — use a plain View wrapper instead
