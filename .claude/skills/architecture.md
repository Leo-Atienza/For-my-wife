# Architecture Guide

## Project Structure

```
For-my-wife/
├── CLAUDE.md                    # Root agent instructions (read first)
├── CONTEXT.md                   # Current state (stores, routes, stats)
├── DECISIONS.md                 # Architectural decisions and rationale
├── APP_PLAN.md                  # Full feature plan & checklist
├── SESSION_PROMPT.md            # Reusable prompts for new sessions
├── .claude/skills/              # Agent guidelines (this folder)
│
├── app/                         # SCREENS ONLY — Expo Router pages
├── components/                  # REUSABLE UI — organized by feature
├── stores/                      # STATE — Zustand stores (26 stores)
├── lib/                         # UTILITIES — pure functions, types, constants
├── hooks/                       # CUSTOM HOOKS — shared React hooks
├── supabase/                    # DATABASE — schema.sql
└── assets/                      # STATIC FILES — fonts, images
```

### What Goes Where

| Directory | Contains | Does NOT Contain |
|-----------|----------|-----------------|
| `app/` | Screen components (pages). One file = one route. | Business logic, reusable components |
| `components/` | Reusable UI organized by feature (`home/`, `notes/`, `ui/`). | Screen layouts, store defs |
| `stores/` | Zustand store definitions. One store per feature. | UI code, components |
| `lib/` | Pure utilities, TypeScript interfaces (`types.ts`), constants. | React components, hooks |
| `hooks/` | Custom React hooks shared across screens. | Components, stores |

### File Placement Decision Tree

```
Screen/page user navigates to?     → app/[feature]/index.tsx
Base UI primitive (Button, Card)?  → components/ui/[Component].tsx
Feature-specific component?        → components/[feature]/[Component].tsx
Zustand store?                     → stores/use[Feature]Store.ts
Custom React hook?                 → hooks/use[Name].ts
Pure function, type, or constant?  → lib/[module].ts
```

## All Stores (26)

| Store | Table | Purpose |
|-------|-------|---------|
| `useAuthStore` | `spaces`, `space_members` | Auth, session, space |
| `useCoupleStore` | `couple_profiles` | Shared couple info, theme |
| `useProfileStore` | `individual_profiles` | Per-partner profiles |
| `useNicknameStore` | `nicknames` | Nickname history |
| `useNotesStore` | `love_notes` | Love notes CRUD |
| `useMemoriesStore` | `memories` | Photos/memories CRUD |
| `useTimelineStore` | `milestones` | Relationship milestones |
| `useCountdownsStore` | `countdown_events` | Countdown events |
| `useBucketStore` | `bucket_items` | Bucket list items |
| `useMoodStore` | `mood_entries` | Mood tracking |
| `useLocationStore` | `location_entries` | GPS location data |
| `useDateIdeasStore` | `date_ideas` | Date planning |
| `useJournalStore` | `journal_letters` | Weekly sealed letters |
| `useQuestionsStore` | `daily_question_entries` | Daily Q&A |
| `useSongStore` | `song_dedications` | Song dedications |
| `usePartnerNotesStore` | `partner_notes` | Notes about partner |
| `useThinkingStore` | `thinking_of_you` | Thinking-of-you taps |
| `useSleepWakeStore` | `sleep_wake_status` | Sleep/wake status |
| `useNextVisitStore` | `next_visits` | LDR visit planner |
| `useLoveLanguageStore` | `love_language_results` | Quiz results |
| `useWatchPartyStore` | `watch_party_sessions` | Shared timers |
| `useCouponStore` | `love_coupons` | Love coupons |
| `useDreamStore` | `dreams` | Dream board / goals |
| `useLoveMapStore` | `love_map_pins` | Special places map |
| `usePromiseStore` | `couple_promises` | Couple promises |
| `useWishListStore` | `wish_items` | Gift wish lists |

## Navigation

### Tab Bar (5 tabs)
```
Home → app/(tabs)/index.tsx
Notes → app/(tabs)/notes.tsx
Memories → app/(tabs)/memories.tsx
Countdowns → app/(tabs)/countdowns.tsx
More → app/(tabs)/more.tsx
```

### Navigation Rules
- **Tab screens** load immediately
- **Sub-screens** use stack navigation within tabs
- **Always provide back button** via `PageHeader` component with `showBack`
- **Use `router.push()`** for forward, `router.back()` for back
- **Pass IDs via route params**, use stores for actual data

## Store Pattern (Copy This)

Reference: `stores/useBucketStore.ts`

Every synced store MUST have:
```typescript
interface MyState {
  items: MyType[];
  addItem: (...) => void;      // pushToSupabase + optional sendPushToPartner
  removeItem: (id) => void;    // deleteFromSupabase
  // Sync methods (required for all synced stores):
  loadFromRemote: (records: MyType[]) => void;
  syncRemoteInsert: (record: MyType) => void;
  syncRemoteUpdate: (record: MyType) => void;
  syncRemoteDelete: (id: string) => void;
  reset: () => void;
}
```

## New Feature Integration (7-File Checklist)

See `CLAUDE.md` → "New Synced Feature Checklist" for the complete step-by-step.

Files to update:
1. `lib/types.ts` — interface
2. `stores/use[Feature]Store.ts` — store (NEW FILE)
3. `lib/initial-load.ts` — import, pull, merge, load
4. `hooks/useSync.ts` — import, subscribe
5. `lib/store-reset.ts` — import, key (SAME INDEX)
6. `supabase/schema.sql` — table, RLS, realtime
7. `app/(tabs)/more.tsx` — menu entry

## Data Flow

```
User Action → Store action (optimistic update) → pushToSupabase()
                                                       ↓
Partner's device ← Supabase Realtime ← syncRemoteInsert/Update/Delete
```

## Screen Component Pattern

```typescript
export default function FeatureScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const items = useMyStore((s) => s.items);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Feature" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 40,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* content */}
      </ScrollView>
    </View>
  );
}
```
