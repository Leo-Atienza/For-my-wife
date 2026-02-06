# Architecture Guide

## Project Structure Rules

```
For-my-wife/
├── CLAUDE.md                    # Root agent instructions (read first)
├── APP_PLAN.md                  # Full feature plan & checklist
├── .claude/skills/              # Agent guidelines (this folder)
│
├── app/                         # SCREENS ONLY — Expo Router pages
├── components/                  # REUSABLE UI — organized by feature
├── stores/                      # STATE — Zustand stores
├── lib/                         # UTILITIES — pure functions, types, constants
├── hooks/                       # CUSTOM HOOKS — shared React hooks
└── assets/                      # STATIC FILES — fonts, images
```

### What Goes Where

| Directory | Contains | Does NOT Contain |
|-----------|----------|-----------------|
| `app/` | Screen components (pages). One file = one route. Minimal logic — just composes components. | Business logic, reusable components, API calls |
| `components/` | Reusable UI components organized by feature (`notes/`, `memories/`, `home/`). Also `ui/` for base primitives. | Screen-level layouts, store definitions, navigation logic |
| `stores/` | Zustand store definitions. One store per feature domain. | UI code, components, side effects |
| `lib/` | Pure utility functions, TypeScript interfaces (`types.ts`), constants (`constants.ts`), helper modules. | React components, hooks, anything with React imports |
| `hooks/` | Custom React hooks shared across multiple screens. | Components, store definitions, constants |
| `assets/` | Font files, image files, illustration SVGs. | Code of any kind |

### File Placement Decision Tree

```
Is it a screen/page the user navigates to?
  → app/[feature]/index.tsx

Is it a reusable UI element?
  → Is it a base primitive (Button, Card, Input)?
    → components/ui/[Component].tsx
  → Is it feature-specific?
    → components/[feature]/[Component].tsx

Is it a Zustand store?
  → stores/use[Feature]Store.ts

Is it a custom React hook?
  → hooks/use[Name].ts

Is it a pure function, type, or constant?
  → lib/[module].ts

Is it a font, image, or illustration?
  → assets/[type]/[file]
```

## Expo Router (Navigation)

### File-Based Routing
```
app/
├── _layout.tsx          → Root layout (tab navigator, fonts, theme provider)
├── index.tsx            → Home dashboard (tab: Home)
├── setup/
│   └── index.tsx        → Onboarding wizard (shown once, then never again)
├── notes/
│   ├── _layout.tsx      → Notes stack navigator (optional)
│   ├── index.tsx         → Notes list (tab: Notes)
│   └── [id].tsx          → Single note view
├── memories/
│   ├── index.tsx         → Memory wall (tab: Memories)
│   └── [id].tsx          → Single memory detail
├── countdowns/
│   └── index.tsx         → Countdown list (tab: Countdowns)
├── distance/
│   └── index.tsx         → Distance tracker
├── timeline/
│   └── index.tsx         → Relationship timeline
├── dates/
│   └── index.tsx         → Date idea generator
├── bucket-list/
│   └── index.tsx         → Bucket list
├── mood/
│   └── index.tsx         → Mood check-in
├── profile/
│   ├── couple.tsx        → Couple profile
│   ├── [partner].tsx     → Individual profile
│   └── nicknames.tsx     → Nickname history
└── settings/
    └── index.tsx         → App settings
```

### Tab Navigator Configuration
```
5 Bottom Tabs:
1. Home       → app/index.tsx          (icon: Heart)
2. Notes      → app/notes/index.tsx    (icon: PenLine)
3. Memories   → app/memories/index.tsx (icon: Camera)
4. Countdowns → app/countdowns/index.tsx (icon: Clock)
5. More       → Drawer or list linking to: distance, timeline, dates,
                 bucket-list, mood, profile, settings
```

### Navigation Rules
- **Tab screens** load immediately (they are the 5 main tabs)
- **Sub-screens** (like single note view `[id].tsx`) use stack navigation within the tab
- **Setup wizard** is a modal that overlays everything if no profile exists
- **Always provide a back button** on sub-screens via `PageHeader` component
- **Use `router.push()`** for forward navigation, `router.back()` for going back
- **Pass data via route params** for IDs, use stores for actual data

## Zustand Stores

### One Store Per Feature Domain
```
stores/
├── useCoupleStore.ts       → Couple profile, theme, anniversary
├── useProfileStore.ts      → Individual profiles for both partners
├── useNicknameStore.ts     → Nicknames (given by partner)
├── useNotesStore.ts        → Love notes CRUD
├── useMemoriesStore.ts     → Memories/photos CRUD
├── useTimelineStore.ts     → Relationship milestones
├── useCountdownsStore.ts   → Countdown events
├── useBucketStore.ts       → Bucket list items
├── useMoodStore.ts         → Mood entries
└── useLocationStore.ts     → Location data for distance
```

### Store Rules
1. **Every store uses `persist` middleware** with AsyncStorage (Phase 1-2)
2. **Store names match the file name**: `useCoupleStore.ts` exports `useCoupleStore`
3. **Stores are the single source of truth** — components read from stores, not local state, for shared data
4. **Actions are defined inside the store** — not in components
5. **No async side effects in stores** — keep stores synchronous. Use hooks for async logic.
6. **Each store has a clear interface** defined with TypeScript

### Accessing Stores in Components
```typescript
// Select only what you need (prevents unnecessary re-renders)
const notes = useNotesStore((state) => state.notes);
const addNote = useNotesStore((state) => state.addNote);

// NOT this (re-renders on any store change):
const store = useNotesStore();
```

## Data Flow

```
User Action
    ↓
Component calls store action (e.g., addNote)
    ↓
Zustand store updates state
    ↓
persist middleware writes to AsyncStorage
    ↓
All subscribed components re-render with new data
```

### Phase 3 Migration Plan
When adding Supabase, the data flow becomes:
```
User Action
    ↓
Component calls store action
    ↓
Store updates local state immediately (optimistic)
    ↓
Store also calls Supabase API
    ↓
Supabase syncs to other device via Realtime
    ↓
Other device's store updates from Realtime subscription
```

The key insight: **stores stay the same, only the persistence layer changes.** This is why `lib/storage.ts` exists as an abstraction.

## Screen Component Pattern

Every screen should follow this structure:

```typescript
// app/notes/index.tsx
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { PageHeader } from '@/components/layout/PageHeader';
import { NoteCard } from '@/components/notes/NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotesStore } from '@/stores/useNotesStore';
import type { LoveNote } from '@/lib/types';

export default function NotesScreen() {
  const router = useRouter();
  const notes = useNotesStore((state) => state.notes);

  if (notes.length === 0) {
    return <EmptyState message="Leave your first love note" action="Write a Note" />;
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Love Notes" />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={() => router.push(`/notes/${item.id}`)} />
        )}
        contentContainerClassName="px-6 py-4 gap-4"
      />
    </View>
  );
}
```

### Screen Rules
- Screens are **thin** — they compose components, they don't contain complex logic
- Screens handle **navigation** (router.push, router.back)
- Screens handle **data fetching from stores** and pass data to components as props
- Screens handle **empty states** — check if data exists before rendering lists
- Screens use `default export` (Expo Router requirement)

## Image Handling

### Phase 1-2 (Local)
```
Camera/Gallery → Image Picker → Resize to max 800px width →
Compress to JPEG 0.7 quality → Convert to base64 → Store in AsyncStorage
```

### Phase 3 (Cloud)
```
Camera/Gallery → Image Picker → Resize → Compress →
Upload to Supabase Storage → Store URL in database
```

### Image Utilities (lib/images.ts)
- `compressImage(uri: string): Promise<string>` — resize + compress
- `getImageSize(uri: string): Promise<{ width: number; height: number }>` — dimensions
- `formatFileSize(bytes: number): string` — human-readable size

## Adding a New Feature Checklist

When building a new feature (e.g., "Mood Check-In"):

1. [ ] Define types in `lib/types.ts` (e.g., `MoodEntry`)
2. [ ] Create Zustand store in `stores/useMoodStore.ts`
3. [ ] Create screen in `app/mood/index.tsx`
4. [ ] Create components in `components/mood/`
5. [ ] Create any custom hooks in `hooks/`
6. [ ] Add navigation entry (tab or "More" screen)
7. [ ] Handle empty state
8. [ ] Test on Expo Go on a real device
