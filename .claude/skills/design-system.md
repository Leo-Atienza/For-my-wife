# Design System — "Us" App

## Design Philosophy

> Every screen should feel like opening a shared diary — warm, personal, and beautiful.

This is a love letter in app form. The design should evoke **intimacy, warmth, and care**. Never cold, corporate, or generic. When choosing between "looks professional" and "feels personal," always choose personal.

## Color System

### Theme: Rose (Default)
```
Primary:       #E11D48  (rose-600)    — hearts, active states, CTAs
Primary soft:  #FFF1F2  (rose-50)     — backgrounds, card fills
Accent:        #FDA4AF  (rose-300)    — borders, hover states, secondary elements
Text:          #1C1917  (stone-900)   — headings, primary text
Text muted:    #78716C  (stone-500)   — secondary text, timestamps, captions
Background:    #FFFBFB               — warm off-white (NEVER pure white #FFFFFF)
Surface:       #FFFFFF               — cards and elevated surfaces
Danger:        #DC2626               — delete actions only
Success:       #16A34A               — completed items, "you're together!"
```

### Theme: Lavender
```
Primary:       #7C3AED  (violet-600)
Primary soft:  #F5F3FF  (violet-50)
Accent:        #C4B5FD  (violet-300)
Background:    #FDFBFF
```

### Theme: Sunset
```
Primary:       #EA580C  (orange-600)
Primary soft:  #FFF7ED  (orange-50)
Accent:        #FDBA74  (orange-300)
Background:    #FFFCFA
```

### Theme: Ocean
```
Primary:       #0891B2  (cyan-600)
Primary soft:  #ECFEFF  (cyan-50)
Accent:        #67E8F9  (cyan-300)
Background:    #FAFFFF
```

### How Themes Work
- Theme colors are defined as CSS custom properties via NativeWind
- Components reference theme tokens, not hardcoded hex values
- Theme selection stored in `useCoupleStore`
- Changing theme updates all screens instantly (no restart)

## Typography

### Font Stack
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Heading | Playfair Display | 700 (Bold) | Screen titles, section headers |
| Body | Inter | 400 (Regular), 500 (Medium), 600 (SemiBold) | All body text, labels, buttons |
| Accent | Dancing Script | 400 (Regular) | Couple names on dashboard, note headers, nicknames, romantic labels |

### Font Sizes (NativeWind)
```
text-xs:   12px  — timestamps, badges
text-sm:   14px  — captions, secondary text
text-base: 16px  — body text (default)
text-lg:   18px  — card titles, form labels
text-xl:   20px  — section headers
text-2xl:  24px  — screen titles
text-3xl:  30px  — dashboard counter number
text-4xl:  36px  — hero text (couple names on dashboard)
```

### Typography Rules
- **Never use all caps** — it feels aggressive. Use normal casing.
- **Line height**: 1.5 for body text, 1.2 for headings
- **Letter spacing**: default for body, slight tracking (0.5px) for small labels
- **Max line length**: text should not stretch full screen width. Use `max-w-prose` or padding.

## Spacing

### Base Unit: 4px
```
p-1:  4px     — tight inner spacing
p-2:  8px     — compact elements
p-3:  12px    — default inner padding
p-4:  16px    — card padding, section spacing
p-5:  20px    — generous card padding
p-6:  24px    — screen horizontal padding
p-8:  32px    — section gaps
p-10: 40px    — major section separators
```

### Screen Layout
- **Horizontal padding**: `px-6` (24px) on all screens — generous, never cramped
- **Top padding**: account for safe area insets + `pt-4` minimum
- **Bottom padding**: account for tab bar height + `pb-6`
- **Card gap**: `gap-4` (16px) between cards in a list
- **Section gap**: `gap-8` (32px) between different sections on a screen

## Components

### Cards
```
- Background: white (Surface color)
- Border radius: rounded-2xl (16px)
- Padding: p-5 (20px)
- Shadow: shadow-sm (soft, not harsh)
- Border: 1px solid accent color (subtle)
- On press: scale to 0.98 with 150ms duration
```

### Buttons
```
Primary:
  - Background: Primary color
  - Text: white
  - Border radius: rounded-full (pill shape)
  - Padding: px-6 py-3
  - Font: Inter SemiBold
  - On press: opacity 0.9

Secondary:
  - Background: Primary soft
  - Text: Primary color
  - Same shape as primary

Ghost:
  - Background: transparent
  - Text: Primary color
  - No border
```

### Inputs
```
- Background: Primary soft (very subtle tint)
- Border: 1px solid accent color
- Border radius: rounded-xl (12px)
- Padding: px-4 py-3
- Font size: text-base
- Placeholder color: text muted
- Focus: border changes to primary color
```

### Bottom Tab Bar
```
- Background: white with top border (1px accent)
- 5 tabs: Home, Notes, Memories, Countdowns, More
- Active tab: primary color icon + label
- Inactive tab: muted text color
- Icon size: 24px
- Label font: text-xs, Inter Medium
- Safe area bottom padding included
```

## Animations

### Principles
- **Duration**: 200-300ms for most transitions. Never instant, never slow.
- **Easing**: `Easing.bezier(0.25, 0.1, 0.25, 1)` — smooth, natural feel
- **Purpose**: Every animation should have meaning. No animation for animation's sake.
- **Interruptible**: All animations should be interruptible (use Reanimated shared values)

### Standard Animations

| Animation | Where | Details |
|-----------|-------|---------|
| Page slide + fade | All screen transitions | Slide from right (20px) + fade in, 250ms |
| Card press | All tappable cards | Scale to 0.98, 150ms, spring back |
| Envelope open | Love notes | Envelope flap lifts up, note slides out, 400ms sequence |
| Number flip | Countdown timers | Individual digits flip like an airport board |
| Floating hearts | Dashboard anniversary counter | Small hearts float up and fade, continuous subtle loop |
| Confetti burst | Bucket list check-off, countdown zero | Brief 1-second burst from center |
| Pulse | "Thinking of you" received | Screen-wide gentle pulse of primary color, 600ms |
| Card flip | Nickname reveal | 3D Y-axis flip, 500ms |
| Checkmark draw | Bucket list completion | SVG path draws the checkmark, 300ms |
| Masonry fade-in | Memory wall | Photos fade in staggered (50ms delay each) |

### Micro-interactions
- Heart icon: scale bounce on tap (1.0 → 1.3 → 1.0, spring)
- Toggle switches: smooth slide with color transition
- Pull-to-refresh: custom heart animation instead of default spinner
- Empty state illustrations: gentle floating/bobbing loop

## Empty States

Every screen MUST have a warm empty state. Never a blank screen.

### Pattern
```
[Illustration or large emoji]
[Warm, encouraging headline]
[Supportive subtext]
[Primary action button]
```

### Examples
- Notes: "No notes yet" → "Leave your first love note" + [Write a Note] button
- Memories: "Your story starts here" → "Add your first memory together" + [Add Memory] button
- Countdowns: "Nothing to count down to... yet" → "Set your first special date" + [Add Countdown] button
- Timeline: "Every love story has a beginning" → "Add your first milestone" + [Add Milestone] button

## Icons

- **Library**: Lucide React Native
- **Size**: 24px default, 20px for compact, 28px for emphasis
- **Stroke width**: 1.5 (default Lucide)
- **Color**: inherits from text color or primary color for active states
- **Common icons**: Heart, PenLine, Camera, Clock, MapPin, Moon, Sun, Music, Star, Gift

## Accessibility

- **Minimum tap target**: 44x44px (Apple HIG standard)
- **Color contrast**: 4.5:1 minimum for body text, 3:1 for large text
- **Labels**: all interactive elements need accessible labels
- **Font scaling**: support Dynamic Type (don't use fixed pixel sizes for critical text)
- **Reduced motion**: respect `prefers-reduced-motion` — disable decorative animations, keep functional ones
