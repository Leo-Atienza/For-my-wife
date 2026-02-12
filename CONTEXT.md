# Session Context — Auth Login Fix + RLS Policy Fix

> Hand-off document for the next Claude agent. Read this FIRST, then CLAUDE.md, then APP_PLAN.md.

## Current Branch & Git State

- **Branch**: `main`
- **Status**: All changes committed. Clean working tree.

## What Was Done (Previous Sessions)

### Button Component Rewrite
- Replaced `Pressable` with `TouchableOpacity` in `components/ui/Button.tsx`
- Buttons now render correctly on Android — solid background, white text
- Button text color issue is **resolved**

### Auth Screen Polish
- Sign-in: centered layout, bigger heart/title, form spacing
- Sign-up: added "← Sign In" back button
- Forgot password, reset password, email confirmation screens added
- Not-found catch-all route added

### Ngrok Fix
- Installed `@expo/ngrok` (was missing, caused `--tunnel` crash)

## What Was Done (This Session)

### 1. Login Flow — Fixed (Multiple Issues)

**Problem**: User could not log in even with correct credentials. Button would load briefly then reset.

**Root cause 1 — RLS infinite recursion on `space_members`**:
The SELECT policy on `space_members` referenced itself: `USING (space_id IN (SELECT space_id FROM space_members ...))`. This caused PostgreSQL error `42P17: infinite recursion detected`.

**Fix**: Replaced the policy to use the existing `user_space_ids()` SECURITY DEFINER function:
```sql
DROP POLICY "Users can read space members" ON space_members;
CREATE POLICY "Users can read space members"
  ON space_members FOR SELECT
  USING (space_id IN (SELECT user_space_ids()));
```

**Root cause 2 — RLS on `spaces` blocked INSERT...RETURNING**:
The `spaces` SELECT policy only allowed reading spaces you're a member of. But when creating a space, the `.select().single()` call needs to read the just-created row before the user has joined as a member.

**Fix**: Added `created_by = auth.uid()` to the SELECT policy:
```sql
DROP POLICY "Users can read their spaces" ON spaces;
CREATE POLICY "Users can read their spaces"
  ON spaces FOR SELECT
  USING (
    created_by = auth.uid()
    OR id IN (SELECT user_space_ids())
  );
```

**Root cause 3 — `onAuthStateChange` race condition**:
The listener in `_layout.tsx` called `setSession()` immediately on `SIGNED_IN`, before `signIn()` had finished loading space info. The route guard saw session without spaceId and stayed on the auth screen.

**Fix** (`_layout.tsx`): Skip `SIGNED_IN` events when `useAuthStore.getState().isLoading` is true (meaning `signIn()` is mid-flight and handling session + space info atomically).

**Root cause 4 — `signIn()` didn't handle `space_members` query failure gracefully**:
If the query threw, the outer catch set an error but never set the session — the user was authenticated in Supabase but the app didn't know.

**Fix** (`useAuthStore.ts`): Wrapped the `space_members` query in its own try/catch. Session is always set regardless of whether space info loads.

**Root cause 5 — Post-login navigation when no space exists**:
After successful sign-in with no space, the route guard saw `session: true, spaceId: null` but since the user was already in the auth group, it did nothing.

**Fix** (`sign-in.tsx`): After successful sign-in, if `spaceId` is null, explicitly navigate to `/auth/create-space`.

### 2. EAS Build Config
- Created `eas.json` with `development`, `preview` (APK), and `production` (AAB) profiles
- To build APK: `npx eas-cli build -p android --profile preview`

### 3. Schema Updated
- `supabase/schema.sql` now has the corrected RLS policies so future database recreations won't have the recursion bug

## What Still Needs to Be Done

### UI/UX Polish
- Review and improve screens across the app (deferred — user wants to do this later)

### Test Auth Flows on Device
- Sign up → "Check Your Email" → "Go to Sign In" → sign in works
- Sign in with wrong password → error shows, button re-enables
- Forgot Password → sends reset link
- Navigate between sign-in ↔ sign-up → smooth transitions
- Test on Android specifically

### Phase 3 Two-Device Testing (After Auth is Solid)
- Note sync between two devices
- Offline queue (airplane mode → create note → reconnect)
- Photo upload + compression + retry
- Push notifications with route navigation
- Distance tracking with GPS permissions
- Conflict resolution (both devices edit same note)

Requires **two physical devices** (or device + emulator) signed into the same couple space.

## Known Risks

1. **`expo-image-manipulator` v14** — uses legacy `manipulateAsync` API. May throw at runtime if API changed.
2. **`File` from `expo-file-system`** — requires Expo SDK 52+. App is on SDK 54, should be fine.
3. **`updatedAt` backward compat** — old persisted data won't have `updatedAt`. `isNewerRecord` helper handles this.
4. **Deep link redirect chain** — In Expo Go, the scheme is `exp+us-couple-app://` not `us-couple-app://`. May need adjustment for testing vs standalone builds.
5. **The `.env` file contains real credentials** — do NOT commit it. It should be in `.gitignore`.
6. **`expo-notifications` warning** — Android Push notifications show an error banner in Expo Go. This is expected — push notifications only work in standalone builds, not Expo Go.
7. **Other RLS policies may have similar issues** — all data table policies use `user_space_ids()` which is SECURITY DEFINER, so they should be fine. But watch for errors on first use of each feature.

## Key Files Reference

| File | Purpose |
|------|---------|
| `components/ui/Button.tsx` | Button component — uses TouchableOpacity |
| `app/auth/sign-in.tsx` | Sign in screen — navigates to create-space if no spaceId |
| `app/auth/sign-up.tsx` | Sign up screen (has back button) |
| `app/auth/create-space.tsx` | Create or join a couple space |
| `app/auth/forgot-password.tsx` | Forgot password flow |
| `app/auth/reset-password.tsx` | Reset password form |
| `app/auth/confirm.tsx` | Email confirmation landing |
| `app/_layout.tsx` | Root layout — route guard, auth state listener, deep link handler |
| `stores/useAuthStore.ts` | Auth state — signIn loads space info before setting session |
| `hooks/useTheme.ts` | Theme hook — falls back to 'rose' when no profile exists |
| `lib/constants.ts` | Theme colors — rose primary is `#E11D48` |
| `supabase/schema.sql` | Database schema with corrected RLS policies |
| `eas.json` | EAS build config (preview = APK, production = AAB) |
