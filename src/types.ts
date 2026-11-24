export type StudyDirection = 'zh-to-de' | 'de-to-zh';
export type StudyMode = 'vocab' | 'writing' | 'listening';
export type SessionModeFilter = 'all' | StudyMode;
export type ReviewRating = 'again' | 'hard' | 'good';
export type DeckTheme = 'pink' | 'sage' | 'cream' | 'lavender';
export type DeckIllustrationType = 'flower' | 'leaves' | 'dango' | 'apple' | 'tea' | 'cat';

export interface Flashcard {
  id: string;
  deckId: string;
  hanzi: string;
  pinyin: string;
  german: string;
  grammar?: string;
  level?: string;
  mode: StudyMode;
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
}

export interface UserSettings {
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
