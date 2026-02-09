# Phase 3: Connected Experience (Two Devices, Supabase)

> Status: **Implementation Complete** | Requires: Configuration + Testing
> Branch: `main`
> Date: February 2026

---

## What Was Built

### 3.1 Authentication System
- **Supabase Auth** with email/password (simple for a 2-user app)
- **Space system**: One space per couple, linked by 6-character invite codes
- **Role assignment**: First user becomes `partner1`, second becomes `partner2`
- **Session persistence**: AsyncStorage-backed, auto-refresh tokens
- **Auth gate**: Home screen redirects to auth flow if not signed in

**Files created:**
- `lib/supabase.ts` — Supabase client singleton
- `stores/useAuthStore.ts` — Auth state (signUp, signIn, signOut, createSpace, joinSpace, loadSpaceInfo)
- `app/auth/sign-in.tsx` — Email/password sign-in
- `app/auth/sign-up.tsx` — Email/password sign-up with confirm password
- `app/auth/create-space.tsx` — Create a new space or join existing
- `app/auth/join-space.tsx` — Enter invite code to join partner's space
- `components/auth/InviteCodeDisplay.tsx` — Large-letter invite code with copy button
- `components/auth/InviteCodeInput.tsx` — 6-character alphanumeric input

---

### 3.2 Realtime Sync Infrastructure
- **Optimistic local-first**: Stores update locally first, then push to Supabase as fire-and-forget
- **Offline queue**: Failed pushes are queued in AsyncStorage, flushed when connectivity returns
- **Realtime subscriptions**: `postgres_changes` on all 17 data tables, filtered by `space_id`
- **All 14 existing stores** updated with `syncRemoteInsert`, `syncRemoteUpdate`, `syncRemoteDelete` actions

**Files created:**
- `lib/sync.ts` — pushToSupabase, deleteFromSupabase, pullFromSupabase, offline queue, subscribeToTable
- `hooks/useSync.ts` — Sets up Realtime subscriptions for all tables when authenticated
- `hooks/useNetworkStatus.ts` — Online/offline detection via NetInfo

**Files modified:**
- All 14 Phase 1-2 stores (useNotesStore, useMemoriesStore, useCountdownsStore, useTimelineStore, useBucketStore, useMoodStore, useLocationStore, useNicknameStore, useCoupleStore, useProfileStore, useDateIdeasStore, useJournalStore, useQuestionsStore, useSongStore)

---

### 3.3 Cloud Photo Storage
- **Supabase Storage** bucket `couple-photos` with RLS
- **Space-scoped paths**: `{spaceId}/memories/{filename}.jpg`
- Reads local files using `expo-file-system` new `File` class API (SDK 54)
- Falls back to local URI if upload fails (graceful degradation)
- Photo delete utility for cleanup

**Files created:**
- `lib/photo-storage.ts` — uploadPhoto, deletePhoto, isRemoteUrl

**Files modified:**
- `app/memories/new.tsx` — Uploads photo before saving, shows loading state

---

### 3.4 "Thinking of You" Tap
- One-tap heartbeat button on the home screen
- Animated heart pulse on send
- Sends push notification to partner
- Tracks daily count ("3 today")
- Partner sees a slide-down notification overlay in real time

**Files created:**
- `stores/useThinkingStore.ts` — Tap records, daily count, push notification on send
- `components/home/ThinkingOfYouButton.tsx` — Animated tap button
- `components/home/ThinkingOfYouReceiver.tsx` — Slide-down overlay when partner taps

---

### 3.5 Virtual Touch Screen
- Full-screen canvas where both partners touch simultaneously
- Uses **Supabase Realtime broadcast** (ephemeral channel messages, not DB writes)
- Two-color indicators: pink (you) and purple (partner)
- Heart emoji blooms at overlap points (distance < 60px)
- Throttled to ~15fps for performance

**Files created:**
- `app/touch/index.tsx` — Touch screen route
- `app/touch/_layout.tsx` — Stack layout
- `components/touch/TouchCanvas.tsx` — PanResponder + broadcast channel
- `components/touch/HeartBloom.tsx` — Floating heart animation

---

### 3.6 Sleep/Wake Sync (LDR Feature)
- Toggle on home screen: "Going to sleep..." / "Good morning!"
- Dark (moon) or light (sun) visual state
- Partner sees your current status on their home screen
- Push notification sent on status change

**Files created:**
- `stores/useSleepWakeStore.ts` — Status per partner, latest-only storage
- `components/home/SleepWakeToggle.tsx` — Moon/Sun toggle
- `components/home/PartnerSleepStatus.tsx` — Shows partner's status

---

### 3.7 Live Distance Tracking
- **Foreground GPS tracking** via `expo-location` every 30 seconds
- Reverse geocoding for city names
- Location synced to Supabase `location_entries` table
- Distance screen updated with GPS status indicator
- Manual override still available as fallback

**Files created:**
- `hooks/useLocationTracking.ts` — Foreground GPS + reverse geocode + periodic updates

**Files modified:**
- `app/distance/index.tsx` — Added GPS status badge, uses useLocationTracking hook

---

### 3.8 Push Notifications
- `expo-notifications` + `expo-device` for token registration
- Push tokens stored in `space_members.push_token`
- Sends via Expo Push API (`exp.host/--/api/v2/push/send`)
- Foreground notifications shown as alerts
- Tap-to-navigate: notifications with a `route` data field open that screen
- Android notification channel with custom vibration and color

**Files created:**
- `lib/notifications.ts` — Register, save token, get partner token, send push
- `hooks/useNotifications.ts` — Foreground listener + tap handler

**Currently sending notifications from:**
- Thinking of You taps
- Sleep/Wake status changes

---

### 3.9 Weekly Recap
- Aggregates data from all stores for the previous week (Sunday-Saturday)
- Stats: love notes, memories, bucket items completed, thinking taps, partner notes, songs
- Most common mood emoji
- Auto-generated highlight summary text
- Dashboard card on home screen (hidden if no activity)
- Full detail screen with stat grid

**Files created:**
- `lib/weekly-recap.ts` — generateWeeklyRecap utility
- `components/home/WeeklyRecapCard.tsx` — Home screen summary card
- `app/recap/index.tsx` — Full recap detail screen
- `app/recap/_layout.tsx` — Stack layout

---

### Partner Notes (Bonus Feature)
- Notes *about* your partner (not messages *to* them) — distinct from Love Notes
- Categories: Things I Love, Noticed Today, Why You're Amazing, Gratitude, Memories of Us
- **Discovery mechanic**: Notes about you appear as sealed cards until you tap to reveal
- Undiscovered count badge
- Two tabs: "My Notes About Them" / "About Me"

**Files created:**
- `stores/usePartnerNotesStore.ts` — CRUD, discovery, remote field mapping
- `app/partner-notes/index.tsx` — Two-tab screen with FlatList
- `app/partner-notes/new.tsx` — Category picker + multiline editor
- `app/partner-notes/[id].tsx` — Detail view with auto-discovery (800ms delay)
- `components/partner-notes/CategoryPicker.tsx` — Horizontal scrollable chips
- `components/partner-notes/PartnerNoteCard.tsx` — Sealed/discovered card states
- `components/partner-notes/NoteCounter.tsx` — Undiscovered count badge

---

### Database Schema
- `supabase/schema.sql` — Complete schema with 19 tables, RLS policies, storage bucket, and Realtime publication
- Helper function `user_space_ids()` for DRY RLS policy definitions

### Packages Added
- `@supabase/supabase-js` — Supabase client
- `@react-native-community/netinfo` — Network status
- `expo-notifications` — Push notifications
- `expo-device` — Device detection for push
- `expo-location` — GPS tracking
- `expo-clipboard` — Copy invite codes

---

## What Was Completed (Previously "Still Needs to Be Done")

### Critical (Must-Do Before Testing) — All Done

1. ~~**Add Supabase anon key to `.env`**~~ — **DONE** (legacy JWT key configured)
2. **Run the database schema** — **MANUAL STEP: Go to Supabase SQL Editor and run `supabase/schema.sql`**
3. ~~**Add Expo project ID to `.env`**~~ — **DONE** (`EXPO_PUBLIC_PROJECT_ID=60a5119d-bbad-4d2e-9153-9c5f61670649`)
4. ~~**Add `expo-location` plugin to `app.json`**~~ — **DONE**

### Important (Before Real Use) — All Done

5. ~~**Initial data pull on login**~~ — **DONE** (`lib/initial-load.ts` created, wired in `_layout.tsx`)
6. ~~**Local-to-cloud data migration**~~ — **DONE** (`lib/migration.ts` created, runs after initial load)
7. ~~**Additional push notification triggers**~~ — **DONE** (love notes, memories, nicknames, partner notes)
8. ~~**Couple/profile store subscriptions in useSync.ts**~~ — **DONE** (added `couple_profiles` + `individual_profiles` channels)

### Nice to Have (Polish) — Partially Done

9. **Sync status indicator** — Not yet implemented
10. **Error toasts** — Not yet implemented
11. **Loading states** — Not yet implemented
12. **Conflict resolution** — Not yet implemented (last-write-wins via upsert)
13. ~~**Sign out cleanup**~~ — **DONE** (all 17 stores reset on sign out)

---

## Testing Checklist

### Phase 1 — Local Features (Verify Still Working)

- [ ] **Onboarding wizard**: Create couple profile, set names, anniversary, theme
- [ ] **Love Notes**: Write, read, mark as read, delete
- [ ] **Memories**: Add photo, caption, date, location. View in grid
- [ ] **Countdowns**: Add event, see countdown timer, recurring events
- [ ] **Nicknames**: Add nickname, set active, see on home screen
- [ ] **Duration counter**: Shows time since anniversary on home screen
- [ ] **Daily quote**: Displays on home screen
- [ ] **Theme system**: Switch between rose, lavender, sunset, ocean

### Phase 2 — Enhanced Features (Verify Still Working)

- [ ] **Timeline**: Add milestones, view chronologically
- [ ] **Date Ideas**: Browse, favorite, add custom ideas
- [ ] **Bucket List**: Add items by category, mark completed
- [ ] **Mood Tracker**: Log daily mood emoji, view history
- [ ] **Journal Letters**: Write weekly letters, timed reveal
- [ ] **Daily Questions**: Answer prompts, see partner's answer
- [ ] **Song Dedications**: Add songs to shared playlist
- [ ] **Status Board**: View/edit profiles, love language, fun facts
- [ ] **Distance**: Manual lat/lng entry, distance calculation

### Phase 3 — Connected Features (New)

#### Authentication
- [ ] Sign up with email/password on Device A
- [ ] Create a space, see invite code
- [ ] Sign up on Device B with different email
- [ ] Join space using invite code
- [ ] Both devices see the same space
- [ ] Sign out on one device, verify redirect to auth screen
- [ ] Restart app, verify session persists

#### Realtime Sync
- [ ] Add a love note on Device A, verify it appears on Device B within seconds
- [ ] Add a memory on Device A, verify it syncs
- [ ] Delete a countdown on Device B, verify it disappears on Device A
- [ ] Edit a bucket list item on one device, verify update on the other
- [ ] Log mood on Device A, check Device B sees it
- [ ] Answer a question on one device, see partner's answer on the other

#### Offline Resilience
- [ ] Turn off wifi on Device A
- [ ] Add a love note while offline
- [ ] Turn wifi back on
- [ ] Verify the note syncs to Device B after reconnection

#### Cloud Photos
- [ ] Add a memory with photo on Device A
- [ ] Verify the photo appears on Device B (loaded from Supabase Storage URL)
- [ ] Delete the memory, verify photo is cleaned up

#### Push Notifications
- [ ] Tap "Thinking of You" on Device A, verify Device B receives a push notification
- [ ] Toggle sleep status on Device A, verify Device B gets "Goodnight" notification
- [ ] Tap the notification on Device B, verify it opens the app

#### Thinking of You
- [ ] Tap the heart button on home screen
- [ ] Verify animation plays
- [ ] Verify "Sent!" text appears temporarily
- [ ] Verify daily counter increments
- [ ] Verify partner sees the slide-down overlay

#### Virtual Touch
- [ ] Open Touch screen on both devices
- [ ] Touch on Device A, verify pink circle appears
- [ ] Touch on Device B, verify purple circle appears on Device A
- [ ] Overlap touches, verify heart emoji blooms appear
- [ ] Release touch, verify indicators fade out

#### Sleep/Wake
- [ ] Tap "Going to sleep" toggle on Device A
- [ ] Verify Device B shows "Partner is sleeping" with moon icon
- [ ] Tap again to wake up
- [ ] Verify Device B updates to "Partner is awake" with sun icon

#### Distance Tracking
- [ ] Open Distance screen, grant location permission
- [ ] Verify GPS status shows "GPS active" with city name
- [ ] Verify partner's location updates on the other device
- [ ] Verify distance calculation is accurate

#### Partner Notes
- [ ] Write a note about your partner (choose a category)
- [ ] Verify it appears in "My Notes About Them" tab
- [ ] On partner's device, check "About Me" tab
- [ ] Verify note appears as a sealed card
- [ ] Tap the sealed card to discover/reveal it
- [ ] Verify undiscovered count badge decreases
- [ ] Delete a note you wrote, verify it disappears from both devices

#### Weekly Recap
- [ ] (Requires a week of data) Verify WeeklyRecapCard appears on home screen
- [ ] Tap the card, verify full recap screen opens with stats
- [ ] Verify stats match actual data from the past week

### Cross-Cutting Concerns
- [ ] **No TypeScript errors**: Run `npx tsc --noEmit` — should return 0 errors
- [ ] **No crash on cold start**: Kill app, reopen, verify no crash
- [ ] **Theme persists**: Change theme, restart app, verify theme is maintained
- [ ] **Auth persists**: Close app, reopen, verify still signed in
- [ ] **Navigation works**: All routes accessible from More menu and Quick Actions
- [ ] **Back button works**: All screens with "showBack" header navigate back correctly

---

## Architecture Notes

### Sync Flow
```
User Action → Local Store Update (instant) → pushToSupabase (async, fire-and-forget)
                                                  ↓ (if offline)
                                            Offline Queue (AsyncStorage)
                                                  ↓ (when online)
                                            flushPendingOperations()

Partner's Device ← Supabase Realtime (postgres_changes) ← Supabase DB
                      ↓
              syncRemoteInsert/Update/Delete (local store update)
```

### Auth Flow
```
App Start → Check session → No session? → /auth/sign-in
                          → Has session, no space? → /auth/create-space
                          → Has session + space, not onboarded? → /setup
                          → All good → Home screen
```

### Space Pairing
```
Partner 1: Sign up → Create space → Gets 6-char invite code → Share with Partner 2
Partner 2: Sign up → Join space → Enter invite code → Auto-assigned partner2 role
```
