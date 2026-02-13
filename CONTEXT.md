# Session Context — Bug Fixes + UI Polish (Cute Theme)

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `main`
- **Status**: Uncommitted changes — ready for commit.

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

### Previous UI/UX Polish
- Toast.tsx — Lucide icons instead of emoji
- Input.tsx — `error?: string` prop with red border
- EmptyState.tsx — Gentle bobbing animation
- Card.tsx — `loading?: boolean` prop
- PageHeader.tsx — 44x44px touch target
- Pull-to-refresh on Notes, Memories, Countdowns
- NaN duration counter guard with fallback card
- SleepWake hardcoded colors → theme-aware
- Require cycle fix via `lib/store-reset.ts`

---

## What Was Done (This Session)

### 1. BUG FIX: Invalid date crash on Couple Profile screen (was APP CRASH)
- Added `isNaN(date.getTime())` guards to `formatDate()`, `formatDateShort()`, and `formatRelativeTime()` in `lib/dates.ts`
- All three functions now return `'Not set'` for null/undefined/invalid date strings instead of throwing `RangeError`

### 2. BUG FIX: camelCase → snake_case sync failure (was DATA LOSS)
- Added centralized `camelToSnake()` and `snakeToCamel()` utilities in `lib/sync.ts`
- Special alias map for non-standard field names: `imageUri` ↔ `image_url`, `couplePhoto` ↔ `couple_photo_url`, `photoUrl` ↔ `photo_url`
- `pushToSupabase()` now auto-converts camelCase records to snake_case before upserting
- `pullFromSupabase()` now auto-converts snake_case records to camelCase before returning
- `subscribeToTable()` realtime callbacks now auto-convert incoming records
- Removed manual snake_case mapping from `initial-load.ts` (thinking/sleepwake stores)
- Removed `mapThinkingRecord`/`mapSleepWakeRecord` from `hooks/useSync.ts`
- Already-fixed stores (thinking, sleepWake, location, partnerNotes) still work fine — already-snake_case keys pass through unchanged

### 3. BUG FIX: "setup" route warning
- Added `app/setup/_layout.tsx` (minimal Stack layout with ErrorBoundary)
- This makes `"setup"` a valid route name in Expo Router, matching the `<Stack.Screen name="setup">` in `app/_layout.tsx`

### 4. UI: QuickActions redesign (home screen)
- Replaced cramped 4-column grid with horizontal scrollable row
- Each action is a circular icon button (56x56) with label below
- Uses theme-colored soft background and accent border
- Feels like cute, tappable widgets that work on any screen size

### 5. UI: More screen redesign
- Replaced individual row cards with grouped card sections
- Items within each section share a single rounded card container with dividers
- Section headers use PlayfairDisplay bold font (no more all-caps)
- Added emoji alongside each menu item label for cute feel
- Section titles: "Fun Activities", "Stay Connected", "You & Me"
- Pressed state highlights with theme primarySoft color

---

## What Still Needs to Be Done

### Priority 1: Testing
- Test auth flows on real device
- Test data sync between two devices (camelCase fix should resolve all sync errors)
- Test offline queue and reconnection
- Verify Couple Profile screen no longer crashes with invalid dates

### Priority 2: Visual Consistency Review
- Review all screens for visual consistency with the "cute, clean, pleasant" directive
- Verify QuickActions horizontal scroll looks good on different screen sizes

### Priority 3: Phase 3 Features
- Two-device testing (note sync, photo upload, push notifications, distance)
- Conflict resolution

---

## Known Warnings (Non-Blocking)

1. **`expo-notifications` error** — Expected in Expo Go. Push notifications only work in standalone builds.
2. **SafeAreaView deprecation** — Warning about deprecated SafeAreaView. Already using `react-native-safe-area-context` in most places.
3. **Realtime send() fallback** — Supabase realtime auto-falling back to REST API.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/dates.ts` | Date formatting — now has invalid date guards |
| `lib/sync.ts` | Sync engine — centralized camelCase↔snake_case + offline queue |
| `lib/initial-load.ts` | Initial data pull — uses auto-converted camelCase data |
| `hooks/useSync.ts` | Realtime subscriptions — auto-converted by subscribeToTable |
| `lib/types.ts` | TypeScript interfaces (camelCase) |
| `supabase/schema.sql` | DB schema (snake_case columns) |
| `app/_layout.tsx` | Root layout — route guard, auth listener, Stack screens |
| `app/setup/_layout.tsx` | Setup route layout (fixes route warning) |
| `app/(tabs)/more.tsx` | More screen — grouped cards with emojis |
| `components/home/QuickActions.tsx` | Quick actions — horizontal scrollable circles |
| `components/ui/Button.tsx` | DO NOT CHANGE — user confirmed buttons are good |

---

## Architecture Notes

- **State**: Zustand with AsyncStorage persistence
- **Sync**: `pushToSupabase()` auto-converts camelCase→snake_case, `pullFromSupabase()` auto-converts snake_case→camelCase
- **Themes**: 4 themes (Rose, Lavender, Sunset, Ocean) in `lib/constants.ts`
- **Typography**: Playfair Display (headings), Inter (body), Dancing Script (romantic accents)
- **Navigation**: Expo Router file-based routing with Stack
- **This app is for 2 users only** — don't over-engineer
