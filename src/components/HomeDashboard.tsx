import React from 'react';
import { BookOpen, MessageSquare, Volume2, ArrowRight, Play } from 'lucide-react';
import { Deck, Flashcard, StudyStats } from '../types';
import {
  CatWithBobaAndBao,
  SakuraBranchCorner,
  CuteCalendarIcon,
  CuteFlameIcon,
  CuteLayersIcon,
  CuteChartIcon,
  PottedFlowerIllustration,
  LeavesInVaseIllustration,
  DangoSkewerIllustration,
  AppleWithSlice,
  CatHoldingApple,
} from './KawaiiIllustrations';

interface HomeDashboardProps {
  decks: Deck[];
  cards: Flashcard[];
  stats: StudyStats;
  onStartStudy: (deckId?: string) => void;
  onOpenDecks: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  decks,
  cards,
  stats,
  onStartStudy,
  onOpenDecks,
}) => {
  const totalCardsCount = cards.length;
  const featuredDecks = decks.slice(0, 3);

  const renderDeckIllustration = (type: Deck['illustration']) => {
    switch (type) {
      case 'flower':
        return <PottedFlowerIllustration className="w-11 h-13" />;
      case 'leaves':
        return <LeavesInVaseIllustration className="w-11 h-13" />;
      case 'dango':
        return <DangoSkewerIllustration className="w-11 h-13" />;
      case 'apple':
        return <AppleWithSlice className="w-12 h-11" />;
      case 'cat':
        return <CatHoldingApple className="w-12 h-11" />;
      default:
        return <PottedFlowerIllustration className="w-11 h-13" />;
    }
  };

  const renderDeckCategoryIcon = (index: number, theme: Deck['theme']) => {
    const iconColor = theme === 'pink' ? 'text-[#C86D7A]' : 'text-[#6A7F5B]';
    if (index === 0) return <BookOpen className={`w-4 h-4 ${iconColor}`} />;
    if (index === 1) return <MessageSquare className={`w-4 h-4 ${iconColor}`} />;
    return <Volume2 className={`w-4 h-4 ${iconColor}`} />;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Mobile Header Bar (Shown only on mobile since desktop has left sidebar) */}
      <div className="flex md:hidden items-center justify-between mb-4 pb-2 border-b border-[#E6D7C8]">
        <div className="flex items-center gap-1.5">
          <span className="font-chinese text-xl font-bold text-[#49352D]">中文卡片</span>
          <span className="text-[#E98F9C] text-lg" aria-hidden="true">
            ♥
          </span>
        </div>
        <span className="text-xs font-semibold text-[#8C7568]">
          Little steps, big progress.
        </span>
      </div>

      {/* Main Dashboard Card Container matching Reference 3 top-left */}
      <div className="relative overflow-hidden bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-5 sm:p-7 shadow-xs">
        {/* Top-Right Cherry Blossom Branch Decoration */}
        <div className="pointer-events-none absolute -top-1 -right-2 opacity-95">
          <SakuraBranchCorner className="w-36 h-24 sm:w-44 sm:h-28" />
        </div>

        {/* Today's Learning Hero Split */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7 flex flex-col justify-center">
            {/* "Heute lernen" Prominent Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-4">
                <CuteCalendarIcon className="w-12 h-12 shrink-0" />
                <div>
                  <h1 className="text-sm font-bold text-[#6B5344]">Heute lernen</h1>
                  <p className="text-2xl sm:text-3xl font-bold text-[#49352D] tabular-nums leading-tight mt-0.5">
                    {stats.dueToday}{' '}
                    <span className="text-base sm:text-lg font-semibold text-[#6B5344]">
                      Karten
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onStartStudy()}
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-[#E38B98] hover:bg-[#D87A88] active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Jetzt lernen</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Cute Cat with Bubble Tea & Baozi Illustration */}
          <div className="sm:col-span-5 flex justify-center sm:justify-end items-end pt-1 sm:pt-4">
            <CatWithBobaAndBao className="w-44 h-34 sm:w-52 sm:h-40 animate-float-gentle" />
          </div>
        </div>

        {/* Three Statistics Cards: Tage in Folge, Karten gesamt, Richtig diese Woche */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-6 items-stretch">
          <div className="bg-[#FFFDF9] border border-[#E8DCD0] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-center lg:items-center justify-start text-center lg:text-left gap-2 lg:gap-3.5">
            <CuteFlameIcon className="w-9 h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-lg sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight">
                {stats.streakDays}
              </p>
              <p className="text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                Tage in Folge
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
                Karten gesamt
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
                Richtig diese Woche
              </p>
            </div>
          </div>
        </div>

        {/* Meine Decks Section */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-bold text-[#49352D]">Meine Decks</h2>
            <button
              onClick={onOpenDecks}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#6B5344] hover:text-[#49352D] transition-colors cursor-pointer"
            >
              <span>Alle anzeigen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {featuredDecks.map((deck, idx) => {
              const deckCards = cards.filter((c) => c.deckId === deck.id);
              const total = deckCards.length;
              const learned = deckCards.filter((c) => c.learned).length;
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
                      {total} Karten
                    </p>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${barTrack}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barFill}`}
                        style={{ width: `${Math.max(15, progressPct)}%` }}
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
