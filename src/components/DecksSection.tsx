import React, { useState } from 'react';
import {
  Layers,
  Plus,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');

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

  const categories = ['Alle', ...Array.from(new Set(decks.map((d) => d.category)))];
  const filteredDecks =
    selectedCategory === 'Alle'
      ? decks
      : decks.filter((d) => d.category === selectedCategory);

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;
    onCreateDeck(
      deckTitle.trim(),
      deckCategory.trim() || 'Allgemein',
      deckTheme,
      deckIllustration
    );
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Decks Container */}
      <div className="bg-[#FFF9F3] border border-[#E9D8C8] rounded-3xl p-4 sm:p-6 shadow-2xs">
        {/* Top Header Row: Title & "+ Neues Deck" */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4B5BE]/45 border border-[#E98F9C]/50 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-[#49352D]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#49352D] leading-tight">
                Meine Decks
              </h1>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                {decks.length} Decks · {cards.length} Karten insgesamt
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewDeckModal(true)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E98F9C] hover:bg-[#DC7D8B] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.6]" />
            <span>Neues Deck</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar"
          role="tablist"
          aria-label="Decks nach Kategorie filtern"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#49352D] text-[#FFF9F3] border-[#49352D]'
                    : 'bg-[#F8F1E7] text-[#6B5344] border-[#E9D8C8] hover:border-[#C7B2A3]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Deck Cards Grid (Single unified view — no duplicate overview list below) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => {
            const deckCards = cards.filter((c) => c.deckId === deck.id);
            const total = deckCards.length;
            const learned = deckCards.filter((c) => c.learned).length;
            const progressPct = total > 0 ? Math.round((learned / total) * 100) : 0;

            const vocabCount = deckCards.filter((c) => c.mode === 'vocab').length;
            const writingCount = deckCards.filter(
              (c) => c.mode === 'writing' || c.mode === 'vocab'
            ).length;
            const listeningCount = deckCards.filter((c) => c.mode === 'listening').length;

            const progressFill =
              deck.theme === 'pink'
                ? 'bg-[#E98F9C]'
                : deck.theme === 'sage'
                ? 'bg-[#A9B99A]'
                : deck.theme === 'lavender'
                ? 'bg-[#B48EB9]'
                : 'bg-[#C89D7C]';

            return (
              <div
                key={deck.id}
                className="rounded-2xl border border-[#E9D8C8] bg-[#FFFDF9] p-4 flex flex-col justify-between transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#8C7568]">
                        {deck.category}
                      </span>
                      <h2 className="text-base font-bold text-[#49352D] mt-0.5 leading-snug">
                        {deck.title}
                      </h2>
                      {deck.subtitle && (
                        <p className="text-xs font-semibold text-[#8C7568] mt-0.5 line-clamp-2">
                          {deck.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">{renderIllustration(deck.illustration)}</div>
                  </div>

                  {/* Subtle Category Colours Breakdown: Pink (Vokabeln), Sage (Schreiben), Lavender (Hören) */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[#49352D]">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#F4B5BE]/35 border border-[#E98F9C]/40"
                      title="Vokabelkarten"
                    >
                      <BookOpen className="w-3 h-3 text-[#C86D7A]" />
                      <span>{vocabCount} Vokabeln</span>
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#E8EEDD] border border-[#A9B99A]/50"
                      title="Schreibkarten"
                    >
                      <Pencil className="w-3 h-3 text-[#5D734C]" />
                      <span>{writingCount} Schreiben</span>
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#E8D9EB]/70 border border-[#C9B3CE]"
                      title="Hörkarten"
                    >
                      <Headphones className="w-3 h-3 text-[#7D5987]" />
                      <span>{listeningCount} Hören</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#E9D8C8]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B5344] mb-1.5 tabular-nums">
                    <span>
                      {learned} / {total} Karten
                    </span>
                    <span>{progressPct}% gelernt</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F8F1E7] border border-[#E9D8C8]/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressFill}`}
                      style={{ width: `${total > 0 ? Math.max(8, progressPct) : 0}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      onClick={() => onStartDeckStudy(deck.id)}
                      className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#E98F9C] hover:bg-[#DC7D8B] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Lernen</span>
                    </button>

                    <button
                      onClick={() => setShowAddCardModal(deck.id)}
                      aria-label={`Neue Karte zu ${deck.title} hinzufügen`}
                      className="min-h-[42px] inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#F8F1E7] hover:bg-[#EFE4D6] border border-[#E9D8C8] text-[#49352D] text-xs font-bold transition-colors cursor-pointer"
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
      </div>

      {/* Modal 1: Neues Deck erstellen */}
      {showNewDeckModal && (
        <div
          className="fixed inset-0 z-50 bg-[#49352D]/35 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-deck-title"
        >
          <div className="w-full max-w-md bg-[#FFF9F3] border-2 border-[#E9D8C8] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 id="new-deck-title" className="text-lg font-bold text-[#49352D]">
                Neues Deck erstellen
              </h2>
              <button
                onClick={() => setShowNewDeckModal(false)}
                aria-label="Dialog schließen"
                className="w-9 h-9 rounded-full bg-[#F8F1E7] border border-[#E9D8C8] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5344] mb-1">
                  Deck-Name *
                </label>
                <input
                  type="text"
                  required
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  placeholder="z.B. Essen & Restaurant"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
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
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D]"
                  >
                    <option value="pink">Baby Pink</option>
                    <option value="sage">Salbeigrün</option>
                    <option value="cream">Creme Beige</option>
                    <option value="lavender">Lavendel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5344] mb-1">
                    Symbol
                  </label>
                  <select
                    value={deckIllustration}
                    onChange={(e) =>
                      setDeckIllustration(e.target.value as DeckIllustrationType)
                    }
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D]"
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
                  className="min-h-[42px] px-4 py-2 rounded-full bg-[#F8F1E7] border border-[#E9D8C8] text-xs font-bold text-[#6B5344] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#E98F9C] hover:bg-[#DC7D8B] text-white text-xs font-bold shadow-2xs cursor-pointer"
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
        <div
          className="fixed inset-0 z-50 bg-[#49352D]/35 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-card-title"
        >
          <div className="w-full max-w-md bg-[#FFF9F3] border-2 border-[#E9D8C8] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="new-card-title" className="text-lg font-bold text-[#49352D]">
                  Neue Karte hinzufügen
                </h2>
                <p className="text-xs font-semibold text-[#8C7568]">
                  Deck: {decks.find((d) => d.id === showAddCardModal)?.title}
                </p>
              </div>
              <button
                onClick={() => setShowAddCardModal(null)}
                aria-label="Dialog schließen"
                className="w-9 h-9 rounded-full bg-[#F8F1E7] border border-[#E9D8C8] flex items-center justify-center text-[#6B5344] hover:text-[#49352D] cursor-pointer"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] font-chinese text-base font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C]"
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
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D]"
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
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E9D8C8] text-sm font-bold text-[#49352D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(null)}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-[#F8F1E7] border border-[#E9D8C8] text-xs font-bold text-[#6B5344] cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#7F966B] hover:bg-[#6E855B] text-white text-xs font-bold shadow-2xs cursor-pointer"
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
