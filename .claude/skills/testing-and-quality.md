# Testing & Quality Assurance

## Definition of Done

A feature is ONLY complete when ALL of these are true:

- [ ] **Types are correct** — no `any`, no `@ts-ignore`, no TypeScript errors
- [ ] **Component renders** — no crashes, no red screens on Expo Go
- [ ] **Empty state handled** — screen looks good with zero data
- [ ] **Data persists** — close and reopen the app, data is still there (AsyncStorage)
- [ ] **Navigation works** — can navigate to and from the screen without issues
- [ ] **Animations are smooth** — no jank, no flicker, 60fps on a real device
- [ ] **Matches design system** — correct colors, fonts, spacing, border radius per `design-system.md`
- [ ] **Accessible** — tap targets are 44x44px minimum, text is readable, labels exist
- [ ] **No console errors** — check Expo Go logs, resolve all warnings and errors

## Quality Checks Before Committing

### 1. TypeScript Check
```bash
npx tsc --noEmit
```
Must pass with zero errors. Warnings are acceptable during development but should be addressed before Phase completion.

### 2. Lint Check
```bash
npx expo lint
```
Fix all errors. Warnings can be noted but shouldn't block progress.

### 3. Visual Check on Device
Open Expo Go on a real phone and verify:
- Screen loads without crashing
- Colors match the active theme
- Text is readable (not cut off, not too small)
- Touch targets are large enough to tap comfortably
- Animations play smoothly
- Scrolling is smooth (FlatList, not ScrollView for long lists)

### 4. Data Persistence Check
1. Add some data (a note, a memory, etc.)
2. Fully close the Expo Go app (swipe away)
3. Reopen it
4. Verify data is still there

### 5. Edge Cases to Always Check
- **Empty strings** — what happens if user submits a blank note?
- **Very long text** — does a 500-character note break the layout?
- **No photo** — do profile and memory screens handle missing images?
- **Many items** — does the list scroll properly with 50+ items?
- **Date edge cases** — what about anniversary date in the future? Today?

## Error Handling Standards

### User-Facing Errors
- Show a **Toast** notification for non-critical errors (e.g., "Failed to save photo, try again")
- Show an **inline message** for form validation (e.g., "Please enter a name")
- Show a **full-screen error state** only for unrecoverable situations
- **Never show** raw error messages, stack traces, or technical details to the user

### Developer Errors
- Use `console.error` for unexpected errors during development
- Use `console.warn` for deprecation warnings or non-critical issues
- Remove all `console.log` debug statements before committing

## Performance Standards

### Targets
- **Screen load**: under 300ms (time from tap to fully rendered)
- **Animation**: 60fps (use `useNativeDriver` or Reanimated shared values)
- **List scrolling**: no dropped frames on a mid-range Android phone
- **Storage read**: under 100ms for any store hydration
- **Image compression**: under 2 seconds per photo

### Common Performance Mistakes to Avoid
1. **Rendering the entire list** — use `FlatList` with `keyExtractor`, not `ScrollView` + `.map()`
2. **Re-rendering everything** — use Zustand selectors, not `const store = useStore()`
3. **Heavy computation on render** — use `useMemo` for expensive calculations
4. **Uncompressed images** — always compress before storing
5. **Missing cleanup** — always clear `setInterval`, `setTimeout`, and subscriptions

## Common Bugs to Watch For

### React Native Specific
- **KeyboardAvoidingView missing** — forms must shift up when keyboard opens
- **Safe area not respected** — content hidden behind notch or status bar
- **Platform differences** — test on both iOS and Android if possible, at minimum test on the primary target (Android)
- **Async storage size** — monitor total usage, warn user if approaching 5MB with images

### State Management
- **Stale closures** — hooks capturing old state values. Use Zustand selectors correctly.
- **Race conditions** — two rapid taps creating duplicate entries. Disable button during save.
- **Missing hydration** — store not loaded from AsyncStorage yet on first render. Show loading state.

### Navigation
- **Back navigation state loss** — data entered on a form lost when pressing back. Warn user or auto-save.
- **Stale params** — navigating to `notes/[id]` with an ID that was deleted. Handle gracefully.

## Phase Completion Checklist

Before marking an entire Phase as complete:

### Phase 1 Checklist
- [ ] Onboarding wizard works end-to-end
- [ ] Dashboard shows couple info, duration counter, and quick actions
- [ ] Can create, view, and read love notes
- [ ] Can upload photos and view memory wall
- [ ] Countdowns display and update in real time
- [ ] Distance shows between two manually set locations
- [ ] Couple profile and individual profiles are editable
- [ ] Nicknames can be set and display throughout the app
- [ ] All data persists across app restarts
- [ ] No TypeScript errors
- [ ] No console errors on any screen
- [ ] Runs smoothly on a real Android device via Expo Go
- [ ] All empty states are implemented
- [ ] Theme colors apply consistently across all screens

## Bug Report Format

When reporting or documenting a bug, include:

```
**What**: One-line description
**Where**: Screen/component where it occurs
**Steps**: How to reproduce
**Expected**: What should happen
**Actual**: What actually happens
**Device**: Phone model + OS version (if relevant)
```
