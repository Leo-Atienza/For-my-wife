# Code Standards & Best Practices

## Language: TypeScript (Strict)

### General Rules
- **Strict mode enabled** in `tsconfig.json` — no exceptions
- **No `any` type** — use `unknown` if the type is truly unknown, then narrow it
- **No `// @ts-ignore`** — fix the type error properly
- **All data models** live in `lib/types.ts` — never define interfaces inline in components
- **Export types** from `lib/types.ts` and import them where needed
- Use **`const` by default**, `let` only when reassignment is necessary, never `var`

### Naming Conventions
| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `NoteCard.tsx`, `DurationCounter.tsx` |
| Hooks | camelCase with `use` prefix | `useCountdown.ts`, `useTheme.ts` |
| Stores | camelCase with `use` prefix | `useCoupleStore.ts` |
| Utilities | camelCase | `formatDuration()`, `calculateDistance()` |
| Types/Interfaces | PascalCase | `LoveNote`, `CoupleProfile` |
| Constants | UPPER_SNAKE_CASE | `LOVE_QUOTES`, `DATE_IDEAS` |
| Files | PascalCase for components, camelCase for everything else | `NoteCard.tsx`, `utils.ts` |
| Directories | kebab-case for routes, camelCase for code dirs | `bucket-list/`, `stores/` |

### Function Style
```typescript
// Prefer arrow functions for components
const NoteCard = ({ note }: { note: LoveNote }) => {
  // ...
};

// Prefer named exports over default exports
export const NoteCard = ...

// Exception: page components use default export (Expo Router requirement)
export default function NotesPage() { ... }
```

## React Native Specific

### Component Rules
- **Functional components only** — no class components
- **One component per file** — unless it's a tiny helper used only in that file
- **Props interface** defined at the top of the file or imported from `types.ts`
- **Destructure props** in the function signature
- **No inline styles** — use NativeWind className or StyleSheet.create
- **Use `React.memo`** only when profiling shows a performance issue, not preemptively

### Hooks Rules
- Custom hooks go in the `hooks/` directory
- Each hook in its own file
- Hooks must start with `use`
- Clean up side effects (intervals, subscriptions, listeners) in return function of `useEffect`
- Specify dependency arrays correctly — never disable the exhaustive-deps rule

### State Management (Zustand)
```typescript
// Store pattern — follow this exactly
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotesState {
  notes: LoveNote[];
  addNote: (note: LoveNote) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<LoveNote>) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      removeNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n),
      })),
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### ID Generation
- Use `uuid` library (v4) for generating unique IDs
- Import: `import { v4 as uuidv4 } from 'uuid'`
- Never use array indices as keys for lists that can change

## Imports

### Order (enforced)
1. React / React Native imports
2. Expo imports
3. Third-party library imports
4. Local components (`components/`)
5. Local hooks (`hooks/`)
6. Local stores (`stores/`)
7. Local utilities (`lib/`)
8. Types (with `type` keyword)

```typescript
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

import { NoteCard } from '@/components/notes/NoteCard';
import { useCountdown } from '@/hooks/useCountdown';
import { useNotesStore } from '@/stores/useNotesStore';
import { formatDuration } from '@/lib/dates';
import type { LoveNote } from '@/lib/types';
```

### Path Aliases
- Use `@/` alias for imports from `src/` or project root (configured in `tsconfig.json`)
- Never use relative paths that go up more than one level (`../../` is the max)

## Error Handling

- **Display user-friendly messages** — never show raw error objects or stack traces
- **Use try/catch** for async operations (photo upload, storage read/write)
- **Graceful fallbacks** — if a photo fails to load, show a placeholder; if storage is full, warn the user
- **No silent failures** — always log errors in development with `console.error`

## Performance

- **Lazy load screens** — Expo Router does this by default
- **Compress images** before storing (max 800px width, 0.7 JPEG quality)
- **Use FlatList** for any list that could have more than 20 items (not ScrollView)
- **Memoize expensive calculations** with `useMemo`, but only when measured
- **Debounce** text input handlers that trigger storage writes (300ms)

## Security

- **No secrets in code** — API keys go in environment variables (`.env`, not committed)
- **No eval()** — ever
- **Sanitize user input** before rendering (though React Native handles most XSS)
- **AsyncStorage is not encrypted** — do not store passwords or tokens in Phase 1
- Phase 3: Use Supabase Auth for proper authentication
