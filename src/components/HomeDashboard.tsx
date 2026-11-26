import React from 'react';
import {
  BookOpen,
  MessageSquare,
  Volume2,
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  CardSrsState,
  Deck,
  Flashcard,
  PlacementResult,
  StudyStats,
  UiLanguage,
} from '../types';
import {
  CatWithBobaAndBao,
  CuteCalendarIcon,
  CuteFlameIcon,
  CuteLayersIcon,
  CuteChartIcon,
  DeckStickerArtwork,
} from './KawaiiIllustrations';
import { AnimatedMascotScene } from './AnimatedMascotScene';
import { getUiStrings } from '../data/uiStrings';

interface HomeDashboardProps {
  decks: Deck[];
  cards: Flashcard[];
  stats: StudyStats;
  srsMap: Record<string, CardSrsState>;
  placement: PlacementResult;
  uiLanguage?: UiLanguage;
  onStartStudy: (deckId?: string) => void;
  onOpenDecks: () => void;
  onOpenPlacement: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  decks,
  cards,
  stats,
  srsMap,
  placement,
  uiLanguage = 'de',
  onStartStudy,
  onOpenDecks,
  onOpenPlacement,
}) => {
  const t = getUiStrings(uiLanguage).home;
  const navT = getUiStrings(uiLanguage).nav;
  const totalCardsCount = cards.length;
  const featuredDecks = decks.slice(0, 3);

  const renderDeckIllustration = (type: Deck['illustration']) => (
    <DeckStickerArtwork illustration={type} className="w-15 h-14" />
  );

  const renderDeckCategoryIcon = (index: number, theme: Deck['theme']) => {
    const iconColor = theme === 'pink' ? 'text-[#C86D7A]' : 'text-[#6A7F5B]';
    if (index === 0) return <BookOpen className={`w-4 h-4 ${iconColor}`} />;
    if (index === 1) return <MessageSquare className={`w-4 h-4 ${iconColor}`} />;
    return <Volume2 className={`w-4 h-4 ${iconColor}`} />;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Mobile Header Bar */}
      <div className="flex md:hidden items-center justify-between mb-4 pb-2 border-b border-[#E6D7C8]">
        <div className="flex items-center gap-2">
          <img
            src="/assets/mascots/lantern-festival.png"
            alt="Laternenfest Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="font-chinese text-xl font-bold text-[#49352D]">中文卡片</span>
          <img
            src="/assets/accents/heart-pink.png"
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain"
          />
        </div>
        <span className="text-xs font-semibold text-[#8C7568]">
          {navT.motto}
        </span>
      </div>

      {/* Main Dashboard Card Container */}
      <div className="relative overflow-hidden bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-5 sm:p-7 shadow-xs">
        <img
          src="/assets/accents/bow-pink.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-4 w-10 h-8 object-contain opacity-90 animate-orbit-sway"
        />

        {/* Today's Learning Hero Split */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7 flex flex-col justify-center">
            <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-4">
                <CuteCalendarIcon className="w-14 h-14 shrink-0" />
                <div>
                  <h1 className="text-sm font-bold text-[#6B5344]">{t.studyToday}</h1>
                  <p className="text-2xl sm:text-3xl font-bold text-[#49352D] tabular-nums leading-tight mt-0.5">
                    {stats.dueToday}{' '}
                    <span className="text-base sm:text-lg font-semibold text-[#6B5344]">
                      {t.cardsWord}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onStartStudy()}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-[#E38B98] hover:bg-[#D87A88] active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{t.studyNow}</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  onClick={onOpenPlacement}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FDF7F0] hover:bg-[#F5E9DC] border border-[#E6D7C8] text-[#49352D] font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  {placement.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#7F946D]" />
                      <span>
                        {t.levelPrefix} {placement.recommendedHskLevel}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C86D7A]" />
                      <span>{t.placementBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="sm:col-span-5 flex justify-center sm:justify-end items-end pt-2 sm:pt-4">
            <CatWithBobaAndBao className="w-48 h-38 sm:w-56 sm:h-44" />
          </div>
        </div>

        {/* Cantonese -> Mandarin Calibration Banner with Keroppi Globe Traveler */}
        <div className="mt-5 bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <AnimatedMascotScene
              mascot="globeTraveler"
              className="w-16 h-20 shrink-0"
              accents={['paperPlane', 'compassMini']}
              idleMotion="breathe"
            />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-[#49352D]">
                {placement.completed
                  ? t.calibratedTitle(
                      placement.readingLevel,
                      placement.readingAccuracy,
                      placement.listeningLevel,
                      placement.listeningAccuracy
                    )
                  : t.uncalibratedTitle}
              </p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                {placement.completed ? t.calibratedDesc : t.uncalibratedDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPlacement}
            className="shrink-0 px-4 py-2 rounded-full bg-[#E3ECD6] hover:bg-[#D4E2C1] border border-[#C5D4B3] text-xs font-bold text-[#49352D] cursor-pointer whitespace-nowrap"
          >
            {placement.completed ? t.retest : t.startTest}
          </button>
        </div>

        {/* Three Statistics Cards */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-center lg:items-center justify-start text-center lg:text-left gap-2 lg:gap-3.5">
            <CuteFlameIcon className="w-9 h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-lg sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight">
                {stats.streakDays}
              </p>
              <p className="text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                {t.streak}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-center lg:items-center justify-start text-center lg:text-left gap-2 lg:gap-3.5">
            <CuteLayersIcon className="w-9 h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-lg sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight">
                {totalCardsCount}
              </p>
              <p className="text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                {t.totalCards}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-center lg:items-center justify-start text-center lg:text-left gap-2 lg:gap-3.5">
            <CuteChartIcon className="w-9 h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-lg sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight">
                {stats.weeklyAccuracy}%
              </p>
              <p className="text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                {t.weeklyAccuracy}
              </p>
            </div>
          </div>
        </div>

        {/* Meine Decks Section */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-bold text-[#49352D]">{t.myDecks}</h2>
            <button
              onClick={onOpenDecks}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#6B5344] hover:text-[#49352D] transition-colors cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {featuredDecks.map((deck, idx) => {
              const deckCards = cards.filter((c) => c.deckId === deck.id);
              const total = deckCards.length;
              const learned = deckCards.filter(
                (c) => c.learned || srsMap[c.id]?.mastered
              ).length;
              const progressPct = total > 0 ? Math.round((learned / total) * 100) : 0;

              const isPink = deck.theme === 'pink';
              const cardBg = isPink
                ? 'bg-[#FCECEF]/90 border-[#F2CFD6]'
                : 'bg-[#EDF1E4]/90 border-[#D8E2C8]';
              const barTrack = isPink ? 'bg-[#F3D2D8]' : 'bg-[#D8E2C8]';
              const barFill = isPink ? 'bg-[#E58F9D]' : 'bg-[#94A884]';

              return (
                <button
                  key={deck.id}
                  onClick={() => onStartStudy(deck.id)}
                  className={`group text-left relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-xs cursor-pointer flex flex-col justify-between min-h-[126px] ${cardBg}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="z-10">
                      <div className="w-7 h-7 rounded-lg bg-[#FFFDF9]/80 border border-[#E6D7C8] flex items-center justify-center mb-2">
                        {renderDeckCategoryIcon(idx, deck.theme)}
                      </div>
                      <h3 className="text-sm font-bold text-[#49352D] leading-snug line-clamp-2 pr-8">
                        {deck.title}
                      </h3>
                    </div>

                    <div className="shrink-0 -mt-1 -mr-1 transition-transform group-hover:scale-105">
                      {renderDeckIllustration(deck.illustration)}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-[#6B5344] tabular-nums mb-1.5">
                      {learned} / {total} {t.cardsWord}
                    </p>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${barTrack}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barFill}`}
                        style={{ width: `${Math.max(8, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
