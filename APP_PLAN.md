# "Us" — A Couple's App

> A private, intimate mobile app for two people to stay connected, share memories, and celebrate their relationship.

---

## Tech Stack

| Layer              | Technology                        | Purpose                              |
| ------------------ | --------------------------------- | ------------------------------------ |
| Framework          | React Native + Expo               | Cross-platform mobile app (iOS + Android) |
| Language           | TypeScript                        | Type safety across the entire app    |
| Styling            | NativeWind (Tailwind for RN)      | Consistent, utility-first styling    |
| UI Components      | React Native Paper + Custom       | Material Design base + custom romantic components |
| Animations         | React Native Reanimated           | Smooth, performant animations        |
| Navigation         | Expo Router                       | File-based routing                   |
| Maps               | React Native Maps                 | Distance feature + location display  |
| Location           | Expo Location                     | GPS tracking (foreground + background) |
| Haptics            | Expo Haptics                      | Vibration feedback for interactions  |
| Notifications      | Expo Notifications                | Real push notifications              |
| Storage (Phase 1)  | AsyncStorage                      | Local data persistence               |
| Backend (Phase 3)  | Supabase                          | Auth, realtime sync, photo storage   |
| Distribution       | Expo Go + EAS Build               | QR code testing + APK builds         |

---

## Design Direction

### Color Themes

| Theme    | Primary   | Soft BG   | Accent    |
| -------- | --------- | --------- | --------- |
| Rose     | `#E11D48` | `#FFF1F2` | `#FDA4AF` |
| Lavender | `#7C3AED` | `#F5F3FF` | `#C4B5FD` |
| Sunset   | `#EA580C` | `#FFF7ED` | `#FDBA74` |
| Ocean    | `#0891B2` | `#ECFEFF` | `#67E8F9` |

### Typography
- **Headings**: Playfair Display (serif) — elegant, romantic
- **Body**: Inter or DM Sans (sans-serif) — clean readability
- **Accents**: Dancing Script (cursive) — couple names, note headers, nicknames

### Animation Principles
- Page transitions: gentle slide + fade (200-300ms)
- Cards: subtle scale-up on press (1.02), soft shadow elevation
- Countdowns: number flip animation for live timer digits
- Love notes: envelope opening animation when reading a new note
- Bucket list: satisfying checkmark draw + confetti burst on completion
- Heart micro-interactions: floating hearts on dashboard

### Mobile-First Layout
- Bottom tab navigation (5 tabs: Home, Notes, Memories, Countdowns, More)
- Full-width cards with generous padding
- Swipe gestures for memory gallery
- Pull-to-refresh for note inbox

---

## Profile System

### 1. Couple Profile (Shared)
The "Us" identity — represents the relationship.

- Couple photo
- Anniversary date
- Relationship type (same city / LDR)
- Theme color
- Our song (title, artist, link)
- Shared bio / motto
- Timezone info

### 2. Individual Profiles (One per partner)
Each partner has their own profile the other can see.

- Profile photo
- Real name
- Birthday
- Location / timezone
- Love language
- Current emotional status (emoji + text)
- Song of the day dedication
- Fun facts / favorites (editable list)
- "Best quality" — written by your partner about you

### 3. Nickname System
You don't pick your own nickname — **your partner picks it for you**.

- Only your partner can set/change your nickname
- Multiple nicknames saved with dates (nickname history)
- Nicknames replace real names throughout the app (toggle-able)
- New nickname = animated card-flip reveal notification
- Nickname journal: timeline of all nicknames ever given

---

## Features by Phase

---

### PHASE 1 — MVP (Local, Single Device)

Everything works offline with AsyncStorage. No backend needed.

#### 1.1 Onboarding / Setup Wizard
- [ ] Step 1: Enter your name
- [ ] Step 2: Enter partner's name
- [ ] Step 3: Give them a nickname
- [ ] Step 4: Set anniversary date
- [ ] Step 5: Same city or long distance?
- [ ] Step 6: Pick theme color
- [ ] Step 7: Add couple photo
- [ ] Redirect to dashboard after setup
- [ ] Redirect to setup if no profile exists

#### 1.2 Home Dashboard
- [ ] Couple photo + names/nicknames display
- [ ] Live "together for X days, Y hours" counter
- [ ] Quick-action card grid (Notes, Memories, Countdowns, etc.)
- [ ] Daily love quote (from curated list)
- [ ] Current emotional status display for each partner
- [ ] Timezone dashboard (dual clocks, day/night indicator)

#### 1.3 Love Notes
- [ ] Note editor with text input + mood emoji picker
- [ ] Note list view with card previews sorted by date
- [ ] Single note view with envelope opening animation
- [ ] Mark notes as read/unread

#### 1.4 Memory Wall
- [ ] Photo upload via camera or gallery
- [ ] Compress images for storage
- [ ] Masonry grid layout for gallery
- [ ] Caption + date + optional location per memory
- [ ] Full-screen photo view with swipe navigation

#### 1.5 Anniversary Countdowns
- [ ] Live countdown cards (days/hours/minutes/seconds)
- [ ] Add/edit countdown form (title, date, emoji, recurring)
- [ ] Auto-create first countdown from anniversary date
- [ ] Celebration animation when a countdown hits zero

#### 1.6 Distance (Manual Mode)
- [ ] Each partner sets their city/location manually
- [ ] Display distance between two points (Haversine formula)
- [ ] Visual: two pulsing dots + dotted line + distance
- [ ] "You're together!" celebration when same location

#### 1.7 "Next Visit" Countdown + Planner (LDR)
- [ ] Special countdown for next time you'll meet
- [ ] Attach trip plan (flights, activities, restaurants)
- [ ] Shared packing list
- [ ] Auto-prompt to add photos after the visit

#### 1.8 Couple Profile & Individual Profiles
- [ ] Couple profile view + edit screen
- [ ] Individual profile view + edit screen
- [ ] Nickname setting (only partner can edit)
- [ ] Fun facts list (add/edit/remove)

---

### PHASE 2 — Richer Features (Still Local)

#### 2.1 Relationship Timeline
- [ ] Vertical scrolling timeline of milestones
- [ ] Add milestones: title, date, description, photo, icon
- [ ] Pre-populated with anniversary as first milestone
- [ ] Smooth scroll animations

#### 2.2 Date Idea Generator
- [ ] Curated list by category (at-home, outdoor, fancy, adventure)
- [ ] Save favorites
- [ ] "Surprise me" random picker with slot-machine animation
- [ ] Add custom date ideas

#### 2.3 Shared Bucket List
- [ ] Checklist items with categories: "this week", "this month", "someday"
- [ ] Satisfying check-off animation + confetti
- [ ] Track completion dates
- [ ] Sort by category or completion status

#### 2.4 Mood Check-In
- [ ] Daily emoji-based mood picker for each partner
- [ ] Optional note with mood entry
- [ ] Trend chart showing mood over time
- [ ] Partner mood comparison view

#### 2.5 Shared Journal / Letter Box (LDR)
- [ ] Write weekly letters to each other
- [ ] Letters are "sealed" — unlock on a set day (e.g., every Sunday)
- [ ] Both write simultaneously, both reveal at the same time
- [ ] Letter archive with date navigation

#### 2.6 Daily Questions / Games
- [ ] Daily question — both answer, then reveal
- [ ] "Would You Rather" — couples edition
- [ ] Photo challenge — daily prompt ("Send a photo of your view right now")

#### 2.7 Song Dedications
- [ ] Dedicate a song of the day with a message
- [ ] Spotify/Apple Music link integration
- [ ] Song history builds a shared playlist over time

#### 2.8 Emotion / Status Board
- [ ] Persistent emoji + short text status
- [ ] Always visible on partner's dashboard
- [ ] Quick-update from home screen

#### 2.9 Multiple Themes
- [ ] Rose, Lavender, Sunset, Ocean palettes
- [ ] Theme picker in settings
- [ ] Live preview when selecting
- [ ] CSS variables swap without restart

---

### PHASE 3 — Connected Experience (Two Devices, Supabase)

#### 3.1 Authentication
- [ ] Supabase Auth (magic link or email/password)
- [ ] One partner creates the "space"
- [ ] Other partner joins via invite link/code
- [ ] Profile data migrates from local to cloud

#### 3.2 Realtime Sync
- [ ] All data syncs between partners via Supabase Realtime
- [ ] Love notes appear on partner's device instantly
- [ ] Conflict resolution for simultaneous edits

#### 3.3 Cloud Photo Storage
- [ ] Migrate images from AsyncStorage to Supabase Storage
- [ ] Proper gallery with zoom, pinch, swipe
- [ ] Photo compression + thumbnail generation

#### 3.4 "Thinking of You" Tap
- [ ] Heart button on home screen
- [ ] Partner's phone vibrates gently (Expo Haptics)
- [ ] Warm pulse animation on their screen
- [ ] Daily counter: "Leo thought of you 7 times today"
- [ ] Delivered via Supabase Realtime

#### 3.5 Virtual Touch Screen
- [ ] Full-screen touch canvas
- [ ] Partner sees where you're touching in realtime
- [ ] Heart blooms where both fingers meet
- [ ] Powered by Supabase Realtime

#### 3.6 Sleep / Wake Sync (LDR)
- [ ] Tap "Going to sleep" or "Good morning"
- [ ] Partner gets push notification
- [ ] Status: "Babe is sleeping (2:30 AM her time)"
- [ ] Timezone-aware

#### 3.7 Live Distance Tracking
- [ ] Real-time GPS via Expo Location (foreground)
- [ ] Distance updates live between partners
- [ ] Map view with both locations
- [ ] Smart notifications: "Your partner just arrived home safely"

#### 3.8 Push Notifications
- [ ] Expo Notifications setup
- [ ] "Your partner left you a new note"
- [ ] "Sunshine is thinking of you"
- [ ] Countdown reached zero alerts
- [ ] New nickname reveal notifications

#### 3.9 Weekly Recap
- [ ] Auto-generated summary each week
- [ ] "This week: 3 memories, 5 bucket list items, anniversary in 12 days"
- [ ] Delivered as a push notification + in-app card

---

### PHASE 4 — Polish & Delight

#### 4.1 Background Location Mode
- [ ] Expo Location background task via Service Worker
- [ ] Updates every 15-30 minutes (battery-friendly)
- [ ] "Last updated 5 min ago" display
- [ ] One-tap toggle to pause

#### 4.2 "This Day in Our History"
- [ ] Surface memories from the same date in previous years
- [ ] Notification: "1 year ago today..."
- [ ] Special card on dashboard

#### 4.3 Love Language Quiz
- [ ] Built-in quiz for each partner
- [ ] Results displayed on individual profiles
- [ ] Tips based on each other's love language

#### 4.4 Watch Party / Sync Timer
- [ ] Start a shared countdown: "Movie night in 2 hours!"
- [ ] Synchronized play timer
- [ ] Shared mealtime timer for LDR dinner dates

#### 4.5 Export / PDF Yearbook
- [ ] Generate a PDF of memories + notes + timeline
- [ ] Beautiful yearbook-style layout
- [ ] Printable as a physical keepsake

#### 4.6 PWA / Home Screen Widget
- [ ] Countdown or status widget on phone home screen
- [ ] Quick "thinking of you" tap from widget

#### 4.7 Spotify Shared Playlist
- [ ] All song dedications auto-compile into a playlist
- [ ] Spotify API integration
- [ ] "Our soundtrack" view in the app

---

## Data Models

```typescript
interface CoupleProfile {
  couplePhoto?: string;
  anniversaryDate: string;
  relationshipType: 'local' | 'ldr';
  theme: 'rose' | 'lavender' | 'sunset' | 'ocean';
  sharedBio?: string;
  ourSong?: { title: string; artist: string; url?: string };
  createdAt: string;
}

interface IndividualProfile {
  id: string;
  role: 'partner1' | 'partner2';
  name: string;
  photo?: string;
  birthday?: string;
  location?: { city: string; timezone: string; lat?: number; lng?: number };
  loveLanguage?: string;
  currentStatus?: { emoji: string; text: string; updatedAt: string };
  songOfTheDay?: { title: string; artist: string; message?: string };
  funFacts: { label: string; value: string }[];
  bestQualityByPartner?: string;
  createdAt: string;
}

interface Nickname {
  id: string;
  forPartner: 'partner1' | 'partner2';
  givenBy: 'partner1' | 'partner2';
  nickname: string;
  isActive: boolean;
  givenAt: string;
}

interface LoveNote {
  id: string;
  author: 'partner1' | 'partner2';
  content: string;
  mood?: string;
  createdAt: string;
  isRead: boolean;
}

interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  location?: string;
  tags?: string[];
  createdAt: string;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
}

interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string;
  emoji?: string;
  isRecurring: boolean;
}

interface BucketItem {
  id: string;
  title: string;
  category: 'this-week' | 'this-month' | 'someday';
  isCompleted: boolean;
  completedDate?: string;
}

interface MoodEntry {
  id: string;
  partner: 'partner1' | 'partner2';
  mood: string;
  note?: string;
  date: string;
}

interface LocationEntry {
  id: string;
  partner: 'partner1' | 'partner2';
  latitude: number;
  longitude: number;
  cityName?: string;
  updatedAt: string;
}
```

---

## Project Structure

```
For-my-wife/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout: fonts, theme, navigation
│   ├── index.tsx                  # Home dashboard
│   ├── setup/
│   │   └── index.tsx             # Onboarding wizard
│   ├── notes/
│   │   ├── index.tsx             # Love notes list
│   │   └── [id].tsx              # Single note view
│   ├── memories/
│   │   ├── index.tsx             # Memory wall / gallery
│   │   └── [id].tsx              # Single memory detail
│   ├── timeline/
│   │   └── index.tsx             # Relationship timeline
│   ├── countdowns/
│   │   └── index.tsx             # Countdown timers
│   ├── dates/
│   │   └── index.tsx             # Date idea generator
│   ├── bucket-list/
│   │   └── index.tsx             # Shared bucket list
│   ├── mood/
│   │   └── index.tsx             # Mood check-in
│   ├── distance/
│   │   └── index.tsx             # Distance tracker + map
│   ├── profile/
│   │   ├── couple.tsx            # Couple profile view/edit
│   │   ├── [partner].tsx         # Individual profile view/edit
│   │   └── nicknames.tsx         # Nickname history
│   └── settings/
│       └── index.tsx             # Theme, export, preferences
│
├── components/
│   ├── ui/                       # Base components (Button, Card, Input, etc.)
│   ├── layout/
│   │   ├── TabBar.tsx            # Bottom navigation
│   │   ├── PageHeader.tsx        # Header with back button
│   │   └── PageTransition.tsx    # Animated page wrapper
│   ├── home/
│   │   ├── DurationCounter.tsx   # Live "together for X days"
│   │   ├── QuickActions.tsx      # Feature card grid
│   │   ├── DailyQuote.tsx        # Random love quote
│   │   └── TimezoneClocks.tsx    # Dual timezone display
│   ├── notes/
│   │   ├── NoteCard.tsx
│   │   ├── NoteEditor.tsx
│   │   └── EnvelopeAnimation.tsx
│   ├── memories/
│   │   ├── MemoryCard.tsx
│   │   ├── MemoryGrid.tsx
│   │   └── PhotoUpload.tsx
│   ├── timeline/
│   │   ├── TimelineItem.tsx
│   │   └── TimelineView.tsx
│   ├── countdowns/
│   │   ├── CountdownCard.tsx
│   │   └── CountdownForm.tsx
│   ├── distance/
│   │   ├── DistanceDisplay.tsx
│   │   └── LocationPicker.tsx
│   ├── profile/
│   │   ├── CoupleProfileCard.tsx
│   │   ├── IndividualProfileCard.tsx
│   │   └── NicknameReveal.tsx
│   └── ldr/
│       ├── ThinkingOfYouButton.tsx
│       ├── TouchCanvas.tsx
│       ├── SleepWakeToggle.tsx
│       └── NextVisitCard.tsx
│
├── stores/                       # Zustand stores
│   ├── useCoupleStore.ts
│   ├── useProfileStore.ts
│   ├── useNotesStore.ts
│   ├── useMemoriesStore.ts
│   ├── useTimelineStore.ts
│   ├── useCountdownsStore.ts
│   ├── useBucketStore.ts
│   ├── useMoodStore.ts
│   ├── useLocationStore.ts
│   └── useNicknameStore.ts
│
├── lib/
│   ├── utils.ts                  # General utilities
│   ├── dates.ts                  # date-fns helpers
│   ├── distance.ts               # Haversine formula
│   ├── storage.ts                # AsyncStorage abstraction
│   ├── constants.ts              # Love quotes, date ideas, theme defs
│   └── types.ts                  # All TypeScript interfaces
│
├── hooks/
│   ├── useCountdown.ts           # Live countdown hook
│   ├── useRelationshipDuration.ts
│   ├── useLocation.ts            # GPS wrapper
│   └── useTheme.ts               # Theme context hook
│
├── assets/
│   ├── fonts/                    # Playfair Display, Dancing Script
│   └── images/                   # Default illustrations, empty states
│
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
├── tailwind.config.js            # NativeWind config
└── APP_PLAN.md                   # This file
```

---

## Cost

| Item                    | Cost        |
| ----------------------- | ----------- |
| All development tools   | $0          |
| Expo Go (testing)       | $0          |
| EAS Build (30/mo)       | $0          |
| Supabase (Phase 3)      | $0          |
| Expo Notifications      | $0          |
| **Total**               | **$0/month** |

---

## Development Workflow

```
Code here → Save → Expo Go live-reloads on your phone instantly

Ready to share → EAS Build → APK → Send to girlfriend
```
