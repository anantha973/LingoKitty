import {
  Deck,
  Flashcard,
  PlacementQuestion,
  PlacementResult,
  StudyStats,
  UserSettings,
} from '../types';
import hsk1Words from './decks/hsk1Words.json';
import hsk2Words from './decks/hsk2Words.json';
import hsk1Sentences from './decks/hsk1Sentences.json';
import hsk2Sentences from './decks/hsk2Sentences.json';
import cantoneseBridge from './decks/cantoneseBridge.json';
import placementDeck from './decks/placementDeck.json';

export const PLACEMENT_QUESTIONS: PlacementQuestion[] =
  placementDeck as PlacementQuestion[];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'cantonese-bridge',
    title: 'Kantonesisch → Mandarin',
    subtitle: 'Wichtige Unterschiede, False Friends & Ton-Sandhi',
    category: 'Brücke',
    theme: 'pink',
    illustration: 'cat',
    hskLevel: 1,
  },
  {
    id: 'hsk1-words',
    title: 'HSK 1 – Wortschatz',
    subtitle: '506 Grundwörter (HSK 3.0)',
    category: 'HSK 1',
    theme: 'pink',
    illustration: 'flower',
    hskLevel: 1,
  },
  {
    id: 'hsk1-sentences',
    title: 'HSK 1 – Sätze & Hören',
    subtitle: '281 Sätze mit Normal- & Langsam-Audio',
    category: 'HSK 1',
    theme: 'sage',
    illustration: 'dango',
    hskLevel: 1,
  },
  {
    id: 'hsk2-words',
    title: 'HSK 2 – Wortschatz',
    subtitle: '750 Aufbauwörter (HSK 3.0)',
    category: 'HSK 2',
    theme: 'cream',
    illustration: 'tea',
    hskLevel: 2,
  },
  {
    id: 'hsk2-sentences',
    title: 'HSK 2 – Sätze & Hören',
    subtitle: '538 Sätze mit Normal- & Langsam-Audio',
    category: 'HSK 2',
    theme: 'lavender',
    illustration: 'leaves',
    hskLevel: 2,
  },
];

export const INITIAL_CARDS: Flashcard[] = [
  ...(cantoneseBridge as Flashcard[]),
  ...(hsk1Words as Flashcard[]),
  ...(hsk1Sentences as Flashcard[]),
  ...(hsk2Words as Flashcard[]),
  ...(hsk2Sentences as Flashcard[]),
];

export const INITIAL_SETTINGS: UserSettings = {
  defaultDirection: 'zh-to-de',
  enabledModes: {
    vocab: true,
    writing: true,
    listening: true,
  },
  showPinyin: true,
  themeAccent: 'pink',
};

export const INITIAL_PLACEMENT: PlacementResult = {
  completed: false,
  recommendedHskLevel: 1,
  readingLevel: 1,
  listeningLevel: 1,
  readingAccuracy: 0,
  listeningAccuracy: 0,
  levelAccuracies: { 1: 0, 2: 0, 3: 0, 4: 0 },
};

export const INITIAL_STATS: StudyStats = {
  streakDays: 0,
  weeklyAccuracy: 0,
  todayLearned: 0,
  todayCorrect: 0,
  todayWrong: 0,
  dueToday: 25,
  activityGrid: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
};
