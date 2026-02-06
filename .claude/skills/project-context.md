# Project Context — Read This First

## App Name: "Us"

A private couple's app — a shared space for two people to celebrate their relationship, store memories, leave love notes, track milestones, and stay connected (especially when long-distance).

## Who Is This For?

- Exactly **2 users**: Leo and his girlfriend
- This is a personal project, not a commercial product
- Do not add admin panels, user management, or multi-tenancy
- Do not add analytics, tracking, or telemetry

## Core Emotional Goal

Every interaction should feel **warm, personal, and intimate**. This is not a productivity app. It's a love letter in app form. When in doubt, choose the option that feels more personal and heartfelt over the one that feels more "professional" or "clean."

## Key Design Decisions Already Made

1. **Native app, not a web app.** React Native + Expo. No web hosting needed.
2. **Local-first (Phases 1-2).** Everything works offline with AsyncStorage. No backend dependencies until Phase 3.
3. **Supabase for Phase 3.** When we add two-device sync, auth, and cloud storage, we use Supabase (free tier).
4. **$0 budget.** Every tool and service must be free. No paid APIs, no paid hosting.
5. **Nicknames are set by your partner, not yourself.** This is a core mechanic of the profile system.
6. **LDR features are first-class.** Distance tracking, timezone display, thinking-of-you tap, sleep/wake sync — these are not afterthoughts.

## The 4 Phases (Summary)

| Phase | Focus | Backend |
|-------|-------|---------|
| Phase 1 | MVP — onboarding, dashboard, notes, memories, countdowns, distance (manual), profiles | AsyncStorage (local) |
| Phase 2 | Richer features — timeline, date ideas, bucket list, mood, journal, games, songs, themes | AsyncStorage (local) |
| Phase 3 | Two-device sync — auth, realtime, cloud photos, thinking-of-you, virtual touch, push notifications | Supabase |
| Phase 4 | Polish — background location, history, love language quiz, watch party, PDF export, widgets | Supabase |

**Always check `APP_PLAN.md` for the full feature list and checklist.**

## What NOT To Do

- Do not add user registration/login until Phase 3
- Do not add server-side rendering (this is a mobile app)
- Do not add web-specific code (DOM APIs, CSS-in-JS for web, etc.)
- Do not install packages not listed in the tech stack without discussing first
- Do not refactor working code for "cleanliness" unless asked
- Do not add comments explaining obvious code
- Do not create test files until the testing strategy is defined
- Do not build features out of phase order
