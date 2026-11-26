import React from 'react';
import {
  BarChart2,
  BookOpen,
  Check,
  X,
  Pencil,
  Headphones,
} from 'lucide-react';
import { Deck, Flashcard, StudyStats, UiLanguage } from '../types';
import {
  CuteFlameIcon,
  CuteLayersIcon,
  CuteChartIcon,
} from './KawaiiIllustrations';
import { AnimatedMascotScene } from './AnimatedMascotScene';
import { getUiStrings } from '../data/uiStrings';

interface ProgressSectionProps {
  decks: Deck[];
  cards: Flashcard[];
  stats: StudyStats;
  uiLanguage?: UiLanguage;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  decks,
  cards,
  stats,
  uiLanguage = 'en',
}) => {
  const t = getUiStrings(uiLanguage).progress;
  const totalCards = cards.length;
  const learnedCards = cards.filter((c) => c.learned).length;

  const vocabCards = cards.filter((c) => c.mode === 'vocab');
  const writingCards = cards.filter(
    (c) => c.mode === 'writing' || c.mode === 'vocab'
  );
  const listeningCards = cards.filter((c) => c.mode === 'listening');

  const calculatedAccuracy =
    stats.todayLearned > 0
      ? Math.round((stats.todayCorrect / stats.todayLearned) * 100)
      : totalCards > 0
      ? Math.round((learnedCards / totalCards) * 100)
      : 0;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (calculatedAccuracy / 100) * circumference;

  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 3:
        return 'bg-[#9BAE88] border-[#8B9E78]';
      case 2:
        return 'bg-[#BCCAA9] border-[#ACBA99]';
      case 1:
        return 'bg-[#DCE5D0] border-[#CCD5C0]';
      default:
        return 'bg-[#F8F1E7] border-[#E9D8C8]';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#FFF9F3] border border-[#E9D8C8] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8EEDD] border border-[#A9B99A] flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5 text-[#49352D]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#49352D] leading-tight">
              {t.title}
            </h1>
            <p className="text-xs font-semibold text-[#8C7568] mt-0.5 leading-snug">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* 1. Three Compact Statistics */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 items-stretch">
          <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 min-w-0">
            <CuteFlameIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {stats.streakDays}{' '}
                {stats.streakDays === 1 ? t.daySingular : t.dayPlural}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5">
                {t.streakLabel}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 min-w-0">
            <CuteLayersIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {learnedCards} / {totalCards}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5">
                {t.cardsLearned}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 min-w-0">
            <CuteChartIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {calculatedAccuracy}%
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5">
                {t.accuracy}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Weekly Activity Grid + Accuracy Ring + Today's Summary */}
        <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <p className="text-xs font-bold text-[#6B5344] mb-2.5">
              {t.weeklyActivity}
            </p>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {t.weekdays.map((day) => (
                <span key={day} className="text-[11px] font-bold text-[#8C7568]">
                  {day}
                </span>
              ))}

              {stats.activityGrid.map((week, wIdx) =>
                week.map((val, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    title={`${t.weekdays[dIdx]}`}
                    className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg border ${getCellColor(
                      val
                    )}`}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col items-center justify-center pt-4 border-t border-[#E9D8C8] lg:pt-0 lg:border-t-0">
            <div className="relative w-26 h-26 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#F4B5BE"
                  strokeOpacity="0.45"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#A9B99A"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-[#49352D] tabular-nums">
                  {calculatedAccuracy}%
                </span>
                <span className="text-[11px] font-bold text-[#6B5344]">
                  {t.correctWord}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 divide-y divide-[#E9D8C8] pt-3 border-t border-[#E9D8C8] lg:pt-0 lg:border-t-0">
            <div className="py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-[#8C7568] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">
                  {t.learnedToday}
                </span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayLearned}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Check className="w-4 h-4 text-[#5D734C] stroke-[2.8] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">
                  {t.correctWord}
                </span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayCorrect}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <X className="w-4 h-4 text-[#C86D7A] stroke-[2.8] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">
                  {t.wrongToday}
                </span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayWrong}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Progress by Learning Mode & Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-bold text-[#49352D] mb-3">{t.byMode}</h2>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#F4B5BE]/25 border border-[#E98F9C]/40">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#C86D7A] shrink-0" />
                    <span className="truncate">{t.vocab}</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {vocabCards.filter((c) => c.learned).length} / {vocabCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F4B5BE]/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E98F9C]"
                    style={{
                      width: `${
                        vocabCards.length
                          ? Math.round(
                              (vocabCards.filter((c) => c.learned).length /
                                vocabCards.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#E8EEDD]/80 border border-[#A9B99A]/50">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Pencil className="w-4 h-4 text-[#5D734C] shrink-0" />
                    <span className="truncate">{t.writing}</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {writingCards.filter((c) => c.learned).length} /{' '}
                    {writingCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#D1DEC0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#A9B99A]"
                    style={{
                      width: `${
                        writingCards.length
                          ? Math.round(
                              (writingCards.filter((c) => c.learned).length /
                                writingCards.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#E8D9EB]/65 border border-[#C9B3CE]">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Headphones className="w-4 h-4 text-[#7D5987] shrink-0" />
                    <span className="truncate">{t.listening}</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {listeningCards.filter((c) => c.learned).length} /{' '}
                    {listeningCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#D6C2DB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#B48EB9]"
                    style={{
                      width: `${
                        listeningCards.length
                          ? Math.round(
                              (listeningCards.filter((c) => c.learned).length /
                                listeningCards.length) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#49352D] mb-3">{t.byDeck}</h2>
              <div className="space-y-2.5">
                {decks.map((deck) => {
                  const dCards = cards.filter((c) => c.deckId === deck.id);
                  const dLearned = dCards.filter((c) => c.learned).length;
                  const pct = dCards.length
                    ? Math.round((dLearned / dCards.length) * 100)
                    : 0;
                  return (
                    <div key={deck.id}>
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#6B5344] mb-1">
                        <span className="truncate">{deck.title}</span>
                        <span className="tabular-nums shrink-0">
                          {dLearned} / {dCards.length} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#F8F1E7] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            deck.theme === 'pink'
                              ? 'bg-[#E98F9C]'
                              : deck.theme === 'lavender'
                              ? 'bg-[#B48EB9]'
                              : 'bg-[#A9B99A]'
                          }`}
                          style={{ width: `${dCards.length ? Math.max(8, pct) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E9D8C8] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-chinese text-sm font-bold text-[#49352D]">
                  加油！一天一点点 ♡
                </p>
                <p className="text-xs font-semibold text-[#8C7568] leading-snug">
                  {t.masteredSummary(learnedCards, totalCards)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <AnimatedMascotScene
                  mascot="gardenerKeroppi"
                  className="w-15 h-15"
                  accents={['leafGreen', 'sparkleFour']}
                  idleMotion="breathe"
                />
                <AnimatedMascotScene
                  mascot="lanternFestival"
                  className="w-15 h-15"
                  accents={['starGold']}
                  idleMotion="float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
