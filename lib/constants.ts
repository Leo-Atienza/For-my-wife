import type { ThemeColors, ThemeName } from './types';

// ============================================
// Theme Definitions
// ============================================

export const THEMES: Record<ThemeName, ThemeColors> = {
  rose: {
    primary: '#E11D48',
    primarySoft: '#FFF1F2',
    accent: '#FDA4AF',
    background: '#FFFBFB',
    surface: '#FFFFFF',
    textPrimary: '#1C1917',
    textMuted: '#78716C',
    danger: '#DC2626',
    success: '#16A34A',
  },
  lavender: {
    primary: '#7C3AED',
    primarySoft: '#F5F3FF',
    accent: '#C4B5FD',
    background: '#FDFBFF',
    surface: '#FFFFFF',
    textPrimary: '#1C1917',
    textMuted: '#78716C',
    danger: '#DC2626',
    success: '#16A34A',
  },
  sunset: {
    primary: '#EA580C',
    primarySoft: '#FFF7ED',
    accent: '#FDBA74',
    background: '#FFFCFA',
    surface: '#FFFFFF',
    textPrimary: '#1C1917',
    textMuted: '#78716C',
    danger: '#DC2626',
    success: '#16A34A',
  },
  ocean: {
    primary: '#0891B2',
    primarySoft: '#ECFEFF',
    accent: '#67E8F9',
    background: '#FAFFFF',
    surface: '#FFFFFF',
    textPrimary: '#1C1917',
    textMuted: '#78716C',
    danger: '#DC2626',
    success: '#16A34A',
  },
};

// ============================================
// Love Quotes (for daily dashboard quote)
// ============================================

export const LOVE_QUOTES: { text: string; author: string }[] = [
  { text: 'I have found the one whom my soul loves.', author: 'Song of Solomon 3:4' },
  { text: 'In all the world, there is no heart for me like yours.', author: 'Maya Angelou' },
  { text: 'Whatever our souls are made of, his and mine are the same.', author: 'Emily Bront\u00eb' },
  { text: 'You are my today and all of my tomorrows.', author: 'Leo Christopher' },
  { text: 'I love you not only for what you are, but for what I am when I am with you.', author: 'Roy Croft' },
  { text: 'Grow old along with me! The best is yet to be.', author: 'Robert Browning' },
  { text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
  { text: 'I want all of you, forever, every day.', author: 'Nicholas Sparks' },
  { text: 'You are my sun, my moon, and all my stars.', author: 'E.E. Cummings' },
  { text: 'Love recognizes no barriers.', author: 'Maya Angelou' },
  { text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott' },
  { text: 'You are the finest, loveliest, tenderest, and most beautiful person I have ever known.', author: 'F. Scott Fitzgerald' },
  { text: 'I would rather spend one lifetime with you, than face all the ages of this world alone.', author: 'J.R.R. Tolkien' },
  { text: 'My heart is, and always will be, yours.', author: 'Jane Austen' },
  { text: 'If I know what love is, it is because of you.', author: 'Hermann Hesse' },
  { text: 'Loved you yesterday, love you still, always have, always will.', author: 'Elaine Davis' },
  { text: 'You are my heart, my life, my one and only thought.', author: 'Arthur Conan Doyle' },
  { text: 'Every love story is beautiful, but ours is my favorite.', author: 'Unknown' },
  { text: 'I choose you. And I\u2019ll choose you over and over. Without pause, without doubt, in a heartbeat.', author: 'Unknown' },
  { text: 'You make me want to be a better man.', author: 'As Good as It Gets' },
  { text: 'You had me at hello.', author: 'Jerry Maguire' },
  { text: 'I am who I am because of you.', author: 'Nicholas Sparks' },
  { text: 'Come live in my heart and pay no rent.', author: 'Samuel Lover' },
  { text: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', author: 'Lao Tzu' },
  { text: 'Two souls with but a single thought, two hearts that beat as one.', author: 'John Keats' },
  { text: 'When I saw you I fell in love, and you smiled because you knew.', author: 'Arrigo Boito' },
  { text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle' },
  { text: 'I love you more than yesterday, but less than tomorrow.', author: 'Rosemonde G\u00e9rard' },
  { text: 'You\u2019re the closest to heaven that I\u2019ll ever be.', author: 'Goo Goo Dolls' },
  { text: 'Home is wherever I\u2019m with you.', author: 'Edward Sharpe' },
];

// ============================================
// Mood Emojis
// ============================================

export const MOOD_EMOJIS = [
  { emoji: '\u2764\ufe0f', label: 'In love' },
  { emoji: '\ud83d\ude0a', label: 'Happy' },
  { emoji: '\ud83e\udd70', label: 'Adoring' },
  { emoji: '\ud83d\ude14', label: 'Missing you' },
  { emoji: '\ud83d\ude34', label: 'Sleepy' },
  { emoji: '\ud83e\udd17', label: 'Hugging' },
  { emoji: '\ud83d\ude22', label: 'Sad' },
  { emoji: '\ud83d\ude04', label: 'Excited' },
  { emoji: '\ud83d\ude0c', label: 'Peaceful' },
  { emoji: '\ud83e\udd14', label: 'Thinking' },
  { emoji: '\ud83d\ude18', label: 'Kissy' },
  { emoji: '\ud83e\udee0', label: 'Grateful' },
];

// ============================================
// Onboarding Step Labels
// ============================================

export const ONBOARDING_STEPS = [
  { key: 'your-name', title: 'What\u2019s your name?', subtitle: 'Let\u2019s start with you.' },
  { key: 'partner-name', title: 'Who\u2019s your special person?', subtitle: 'What\u2019s their name?' },
  { key: 'nickname', title: 'Give them a nickname', subtitle: 'Something only you call them.' },
  { key: 'anniversary', title: 'When did it all begin?', subtitle: 'Your anniversary date.' },
  { key: 'relationship-type', title: 'Are you nearby?', subtitle: 'Same city or long distance?' },
  { key: 'theme', title: 'Pick your vibe', subtitle: 'Choose a color theme for your space.' },
  { key: 'photo', title: 'Add a couple photo', subtitle: 'Your favorite picture together.' },
] as const;
