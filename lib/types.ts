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
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description?: string;
  imageUri?: string;
  icon?: string;
}

export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string;
  emoji?: string;
  isRecurring: boolean;
}

export interface BucketItem {
  id: string;
  title: string;
  category: BucketCategory;
  isCompleted: boolean;
  completedDate?: string;
}

export interface MoodEntry {
  id: string;
  partner: PartnerRole;
  mood: string;
  note?: string;
  date: string;
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
