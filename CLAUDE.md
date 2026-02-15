# "Us" — Couple's App | Agent Instructions

> Root instruction file for all Claude agents. Read this FIRST.

## What This Project Is

A private, intimate **React Native + Expo** mobile app for a couple (2 users only).
It is NOT a website. It is NOT a web app. It is a **native mobile app** built with Expo.

## Read Order

1. **This file** (CLAUDE.md) — rules, tech stack, patterns
2. **CONTEXT.md** — current state (stores, routes, stats)
3. **APP_PLAN.md** — feature plans and data models (only if building new features)
4. **DECISIONS.md** — architectural rationale (only if questioning a pattern)
5. **`.claude/skills/`** — domain-specific guidance (only the relevant one)

## Critical Rules

1. **Never introduce web-only technology.** No Next.js, no Vercel, no browser-only APIs.
2. **This app is for 2 users only.** Do not over-engineer for scale.
3. **TypeScript is mandatory.** No `any` types. No `@ts-ignore`. All interfaces in `lib/types.ts`.
4. **The aesthetic is romantic, warm, and intimate.** See `.claude/skills/design-system.md`.
5. **Do NOT update CONTEXT.md** unless explicitly told to.
6. **Do NOT refactor working code** unless explicitly asked.
7. **Do NOT create test files** unless explicitly asked.
8. **Always run `npx tsc --noEmit`** after changes to verify zero TypeScript errors.
9. **Run `npx expo export --platform ios`** to verify the bundle compiles.

## Tech Stack (Do Not Change)

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (SDK 54) |
| Language | TypeScript (strict mode) |
| Styling | NativeWind (Tailwind CSS for RN) |
| State | Zustand + AsyncStorage (`zustandStorage` wrapper) |
| Navigation | Expo Router (file-based) |
| Animations | React Native Animated API (`useNativeDriver: true`) |
| Backend | Supabase (auth, realtime, storage, Postgres) |
| Notifications | Expo Notifications + `sendPushToPartner()` |
| Icons | Lucide React Native |
| Fonts | Playfair Display (headings), Inter (body), Dancing Script (romantic) |

## New Synced Feature Checklist

When adding a new feature with Supabase sync, update these **7 files** in this order:

### 1. `lib/types.ts` — Add the TypeScript interface
```typescript
export interface MyFeature {
  id: string;
  // ... fields
  createdAt: string;
  updatedAt?: string;
}
```

### 2. `stores/useMyFeatureStore.ts` — Create Zustand store
Copy the pattern from `stores/useBucketStore.ts`. Must include:
- `loadFromRemote(records)`, `syncRemoteInsert(record)`, `syncRemoteUpdate(record)`, `syncRemoteDelete(id)`, `reset()`
- `pushToSupabase('table_name', record)` in mutation actions
- Optional: `sendPushToPartner()` for partner notifications

### 3. `lib/initial-load.ts` — Add to initial data pull
- Import the store and type
- Add `pullFromSupabase<MyType>('table_name')` to Promise.all
- Add destructured variable name
- Add `useMyStore.getState().loadFromRemote(mergeById(...))` call

### 4. `hooks/useSync.ts` — Add realtime subscription
- Import the store
- Add `subscribeToTable<RemoteRecord>('table_name', { onInsert, onUpdate, onDelete })`
- Push channel to `channels` array

### 5. `lib/store-reset.ts` — Add to sign-out reset
- Add `import('@/stores/useMyFeatureStore')` to `Promise.all`
- Add `'useMyFeatureStore'` to `storeKeys` array (SAME INDEX)

### 6. `supabase/schema.sql` — Add table + RLS + realtime
```sql
CREATE TABLE my_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  -- fields (snake_case) --
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE my_feature ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage my_feature in their space" ON my_feature FOR ALL
  USING (space_id IN (SELECT space_id FROM space_members WHERE user_id = auth.uid()))
  WITH CHECK (space_id IN (SELECT space_id FROM space_members WHERE user_id = auth.uid()));
ALTER PUBLICATION supabase_realtime ADD TABLE my_feature;
```

### 7. `app/(tabs)/more.tsx` — Add menu entry
- Import icon from `lucide-react-native`
- Add menu item to appropriate section

## NativeWind + Pressable Bug (CRITICAL)

**NEVER put layout properties inside Pressable callback styles.** `@tailwind base` overrides them.

```tsx
// CORRECT
<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    {/* content */}
  </View>
</Pressable>

// WRONG — layout props will be overridden
<Pressable style={({ pressed }) => ({ flexDirection: 'row', opacity: pressed ? 0.7 : 1 })}>
```

## Animation Pattern

All animations use the built-in `Animated` API (NOT Reanimated):
```tsx
const anim = useRef(new Animated.Value(0)).current;
useEffect(() => {
  Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
}, []);
```

## Sync Engine (camelCase ↔ snake_case)

- `pushToSupabase(table, record)` — auto-converts camelCase → snake_case
- `pullFromSupabase<T>(table)` — auto-converts snake_case → camelCase
- Special aliases: `imageUri` ↔ `image_url`, `couplePhoto` ↔ `couple_photo_url`
- Offline queue: failed writes stored in AsyncStorage, flushed on foreground

## Skills Files (read only when relevant)

| File | Read When |
|------|-----------|
| `.claude/skills/design-system.md` | Building UI components |
| `.claude/skills/code-standards.md` | Writing any code |
| `.claude/skills/architecture.md` | Creating files/stores/routes |
| `.claude/skills/testing-and-quality.md` | Verifying completed work |
| `.claude/skills/project-context.md` | Understanding the app's purpose |

## Git

- Commit messages: imperative mood ("Add dream board", not "Added")
- Push after meaningful progress, not every tiny change
