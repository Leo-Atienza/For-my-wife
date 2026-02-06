# "Us" — Couple's App | Agent Instructions

> This is the root instruction file for all Claude agents working on this project.
> Read this FIRST before doing anything.

## What This Project Is

A private, intimate **React Native + Expo** mobile app for a couple to stay connected.
It is NOT a website. It is NOT a web app. It is a **native mobile app** built with Expo.

## Critical Rules

1. **Always read `APP_PLAN.md` before building any feature.** It is the source of truth for features, data models, project structure, and phasing.
2. **Always read the relevant skills file in `.claude/skills/`** before starting work in that area.
3. **Never introduce a web-only technology.** No Next.js, no Vercel, no browser-only APIs. Everything must work in React Native.
4. **Follow the phase order.** Do not build Phase 3 features until Phases 1-2 are solid. Do not add Supabase until Phase 3.
5. **This app is for 2 users only.** Do not over-engineer for scale. Keep it simple and personal.
6. **The aesthetic is romantic, warm, and intimate.** Every screen should feel like opening a shared diary. See `.claude/skills/design-system.md`.
7. **TypeScript is mandatory.** No `any` types. No untyped code. All interfaces live in `lib/types.ts`.
8. **Test on a real device via Expo Go.** Do not rely solely on simulators.

## Skills & Guidelines (read these)

| File | When to Read |
|------|-------------|
| `.claude/skills/project-context.md` | Before ANY task — understand the project |
| `.claude/skills/code-standards.md` | Before writing ANY code |
| `.claude/skills/design-system.md` | Before building ANY UI component |
| `.claude/skills/architecture.md` | Before creating files, stores, or navigation |
| `.claude/skills/testing-and-quality.md` | Before marking ANY task as done |

## Tech Stack (Do Not Change Without Permission)

- **Framework**: React Native + Expo (SDK 52+)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router (file-based)
- **Animations**: React Native Reanimated + Moti
- **Backend (Phase 3 only)**: Supabase

## Branch & Git

- Develop on branch: `claude/plan-couple-app-eldhT`
- Commit messages: clear, descriptive, imperative mood ("Add love notes screen", not "Added")
- Push after meaningful progress, not after every tiny change
