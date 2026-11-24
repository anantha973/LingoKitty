import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Folder,
  ChevronRight,
  BookOpen,
  Pencil,
  Headphones,
  X,
  Check,
  Play,
} from 'lucide-react';
import {
  Deck,
  DeckIllustrationType,
  DeckTheme,
  Flashcard,
  StudyMode,
} from '../types';
import {
  PottedFlowerIllustration,
  LeavesInVaseIllustration,
  DangoSkewerIllustration,
  AppleWithSlice,
  CatHoldingApple,
} from './KawaiiIllustrations';

interface DecksSectionProps {
  decks: Deck[];
  cards: Flashcard[];
  onStartDeckStudy: (deckId: string) => void;
  onCreateDeck: (
    title: string,
    category: string,
    theme: DeckTheme,
    illustration: DeckIllustrationType
  ) => void;
  onAddCard: (card: Omit<Flashcard, 'id'>) => void;
}

export const DecksSection: React.FC<DecksSectionProps> = ({
  decks,
  cards,
  onStartDeckStudy,
  onCreateDeck,
  onAddCard,
}) => {
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState<string | null>(null);

  // New Deck Form State
  const [deckTitle, setDeckTitle] = useState('');
  const [deckCategory, setDeckCategory] = useState('Wortschatz');
  const [deckTheme, setDeckTheme] = useState<DeckTheme>('pink');
  const [deckIllustration, setDeckIllustration] = useState<DeckIllustrationType>('flower');

  // New Card Form State
  const [cardHanzi, setCardHanzi] = useState('');
  const [cardPinyin, setCardPinyin] = useState('');
  const [cardGerman, setCardGerman] = useState('');
  const [cardGrammar, setCardGrammar] = useState('Nomen');
  const [cardMode, setCardMode] = useState<StudyMode>('vocab');

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;
    onCreateDeck(deckTitle.trim(), deckCategory.trim() || 'Allgemein', deckTheme, deckIllustration);
    setDeckTitle('');
    setShowNewDeckModal(false);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddCardModal || !cardHanzi.trim() || !cardGerman.trim()) return;
    onAddCard({
      deckId: showAddCardModal,
      hanzi: cardHanzi.trim(),
      pinyin: cardPinyin.trim() || '—',
      german: cardGerman.trim(),
      grammar: cardGrammar.trim() || 'Wort',
      level: 'Eigenes Wort',
      mode: cardMode,
      illustration: 'flower',
      learned: false,
    });
    setCardHanzi('');
    setCardPinyin('');
    setCardGerman('');
    setShowAddCardModal(null);
  };

  const renderIllustration = (type: DeckIllustrationType) => {
    switch (type) {
      case 'flower':
        return <PottedFlowerIllustration className="w-12 h-14" />;
      case 'leaves':
        return <LeavesInVaseIllustration className="w-12 h-14" />;
      case 'dango':
        return <DangoSkewerIllustration className="w-12 h-14" />;
      case 'apple':
        return <AppleWithSlice className="w-14 h-12" />;
      case 'cat':
        return <CatHoldingApple className="w-14 h-12" />;
      default:
        return <PottedFlowerIllustration className="w-12 h-14" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Decks Container */}
      <div className="bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-5 sm:p-7 shadow-xs">
        {/* Top Bar matching Reference 3 Bottom-Left "Decks" + "+ Neue Deck" pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAD7DC]/80 border border-[#F0BFC7] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#49352D]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#49352D]">Decks</h1>
              <p className="text-xs font-semibold text-[#8C7568]">
                Wähle ein Deck zum Lernen oder erstelle eigene Lernkarten
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewDeckModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E98F9C] hover:bg-[#DC7E8C] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.6]" />
            <span>Neues Deck</span>
          </button>
        </div>

        {/* Visual Deck Cards Grid (All 6+ Decks) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const deckCards = cards.filter((c) => c.deckId === deck.id);
            const total = deckCards.length;
            const learned = deckCards.filter((c) => c.learned).length;
            const progressPct = total > 0 ? Math.round((learned / total) * 100) : 0;

            const vocabCount = deckCards.filter((c) => c.mode === 'vocab').length;
            const writingCount = deckCards.filter((c) => c.mode === 'writing').length;
            const listeningCount = deckCards.filter((c) => c.mode === 'listening').length;

            const surfaceStyle =
              deck.theme === 'pink'
                ? 'bg-[#FCECEF]/90 border-[#F2CFD6]'
                : deck.theme === 'sage'
                ? 'bg-[#EDF1E4]/90 border-[#D8E2C8]'
                : deck.theme === 'lavender'
                ? 'bg-[#F8EBF4]/90 border-[#E8CCE0]'
                : 'bg-[#FFFDF9] border-[#E6D7C8]';

            const progressFill =
              deck.theme === 'pink'
                ? 'bg-[#E58F9D]'
                : deck.theme === 'sage'
                ? 'bg-[#94A884]'
                : deck.theme === 'lavender'
                ? 'bg-[#C98FB4]'
                : 'bg-[#C89D7C]';

            return (
              <div
                key={deck.id}
                className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all hover:shadow-xs ${surfaceStyle}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#8C7568]">
                        {deck.category}
                      </span>
                      <h2 className="text-base font-bold text-[#49352D] mt-0.5 leading-snug">
                        {deck.title}
                      </h2>
                      {deck.subtitle && (
                        <p className="text-xs font-semibold text-[#6B5344] mt-0.5">
                          {deck.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">{renderIllustration(deck.illustration)}</div>
                  </div>

                  {/* Breakdown of card modes inside deck */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#6B5344]">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#C86D7A]" />
                      {vocabCount}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Pencil className="w-3 h-3 text-[#6A7F5B]" />
                      {writingCount}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-[#A4678E]" />
                      {listeningCount}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#49352D]/10">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B5344] mb-1.5 tabular-nums">
                    <span>{total} Karten</span>
                    <span>{progressPct}% gelernt</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#49352D]/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressFill}`}
                      style={{ width: `${Math.max(12, progressPct)}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      onClick={() => onStartDeckStudy(deck.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#49352D] hover:bg-[#3A2821] text-[#FFF9F1] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Lernen</span>
                    </button>

                    <button
                      onClick={() => setShowAddCardModal(deck.id)}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#FFFDF9] hover:bg-[#F5E9DC] border border-[#E6D7C8] text-[#49352D] text-xs font-bold transition-colors cursor-pointer"
                      title="Neue Karte hinzufügen"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Karte</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Folder List View (Matches Reference 3 Bottom-Left "Decks" List Box) */}
        <div className="mt-7 bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-4 sm:p-5">
          <h2 className="text-sm font-bold text-[#6B5344] mb-3">
            Schnellübersicht aller Decks
          </h2>
          <div className="divide-y divide-[#EFE4D8]">
            {decks.map((deck) => {
              const count = cards.filter((c) => c.deckId === deck.id).length;
              return (
                <div
                  key={`list-${deck.id}`}
                  className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                >
                  <button
                    onClick={() => onStartDeckStudy(deck.id)}
                    className="flex-1 flex items-center gap-3.5 text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EDF1E4] border border-[#D8E2C8] flex items-center justify-center shrink-0">
                      <Folder className="w-5 h-5 text-[#7C8F6C]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#49352D] group-hover:text-[#C86D7A] transition-colors">
                        {deck.title}
                      </p>
                      <p className="text-xs font-semibold text-[#8C7568] tabular-nums">
                        {count} Karten · {deck.category}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddCardModal(deck.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F8F1E7] hover:bg-[#EFE4D8] text-xs font-bold text-[#6B5344] transition-colors cursor-pointer"
                    >
                      + Karte
                    </button>
                    <button
                      onClick={() => onStartDeckStudy(deck.id)}
                      aria-label={`${deck.title} öffnen`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8C7568] hover:text-[#49352D] cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal 1: Neues Deck erstellen */}
      {showNewDeckModal && (
        <div className="fixed inset-0 z-50 bg-[#49352D]/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFF9F1] border-2 border-[#E6D7C8] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#49352D]">Neues Deck erstellen</h2>
              <button
                onClick={() => setShowNewDeckModal(false)}
                aria-label="Schließen"
                className="w-8 h-8 rounded-full bg-[#F5E9DC] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Deck-Name
                </label>
                <input
                  type="text"
                  required
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  placeholder="z.B. Essen & Restaurant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Kategorie
                </label>
                <input
                  type="text"
                  value={deckCategory}
                  onChange={(e) => setDeckCategory(e.target.value)}
                  placeholder="z.B. HSK 1, Alltag, Grammatik"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5344] mb-1">
                    Farbthema
                  </label>
                  <select
                    value={deckTheme}
                    onChange={(e) => setDeckTheme(e.target.value as DeckTheme)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D]"
                  >
                    <option value="pink">Baby Pink</option>
                    <option value="sage">Salbeigrün</option>
                    <option value="cream">Creme Beige</option>
                    <option value="lavender">Lavendel Rosa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5344] mb-1">
                    Illustration
                  </label>
                  <select
                    value={deckIllustration}
                    onChange={(e) =>
                      setDeckIllustration(e.target.value as DeckIllustrationType)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D]"
                  >
                    <option value="flower">Blumentopf</option>
                    <option value="leaves">Blätter-Vase</option>
                    <option value="dango">Dango-Spieß</option>
                    <option value="apple">Roter Apfel</option>
                    <option value="cat">Kätzchen</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewDeckModal(false)}
                  className="px-4 py-2.5 rounded-full bg-[#F3E9DC] text-xs font-bold text-[#6B5344] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#E98F9C] hover:bg-[#DC7E8C] text-white text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Deck speichern</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Neue Karte zu Deck hinzufügen */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-[#49352D]/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFF9F1] border-2 border-[#E6D7C8] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#49352D]">Neue Karte hinzufügen</h2>
                <p className="text-xs font-semibold text-[#8C7568]">
                  Deck: {decks.find((d) => d.id === showAddCardModal)?.title}
                </p>
              </div>
              <button
                onClick={() => setShowAddCardModal(null)}
                aria-label="Schließen"
                className="w-8 h-8 rounded-full bg-[#F5E9DC] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Vereinfachtes Chinesisch (Hanzi) *
                </label>
                <input
                  type="text"
                  lang="zh-CN"
                  required
                  value={cardHanzi}
                  onChange={(e) => setCardHanzi(e.target.value)}
                  placeholder="z.B. 苹果 oder 我想喝咖啡。"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] font-chinese text-base font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Pinyin (mit Tonzeichen)
                </label>
                <input
                  type="text"
                  value={cardPinyin}
                  onChange={(e) => setCardPinyin(e.target.value)}
                  placeholder="z.B. píngguǒ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Deutsche Bedeutung *
                </label>
                <input
                  type="text"
                  required
                  value={cardGerman}
                  onChange={(e) => setCardGerman(e.target.value)}
                  placeholder="z.B. (der) Apfel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5344] mb-1">
                    Lernmodus
                  </label>
                  <select
                    value={cardMode}
                    onChange={(e) => setCardMode(e.target.value as StudyMode)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D]"
                  >
                    <option value="vocab">Vokabeln</option>
                    <option value="writing">Schreibübung</option>
                    <option value="listening">Hörübung (Audio)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5344] mb-1">
                    Wortart / Hinweis
                  </label>
                  <input
                    type="text"
                    value={cardGrammar}
                    onChange={(e) => setCardGrammar(e.target.value)}
                    placeholder="Nomen, Verb, Satz..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6D7C8] text-sm font-bold text-[#49352D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(null)}
                  className="px-4 py-2.5 rounded-full bg-[#F3E9DC] text-xs font-bold text-[#6B5344] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8FA47D] hover:bg-[#7D926B] text-white text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Karte hinzufügen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
