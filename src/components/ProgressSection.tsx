import React from 'react';
import { BarChart2, BookOpen, Check, X, Pencil, Headphones } from 'lucide-react';
import { Deck, Flashcard, StudyStats } from '../types';
import {
  CuteFlameIcon,
  CuteLayersIcon,
  CuteChartIcon,
} from './KawaiiIllustrations';
import { AnimatedMascotScene } from './AnimatedMascotScene';

interface ProgressSectionProps {
  decks: Deck[];
  cards: Flashcard[];
  stats: StudyStats;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  decks,
  cards,
  stats,
}) => {
  const totalCards = cards.length;
  const learnedCards = cards.filter((c) => c.learned).length;

  const vocabCards = cards.filter((c) => c.mode === 'vocab');
  const writingCards = cards.filter(
    (c) => c.mode === 'writing' || c.mode === 'vocab'
  );
  const listeningCards = cards.filter((c) => c.mode === 'listening');

  // SVG Donut chart calculations for 82% Richtig
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stats.weeklyAccuracy / 100) * circumference;

  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 3:
        return 'bg-[#9BAE88] border-[#8B9E78]';
      case 2:
        return 'bg-[#BCCAA9] border-[#ACBA99]';
      case 1:
        return 'bg-[#DCE5D0] border-[#CCD5C0]';
      default:
        return 'bg-[#EFE7DC] border-[#E2D6C8]';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Lernfortschritt Box matching Reference 3 Bottom-Center */}
      <div className="bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xs">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E3ECD6] border border-[#C5D4B3] flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5 text-[#49352D]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#49352D] leading-tight">
              Lernfortschritt
            </h1>
            <p className="text-xs font-semibold text-[#8C7568] mt-0.5 leading-snug">
              Deine Lernaktivität, Genauigkeit und Fortschritte nach Kategorie
            </p>
          </div>
        </div>

        {/* Top Summary Metric Row — stacked & centered on mobile/tablet, horizontal on lg+ */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 lg:gap-4 mb-5 sm:mb-6 items-stretch">
          <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl px-2 py-3 sm:p-4 flex flex-col lg:flex-row items-center justify-start lg:justify-start text-center lg:text-left gap-1.5 sm:gap-2 lg:gap-3.5 min-w-0">
            <CuteFlameIcon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {stats.streakDays}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                Tage in Folge
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl px-2 py-3 sm:p-4 flex flex-col lg:flex-row items-center justify-start lg:justify-start text-center lg:text-left gap-1.5 sm:gap-2 lg:gap-3.5 min-w-0">
            <CuteLayersIcon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {learnedCards} / {totalCards}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                Karten gelernt
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl px-2 py-3 sm:p-4 flex flex-col lg:flex-row items-center justify-start lg:justify-start text-center lg:text-left gap-1.5 sm:gap-2 lg:gap-3.5 min-w-0">
            <CuteChartIcon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 shrink-0" />
            <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
              <p className="text-base sm:text-xl font-bold text-[#49352D] tabular-nums leading-tight whitespace-nowrap">
                {stats.weeklyAccuracy}%
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#8C7568] leading-snug mt-0.5 text-balance">
                Genauigkeit
              </p>
            </div>
          </div>
        </div>

        {/* Centerpiece: Weekly Activity Heatmap + Circular Donut + Today's Breakdown */}
        <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left: Mo Di Mi Do Fr Sa So Activity Grid */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <p className="text-xs font-bold text-[#6B5344] mb-3">
              Wöchentliche Aktivität
            </p>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-bold text-[#8C7568] mb-0.5"
                >
                  {day}
                </span>
              ))}

              {stats.activityGrid.map((week, wIdx) =>
                week.map((val, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    title={`Woche ${wIdx + 1}, ${WEEKDAYS[dIdx]}: ${val * 6} Karten`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-lg border transition-transform hover:scale-105 ${getCellColor(
                      val
                    )}`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Center: 82% Richtig Circular Donut Ring */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center pt-5 border-t border-[#EFE4D8] lg:pt-0 lg:border-t-0">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Soft Pink Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#F4C7CE"
                  strokeWidth="12"
                />
                {/* Sage Green Progress Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#9BAE88"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-bold text-[#49352D] tabular-nums">
                  {stats.weeklyAccuracy}%
                </span>
                <span className="text-xs font-bold text-[#6B5344]">Richtig</span>
              </div>
            </div>
          </div>

          {/* Right: Heute gelernt / Richtig / Falsch table */}
          <div className="lg:col-span-4 divide-y divide-[#EFE4D8] pt-4 border-t border-[#EFE4D8] lg:pt-0 lg:border-t-0">
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 text-[#8C6754] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">
                  Heute gelernt
                </span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayLearned}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className="w-4 h-4 text-[#6A7F5B] stroke-[2.8] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">Richtig</span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayCorrect}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <X className="w-4 h-4 text-[#D97786] stroke-[2.8] shrink-0" />
                <span className="text-sm font-bold text-[#49352D]">Falsch</span>
              </div>
              <span className="text-base font-bold text-[#49352D] tabular-nums shrink-0">
                {stats.todayWrong}
              </span>
            </div>
          </div>
        </div>

        {/* Cards Learned by Mode & Category */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: By Learning Mode */}
          <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-bold text-[#49352D] mb-3.5">
              Karten nach Lernmodus
            </h2>

            <div className="space-y-3">
              {/* Vocabulary */}
              <div className="p-3 rounded-2xl bg-[#FCECEF]/80 border border-[#F2CFD6]">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#C86D7A] shrink-0" />
                    <span className="truncate">Vokabeln (Wort ↔ Bedeutung)</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {vocabCards.filter((c) => c.learned).length} / {vocabCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F3D2D8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E58F9D]"
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

              {/* Writing */}
              <div className="p-3 rounded-2xl bg-[#EDF1E4]/80 border border-[#D8E2C8]">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Pencil className="w-4 h-4 text-[#6A7F5B] shrink-0" />
                    <span className="truncate">Schreibübung (Schriftzeichen)</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {writingCards.filter((c) => c.learned).length} /{' '}
                    {writingCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#D8E2C8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#94A884]"
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

              {/* Listening */}
              <div className="p-3 rounded-2xl bg-[#F8EBF4]/80 border border-[#E8CCE0]">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#49352D] mb-1.5">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Headphones className="w-4 h-4 text-[#A4678E] shrink-0" />
                    <span className="truncate">Hörübung (Sätze verstehen)</span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {listeningCards.filter((c) => c.learned).length} /{' '}
                    {listeningCards.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E8CCE0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C98FB4]"
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

          {/* Right Column: By Deck Category + Cute Cat Motivation */}
          <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#49352D] mb-3.5">
                Fortschritt nach Deck
              </h2>
              <div className="space-y-3">
                {decks.slice(0, 4).map((deck) => {
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
                      <div className="w-full h-2 rounded-full bg-[#EFE4D8] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            deck.theme === 'pink' ? 'bg-[#E58F9D]' : 'bg-[#94A884]'
                          }`}
                          style={{ width: `${Math.max(10, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Milestone Banner: Keroppi Gardener + Lantern Festival */}
            <div className="mt-5 pt-3 border-t border-[#EFE4D8] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-chinese text-base font-bold text-[#49352D]">
                  加油！一天一点点 ♡
                </p>
                <p className="text-xs font-semibold text-[#8C7568] leading-snug">
                  Wachse jeden Tag ein Stück weiter!
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <AnimatedMascotScene
                  mascot="gardenerKeroppi"
                  className="w-16 h-16"
                  accents={['leafGreen', 'sparkleFour']}
                  idleMotion="breathe"
                />
                <AnimatedMascotScene
                  mascot="lanternFestival"
                  className="w-16 h-16"
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
