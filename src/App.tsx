/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AppSection,
  Deck,
  DeckIllustrationType,
  DeckTheme,
  Flashcard,
  ReviewRating,
  StudyDirection,
  StudyMode,
  StudyStats,
  UserSettings,
} from './types';
import {
  INITIAL_CARDS,
  INITIAL_DECKS,
  INITIAL_SETTINGS,
  INITIAL_STATS,
} from './data/initialData';
import { DesktopSidebar, MobileBottomNav } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { StudySection } from './components/StudySection';
import { DecksSection } from './components/DecksSection';
import { ProgressSection } from './components/ProgressSection';
import { SettingsSection } from './components/SettingsSection';

const STORAGE_KEYS = {
  DECKS: 'zwkp_decks_v1',
  CARDS: 'zwkp_cards_v1',
  SETTINGS: 'zwkp_settings_v1',
  STATS: 'zwkp_stats_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [decks, setDecks] = useState<Deck[]>(() =>
    loadFromStorage(STORAGE_KEYS.DECKS, INITIAL_DECKS)
  );
  const [cards, setCards] = useState<Flashcard[]>(() =>
    loadFromStorage(STORAGE_KEYS.CARDS, INITIAL_CARDS)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [stats, setStats] = useState<StudyStats>(() =>
    loadFromStorage(STORAGE_KEYS.STATS, INITIAL_STATS)
  );
  const [selectedDeckId, setSelectedDeckId] = useState<string>('hsk1');

  // Persist changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    } catch {
      // ignore storage errors
    }
  }, [decks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch {
      // ignore storage errors
    }
  }, [cards]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // ignore storage errors
    }
  }, [stats]);

  const handleStartStudy = useCallback(
    (deckId?: string) => {
      if (deckId) {
        setSelectedDeckId(deckId);
      }
      setActiveSection('study');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handleNavigate = useCallback((section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateDirection = useCallback((defaultDirection: StudyDirection) => {
    setSettings((prev) => ({ ...prev, defaultDirection }));
  }, []);

  const handleToggleMode = useCallback((mode: StudyMode) => {
    setSettings((prev) => {
      const nextValue = !prev.enabledModes[mode];
      const updated = { ...prev.enabledModes, [mode]: nextValue };
      // Ensure at least one learning mode stays enabled
      if (!updated.vocab && !updated.writing && !updated.listening) {
        return prev;
      }
      return {
        ...prev,
        enabledModes: updated,
      };
    });
  }, []);

  const handleTogglePinyin = useCallback(() => {
    setSettings((prev) => ({ ...prev, showPinyin: !prev.showPinyin }));
  }, []);

  const handleUpdateThemeAccent = useCallback(
    (themeAccent: UserSettings['themeAccent']) => {
      setSettings((prev) => ({ ...prev, themeAccent }));
    },
    []
  );

  const handleRateCard = useCallback((cardId: string, rating: ReviewRating) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              lastRating: rating,
              learned: rating === 'good' ? true : rating === 'again' ? false : c.learned,
            }
          : c
      )
    );

    setStats((prev) => {
      const isCorrect = rating === 'good' || rating === 'hard';
      const nextTodayLearned = prev.todayLearned + 1;
      const nextTodayCorrect = isCorrect ? prev.todayCorrect + 1 : prev.todayCorrect;
      const nextTodayWrong = !isCorrect ? prev.todayWrong + 1 : prev.todayWrong;
      const nextDueToday = Math.max(0, prev.dueToday - 1);
      const nextAccuracy = Math.round((nextTodayCorrect / nextTodayLearned) * 100);

      return {
        ...prev,
        todayLearned: nextTodayLearned,
        todayCorrect: nextTodayCorrect,
        todayWrong: nextTodayWrong,
        dueToday: nextDueToday,
        weeklyAccuracy: nextAccuracy,
      };
    });
  }, []);

  const handleCreateDeck = useCallback(
    (
      title: string,
      category: string,
      theme: DeckTheme,
      illustration: DeckIllustrationType
    ) => {
      const newDeckId = `deck-${Date.now()}`;
      const newDeck: Deck = {
        id: newDeckId,
        title,
        subtitle: 'Eigenes Lern-Deck',
        category,
        theme,
        illustration,
      };
      setDecks((prev) => [...prev, newDeck]);

      // Add a default starter card so the deck is immediately playable
      const starterCard: Flashcard = {
        id: `c-${Date.now()}`,
        deckId: newDeckId,
        hanzi: '学习',
        pinyin: 'xuéxí',
        german: 'lernen / studieren',
        grammar: 'Verb',
        level: category,
        mode: 'vocab',
        illustration: 'flower',
        learned: false,
      };
      setCards((prev) => [...prev, starterCard]);
    },
    []
  );

  const handleAddCard = useCallback((cardData: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: `c-${Date.now()}`,
    };
    setCards((prev) => [...prev, newCard]);
    setStats((prev) => ({ ...prev, dueToday: prev.dueToday + 1 }));
  }, []);

  const handleResetDemoData = useCallback(() => {
    setDecks(INITIAL_DECKS);
    setCards(INITIAL_CARDS);
    setSettings(INITIAL_SETTINGS);
    setStats(INITIAL_STATS);
    setSelectedDeckId('hsk1');
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F1E7] text-[#49352D]">
      {/* Desktop Left Sidebar matching Reference 3 */}
      <DesktopSidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-5 pb-24 md:px-8 md:py-8 overflow-y-auto">
        {activeSection === 'home' && (
          <HomeDashboard
            decks={decks}
            cards={cards}
            stats={stats}
            onStartStudy={handleStartStudy}
            onOpenDecks={() => handleNavigate('decks')}
          />
        )}

        {activeSection === 'study' && (
          <StudySection
            decks={decks}
            cards={cards}
            selectedDeckId={selectedDeckId}
            onSelectDeck={setSelectedDeckId}
            settings={settings}
            onUpdateDirection={handleUpdateDirection}
            onTogglePinyin={handleTogglePinyin}
            onRateCard={handleRateCard}
            onBackHome={() => handleNavigate('home')}
            onOpenSettings={() => handleNavigate('settings')}
          />
        )}

        {activeSection === 'decks' && (
          <DecksSection
            decks={decks}
            cards={cards}
            onStartDeckStudy={handleStartStudy}
            onCreateDeck={handleCreateDeck}
            onAddCard={handleAddCard}
          />
        )}

        {activeSection === 'progress' && (
          <ProgressSection decks={decks} cards={cards} stats={stats} />
        )}

        {activeSection === 'settings' && (
          <SettingsSection
            settings={settings}
            onUpdateDirection={handleUpdateDirection}
            onToggleMode={handleToggleMode}
            onTogglePinyin={handleTogglePinyin}
            onUpdateThemeAccent={handleUpdateThemeAccent}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Mobile Compact Bottom Tab Bar */}
      <MobileBottomNav activeSection={activeSection} onNavigate={handleNavigate} />
    </div>
  );
}
