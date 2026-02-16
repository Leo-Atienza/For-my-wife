import type { LoveLanguageQuestion, LoveLanguageType } from './types';

export const LOVE_LANGUAGE_LABELS: Record<LoveLanguageType, string> = {
  'words-of-affirmation': 'Words of Affirmation',
  'quality-time': 'Quality Time',
  'receiving-gifts': 'Receiving Gifts',
  'acts-of-service': 'Acts of Service',
  'physical-touch': 'Physical Touch',
};

export const LOVE_LANGUAGE_EMOJIS: Record<LoveLanguageType, string> = {
  'words-of-affirmation': '💬',
  'quality-time': '⏳',
  'receiving-gifts': '🎁',
  'acts-of-service': '🤝',
  'physical-touch': '🤗',
};

export const LOVE_LANGUAGE_DESCRIPTIONS: Record<LoveLanguageType, string> = {
  'words-of-affirmation': 'You feel most loved when your partner expresses affection through words — compliments, encouragement, and "I love you."',
  'quality-time': 'You feel most loved when your partner gives you their full, undivided attention — being present and focused on you.',
  'receiving-gifts': 'You feel most loved through thoughtful gifts — it\'s the thought, effort, and symbolism that matters most.',
  'acts-of-service': 'You feel most loved when your partner does things to help you — cooking, cleaning, or any act that eases your burden.',
  'physical-touch': 'You feel most loved through physical closeness — holding hands, hugs, kisses, and being near each other.',
};

export const LOVE_LANGUAGE_TIPS: Record<LoveLanguageType, string[]> = {
  'words-of-affirmation': [
    'Leave little love notes for them to find',
    'Send a random "thinking of you" text during the day',
    'Tell them specifically what you appreciate about them',
    'Compliment them in front of others',
    'Write them a heartfelt letter',
  ],
  'quality-time': [
    'Put your phone away during dates',
    'Plan a weekly "us time" with no distractions',
    'Take walks together and talk about your day',
    'Learn a new hobby together',
    'Have daily check-in conversations',
  ],
  'receiving-gifts': [
    'Surprise them with small, thoughtful gifts',
    'Remember things they mentioned wanting',
    'Pick up their favorite snack on your way home',
    'Make them something handmade',
    'Keep a list of gift ideas throughout the year',
  ],
  'acts-of-service': [
    'Do a chore they dislike without being asked',
    'Cook their favorite meal as a surprise',
    'Help them with a task they\'ve been putting off',
    'Run errands for them when they\'re busy',
    'Set up something nice for when they get home',
  ],
  'physical-touch': [
    'Hold hands when you\'re walking together',
    'Give them a long hug when you see each other',
    'Sit close to them on the couch',
    'Give a random back rub or shoulder massage',
    'Greet them with a kiss every time',
  ],
};

export const LOVE_LANGUAGE_QUESTIONS: LoveLanguageQuestion[] = [
  {
    id: 'llq1',
    optionA: { text: 'Hearing "I love you" or "I\'m proud of you"', language: 'words-of-affirmation' },
    optionB: { text: 'Getting a long, warm hug', language: 'physical-touch' },
  },
  {
    id: 'llq2',
    optionA: { text: 'Receiving a thoughtful surprise gift', language: 'receiving-gifts' },
    optionB: { text: 'Having a full day together with no plans', language: 'quality-time' },
  },
  {
    id: 'llq3',
    optionA: { text: 'Your partner doing the dishes without being asked', language: 'acts-of-service' },
    optionB: { text: 'Your partner telling you why they love you', language: 'words-of-affirmation' },
  },
  {
    id: 'llq4',
    optionA: { text: 'Cuddling together on the couch', language: 'physical-touch' },
    optionB: { text: 'Receiving a gift that shows they were thinking of you', language: 'receiving-gifts' },
  },
  {
    id: 'llq5',
    optionA: { text: 'Your partner cooking your favorite meal', language: 'acts-of-service' },
    optionB: { text: 'Going on a walk together just to talk', language: 'quality-time' },
  },
  {
    id: 'llq6',
    optionA: { text: 'A heartfelt love letter', language: 'words-of-affirmation' },
    optionB: { text: 'A handmade gift from your partner', language: 'receiving-gifts' },
  },
  {
    id: 'llq7',
    optionA: { text: 'Your partner handling a stressful task for you', language: 'acts-of-service' },
    optionB: { text: 'Holding hands while walking', language: 'physical-touch' },
  },
  {
    id: 'llq8',
    optionA: { text: 'A phone-free dinner date together', language: 'quality-time' },
    optionB: { text: 'Your partner writing you a sweet note', language: 'words-of-affirmation' },
  },
  {
    id: 'llq9',
    optionA: { text: 'A surprise flower or small gift', language: 'receiving-gifts' },
    optionB: { text: 'Your partner cleaning the whole house', language: 'acts-of-service' },
  },
  {
    id: 'llq10',
    optionA: { text: 'A back massage after a long day', language: 'physical-touch' },
    optionB: { text: 'Uninterrupted time just for the two of you', language: 'quality-time' },
  },
  {
    id: 'llq11',
    optionA: { text: 'Your partner telling others how great you are', language: 'words-of-affirmation' },
    optionB: { text: 'Your partner making your morning coffee', language: 'acts-of-service' },
  },
  {
    id: 'llq12',
    optionA: { text: 'Planning a weekend getaway together', language: 'quality-time' },
    optionB: { text: 'Falling asleep in each other\'s arms', language: 'physical-touch' },
  },
  {
    id: 'llq13',
    optionA: { text: 'A meaningful souvenir from their trip', language: 'receiving-gifts' },
    optionB: { text: 'A long video call when you\'re apart', language: 'quality-time' },
  },
  {
    id: 'llq14',
    optionA: { text: 'Your partner saying "You make me a better person"', language: 'words-of-affirmation' },
    optionB: { text: 'Your partner fixing something that\'s been bothering you', language: 'acts-of-service' },
  },
  {
    id: 'llq15',
    optionA: { text: 'A spontaneous hug from behind', language: 'physical-touch' },
    optionB: { text: 'A gift that shows they really know you', language: 'receiving-gifts' },
  },
];
