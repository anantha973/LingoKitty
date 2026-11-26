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
  Check,
  X,
  Play,
  Keyboard,
  Layers,
  Loader2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  CantoneseBridgeKind,
  CardSrsState,
  Deck,
  Flashcard,
  RatingKey,
  ReviewRating,
  SessionModeFilter,
  StudyDirection,
  StudyMode,
  UserSettings,
} from '../types';
import { useMandarinSpeech } from '../hooks/useMandarinSpeech';
import {
  applyLoopRating,
  computeDeckLoopProgressPct,
  createInitialDeckLoopState,
  DeckLoopState,
} from '../utils/confidenceLoopEngine';
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
  srsMap: Record<string, CardSrsState>;
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  settings: UserSettings;
  onUpdateDirection: (dir: StudyDirection) => void;
  onTogglePinyin: () => void;
  onRateCard: (cardId: string, rating: ReviewRating, direction: StudyDirection) => void;
  onBackHome: () => void;
  onOpenSettings: () => void;
}

const CONFIDENCE_BUTTONS: {
  key: RatingKey;
  label: string;
  sub: string;
  cls: string;
}[] = [
  {
    key: '1',
    label: '1 · Nochmal',
    sub: 'sofort',
    cls: 'bg-[#FAD7DC] hover:bg-[#F4B5BE] border-[#E598A4] text-[#49352D]',
  },
  {
    key: '2',
    label: '2 · Schwer',
    sub: 'kurz',
    cls: 'bg-[#FBE7D3] hover:bg-[#F5D6B8] border-[#E5BE96] text-[#49352D]',
  },
  {
    key: '3',
    label: '3 · Geht',
    sub: 'mittel',
    cls: 'bg-[#F3E9DC] hover:bg-[#E6D7C8] border-[#D8C5B4] text-[#49352D]',
  },
  {
    key: '4',
    label: '4 · Gut',
    sub: 'sicher',
    cls: 'bg-[#E5EFD9] hover:bg-[#D5E5C2] border-[#B4C89D] text-[#3F5232]',
  },
  {
    key: '5',
    label: '5 · Sofort',
    sub: 'fast-track',
    cls: 'bg-[#DCE8CE] hover:bg-[#C8D9B5] border-[#96B07E] text-[#2F4222]',
  },
];

export const StudySection: React.FC<StudySectionProps> = ({
  decks,
  cards,
  srsMap,
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
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [writingSubmitted, setWritingSubmitted] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(0);

  const writingInputRef = useRef<HTMLInputElement>(null);
  const { speak, stopSpeech, prefetchAudio, isSpeaking, isLoadingAudio } =
    useMandarinSpeech();

  const currentDeck = useMemo(
    () => decks.find((d) => d.id === selectedDeckId) || decks[0],
    [decks, selectedDeckId]
  );

  const deckCards = useMemo(
    () => cards.filter((c) => c.deckId === currentDeck.id),
    [cards, currentDeck.id]
  );

  // Determine cards eligible for the chosen mode filter.
  // Word cards ('vocab') also support 'writing' practice without duplicating JSON records.
  const studyQueue = useMemo(() => {
    const filtered = deckCards.filter((card) => {
      if (activeModeFilter === 'writing') {
        return card.mode === 'writing' || card.mode === 'vocab';
      }
      if (activeModeFilter !== 'all') {
        return card.mode === activeModeFilter;
      }
      return settings.enabledModes[card.mode];
    });
    return filtered.length > 0 ? filtered : deckCards;
  }, [deckCards, activeModeFilter, settings.enabledModes]);

  const cardById = useMemo(() => {
    const map = new Map<string, Flashcard>();
    for (const c of studyQueue) map.set(c.id, c);
    return map;
  }, [studyQueue]);

  const bridgeMap = useMemo(() => {
    const map: Record<string, CantoneseBridgeKind | undefined> = {};
    for (const c of studyQueue) map[c.id] = c.cantoneseBridge;
    return map;
  }, [studyQueue]);

  // Confidence-loop state (achsoo reference engine)
  const [loopState, setLoopState] = useState<DeckLoopState>(() =>
    createInitialDeckLoopState(
      currentDeck.id,
      studyQueue.map((c) => c.id),
      srsMap,
      bridgeMap,
      undefined,
      settings.defaultDirection
    )
  );

  // Re-initialize confidence loop when deck, mode filter, shuffle, or manual restart changes
  useEffect(() => {
    setLoopState(
      createInitialDeckLoopState(
        currentDeck.id,
        studyQueue.map((c) => c.id),
        srsMap,
        bridgeMap,
        undefined,
        settings.defaultDirection,
        isShuffled ? `shuffle-${currentDeck.id}-${sessionSeed}` : undefined
      )
    );
    setIsRevealed(false);
    setWritingInput('');
    setWritingSubmitted(false);
    stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDeck.id, activeModeFilter, isShuffled, settings.defaultDirection, sessionSeed]);

  const currentCard = loopState.currentCardId
    ? cardById.get(loopState.currentCardId)
    : undefined;

  const effectiveMode: StudyMode =
    activeModeFilter === 'writing'
      ? 'writing'
      : activeModeFilter === 'listening'
      ? 'listening'
      : currentCard?.mode ?? 'vocab';

  // Reset per-card UI and prefetch next card's audio
  useEffect(() => {
    setIsRevealed(false);
    setWritingInput('');
    setWritingSubmitted(false);
    stopSpeech();

    if (currentCard?.audioUrl) {
      prefetchAudio(currentCard.audioUrl);
    }
    const nextCandidateId =
      loopState.activePool.find((id) => id !== loopState.currentCardId) ??
      loopState.waitingQueue[0];
    const nextCard = nextCandidateId ? cardById.get(nextCandidateId) : undefined;
    if (nextCard?.audioUrl) {
      prefetchAudio(nextCard.audioUrl);
    }
  }, [
    loopState.currentCardId,
    loopState.virtualClock,
    currentCard?.audioUrl,
    loopState.activePool,
    loopState.waitingQueue,
    cardById,
    prefetchAudio,
    stopSpeech,
  ]);

  const playCurrentMandarin = (forceSlow?: boolean) => {
    if (!currentCard) return;
    speak(currentCard.hanzi, {
      audioUrl: currentCard.audioUrl,
      slowUrl: currentCard.audioSlowUrl,
      slow: forceSlow ?? slowAudio,
    });
  };

  const handleSelectModeFilter = (mode: SessionModeFilter) => {
    setActiveModeFilter(mode);
    setShowModePicker(false);
  };

  const handleSkipNext = () => {
    // Treat skip as a soft rate '3' inside the loop without altering SRS mastery
    if (!currentCard) return;
    setLoopState((prev) => applyLoopRating(prev, currentCard.id, '3'));
  };

  const handleCheckWriting = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setWritingSubmitted(true);
    setIsRevealed(true);
    playCurrentMandarin();
  };

  const handleRevealAnswer = () => {
    setIsRevealed(true);
    if (currentCard && effectiveMode === 'listening') {
      playCurrentMandarin();
    }
  };

  const handleRateAndAdvance = (rating: RatingKey) => {
    if (!currentCard) return;
    onRateCard(currentCard.id, rating, settings.defaultDirection);
    setLoopState((prev) => applyLoopRating(prev, currentCard.id, rating));
  };

  // Keyboard shortcuts (Space/Enter to reveal, 1-5 to rate)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (!currentCard || loopState.phase === 'done') return;

      if (!isRevealed && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        handleRevealAnswer();
      } else if (isRevealed && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        handleRateAndAdvance(e.key as RatingKey);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard, isRevealed, loopState.phase, settings.defaultDirection]);

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
          badgeBg: 'bg-[#FAD7DC] border-[#F0BFC7] text-[#49352D]',
          icon: BookOpen,
        };
      case 'writing':
        return {
          label: 'Schreibübung',
          badgeBg: 'bg-[#E3ECD6] border-[#C5D4B3] text-[#49352D]',
          icon: Pencil,
        };
      case 'listening':
        return {
          label: 'Hörübung',
          badgeBg: 'bg-[#F6DCE8] border-[#E8C2D5] text-[#49352D]',
          icon: Headphones,
        };
    }
  };

  const modeCounts = useMemo(() => {
    const writingCount = deckCards.filter(
      (c) => c.mode === 'writing' || c.mode === 'vocab'
    ).length;
    return {
      all: deckCards.length,
      vocab: deckCards.filter((c) => c.mode === 'vocab').length,
      writing: writingCount,
      listening: deckCards.filter((c) => c.mode === 'listening').length,
    };
  }, [deckCards]);

  const progressPct = computeDeckLoopProgressPct(loopState);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-4 sm:p-7 shadow-xs">
        {/* Top Study Header */}
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
                onChange={(e) => onSelectDeck(e.target.value)}
                aria-label="Deck auswählen"
                className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-xl px-3 py-1.5 text-sm sm:text-base font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C] cursor-pointer max-w-[230px] sm:max-w-none"
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
              onClick={() => setSlowAudio((prev) => !prev)}
              title="Langsamer Modus (0.8×)"
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                slowAudio
                  ? 'bg-[#E3ECD6] border-[#A9B99A] text-[#3F5232]'
                  : 'bg-[#FFFDF9] border-[#E6D7C8] text-[#6B5344] hover:text-[#49352D]'
              }`}
            >
              {slowAudio ? '0.8× Langsam' : '1.0× Normal'}
            </button>

            <button
              onClick={() => setShowModePicker((prev) => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                showModePicker
                  ? 'bg-[#FAD7DC] border-[#E98F9C] text-[#49352D]'
                  : 'bg-[#FFFDF9] border-[#E6D7C8] text-[#6B5344] hover:text-[#49352D]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Modus</span>
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

        {/* Mode Filter Bar */}
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
                  Schriftzeichen, Pinyin & Bedeutung lernen.
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
                  Vereinfachte Zeichen per Tastatur üben.
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
                  Ganze Mandarin-Sätze über Audio verstehen.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Session Progress Bar (Confidence Loop) */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-[#EADFD3] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#E58F9D] transition-all duration-300"
              style={{ width: `${Math.max(4, progressPct)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#6B5344] tabular-nums shrink-0">
            {loopState.phase === 'sweep'
              ? `Abschluss-Check (${loopState.sweepPassedIds.length}/${loopState.finalCheckTotal})`
              : `${loopState.clearedIds.length} / ${loopState.orderedCardIds.length} sicher (${progressPct}%)`}
          </span>
        </div>

        {/* Done State */}
        {loopState.phase === 'done' || !currentCard ? (
          <div className="mt-6 bg-[#FFFDF9] border-2 border-[#C9D6B8] rounded-3xl p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#E3ECD6] flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7 text-[#557042]" />
            </div>
            <h2 className="text-xl font-bold text-[#49352D]">
              Runde abgeschlossen! 太棒了 ♡
            </h2>
            <p className="text-sm font-semibold text-[#6B5344] mt-1">
              Alle {loopState.orderedCardIds.length} Karten dieses Sets sind gefestigt.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSessionSeed((s) => s + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E38B98] hover:bg-[#D87A88] text-white font-bold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Neue Wiederholungsrunde</span>
              </button>
              <button
                onClick={onBackHome}
                className="px-5 py-2.5 rounded-full bg-[#F3E9DC] hover:bg-[#E6D7C8] text-[#49352D] font-bold text-sm cursor-pointer"
              >
                Zurück zur Übersicht
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Active Flashcard Stage */}
            <div className="mt-5 relative flex items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={onBackHome}
                aria-label="Zurück"
                className="hidden sm:flex w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] items-center justify-center text-[#6B5344] hover:text-[#49352D] hover:bg-[#F5E9DC] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="w-full max-w-xl">
                {(() => {
                  const modeMeta = getModeMeta(effectiveMode);
                  const ModeIcon = modeMeta.icon;
                  const cardSurfaceClass =
                    effectiveMode === 'writing'
                      ? 'bg-[#F3F6EC] border-[#C9D6B8]'
                      : effectiveMode === 'listening'
                      ? 'bg-[#FCF5F9] border-[#E8C9DA]'
                      : isRevealed
                      ? 'bg-[#F4F7EE] border-[#CEDBC0]'
                      : 'bg-[#FFFDF9] border-[#E8D5C8]';

                  const isDivergent =
                    currentCard.cantoneseBridge === 'non_cognate' ||
                    currentCard.cantoneseBridge === 'false_friend';

                  return (
                    <div
                      className={`relative overflow-hidden rounded-3xl border-2 p-5 sm:p-8 min-h-[330px] sm:min-h-[360px] flex flex-col justify-between transition-colors duration-200 shadow-xs ${cardSurfaceClass}`}
                    >
                      <div className="pointer-events-none absolute -top-1 -right-2 opacity-90">
                        <SakuraBranchCorner className="w-32 h-22 sm:w-36 sm:h-24" />
                      </div>

                      <div className="pointer-events-none absolute bottom-3 left-3 opacity-80">
                        <SmallSakuraFlower className="w-7 h-7" />
                      </div>

                      {/* Card Top Bar */}
                      <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold ${modeMeta.badgeBg}`}
                          >
                            <ModeIcon className="w-4 h-4" />
                            <span>{modeMeta.label}</span>
                          </div>

                          {isDivergent && (
                            <span className="px-2.5 py-1 rounded-full bg-[#FBE7D3] border border-[#E5BE96] text-[11px] font-bold text-[#6B421C]">
                              Kantonesisch ≠ Mandarin
                            </span>
                          )}
                        </div>

                        {effectiveMode === 'vocab' && (
                          <button
                            onClick={onTogglePinyin}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF9F1]/90 border border-[#E6D7C8] text-[#6B5344] hover:text-[#49352D] transition-colors cursor-pointer"
                            title="Pinyin ein-/ausblenden"
                          >
                            Pinyin: {settings.showPinyin ? 'An' : 'Aus'}
                          </button>
                        )}
                      </div>

                      {/* MODE 1: VOCABULARY */}
                      {effectiveMode === 'vocab' && (
                        <div className="relative z-10 my-auto py-5 flex flex-col items-center justify-center text-center">
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

                                  {currentCard.traditional &&
                                    currentCard.traditional !== currentCard.hanzi && (
                                      <p className="mt-1 text-xs font-semibold text-[#8C7568]">
                                        Traditionell:{' '}
                                        <span className="font-chinese">
                                          {currentCard.traditional}
                                        </span>
                                      </p>
                                    )}

                                  <div className="mt-4 flex items-center justify-center gap-2.5">
                                    <button
                                      onClick={() => playCurrentMandarin()}
                                      aria-label="Mandarin Aussprache abspielen"
                                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                        isSpeaking
                                          ? 'bg-[#E98F9C] text-white scale-105'
                                          : 'bg-[#FAD7DC]/80 text-[#49352D] hover:bg-[#F4B5BE]'
                                      }`}
                                    >
                                      {isLoadingAudio ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Volume2 className="w-5 h-5" />
                                      )}
                                    </button>

                                    {settings.showPinyin && (
                                      <span className="text-xl sm:text-2xl font-bold text-[#6B5344]">
                                        {currentCard.pinyin}
                                      </span>
                                    )}
                                  </div>

                                  {isRevealed && (
                                    <div className="mt-5 px-5 py-2.5 rounded-2xl bg-[#FFFDF9]/90 border border-[#CEDBC0]">
                                      <p className="text-lg sm:text-xl font-bold text-[#49352D]">
                                        {currentCard.german}
                                      </p>
                                      {(currentCard.grammar || currentCard.level) && (
                                        <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                                          {currentCard.level}
                                          {currentCard.grammar ? ` · ${currentCard.grammar}` : ''}
                                        </p>
                                      )}
                                      {currentCard.bridgeNote && (
                                        <p className="text-xs font-bold text-[#8A5A2B] mt-1.5">
                                          {currentCard.bridgeNote}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            }

                            return (
                              <>
                                <p className="text-2xl sm:text-3xl font-bold text-[#49352D] leading-snug">
                                  {currentCard.german}
                                </p>

                                <div className="mt-3 flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => playCurrentMandarin()}
                                    aria-label="Mandarin Aussprache abspielen"
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                      isSpeaking
                                        ? 'bg-[#A9B99A] text-white scale-105'
                                        : 'bg-[#E2ECD5] text-[#49352D] hover:bg-[#CEDBC0]'
                                    }`}
                                  >
                                    {isLoadingAudio ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Volume2 className="w-5 h-5" />
                                    )}
                                  </button>

                                  {isRevealed && (
                                    <span className="text-lg font-bold text-[#49352D]">
                                      <span className="font-chinese text-2xl mr-1.5">
                                        {currentCard.hanzi}
                                      </span>
                                      {settings.showPinyin && `(${currentCard.pinyin})`}
                                    </span>
                                  )}
                                </div>

                                {isRevealed && currentCard.bridgeNote && (
                                  <p className="mt-3 text-xs font-bold text-[#8A5A2B] bg-[#FBE7D3]/70 px-3 py-1.5 rounded-xl">
                                    {currentCard.bridgeNote}
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* MODE 2: WRITING PRACTICE */}
                      {effectiveMode === 'writing' && (
                        <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center text-center">
                          {!isRevealed ? (
                            <form
                              onSubmit={handleCheckWriting}
                              className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                              <p className="text-2xl sm:text-3xl font-bold text-[#49352D]">
                                {currentCard.german}
                              </p>
                              <p className="text-xs font-semibold text-[#8C7568] mt-1">
                                {currentCard.grammar || 'Wort'} · {currentCard.level || 'HSK 1'}
                                {settings.showPinyin ? ` · Pinyin: ${currentCard.pinyin}` : ''}
                              </p>

                              <div className="mt-5 w-full relative">
                                <input
                                  ref={writingInputRef}
                                  type="text"
                                  lang="zh-CN"
                                  value={writingInput}
                                  onChange={(e) => setWritingInput(e.target.value)}
                                  placeholder="Vereinfachte Schriftzeichen eingeben..."
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
                                  <Keyboard className="w-4 h-4 text-[#8C7568]" aria-hidden="true" />
                                </div>
                              </div>

                              <button
                                type="submit"
                                className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#8FA47D] hover:bg-[#7F946D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                              >
                                <Check className="w-4 h-4 stroke-[2.6]" />
                                <span>Überprüfen</span>
                              </button>
                            </form>
                          ) : (
                            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                              <p className="text-sm font-bold text-[#6B5344]">
                                {currentCard.german}
                              </p>
                              <p className="mt-2 font-chinese text-5xl sm:text-6xl font-bold text-[#49352D] tracking-wide">
                                {currentCard.hanzi}
                              </p>
                              {currentCard.traditional &&
                                currentCard.traditional !== currentCard.hanzi && (
                                  <p className="mt-1 text-xs font-semibold text-[#8C7568]">
                                    Traditionell:{' '}
                                    <span className="font-chinese">
                                      {currentCard.traditional}
                                    </span>
                                  </p>
                                )}

                              <div className="mt-3 flex items-center justify-center gap-2.5">
                                <span className="text-xl font-bold text-[#6B5344]">
                                  {currentCard.pinyin}
                                </span>
                                <button
                                  onClick={() => playCurrentMandarin()}
                                  aria-label="Mandarin Aussprache abspielen"
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    isSpeaking
                                      ? 'bg-[#8FA47D] text-white scale-105'
                                      : 'bg-[#DCE5D0] text-[#49352D] hover:bg-[#C9D6B8]'
                                  }`}
                                >
                                  {isLoadingAudio ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Volume2 className="w-5 h-5" />
                                  )}
                                </button>
                              </div>

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

                      {/* MODE 3: LISTENING PRACTICE (Mandarin audio only on front) */}
                      {effectiveMode === 'listening' && (
                        <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center text-center">
                          {!isRevealed ? (
                            <div className="flex flex-col items-center justify-center py-4">
                              <div className="flex items-center justify-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-1 h-12" aria-hidden="true">
                                  {[14, 26, 36, 22, 30, 16].map((h, i) => (
                                    <span
                                      key={`l-${i}`}
                                      style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                                      className={`w-1.5 rounded-full bg-[#DFB4C8] transition-transform ${
                                        isSpeaking ? 'animate-wave-bar' : ''
                                      }`}
                                    />
                                  ))}
                                </div>

                                <button
                                  onClick={() => playCurrentMandarin()}
                                  aria-label="Mandarin Satz anhören"
                                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4B5BE] hover:bg-[#E98F9C] active:scale-95 text-[#49352D] flex items-center justify-center shadow-sm border-4 border-[#FCE6EA] transition-all cursor-pointer ${
                                    isSpeaking ? 'ring-4 ring-[#F4B5BE]/40 scale-105' : ''
                                  }`}
                                >
                                  {isLoadingAudio ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-[#C86D7A]" />
                                  ) : (
                                    <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-[#C86D7A] text-[#C86D7A] ml-1" />
                                  )}
                                </button>

                                <div className="flex items-center gap-1 h-12" aria-hidden="true">
                                  {[16, 30, 22, 36, 26, 14].map((h, i) => (
                                    <span
                                      key={`r-${i}`}
                                      style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
                                      className={`w-1.5 rounded-full bg-[#DFB4C8] transition-transform ${
                                        isSpeaking ? 'animate-wave-bar' : ''
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              {currentCard.audioSlowUrl && (
                                <button
                                  type="button"
                                  onClick={() => playCurrentMandarin(true)}
                                  className="mt-4 px-3.5 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] text-xs font-bold text-[#6B5344] hover:text-[#49352D] cursor-pointer"
                                >
                                  Langsam abspielen (0.8×)
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                              <p className="font-chinese text-3xl sm:text-4xl font-bold text-[#49352D] leading-snug">
                                {currentCard.hanzi}
                              </p>

                              <div className="mt-3 flex items-center justify-center gap-2.5">
                                <span className="text-base sm:text-lg font-bold text-[#6B5344]">
                                  {currentCard.pinyin}
                                </span>
                                <button
                                  onClick={() => playCurrentMandarin()}
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

                              {/* German meaning box — no German TTS button (Mandarin audio only) */}
                              <div className="mt-5 w-full bg-[#EFE7DC]/90 border border-[#DFD1C1] rounded-2xl px-4 py-3 text-center">
                                <span className="text-sm sm:text-base font-bold text-[#49352D]">
                                  {currentCard.german}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="relative z-10 flex items-end justify-between min-h-[40px]">
                        <div className="flex items-center">
                          {effectiveMode === 'writing' && !isRevealed && (
                            <div className="-mb-3 -ml-2">
                              <CatWritingNotebook className="w-22 h-18 sm:w-26 sm:h-20" />
                            </div>
                          )}
                        </div>
                        <div className="-mb-3 -mr-2">
                          {effectiveMode === 'vocab' && renderCardIllustration(currentCard)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button
                onClick={handleSkipNext}
                aria-label="Später zeigen"
                title="Später zeigen"
                className="hidden sm:flex w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] items-center justify-center text-[#6B5344] hover:text-[#49352D] hover:bg-[#F5E9DC] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Controls Bar: Direction Switcher + 5-Point Confidence Rating */}
            <div className="mt-5 flex flex-col items-center gap-3.5 max-w-xl mx-auto">
              <div className="w-full flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#E6D7C8] rounded-full p-1 shadow-2xs">
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

                {!isRevealed && (
                  <button
                    onClick={handleRevealAnswer}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FAD7DC] hover:bg-[#F4B5BE] border border-[#E98F9C]/40 text-[#49352D] font-bold text-sm shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 text-[#C86D7A]" />
                    <span>Antwort zeigen (Leertaste)</span>
                  </button>
                )}
              </div>

              {isRevealed && (
                <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2">
                  {CONFIDENCE_BUTTONS.map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => handleRateAndAdvance(btn.key)}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-2xl border font-bold transition-all cursor-pointer ${btn.cls}`}
                    >
                      <span className="text-[11px] sm:text-xs leading-tight whitespace-nowrap">
                        {btn.label}
                      </span>
                      <span className="text-[10px] font-semibold opacity-75 hidden sm:inline">
                        {btn.sub}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
