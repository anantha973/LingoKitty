export type StudyDirection = 'zh-to-de' | 'de-to-zh';
export type StudyMode = 'vocab' | 'writing' | 'listening';
export type SessionModeFilter = 'all' | StudyMode;

export type RatingKey = '1' | '2' | '3' | '4' | '5';
export type ConfidenceRating = 0 | 1 | 2 | 3 | 4 | 5;
export type LegacyRatingKey = 'again' | 'hard' | 'good' | 'easy';
export type ReviewRating = RatingKey | LegacyRatingKey;

export type CantoneseBridgeKind =
  | 'cognate'
  | 'non_cognate'
  | 'false_friend'
  | 'simplified_diff';

export type DeckTheme = 'pink' | 'sage' | 'cream' | 'lavender';
export type DeckIllustrationType =
  | 'flower'
  | 'leaves'
  | 'dango'
  | 'apple'
  | 'tea'
  | 'cat'
  | 'gardener'
  | 'baker'
  | 'flyer'
  | 'bubbles'
  | 'baozi'
  | 'lantern';

export interface SentenceToken {
  word: string;
  pinyin: string;
  gloss: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  hanzi: string;
  traditional?: string;
  pinyin: string;
  german: string;
  english?: string;
  grammar?: string;
  level?: string;
  hskLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  mode: StudyMode;
  audioUrl?: string;
  audioSlowUrl?: string;
  cantoneseBridge?: CantoneseBridgeKind;
  bridgeNote?: string;
  grammarTags?: string[];
  tokens?: SentenceToken[];
  illustration?: 'apple' | 'water' | 'coffee' | 'tea' | 'cat' | 'flower' | 'dango' | 'book';
  lastRating?: ReviewRating;
  learned?: boolean;
}

export interface Deck {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  theme: DeckTheme;
  illustration: DeckIllustrationType;
  hskLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CardSrsState {
  cardId: string;
  confidence: ConfidenceRating;
  consecutiveHighCount: number;
  consecutiveFiveCount: number;
  reviewCount: number;
  repetitions: number;
  lapses: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewedAt: string | null;
  dueAt: string;
  lastRating?: RatingKey;
  mastered: boolean;
}

export interface PlacementQuestion {
  id: string;
  hskLevel: 1 | 2 | 3 | 4;
  skill: 'reading' | 'listening';
  hanzi: string;
  traditional?: string;
  pinyin: string;
  german: string;
  options: string[];
  audioUrl: string;
  cantoneseBridge: CantoneseBridgeKind;
  bridgeNote?: string;
}

export interface PlacementResult {
  completed: boolean;
  recommendedHskLevel: 1 | 2 | 3 | 4;
  readingLevel: 1 | 2 | 3 | 4;
  listeningLevel: 1 | 2 | 3 | 4;
  readingAccuracy: number;
  listeningAccuracy: number;
  levelAccuracies: Record<number, number>;
  completedAt?: string;
}

export type UiLanguage = 'de' | 'en';

export interface UserSettings {
  uiLanguage?: UiLanguage;
  defaultDirection: StudyDirection;
  enabledModes: {
    vocab: boolean;
    writing: boolean;
    listening: boolean;
  };
  showPinyin: boolean;
  themeAccent: 'pink' | 'sage' | 'cream' | 'lavender';
}

export interface StudyStats {
  streakDays: number;
  weeklyAccuracy: number;
  todayLearned: number;
  todayCorrect: number;
  todayWrong: number;
  dueToday: number;
  // 4 weeks x 7 days (Mo-So), intensity 0 to 3
  activityGrid: number[][];
}

export type AppSection = 'home' | 'study' | 'decks' | 'progress' | 'settings';
