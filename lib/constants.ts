import type { ThemeColors, ThemeName, DateIdeaCategory, DailyQuestion } from './types';

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
// Semantic Colors (theme-independent)
// ============================================

export const SEMANTIC_COLORS = {
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
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

// ============================================
// Date Ideas (Phase 2)
// ============================================

export const DATE_IDEAS: {
  title: string;
  description: string;
  category: DateIdeaCategory;
}[] = [
  // At-home
  { title: 'Cook a new recipe together', description: 'Pick a cuisine neither of you has tried and make it from scratch.', category: 'at-home' },
  { title: 'Movie marathon', description: 'Pick a trilogy or franchise and binge it with snacks.', category: 'at-home' },
  { title: 'Build a blanket fort', description: 'Pillows, fairy lights, and your favorite show inside.', category: 'at-home' },
  { title: 'Paint night', description: 'Get canvases and paint the same scene — compare at the end.', category: 'at-home' },
  { title: 'Board game tournament', description: 'Best of 3 across different games. Loser makes dessert.', category: 'at-home' },
  { title: 'Bake something sweet', description: 'Cookies, brownies, or a cake you decorate together.', category: 'at-home' },
  { title: 'Spa night at home', description: 'Face masks, candles, massage, and relaxing music.', category: 'at-home' },
  { title: 'Stargaze from your window', description: 'Turn off all the lights and look up at the sky together.', category: 'at-home' },
  { title: 'Write love letters', description: 'Sit together but write each other a heartfelt letter to read later.', category: 'at-home' },
  { title: 'Photo album night', description: 'Go through old photos and relive your favorite memories.', category: 'at-home' },
  // Outdoor
  { title: 'Picnic in the park', description: 'Pack your favorite foods and find a beautiful spot outside.', category: 'outdoor' },
  { title: 'Sunrise or sunset walk', description: 'Wake up early or go out in the evening for a scenic walk.', category: 'outdoor' },
  { title: 'Bike ride together', description: 'Explore a trail or ride around your neighborhood.', category: 'outdoor' },
  { title: 'Visit a farmers market', description: 'Walk around, sample food, and buy ingredients for dinner.', category: 'outdoor' },
  { title: 'Beach day', description: 'Sand, sun, and each other. Simple and perfect.', category: 'outdoor' },
  { title: 'Go hiking', description: 'Find a nearby trail and enjoy nature together.', category: 'outdoor' },
  { title: 'Botanical garden visit', description: 'Walk through beautiful gardens and take photos together.', category: 'outdoor' },
  { title: 'Fly a kite', description: 'Find an open field and enjoy the wind together.', category: 'outdoor' },
  { title: 'Outdoor movie', description: 'Bring a laptop, blanket, and snacks to a park at night.', category: 'outdoor' },
  { title: 'Walk with no destination', description: 'Just walk together and see where you end up.', category: 'outdoor' },
  // Fancy
  { title: 'Dress up and dine out', description: 'Put on your best outfit and go somewhere special.', category: 'fancy' },
  { title: 'Wine or cocktail tasting', description: 'Visit a winery or try making fancy cocktails at home.', category: 'fancy' },
  { title: 'Go see a live show', description: 'Concert, theater, comedy show, or live music.', category: 'fancy' },
  { title: 'Rooftop dinner', description: 'Find a restaurant with a view and enjoy the skyline.', category: 'fancy' },
  { title: 'Art gallery date', description: 'Explore an exhibition and discuss your favorite pieces.', category: 'fancy' },
  { title: 'Couples massage', description: 'Book a real spa day and fully relax together.', category: 'fancy' },
  { title: 'Afternoon tea', description: 'Dress up and enjoy tea, scones, and conversation.', category: 'fancy' },
  { title: 'Candlelit dinner at home', description: 'Make a gourmet meal, set the table with candles, and play soft music.', category: 'fancy' },
  // Adventure
  { title: 'Road trip to somewhere new', description: 'Pick a town you\'ve never visited and just drive there.', category: 'adventure' },
  { title: 'Try a new sport together', description: 'Rock climbing, kayaking, tennis — something neither has tried.', category: 'adventure' },
  { title: 'Escape room', description: 'Work together to solve puzzles and escape.', category: 'adventure' },
  { title: 'Amusement park', description: 'Rides, cotton candy, and winning a stuffed animal.', category: 'adventure' },
  { title: 'Go camping', description: 'Pitch a tent, make a fire, and enjoy nature overnight.', category: 'adventure' },
  { title: 'Take a dance class', description: 'Salsa, swing, or ballroom — learn something new together.', category: 'adventure' },
  { title: 'Scavenger hunt', description: 'Create clues for each other around the city or neighborhood.', category: 'adventure' },
  { title: 'Volunteer together', description: 'Give back side by side — animal shelter, food bank, or cleanup.', category: 'adventure' },
];

// ============================================
// Daily Questions (Phase 2)
// ============================================

export const DAILY_QUESTIONS: DailyQuestion[] = [
  { id: 'q1', question: 'What is your favorite memory of us?', category: 'question' },
  { id: 'q2', question: 'What was the moment you knew you loved me?', category: 'question' },
  { id: 'q3', question: 'What do you love most about our relationship?', category: 'question' },
  { id: 'q4', question: 'If we could travel anywhere tomorrow, where would you want to go?', category: 'question' },
  { id: 'q5', question: 'What is something new you want us to try together?', category: 'question' },
  { id: 'q6', question: 'What song makes you think of me?', category: 'question' },
  { id: 'q7', question: 'What is your dream date with me?', category: 'question' },
  { id: 'q8', question: 'What is one thing I do that always makes you smile?', category: 'question' },
  { id: 'q9', question: 'What do you think is our greatest strength as a couple?', category: 'question' },
  { id: 'q10', question: 'Describe your perfect lazy Sunday with me.', category: 'question' },
  { id: 'q11', question: 'What is the funniest thing that has happened to us?', category: 'question' },
  { id: 'q12', question: 'If you could relive one day with me, which day would it be?', category: 'question' },
  { id: 'q13', question: 'What is something you have never told me but want me to know?', category: 'question' },
  { id: 'q14', question: 'What is your favorite way to show love?', category: 'question' },
  { id: 'q15', question: 'What little thing do I do that means the world to you?', category: 'question' },
  { id: 'q16', question: 'What is one goal you want us to achieve together this year?', category: 'question' },
  { id: 'q17', question: 'What is your favorite thing about my personality?', category: 'question' },
  { id: 'q18', question: 'If we wrote a book about our love story, what would the title be?', category: 'question' },
  { id: 'q19', question: 'What is the most romantic thing I have ever done for you?', category: 'question' },
  { id: 'q20', question: 'What does "home" mean to you?', category: 'question' },
  // Would You Rather
  { id: 'wyr1', question: 'Would you rather have a surprise date or plan one together?', category: 'would-you-rather' },
  { id: 'wyr2', question: 'Would you rather go on a beach vacation or a mountain adventure?', category: 'would-you-rather' },
  { id: 'wyr3', question: 'Would you rather have breakfast in bed or dinner by candlelight?', category: 'would-you-rather' },
  { id: 'wyr4', question: 'Would you rather receive a love letter or a surprise gift?', category: 'would-you-rather' },
  { id: 'wyr5', question: 'Would you rather cook together or eat out at a fancy restaurant?', category: 'would-you-rather' },
  { id: 'wyr6', question: 'Would you rather relive our first date or plan a brand new one?', category: 'would-you-rather' },
  { id: 'wyr7', question: 'Would you rather dance in the rain or watch the sunset together?', category: 'would-you-rather' },
  { id: 'wyr8', question: 'Would you rather have a movie night or a game night?', category: 'would-you-rather' },
  { id: 'wyr9', question: 'Would you rather travel the world together or build a dream home?', category: 'would-you-rather' },
  { id: 'wyr10', question: 'Would you rather have more time or more money for our dates?', category: 'would-you-rather' },
];

// ============================================
// Timeline Icons (Phase 2)
// ============================================

export const TIMELINE_ICONS = [
  { emoji: '\u2764\ufe0f', label: 'Heart' },
  { emoji: '\ud83d\udc8d', label: 'Ring' },
  { emoji: '\u2708\ufe0f', label: 'Travel' },
  { emoji: '\ud83c\udf89', label: 'Party' },
  { emoji: '\ud83c\udf93', label: 'Graduation' },
  { emoji: '\ud83c\udfe0', label: 'Home' },
  { emoji: '\ud83c\udf39', label: 'Rose' },
  { emoji: '\ud83d\udcf8', label: 'Photo' },
  { emoji: '\ud83c\udfb5', label: 'Music' },
  { emoji: '\ud83c\udf1f', label: 'Star' },
  { emoji: '\ud83d\ude97', label: 'Car' },
  { emoji: '\ud83c\udf82', label: 'Cake' },
];

// ============================================
// Bucket List Category Labels (Phase 2)
// ============================================

export const BUCKET_CATEGORIES = [
  { key: 'this-week' as const, label: 'This Week', emoji: '\ud83d\udcc5' },
  { key: 'this-month' as const, label: 'This Month', emoji: '\ud83d\uddd3\ufe0f' },
  { key: 'someday' as const, label: 'Someday', emoji: '\u2728' },
];
