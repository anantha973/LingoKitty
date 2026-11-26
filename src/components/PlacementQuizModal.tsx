import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  X,
  Check,
  ArrowRight,
  BookOpen,
  Headphones,
  Loader2,
} from 'lucide-react';
import { PlacementQuestion, PlacementResult } from '../types';
import { useMandarinSpeech } from '../hooks/useMandarinSpeech';
import { AnimatedMascotScene } from './AnimatedMascotScene';

interface PlacementQuizModalProps {
  questions: PlacementQuestion[];
  onClose: () => void;
  onComplete: (result: PlacementResult) => void;
}

interface AnswerRecord {
  question: PlacementQuestion;
  correct: boolean;
}

export const PlacementQuizModal: React.FC<PlacementQuizModalProps> = ({
  questions,
  onClose,
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [finishedResult, setFinishedResult] = useState<PlacementResult | null>(null);

  const { speak, stopSpeech, prefetchAudio, isSpeaking, isLoadingAudio } =
    useMandarinSpeech();

  const current = questions[index];

  useEffect(() => {
    stopSpeech();
    if (!current || finishedResult) return;
    const nextQ = questions[index + 1];
    if (nextQ?.audioUrl) {
      prefetchAudio(nextQ.audioUrl);
    }
    if (current.skill === 'listening') {
      speak(current.hanzi, { audioUrl: current.audioUrl });
    }
  }, [index, current, finishedResult, questions, prefetchAudio, speak, stopSpeech]);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const computeResult = (records: AnswerRecord[]): PlacementResult => {
    const levelStats: Record<number, { ok: number; total: number }> = {
      1: { ok: 0, total: 0 },
      2: { ok: 0, total: 0 },
      3: { ok: 0, total: 0 },
      4: { ok: 0, total: 0 },
    };
    let readOk = 0;
    let readTotal = 0;
    let listenOk = 0;
    let listenTotal = 0;

    for (const r of records) {
      const lvl = r.question.hskLevel;
      levelStats[lvl].total += 1;
      if (r.correct) levelStats[lvl].ok += 1;
      if (r.question.skill === 'reading') {
        readTotal += 1;
        if (r.correct) readOk += 1;
      } else {
        listenTotal += 1;
        if (r.correct) listenOk += 1;
      }
    }

    const levelAccuracies: Record<number, number> = {};
    let highestPassed: 1 | 2 | 3 | 4 = 1;
    for (const lvl of [1, 2, 3, 4] as const) {
      const st = levelStats[lvl];
      const pct = st.total > 0 ? Math.round((st.ok / st.total) * 100) : 0;
      levelAccuracies[lvl] = pct;
      if (pct >= 60 && lvl === highestPassed) {
        highestPassed = lvl < 4 ? ((lvl + 1) as 1 | 2 | 3 | 4) : 4;
      } else if (pct >= 60 && lvl > highestPassed && levelAccuracies[lvl - 1] >= 60) {
        highestPassed = lvl;
      }
    }

    const readingAccuracy = readTotal > 0 ? Math.round((readOk / readTotal) * 100) : 0;
    const listeningAccuracy =
      listenTotal > 0 ? Math.round((listenOk / listenTotal) * 100) : 0;

    const readingLevel: 1 | 2 | 3 | 4 =
      readingAccuracy >= 80 ? 3 : readingAccuracy >= 55 ? 2 : 1;
    const listeningLevel: 1 | 2 | 3 | 4 =
      listeningAccuracy >= 80 ? 3 : listeningAccuracy >= 55 ? 2 : 1;

    return {
      completed: true,
      recommendedHskLevel: highestPassed,
      readingLevel,
      listeningLevel,
      readingAccuracy,
      listeningAccuracy,
      levelAccuracies,
      completedAt: new Date().toISOString(),
    };
  };

  const handleAnswer = (option: string | null) => {
    if (!current || selectedOption !== null) return;
    const isCorrect = option !== null && option === current.german;
    setSelectedOption(option ?? '__skip__');

    const nextAnswers = [...answers, { question: current, correct: isCorrect }];
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      setSelectedOption(null);
      if (index + 1 >= questions.length) {
        stopSpeech();
        setFinishedResult(computeResult(nextAnswers));
      } else {
        setIndex((prev) => prev + 1);
      }
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#49352D]/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-5 sm:p-7 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FAD7DC] border border-[#F0BFC7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#49352D]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#49352D]">
                Einstufungstest · Kantonesisch → Mandarin
              </h2>
              <p className="text-xs font-semibold text-[#8C7568]">
                Wir überspringen Bekanntes und fokussieren Mandarin-Unterschiede
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            aria-label="Schließen"
            className="w-8 h-8 rounded-full bg-[#F5E9DC] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!finishedResult && current ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-[#8C7568] mb-1.5">
              <span>
                Frage {index + 1} / {questions.length}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#FFFDF9] border border-[#E6D7C8] text-[#49352D]">
                  HSK {current.hskLevel}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                    current.skill === 'reading'
                      ? 'bg-[#FAD7DC]/70 border-[#F0BFC7] text-[#49352D]'
                      : 'bg-[#E3ECD6]/80 border-[#C5D4B3] text-[#49352D]'
                  }`}
                >
                  {current.skill === 'reading' ? (
                    <>
                      <BookOpen className="w-3 h-3" /> Lesen
                    </>
                  ) : (
                    <>
                      <Headphones className="w-3 h-3" /> Hören
                    </>
                  )}
                </span>
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#EFE4D8] overflow-hidden mb-5">
              <div
                className="h-full bg-[#E98F9C] rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((index + 1) / questions.length) * 100)}%` }}
              />
            </div>

            {/* Prompt Box with Keroppi Explorer / Singing in the Rain */}
            <div className="relative bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-6 text-center mb-4">
              <div className="flex justify-center mb-2">
                {current.skill === 'reading' ? (
                  <AnimatedMascotScene
                    mascot="littleExplorer"
                    className="w-18 h-16"
                    accents={['leafGreen', 'compassMini']}
                    idleMotion="breathe"
                  />
                ) : (
                  <AnimatedMascotScene
                    mascot="singingRain"
                    className="w-18 h-16"
                    isAudioPlaying={isSpeaking}
                    idleMotion="float"
                  />
                )}
              </div>
              {current.skill === 'reading' ? (
                <>
                  <p className="font-chinese text-4xl sm:text-5xl font-bold text-[#49352D]">
                    {current.hanzi}
                  </p>
                  {current.traditional && (
                    <p className="mt-1.5 text-xs font-semibold text-[#8C7568]">
                      Traditionell: <span className="font-chinese">{current.traditional}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => speak(current.hanzi, { audioUrl: current.audioUrl })}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAD7DC]/70 hover:bg-[#FAD7DC] text-xs font-bold text-[#49352D] cursor-pointer"
                  >
                    {isLoadingAudio ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>Mandarin anhören</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <button
                    type="button"
                    onClick={() => speak(current.hanzi, { audioUrl: current.audioUrl })}
                    className={`w-16 h-16 rounded-full bg-[#F4B5BE] hover:bg-[#E98F9C] border-4 border-[#FCE6EA] flex items-center justify-center text-[#49352D] transition-all cursor-pointer ${
                      isSpeaking ? 'scale-105 ring-4 ring-[#F4B5BE]/40' : ''
                    }`}
                  >
                    {isLoadingAudio ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Volume2 className="w-7 h-7" />
                    )}
                  </button>
                  <p className="mt-2.5 text-xs font-bold text-[#8C7568]">
                    Höre das Mandarin-Wort und wähle die Bedeutung
                  </p>
                  {selectedOption !== null && (
                    <p className="mt-1.5 font-chinese text-lg font-bold text-[#49352D]">
                      {current.hanzi} · {current.pinyin}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 gap-2">
              {current.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isRight = opt === current.german;
                let style =
                  'bg-[#FFFDF9] border-[#E6D7C8] text-[#49352D] hover:bg-[#F5E9DC]/60';
                if (selectedOption !== null) {
                  if (isRight) {
                    style = 'bg-[#E3ECD6] border-[#8FA47D] text-[#49352D]';
                  } else if (isSelected) {
                    style = 'bg-[#FAD7DC] border-[#D86C7C] text-[#49352D]';
                  } else {
                    style = 'bg-[#FFFDF9]/60 border-[#E6D7C8] text-[#8C7568]';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isRight && (
                      <Check className="w-4 h-4 text-[#6A7F5B]" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(null)}
                className="mt-1 w-full text-center px-4 py-2 rounded-xl text-xs font-bold text-[#8C7568] hover:text-[#49352D] cursor-pointer"
              >
                Kenne ich noch nicht / überspringen
              </button>
            </div>
          </div>
        ) : finishedResult ? (
          <div className="space-y-4">
            <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-5 text-center">
              <div className="flex justify-center mb-2">
                <AnimatedMascotScene
                  mascot="winnersCup"
                  className="w-28 h-24"
                  accents={['starGold', 'sparkleFour', 'heartPink']}
                  idleMotion="float"
                />
              </div>
              <p className="text-xs font-bold text-[#8C7568] uppercase tracking-wide">
                Dein Ergebnis
              </p>
              <p className="text-2xl font-bold text-[#49352D] mt-1">
                Start-Empfehlung: HSK {finishedResult.recommendedHskLevel}
              </p>
              <p className="text-xs font-semibold text-[#6B5344] mt-1.5">
                Lesen: {finishedResult.readingAccuracy}% (HSK {finishedResult.readingLevel}) · Hören:{' '}
                {finishedResult.listeningAccuracy}% (HSK {finishedResult.listeningLevel})
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((lvl) => (
                  <div
                    key={lvl}
                    className="rounded-xl bg-[#FDF7F0] border border-[#E6D7C8] p-2.5"
                  >
                    <p className="text-[11px] font-bold text-[#8C7568]">HSK {lvl}</p>
                    <p className="text-base font-bold text-[#49352D] tabular-nums">
                      {finishedResult.levelAccuracies[lvl]}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#E3ECD6]/60 border border-[#C5D4B3] rounded-2xl p-3.5 text-xs font-semibold text-[#49352D]">
              Vertraute Kognate unterhalb deines Niveaus werden beschleunigt — kantonesische
              Unterschiede (z. B. 吃, 喝, 看, 走, 没有) bleiben aktiv im Fokus.
            </div>

            <button
              type="button"
              onClick={() => onComplete(finishedResult)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#E38B98] hover:bg-[#D87A88] text-white font-bold text-sm shadow-xs cursor-pointer"
            >
              <span>Lernplan kalibrieren & loslegen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
