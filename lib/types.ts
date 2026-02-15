// ============================================
// "Us" App — All TypeScript Interfaces
// ============================================

export interface CoupleProfile {
  couplePhoto?: string;
  anniversaryDate: string;
  relationshipType: 'local' | 'ldr';
  theme: ThemeName;
  sharedBio?: string;
  ourSong?: SongReference;
  createdAt: string;
}

export interface IndividualProfile {
  id: string;
  role: PartnerRole;
  name: string;
  photo?: string;
  birthday?: string;
  location?: LocationInfo;
  loveLanguage?: string;
  currentStatus?: EmotionalStatus;
  songOfTheDay?: SongDedication;
  funFacts: FunFact[];
  bestQualityByPartner?: string;
  createdAt: string;
}

export interface Nickname {
  id: string;
  forPartner: PartnerRole;
  givenBy: PartnerRole;
  nickname: string;
  isActive: boolean;
  givenAt: string;
}

export interface LoveNote {
  id: string;
  author: PartnerRole;
  content: string;
  mood?: string;
  createdAt: string;
  updatedAt?: string;
  isRead: boolean;
}

export interface Memory {
  id: string;
  imageUri: string;
  caption: string;
  date: string;
  location?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description?: string;
  imageUri?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string;
  emoji?: string;
  isRecurring: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BucketItem {
  id: string;
  title: string;
  category: BucketCategory;
  isCompleted: boolean;
  completedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoodEntry {
  id: string;
  partner: PartnerRole;
  mood: string;
  note?: string;
  date: string;
  updatedAt?: string;
}

export interface LocationEntry {
  id: string;
  partner: PartnerRole;
  latitude: number;
  longitude: number;
  cityName?: string;
  updatedAt: string;
}

// ============================================
// Phase 2 — New Data Models
// ============================================

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: DateIdeaCategory;
  isFavorite: boolean;
  isCustom: boolean;
}

export type DateIdeaCategory = 'at-home' | 'outdoor' | 'fancy' | 'adventure';

export interface JournalLetter {
  id: string;
  author: PartnerRole;
  content: string;
  weekKey: string;
  revealDate: string;
  createdAt: string;
}

export type QuestionCategory = 'question' | 'would-you-rather' | 'photo-challenge';

export interface DailyQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
}

export interface DailyQuestionEntry {
  id: string;
  questionId: string;
  question: string;
  category: QuestionCategory;
  dateKey: string;
  partner1Answer?: string;
  partner2Answer?: string;
  partner1Photo?: string;
  partner2Photo?: string;
  createdAt: string;
}

export interface SongDedicationEntry {
  id: string;
  dedicatedBy: PartnerRole;
  title: string;
  artist: string;
  url?: string;
  message?: string;
  createdAt: string;
}

// ============================================
// Supporting Types
// ============================================

export type PartnerRole = 'partner1' | 'partner2';

export type ThemeName = 'rose' | 'lavender' | 'sunset' | 'ocean';

export type BucketCategory = 'this-week' | 'this-month' | 'someday';

export interface SongReference {
  title: string;
  artist: string;
  url?: string;
}

export interface SongDedication {
  title: string;
  artist: string;
  message?: string;
}

export interface LocationInfo {
  city: string;
  timezone: string;
  lat?: number;
  lng?: number;
}

export interface EmotionalStatus {
  emoji: string;
  text: string;
  updatedAt: string;
}

export interface FunFact {
  label: string;
  value: string;
}

// ============================================
// Theme Types
// ============================================

export interface ThemeColors {
  primary: string;
  primarySoft: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  danger: string;
  success: string;
}

// ============================================
// Phase 3 — Auth & Sync Types
// ============================================

export interface Space {
  id: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
}

export interface SpaceMember {
  id: string;
  spaceId: string;
  userId: string;
  role: PartnerRole;
  joinedAt: string;
  pushToken?: string;
}

export interface ThinkingOfYouTap {
  id: string;
  fromPartner: PartnerRole;
  createdAt: string;
}

export interface SleepWakeEntry {
  id: string;
  partner: PartnerRole;
  status: 'sleeping' | 'awake';
  createdAt: string;
}

export interface WeeklyRecap {
  id: string;
  weekKey: string;
  memoriesCount: number;
  notesCount: number;
  bucketCompletedCount: number;
  moodSummary: string;
  highlightText: string;
  createdAt: string;
}

export type PartnerNoteCategory =
  | 'things-i-love'
  | 'noticed-today'
  | 'why-amazing'
  | 'gratitude'
  | 'memories-of-us';

export interface PartnerNote {
  id: string;
  author: PartnerRole;
  aboutPartner: PartnerRole;
  content: string;
  category: PartnerNoteCategory;
  isDiscovered: boolean;
  discoveredAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Next Visit Planner (LDR Feature — Phase 1.7)
// ============================================

export interface NextVisit {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  notes?: string;
  activities: VisitActivity[];
  packingItems: PackingItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface VisitActivity {
  id: string;
  title: string;
  date?: string;
  isCompleted: boolean;
}

export interface PackingItem {
  id: string;
  item: string;
  isPacked: boolean;
  partner: PartnerRole;
}

// ============================================
// Love Language Quiz (Phase 4.3)
// ============================================

export type LoveLanguageType =
  | 'words-of-affirmation'
  | 'quality-time'
  | 'receiving-gifts'
  | 'acts-of-service'
  | 'physical-touch';

export interface LoveLanguageResult {
  partner: PartnerRole;
  primary: LoveLanguageType;
  scores: Record<LoveLanguageType, number>;
  completedAt: string;
}

export interface LoveLanguageQuestion {
  id: string;
  optionA: { text: string; language: LoveLanguageType };
  optionB: { text: string; language: LoveLanguageType };
}

// ============================================
// Watch Party / Sync Timer (Phase 4.4)
// ============================================

export interface WatchPartySession {
  id: string;
  title: string;
  type: 'movie' | 'dinner' | 'activity';
  startedBy: PartnerRole;
  startedAt?: string;
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// This Day in Our History (Phase 4.2)
// ============================================

export interface HistoryEntry {
  type: 'memory' | 'milestone' | 'note' | 'countdown';
  title: string;
  date: string;
  imageUri?: string;
  id: string;
}

// ============================================
// Love Coupon Book
// ============================================

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  givenBy: PartnerRole;
  isRedeemed: boolean;
  redeemedAt?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Dream Board
// ============================================

export type DreamCategory =
  | 'travel'
  | 'home'
  | 'adventure'
  | 'career'
  | 'family'
  | 'lifestyle';

export interface Dream {
  id: string;
  title: string;
  description?: string;
  category: DreamCategory;
  emoji: string;
  addedBy: PartnerRole;
  isAchieved: boolean;
  achievedAt?: string;
  targetYear?: number;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Love Map (Places We've Been)
// ============================================

export type LoveMapCategory =
  | 'first-date'
  | 'vacation'
  | 'restaurant'
  | 'adventure'
  | 'home'
  | 'special'
  | 'other';

export interface LoveMapPin {
  id: string;
  placeName: string;
  description?: string;
  category: LoveMapCategory;
  emoji: string;
  date?: string;
  addedBy: PartnerRole;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Couple Promises
// ============================================

export interface CouplePromise {
  id: string;
  title: string;
  description: string;
  emoji: string;
  madeBy: PartnerRole;
  isKept: boolean;
  keptAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Wish List (Gift Ideas)
// ============================================

export type WishCategory =
  | 'experience'
  | 'gift'
  | 'surprise'
  | 'homemade'
  | 'other';

export interface WishItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: WishCategory;
  forPartner: PartnerRole;
  addedBy: PartnerRole;
  isFulfilled: boolean;
  fulfilledAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Onboarding Types
// ============================================

export interface OnboardingData {
  yourName: string;
  partnerName: string;
  partnerNickname: string;
  anniversaryDate: string;
  relationshipType: 'local' | 'ldr';
  theme: ThemeName;
  couplePhoto?: string;
}

export type OnboardingStep =
  | 'your-name'
  | 'partner-name'
  | 'nickname'
  | 'anniversary'
  | 'relationship-type'
  | 'theme'
  | 'photo';
