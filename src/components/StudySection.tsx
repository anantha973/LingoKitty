import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Shuffle,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Pencil,
  Headphones,
  Volume2,
  Eye,
  RotateCw,
  Check,
  X,
  Play,
  Keyboard,
  Layers,
} from 'lucide-react';
import {
  Deck,
  Flashcard,
  ReviewRating,
  SessionModeFilter,
  StudyDirection,
  StudyMode,
  UserSettings,
} from '../types';
import { useMandarinSpeech } from '../hooks/useMandarinSpeech';
import {
  CatHoldingApple,
  CatWritingNotebook,
  SakuraBranchCorner,
  SmallSakuraFlower,
  AppleWithSlice,
  PottedFlowerIllustration,
  DangoSkewerIllustration,
} from './KawaiiIllustrations';

interface StudySectionProps {
  decks: Deck[];
  cards: Flashcard[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  settings: UserSettings;
  onUpdateDirection: (dir: StudyDirection) => void;
  onTogglePinyin: () => void;
  onRateCard: (cardId: string, rating: ReviewRating) => void;
  onBackHome: () => void;
  onOpenSettings: () => void;
}

export const StudySection: React.FC<StudySectionProps> = ({
  decks,
  cards,
  selectedDeckId,
  onSelectDeck,
  settings,
  onUpdateDirection,
  onTogglePinyin,
  onRateCard,
  onBackHome,
  onOpenSettings,
}) => {
  const [activeModeFilter, setActiveModeFilter] = useState<SessionModeFilter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [writingSubmitted, setWritingSubmitted] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);

  const writingInputRef = useRef<HTMLInputElement>(null);
  const { speak, isSpeaking, stopSpeech } = useMandarinSpeech();

  const currentDeck = useMemo(
    () => decks.find((d) => d.id === selectedDeckId) || decks[0],
    [decks, selectedDeckId]
  );

  // Filter cards by deck and active mode filter (or settings enabledModes if 'all')
  const studyQueue = useMemo(() => {
    const deckCards = cards.filter((c) => c.deckId === currentDeck.id);
    const filtered = deckCards.filter((card) => {
      if (activeModeFilter !== 'all') {
        return card.mode === activeModeFilter;
      }
      return settings.enabledModes[card.mode];
    });

    const baseList = filtered.length > 0 ? filtered : deckCards;
    if (!isShuffled) return baseList;
    return [...baseList].sort((a, b) => a.id.localeCompare(b.id) * -1);
  }, [cards, currentDeck.id, activeModeFilter, settings.enabledModes, isShuffled]);

  const safeIndex = studyQueue.length > 0 ? Math.min(currentIndex, studyQueue.length - 1) : 0;
  const currentCard = studyQueue[safeIndex];

  // Reset card state when changing card, mode, or deck
  useEffect(() => {
    setIsRevealed(false);
    setWritingInput('');
    setWritingSubmitted(false);
    stopSpeech();
  }, [safeIndex, activeModeFilter, selectedDeckId, stopSpeech]);

  const handleSelectModeFilter = (mode: SessionModeFilter) => {
    setActiveModeFilter(mode);
    setCurrentIndex(0);
    setIsRevealed(false);
    setWritingInput('');
    setWritingSubmitted(false);
    setShowModePicker(false);
  };

  const handlePrevCard = () => {
    if (studyQueue.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : studyQueue.length - 1));
  };

  const handleNextCard = () => {
    if (studyQueue.length === 0) return;
    setCurrentIndex((prev) => (prev < studyQueue.length - 1 ? prev + 1 : 0));
  };

  const handleCheckWriting = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setWritingSubmitted(true);
    setIsRevealed(true);
    if (currentCard) {
      speak(currentCard.hanzi, 'zh-CN');
    }
  };

  const handleRevealAnswer = () => {
    setIsRevealed(true);
    if (currentCard && currentCard.mode === 'listening') {
      speak(currentCard.hanzi, 'zh-CN');
    }
  };

  const handleRateAndAdvance = (rating: ReviewRating) => {
    if (!currentCard) return;
    onRateCard(currentCard.id, rating);
    handleNextCard();
  };

  const renderCardIllustration = (card: Flashcard) => {
    switch (card.illustration) {
      case 'apple':
        return <AppleWithSlice className="w-20 h-16 sm:w-24 sm:h-20" />;
      case 'flower':
        return <PottedFlowerIllustration className="w-16 h-18" />;
      case 'dango':
        return <DangoSkewerIllustration className="w-16 h-18" />;
      default:
        return <CatHoldingApple className="w-24 h-20 sm:w-28 sm:h-24" />;
    }
  };

  const getModeMeta = (mode: StudyMode) => {
    switch (mode) {
      case 'vocab':
        return {
          label: 'Vokabel',
          fullTitle: 'Vokabel-Karte (Wort & Bedeutung)',
          badgeBg: 'bg-[#FAD7DC] border-[#F0BFC7] text-[#49352D]',
          icon: BookOpen,
        };
      case 'writing':
        return {
          label: 'Schreibübung',
          fullTitle: 'Schreibübung (Schreiben)',
          badgeBg: 'bg-[#E3ECD6] border-[#C5D4B3] text-[#49352D]',
          icon: Pencil,
        };
      case 'listening':
        return {
          label: 'Hörübung',
          fullTitle: 'Hörübung (Verstehen)',
          badgeBg: 'bg-[#F6DCE8] border-[#E8C2D5] text-[#49352D]',
          icon: Headphones,
        };
    }
  };

  // Count cards per mode in the current deck
  const modeCounts = useMemo(() => {
    const deckCards = cards.filter((c) => c.deckId === currentDeck.id);
    return {
      all: deckCards.length,
      vocab: deckCards.filter((c) => c.mode === 'vocab').length,
      writing: deckCards.filter((c) => c.mode === 'writing').length,
      listening: deckCards.filter((c) => c.mode === 'listening').length,
    };
  }, [cards, currentDeck.id]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Study Container matching Reference 3 Top-Right Card */}
      <div className="bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-4 sm:p-7 shadow-xs">
        {/* Top Study Header: Back arrow, Deck Selector, Shuffle, Mode Chooser & Settings */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackHome}
              aria-label="Zurück zur Startseite"
              className="w-10 h-10 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] flex items-center justify-center text-[#49352D] hover:bg-[#F5E9DC] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#49352D]">Lernen</span>
              <span className="text-[#8C7568] font-bold">·</span>
              <select
                value={currentDeck.id}
                onChange={(e) => {
                  onSelectDeck(e.target.value);
                  setCurrentIndex(0);
                }}
                aria-label="Deck auswählen"
                className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-xl px-3 py-1.5 text-sm sm:text-base font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C] cursor-pointer"
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModePicker((prev) => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                showModePicker
                  ? 'bg-[#FAD7DC] border-[#E98F9C] text-[#49352D]'
                  : 'bg-[#FFFDF9] border-[#E6D7C8] text-[#6B5344] hover:text-[#49352D]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Lernmodus wählen</span>
            </button>

            <button
              onClick={() => setIsShuffled((prev) => !prev)}
              aria-label="Karten mischen"
              title="Karten mischen"
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isShuffled
                  ? 'bg-[#FAD7DC] border-[#E98F9C] text-[#49352D]'
                  : 'bg-[#FFFDF9] border-[#E6D7C8] text-[#6B5344] hover:bg-[#F5E9DC]'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              aria-label="Lerneinstellungen"
              title="Einstellungen"
              className="w-10 h-10 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] flex items-center justify-center text-[#6B5344] hover:bg-[#F5E9DC] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Three Distinct Learning Modes Selector Bar (matching Reference 2 "Choose a deck" & Reference 3 mode pills) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectModeFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
              activeModeFilter === 'all'
                ? 'bg-[#49352D] text-[#FFF9F1] border-[#49352D] shadow-2xs'
                : 'bg-[#FFFDF9] text-[#6B5344] border-[#E6D7C8] hover:border-[#C7B2A3]'
            }`}
          >
            Alle Modi ({modeCounts.all})
          </button>

          <button
            onClick={() => handleSelectModeFilter('vocab')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
              activeModeFilter === 'vocab'
                ? 'bg-[#FAD7DC] text-[#49352D] border-[#E598A4] shadow-2xs'
                : 'bg-[#FFFDF9] text-[#6B5344] border-[#E6D7C8] hover:bg-[#FCECEF]/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C86D7A]" />
            <span>Vokabeln ({modeCounts.vocab})</span>
          </button>

          <button
            onClick={() => handleSelectModeFilter('writing')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
              activeModeFilter === 'writing'
                ? 'bg-[#E2ECD5] text-[#49352D] border-[#A9B99A] shadow-2xs'
                : 'bg-[#FFFDF9] text-[#6B5344] border-[#E6D7C8] hover:bg-[#EDF1E4]/60'
            }`}
          >
            <Pencil className="w-3.5 h-3.5 text-[#6A7F5B]" />
            <span>Schreibübung ({modeCounts.writing})</span>
          </button>

          <button
            onClick={() => handleSelectModeFilter('listening')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
              activeModeFilter === 'listening'
                ? 'bg-[#F5DCEB] text-[#49352D] border-[#D8A7C4] shadow-2xs'
                : 'bg-[#FFFDF9] text-[#6B5344] border-[#E6D7C8] hover:bg-[#F9EBF3]/60'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#A4678E]" />
            <span>Hörübung ({modeCounts.listening})</span>
          </button>
        </div>

        {/* Expandable Choose-a-Card-Type Overview Cards (from Reference 2 "Choose a deck / Select a card type") */}
        {showModePicker && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl">
            <button
              onClick={() => handleSelectModeFilter('vocab')}
              className="text-left p-4 rounded-2xl bg-[#FCECEF] border border-[#F2CFD6] hover:shadow-xs transition-all cursor-pointer flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#FAD7DC] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#49352D]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#49352D]">Vokabeln</p>
                <p className="text-xs font-semibold text-[#6B5344] mt-0.5">
                  Chinesische Wörter & deutsche Bedeutungen lernen.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectModeFilter('writing')}
              className="text-left p-4 rounded-2xl bg-[#EDF1E4] border border-[#D8E2C8] hover:shadow-xs transition-all cursor-pointer flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#DCE5D0] flex items-center justify-center shrink-0">
                <Pencil className="w-5 h-5 text-[#49352D]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#49352D]">Schreibübung</p>
                <p className="text-xs font-semibold text-[#6B5344] mt-0.5">
                  Schriftzeichen aus dem Deutschen abrufen & tippen.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleSelectModeFilter('listening')}
              className="text-left p-4 rounded-2xl bg-[#F8EBF4] border border-[#E8CCE0] hover:shadow-xs transition-all cursor-pointer flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#F0D5E6] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-[#49352D]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#49352D]">Hörübung</p>
                <p className="text-xs font-semibold text-[#6B5344] mt-0.5">
                  Gesprochene Sätze rein über Audio verstehen.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Segmented Progress Bar + Counter (12 / 24) matching Reference 3 */}
        {studyQueue.length > 0 && currentCard && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-1">
                {studyQueue.slice(0, 16).map((c, idx) => {
                  const isCompletedOrActive = idx <= safeIndex;
                  const activeColor =
                    currentCard.mode === 'writing'
                      ? 'bg-[#A9B99A]'
                      : currentCard.mode === 'listening'
                      ? 'bg-[#D896B5]'
                      : 'bg-[#E58F9D]';
                  return (
                    <div
                      key={c.id}
                      className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                        isCompletedOrActive ? activeColor : 'bg-[#EADFD3]'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#6B5344] tabular-nums shrink-0">
                {safeIndex + 1} / {studyQueue.length}
              </span>
            </div>

            {/* Active Flashcard Stage with Left / Right Navigation Arrows */}
            <div className="mt-5 relative flex items-center justify-center gap-2 sm:gap-4">
              {/* Left Previous Arrow (Desktop & Tablet) */}
              <button
                onClick={handlePrevCard}
                aria-label="Vorherige Karte"
                className="hidden sm:flex w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] items-center justify-center text-[#6B5344] hover:text-[#49352D] hover:bg-[#F5E9DC] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* CENTRAL FLASHCARD */}
              <div className="w-full max-w-xl">
                {(() => {
                  const modeMeta = getModeMeta(currentCard.mode);
                  const ModeIcon = modeMeta.icon;

                  // Card surface tint based on learning mode & reveal state
                  const cardSurfaceClass =
                    currentCard.mode === 'writing'
                      ? 'bg-[#F3F6EC] border-[#C9D6B8]'
                      : currentCard.mode === 'listening'
                      ? 'bg-[#FCF5F9] border-[#E8C9DA]'
                      : isRevealed
                      ? 'bg-[#F4F7EE] border-[#CEDBC0]'
                      : 'bg-[#FFFDF9] border-[#E8D5C8]';

                  return (
                    <div
                      className={`relative overflow-hidden rounded-3xl border-2 p-5 sm:p-8 min-h-[320px] sm:min-h-[350px] flex flex-col justify-between transition-colors duration-200 shadow-xs ${cardSurfaceClass}`}
                    >
                      {/* Top-Right Cherry Blossom Branch */}
                      <div className="pointer-events-none absolute -top-1 -right-2 opacity-90">
                        <SakuraBranchCorner className="w-32 h-22 sm:w-36 sm:h-24" />
                      </div>

                      {/* Bottom-Left Small Sakura Flower */}
                      <div className="pointer-events-none absolute bottom-3 left-3 opacity-80">
                        <SmallSakuraFlower className="w-7 h-7" />
                      </div>

                      {/* Card Top Bar: Mode Pill + Flip/Status Icon */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <div
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold ${modeMeta.badgeBg}`}
                        >
                          <ModeIcon className="w-4 h-4" />
                          <span>{modeMeta.label}</span>
                        </div>

                        {currentCard.mode === 'vocab' && (
                          <button
                            onClick={onTogglePinyin}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF9F1]/90 border border-[#E6D7C8] text-[#6B5344] hover:text-[#49352D] transition-colors cursor-pointer"
                            title="Pinyin ein-/ausblenden"
                          >
                            Pinyin: {settings.showPinyin ? 'An' : 'Aus'}
                          </button>
                        )}

                        {isRevealed && currentCard.mode !== 'vocab' && (
                          <span className="w-7 h-7 rounded-full bg-[#A9B99A] text-white flex items-center justify-center shadow-2xs">
                            <Check className="w-4 h-4 stroke-[2.6]" />
                          </span>
                        )}
                      </div>

                      {/* ========================================================
                          MODE 1: VOCABULARY CARDS (Vokabeln)
                      ======================================================== */}
                      {currentCard.mode === 'vocab' && (
                        <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center text-center">
                          {/* Front vs Back depending on learning direction */}
                          {(() => {
                            const isChineseFront = settings.defaultDirection === 'zh-to-de';
                            const showChineseSide =
                              (isChineseFront && !isRevealed) || (!isChineseFront && isRevealed);

                            if (showChineseSide) {
                              return (
                                <>
                                  <p className="font-chinese text-5xl sm:text-6xl font-bold text-[#49352D] tracking-wide leading-tight select-all">
                                    {currentCard.hanzi}
                                  </p>

                                  <div className="mt-4 flex items-center justify-center gap-2.5">
                                    <button
                                      onClick={() => speak(currentCard.hanzi, 'zh-CN')}
                                      aria-label="Mandarin Aussprache abspielen"
                                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                        isSpeaking
                                          ? 'bg-[#E98F9C] text-white scale-105'
                                          : 'bg-[#FAD7DC]/80 text-[#49352D] hover:bg-[#F4B5BE]'
                                      }`}
                                    >
                                      <Volume2 className="w-5 h-5" />
                                    </button>

                                    {settings.showPinyin && (
                                      <span className="text-xl sm:text-2xl font-bold text-[#6B5344]">
                                        {currentCard.pinyin}
                                      </span>
                                    )}
                                  </div>

                                  {isRevealed && (
                                    <div className="mt-4 pt-3 border-t border-[#E6D7C8]/80 text-sm font-bold text-[#6B5344]">
                                      <span>{currentCard.german}</span>
                                      {currentCard.grammar && (
                                        <span className="text-[#8C7568]">
                                          {' '}
                                          · {currentCard.grammar}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            }

                            // German meaning side (Back for zh->de, Front for de->zh)
                            return (
                              <>
                                <p className="text-3xl sm:text-4xl font-bold text-[#49352D] leading-snug">
                                  {currentCard.german}
                                </p>

                                <div className="mt-3 flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => speak(currentCard.hanzi, 'zh-CN')}
                                    aria-label="Mandarin Aussprache abspielen"
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                      isSpeaking
                                        ? 'bg-[#A9B99A] text-white scale-105'
                                        : 'bg-[#E2ECD5] text-[#49352D] hover:bg-[#CEDBC0]'
                                    }`}
                                  >
                                    <Volume2 className="w-5 h-5" />
                                  </button>

                                  {isRevealed && settings.showPinyin && (
                                    <span className="text-base font-bold text-[#6B5344]">
                                      {currentCard.hanzi} ({currentCard.pinyin})
                                    </span>
                                  )}
                                </div>

                                {(currentCard.grammar || currentCard.level) && (
                                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#6B5344]">
                                    {currentCard.grammar && (
                                      <span className="px-3 py-1 rounded-full bg-[#FAD7DC]/70 border border-[#F0BFC7]">
                                        {currentCard.grammar}
                                      </span>
                                    )}
                                    {currentCard.level && (
                                      <span className="px-3 py-1 rounded-full bg-[#FFF9F1] border border-[#E6D7C8]">
                                        {currentCard.level}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* ========================================================
                          MODE 2: WRITING PRACTICE (Schreiben)
                      ======================================================== */}
                      {currentCard.mode === 'writing' && (
                        <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center text-center">
                          {!isRevealed ? (
                            <form
                              onSubmit={handleCheckWriting}
                              className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                              <p className="text-2xl sm:text-3xl font-bold text-[#49352D]">
                                {currentCard.german}
                              </p>
                              {currentCard.grammar && (
                                <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                                  {currentCard.grammar} · {currentCard.level || 'HSK 1'}
                                </p>
                              )}

                              {/* Standard OS/iPad Keyboard Chinese Text Input Field */}
                              <div className="mt-5 w-full relative">
                                <input
                                  ref={writingInputRef}
                                  type="text"
                                  lang="zh-CN"
                                  value={writingInput}
                                  onChange={(e) => setWritingInput(e.target.value)}
                                  placeholder="Chinesische Schriftzeichen eingeben..."
                                  autoComplete="off"
                                  autoCorrect="off"
                                  autoCapitalize="off"
                                  spellCheck={false}
                                  className="w-full h-13 px-4 pr-20 rounded-2xl bg-[#FFFDF9] border-2 border-[#C5D4B3] focus:border-[#8FA47D] focus:outline-none font-chinese text-xl font-bold text-[#49352D] placeholder:font-sans placeholder:text-sm placeholder:font-semibold placeholder:text-[#A39286] text-center shadow-2xs"
                                />

                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                  {writingInput && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWritingInput('');
                                        writingInputRef.current?.focus();
                                      }}
                                      aria-label="Eingabe löschen"
                                      className="w-7 h-7 rounded-full hover:bg-[#F2E9DF] flex items-center justify-center text-[#6B5344] cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                  <Keyboard
                                    className="w-4 h-4 text-[#8C7568]"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>

                              {/* iPad & Mobile Native Keyboard Hint Box */}
                              <p className="mt-2.5 text-[11px] sm:text-xs font-semibold text-[#6B5344] flex items-center gap-1.5">
                                <span>
                                  Tipp: Nutze die iPad-/Smartphone-Tastatur für Handschrift-Eingabe
                                </span>
                              </p>

                              {/* Sage-green Überprüfen Button matching Reference 1 & 3 */}
                              <button
                                type="submit"
                                className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#8FA47D] hover:bg-[#7F946D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                              >
                                <Check className="w-4 h-4 stroke-[2.6]" />
                                <span>Überprüfen</span>
                              </button>
                            </form>
                          ) : (
                            /* REVEALED BACK OF WRITING CARD */
                            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                              <p className="text-sm font-bold text-[#6B5344]">
                                {currentCard.german}
                              </p>

                              <p className="mt-2 font-chinese text-5xl sm:text-6xl font-bold text-[#49352D] tracking-wide">
                                {currentCard.hanzi}
                              </p>

                              <div className="mt-3 flex items-center justify-center gap-2.5">
                                <span className="text-xl font-bold text-[#6B5344]">
                                  {currentCard.pinyin}
                                </span>
                                <button
                                  onClick={() => speak(currentCard.hanzi, 'zh-CN')}
                                  aria-label="Mandarin Aussprache abspielen"
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    isSpeaking
                                      ? 'bg-[#8FA47D] text-white scale-105'
                                      : 'bg-[#DCE5D0] text-[#49352D] hover:bg-[#C9D6B8]'
                                  }`}
                                >
                                  <Volume2 className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Answer Comparison Box */}
                              <div className="mt-4 w-full bg-[#FFFDF9] border border-[#C9D6B8] rounded-2xl p-3 text-xs sm:text-sm">
                                {writingSubmitted && writingInput.trim().length > 0 ? (
                                  writingInput.trim() === currentCard.hanzi.trim() ? (
                                    <div className="flex items-center justify-center gap-2 text-[#557042] font-bold">
                                      <Check className="w-4 h-4 stroke-[2.6]" />
                                      <span>
                                        Perfekt geschrieben:{' '}
                                        <span className="font-chinese text-base">
                                          {writingInput.trim()}
                                        </span>
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#6B5344] font-semibold">
                                      <span>
                                        Deine Eingabe:{' '}
                                        <strong className="font-chinese text-base text-[#C86D7A]">
                                          {writingInput.trim()}
                                        </strong>
                                      </span>
                                      <span aria-hidden="true">→</span>
                                      <span>
                                        Richtig:{' '}
                                        <strong className="font-chinese text-base text-[#557042]">
                                          {currentCard.hanzi}
                                        </strong>
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <p className="text-[#8C7568] font-semibold">
                                    Vergleiche die Striche und die Pinyin-Aussprache.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ========================================================
                          MODE 3: LISTENING PRACTICE (Hören)
                          CRITICAL: FRONT IS STRICTLY AUDIO ONLY — NO TEXT, NO HANZI, NO PINYIN, NO HINTS
                      ======================================================== */}
                      {currentCard.mode === 'listening' && (
                        <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center text-center">
                          {!isRevealed ? (
                            /* FRONT — AUDIO ONLY */
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="flex items-center justify-center gap-4 sm:gap-6">
                                {/* Left Sound-Wave Bars */}
                                <div
                                  className="flex items-center gap-1 h-12"
                                  aria-hidden="true"
                                >
                                  {[14, 26, 36, 22, 30, 16].map((h, i) => (
                                    <span
                                      key={`l-${i}`}
                                      style={{
                                        height: `${h}px`,
                                        animationDelay: `${i * 0.1}s`,
                                      }}
                                      className={`w-1.5 rounded-full bg-[#DFB4C8] transition-transform ${
                                        isSpeaking ? 'animate-wave-bar' : ''
                                      }`}
                                    />
                                  ))}
                                </div>

                                {/* Large Circular Play Button */}
                                <button
                                  onClick={() => speak(currentCard.hanzi, 'zh-CN')}
                                  aria-label="Mandarin Satz anhören"
                                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4B5BE] hover:bg-[#E98F9C] active:scale-95 text-[#49352D] flex items-center justify-center shadow-sm border-4 border-[#FCE6EA] transition-all cursor-pointer ${
                                    isSpeaking ? 'ring-4 ring-[#F4B5BE]/40 scale-105' : ''
                                  }`}
                                >
                                  <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-[#C86D7A] text-[#C86D7A] ml-1" />
                                </button>

                                {/* Right Sound-Wave Bars */}
                                <div
                                  className="flex items-center gap-1 h-12"
                                  aria-hidden="true"
                                >
                                  {[16, 30, 22, 36, 26, 14].map((h, i) => (
                                    <span
                                      key={`r-${i}`}
                                      style={{
                                        height: `${h}px`,
                                        animationDelay: `${i * 0.12}s`,
                                      }}
                                      className={`w-1.5 rounded-full bg-[#DFB4C8] transition-transform ${
                                        isSpeaking ? 'animate-wave-bar' : ''
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* BACK — REVEALED ANSWER (Chinese Sentence + Pinyin + German Translation + Audio) */
                            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                              <p className="font-chinese text-3xl sm:text-4xl font-bold text-[#49352D] leading-snug">
                                {currentCard.hanzi}
                              </p>

                              <div className="mt-3 flex items-center justify-center gap-2.5">
                                <span className="text-base sm:text-lg font-bold text-[#6B5344]">
                                  {currentCard.pinyin}
                                </span>
                                <button
                                  onClick={() => speak(currentCard.hanzi, 'zh-CN')}
                                  aria-label="Mandarin Satz erneut anhören"
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    isSpeaking
                                      ? 'bg-[#E98F9C] text-white scale-105'
                                      : 'bg-[#FAD7DC] text-[#49352D] hover:bg-[#F4B5BE]'
                                  }`}
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* German Translation Pill Box matching Reference 3 Hörübung back */}
                              <div className="mt-5 w-full bg-[#EFE7DC]/90 border border-[#DFD1C1] rounded-2xl px-4 py-3 flex items-center justify-center gap-2.5">
                                <button
                                  onClick={() => speak(currentCard.german, 'de-DE')}
                                  aria-label="Deutsche Übersetzung vorlesen"
                                  className="w-7 h-7 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] shrink-0 cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-sm sm:text-base font-bold text-[#49352D]">
                                  {currentCard.german}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Decorative Corner Mascot / Illustration */}
                      <div className="relative z-10 flex items-end justify-between min-h-[40px]">
                        <div className="flex items-center">
                          {currentCard.mode === 'writing' && !isRevealed && (
                            <div className="-mb-3 -ml-2">
                              <CatWritingNotebook className="w-22 h-18 sm:w-26 sm:h-20" />
                            </div>
                          )}
                        </div>

                        <div className="-mb-3 -mr-2">
                          {currentCard.mode === 'vocab' && renderCardIllustration(currentCard)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Next Arrow (Desktop & Tablet) */}
              <button
                onClick={handleNextCard}
                aria-label="Nächste Karte"
                className="hidden sm:flex w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] items-center justify-center text-[#6B5344] hover:text-[#49352D] hover:bg-[#F5E9DC] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Controls Bar: Direction Switcher + Reveal / SRS Review Controls */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 max-w-xl mx-auto">
              {/* Direction Selector (Essential for Vocabulary Practice) */}
              <div className="flex items-center gap-2 bg-[#FFFDF9] border border-[#E6D7C8] rounded-full p-1.5 shadow-2xs">
                <span className="pl-2.5 text-xs font-bold text-[#6B5344] hidden xs:inline">
                  Richtung:
                </span>
                <button
                  onClick={() => onUpdateDirection('zh-to-de')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    settings.defaultDirection === 'zh-to-de'
                      ? 'bg-[#E98F9C] text-white shadow-2xs'
                      : 'text-[#6B5344] hover:text-[#49352D]'
                  }`}
                >
                  中文 → Deutsch
                </button>
                <button
                  onClick={() => onUpdateDirection('de-to-zh')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    settings.defaultDirection === 'de-to-zh'
                      ? 'bg-[#E98F9C] text-white shadow-2xs'
                      : 'text-[#6B5344] hover:text-[#49352D]'
                  }`}
                >
                  Deutsch → 中文
                </button>
              </div>

              {/* Answer Reveal OR Review Rating Controls (Again / Hard / Good) */}
              {!isRevealed ? (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <button
                    onClick={handlePrevCard}
                    aria-label="Vorherige Karte"
                    className="sm:hidden w-11 h-11 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] flex items-center justify-center text-[#6B5344]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleRevealAnswer}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FAD7DC] hover:bg-[#F4B5BE] border border-[#E98F9C]/40 text-[#49352D] font-bold text-sm shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 text-[#C86D7A]" />
                    <span>Antwort zeigen</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    aria-label="Nächste Karte"
                    className="sm:hidden w-11 h-11 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] flex items-center justify-center text-[#6B5344]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => handleRateAndAdvance('again')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAD7DC] hover:bg-[#F4B5BE] border border-[#E598A4] text-[#49352D] font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4 text-[#C86D7A]" />
                    <span>Again</span>
                  </button>

                  <button
                    onClick={() => handleRateAndAdvance('hard')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F3E9DC] hover:bg-[#E6D7C8] border border-[#D8C5B4] text-[#49352D] font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#8C7568]" />
                    <span>Hard</span>
                  </button>

                  <button
                    onClick={() => handleRateAndAdvance('good')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#DCE8CE] hover:bg-[#C8D9B5] border border-[#A9B99A] text-[#3F5232] font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#557042]" />
                    <span>Good</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Visual Reference Strip of the 3 Card Types (matches Reference 3 middle strip) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Type 1: Vokabel-Karte */}
        <button
          onClick={() => handleSelectModeFilter('vocab')}
          className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
            activeModeFilter === 'vocab'
              ? 'bg-[#FFFDF9] border-[#E98F9C] ring-2 ring-[#F4B5BE]/40'
              : 'bg-[#FDF7F0] border-[#E6D7C8] hover:bg-[#FFFDF9]'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAD7DC] border border-[#F0BFC7] text-xs font-bold text-[#49352D]">
            <BookOpen className="w-3.5 h-3.5 text-[#C86D7A]" />
            <span>Vokabel-Karte</span>
            <span className="font-normal text-[#6B5344]">(Wort & Bedeutung)</span>
          </div>
          <p className="mt-2.5 text-xs font-semibold text-[#6B5344]">
            Lerne Schriftzeichen, Pinyin & deutsche Bedeutung in beiden Richtungen.
          </p>
        </button>

        {/* Card Type 2: Schreibübung */}
        <button
          onClick={() => handleSelectModeFilter('writing')}
          className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
            activeModeFilter === 'writing'
              ? 'bg-[#FFFDF9] border-[#A9B99A] ring-2 ring-[#A9B99A]/40'
              : 'bg-[#FDF7F0] border-[#E6D7C8] hover:bg-[#FFFDF9]'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3ECD6] border border-[#C5D4B3] text-xs font-bold text-[#49352D]">
            <Pencil className="w-3.5 h-3.5 text-[#6A7F5B]" />
            <span>Schreibübung</span>
            <span className="font-normal text-[#6B5344]">(Schreiben)</span>
          </div>
          <p className="mt-2.5 text-xs font-semibold text-[#6B5344]">
            Schreibe Schriftzeichen per iPad-/Systemtastatur direkt aus dem Deutschen.
          </p>
        </button>

        {/* Card Type 3: Hörübung */}
        <button
          onClick={() => handleSelectModeFilter('listening')}
          className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
            activeModeFilter === 'listening'
              ? 'bg-[#FFFDF9] border-[#D8A7C4] ring-2 ring-[#D8A7C4]/40'
              : 'bg-[#FDF7F0] border-[#E6D7C8] hover:bg-[#FFFDF9]'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DCE8] border border-[#E8C2D5] text-xs font-bold text-[#49352D]">
            <Headphones className="w-3.5 h-3.5 text-[#A4678E]" />
            <span>Hörübung</span>
            <span className="font-normal text-[#6B5344]">(Verstehen)</span>
          </div>
          <p className="mt-2.5 text-xs font-semibold text-[#6B5344]">
            Höre gesprochene Mandarin-Sätze ganz ohne visuelle Text-Hilfe.
          </p>
        </button>
      </div>
    </div>
  );
};
