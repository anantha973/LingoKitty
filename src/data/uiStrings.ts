import { UiLanguage } from '../types';

export function getUiStrings(lang: UiLanguage = 'de') {
  const isEn = lang === 'en';
  return {
    nav: {
      subtitle: isEn ? 'Learn Chinese' : 'Chinesisch Lernen',
      home: isEn ? 'Home' : 'Start',
      study: isEn ? 'Study' : 'Lernen',
      decks: 'Decks',
      progress: isEn ? 'Progress' : 'Fortschritt',
      settings: isEn ? 'Settings' : 'Einstellungen',
      motto: isEn
        ? 'Little steps, big progress.'
        : 'Kleine Schritte, großer Fortschritt.',
    },
    home: {
      studyToday: isEn ? 'Study Today' : 'Heute lernen',
      cardsWord: isEn ? 'cards' : 'Karten',
      studyNow: isEn ? 'Study Now' : 'Jetzt lernen',
      placementBtn: isEn ? 'Placement Test' : 'Einstufungstest',
      levelPrefix: isEn ? 'Level: HSK' : 'Niveau: HSK',
      calibratedTitle: (rLvl: number, rAcc: number, lLvl: number, lAcc: number) =>
        isEn
          ? `Calibrated for Cantonese → Mandarin · Reading HSK ${rLvl} (${rAcc}%) · Listening HSK ${lLvl} (${lAcc}%)`
          : `Kalibriert für Kantonesisch → Mandarin · Lesen HSK ${rLvl} (${rAcc}%) · Hören HSK ${lLvl} (${lAcc}%)`,
      calibratedDesc: isEn
        ? 'Familiar cognates are fast-tracked — true Mandarin differences stay in focus.'
        : 'Vertraute Kognate werden beschleunigt — echte Mandarin-Unterschiede bleiben im Fokus.',
      uncalibratedTitle: isEn
        ? 'Already speak Cantonese? Take the 2-minute placement test.'
        : 'Sprichst du schon Kantonesisch? Starte den 2-Minuten-Einstufungstest.',
      uncalibratedDesc: isEn
        ? 'We skip familiar words and test reading & Mandarin listening separately.'
        : 'Wir überspringen vertraute Wörter und testen Lesen & Mandarin-Hören getrennt.',
      retest: isEn ? 'Retake Test' : 'Neu testen',
      startTest: isEn ? 'Start Test' : 'Test starten',
      streak: isEn ? 'Day Streak' : 'Tage in Folge',
      totalCards: isEn ? 'Total Cards' : 'Karten gesamt',
      weeklyAccuracy: isEn ? 'Correct This Week' : 'Richtig diese Woche',
      myDecks: isEn ? 'My Decks' : 'Meine Decks',
      viewAll: isEn ? 'View all' : 'Alle anzeigen',
    },
    study: {
      title: isEn ? 'Study' : 'Lernen',
      slowMode: isEn ? '0.8× Slow' : '0.8× Langsam',
      normalMode: '1.0× Normal',
      modeBtn: isEn ? 'Mode' : 'Modus',
      allModes: isEn ? 'All Modes' : 'Alle Modi',
      vocab: isEn ? 'Vocab' : 'Vokabeln',
      writing: isEn ? 'Writing' : 'Schreibübung',
      listening: isEn ? 'Listening' : 'Hörübung',
      modeVocabDesc: isEn
        ? 'Learn characters, Pinyin & German meanings.'
        : 'Schriftzeichen, Pinyin & Bedeutung lernen.',
      modeWritingDesc: isEn
        ? 'Practice simplified characters by keyboard.'
        : 'Vereinfachte Zeichen per Tastatur üben.',
      modeListeningDesc: isEn
        ? 'Understand full Mandarin sentences via audio.'
        : 'Ganze Mandarin-Sätze über Audio verstehen.',
      finalCheck: isEn ? 'Final Check' : 'Abschluss-Check',
      masteredProgress: isEn ? 'confident' : 'sicher',
      roundDoneTitle: isEn
        ? 'Round Complete! 太棒了 ♡'
        : 'Runde abgeschlossen! 太棒了 ♡',
      roundDoneDesc: (n: number) =>
        isEn
          ? `All ${n} cards in this set are reinforced.`
          : `Alle ${n} Karten dieses Sets sind gefestigt.`,
      repeatRound: isEn ? 'New Review Round' : 'Neue Wiederholungsrunde',
      backOverview: isEn ? 'Back to Overview' : 'Zurück zur Übersicht',
      badgeVocab: isEn ? 'Vocab' : 'Vokabel',
      badgeWriting: isEn ? 'Writing' : 'Schreibübung',
      badgeListening: isEn ? 'Listening' : 'Hörübung',
      cantoneseDiff: isEn ? 'Cantonese ≠ Mandarin' : 'Kantonesisch ≠ Mandarin',
      pinyinLabel: 'Pinyin',
      on: isEn ? 'On' : 'An',
      off: isEn ? 'Off' : 'Aus',
      traditionalLabel: isEn ? 'Traditional:' : 'Traditionell:',
      writingPlaceholder: isEn
        ? 'Type simplified Chinese characters...'
        : 'Vereinfachte Schriftzeichen eingeben...',
      checkBtn: isEn ? 'Check' : 'Überprüfen',
      perfectWritten: isEn ? 'Written perfectly:' : 'Perfekt geschrieben:',
      yourInput: isEn ? 'Your input:' : 'Deine Eingabe:',
      correctAnswer: isEn ? 'Correct:' : 'Richtig:',
      compareHint: isEn
        ? 'Compare the strokes and Pinyin pronunciation.'
        : 'Vergleiche die Striche und die Pinyin-Aussprache.',
      playSlowBtn: isEn ? 'Play slowly (0.8×)' : 'Langsam abspielen (0.8×)',
      showAnswer: isEn
        ? 'Show Answer (Space)'
        : 'Antwort zeigen (Leertaste)',
      ratings: isEn
        ? [
            { key: '1' as const, label: '1 · Again', sub: 'now' },
            { key: '2' as const, label: '2 · Hard', sub: 'short' },
            { key: '3' as const, label: '3 · Okay', sub: 'mid' },
            { key: '4' as const, label: '4 · Good', sub: 'solid' },
            { key: '5' as const, label: '5 · Easy', sub: 'fast-track' },
          ]
        : [
            { key: '1' as const, label: '1 · Nochmal', sub: 'sofort' },
            { key: '2' as const, label: '2 · Schwer', sub: 'kurz' },
            { key: '3' as const, label: '3 · Geht', sub: 'mittel' },
            { key: '4' as const, label: '4 · Gut', sub: 'sicher' },
            { key: '5' as const, label: '5 · Sofort', sub: 'fast-track' },
          ],
    },
    decks: {
      title: isEn ? 'My Decks' : 'Meine Decks',
      summary: (d: number, c: number) =>
        isEn
          ? `${d} decks · ${c} total cards`
          : `${d} Decks · ${c} Karten insgesamt`,
      newDeck: isEn ? 'New Deck' : 'Neues Deck',
      allFilter: isEn ? 'All' : 'Alle',
      vocabTag: isEn ? 'Vocab' : 'Vokabeln',
      writingTag: isEn ? 'Writing' : 'Schreiben',
      listeningTag: isEn ? 'Listening' : 'Hören',
      cardsLabel: isEn ? 'cards' : 'Karten',
      learnedPct: (p: number) => (isEn ? `${p}% learned` : `${p}% gelernt`),
      studyBtn: isEn ? 'Study' : 'Lernen',
      cardBtn: isEn ? 'Card' : 'Karte',
      createDeckTitle: isEn ? 'Create New Deck' : 'Neues Deck erstellen',
      deckNameLabel: isEn ? 'Deck Name *' : 'Deck-Name *',
      deckNamePlaceholder: isEn ? 'e.g. Food & Restaurant' : 'z.B. Essen & Restaurant',
      categoryLabel: isEn ? 'Category' : 'Kategorie',
      themeLabel: isEn ? 'Color Theme' : 'Farbthema',
      stickerLabel: isEn ? 'Choose Sticker Mascot' : 'Sticker-Maskottchen wählen',
      cancel: isEn ? 'Cancel' : 'Abbrechen',
      saveDeck: isEn ? 'Save Deck' : 'Deck speichern',
      addCardTitle: isEn ? 'Add New Card' : 'Neue Karte hinzufügen',
      hanziLabel: isEn
        ? 'Simplified Chinese (Hanzi) *'
        : 'Vereinfachtes Chinesisch (Hanzi) *',
      pinyinLabel: isEn ? 'Pinyin (with tone marks)' : 'Pinyin (mit Tonzeichen)',
      germanMeaningLabel: isEn
        ? 'German Meaning *'
        : 'Deutsche Bedeutung *',
      modeLabel: isEn ? 'Study Mode' : 'Lernmodus',
      grammarLabel: isEn ? 'Part of Speech / Note' : 'Wortart / Hinweis',
      addCardBtn: isEn ? 'Add Card' : 'Karte hinzufügen',
    },
    progress: {
      title: isEn ? 'Progress' : 'Fortschritt',
      subtitle: isEn
        ? 'Your current study streak, accuracy and learned cards'
        : 'Deine aktuelle Lernserie, Genauigkeit und gelernte Karten',
      daySingular: isEn ? 'Day' : 'Tag',
      dayPlural: isEn ? 'Days' : 'Tage',
      streakLabel: isEn ? 'Study Streak' : 'Lernserie',
      cardsLearned: isEn ? 'Cards Learned' : 'Karten gelernt',
      accuracy: isEn ? 'Accuracy' : 'Genauigkeit',
      weeklyActivity: isEn ? 'Weekly Activity' : 'Wöchentliche Aktivität',
      weekdays: isEn
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      correctWord: isEn ? 'Correct' : 'Richtig',
      learnedToday: isEn ? 'Studied' : 'Gelernt',
      wrongToday: isEn ? 'Wrong' : 'Falsch',
      byMode: isEn ? 'Progress by Mode' : 'Fortschritt nach Lernmodus',
      byDeck: isEn ? 'Progress by Deck' : 'Fortschritt nach Deck',
      vocab: isEn ? 'Vocab' : 'Vokabeln',
      writing: isEn ? 'Writing' : 'Schreibübung',
      listening: isEn ? 'Listening' : 'Hörübung',
      masteredSummary: (l: number, t: number) =>
        isEn
          ? `${l} of ${t} cards mastered.`
          : `${l} von ${t} Karten erfolgreich gemeistert.`,
    },
    settings: {
      title: isEn ? 'Settings' : 'Einstellungen',
      subtitle: isEn
        ? 'Adjust UI language, default direction, active modes and appearance'
        : 'App-Sprache, Standard-Lernrichtung, Kartentypen und Darstellung anpassen',
      uiLangTitle: isEn ? 'App UI Language' : 'App-Sprache (Oberfläche)',
      uiLangDesc: isEn
        ? 'Only changes buttons and menus — flashcards stay Chinese ↔ German'
        : 'Ändert nur Menüs & Buttons — Lernkarten bleiben Chinesisch ↔ Deutsch',
      directionTitle: isEn ? 'Card Direction (Default)' : 'Kartenrichtung (Standard)',
      directionDesc: isEn
        ? 'Starting direction for vocab cards. Manual switching during a session stays independent.'
        : 'Startrichtung für Vokabelkarten. Ein manueller Richtungswechsel während einer aktiven Sitzung bleibt davon unberührt.',
      dirZhDe: isEn ? 'Chinese → German' : 'Chinesisch → Deutsch',
      dirDeZh: isEn ? 'German → Chinese' : 'Deutsch → Chinesisch',
      modesTitle: isEn ? 'Enabled Study Modes' : 'Aktivierte Lernmodi',
      modesDesc: isEn
        ? 'Choose which card types appear in mixed mode ("All Modes")'
        : 'Wähle, welche Kartentypen im gemischten Modus („Alle Modi“) abgefragt werden',
      modeVocab: isEn ? 'Vocab' : 'Vokabeln',
      modeVocabDesc: isEn
        ? 'Characters, Pinyin & German meaning'
        : 'Schriftzeichen, Pinyin & deutsche Bedeutung',
      modeWriting: isEn ? 'Writing' : 'Schreiben',
      modeWritingDesc: isEn
        ? 'Type simplified characters using keyboard'
        : 'Vereinfachte Schriftzeichen per Tastatur eingeben',
      modeListening: isEn ? 'Listening' : 'Hören',
      modeListeningDesc: isEn
        ? 'Understand spoken Mandarin without text hints'
        : 'Gesprochenes Mandarin ohne Text-Hilfe verstehen',
      pinyinTitle: isEn ? 'Show Pinyin' : 'Pinyin-Anzeige',
      pinyinDesc: isEn
        ? 'Display Pinyin pronunciation aid on the front of vocab cards'
        : 'Zeige Pinyin als Aussprachehilfe auf der Vorderseite von Vokabelkarten',
      pinyinOn: isEn ? 'Pinyin visible (píngguǒ)' : 'Pinyin sichtbar (píngguǒ)',
      pinyinOff: isEn ? 'Characters only (苹果)' : 'Nur Schriftzeichen (苹果)',
      accentTitle: isEn ? 'Color Accent' : 'Farbakzent',
      accentDesc: isEn ? 'Soft pastel stationery theme' : 'Sanftes Pastell-Farbschema',
      profileNote: isEn
        ? 'Flashcards: German ↔ Simplified Chinese (Mandarin)'
        : 'Sprachprofil: Deutsch → Vereinfachtes Chinesisch',
      resetBtn: isEn ? 'Reset Demo Data' : 'Beispieldaten zurücksetzen',
      resetDone: isEn ? 'Demo Data Restored ✓' : 'Beispieldaten wiederhergestellt ✓',
    },
    placement: {
      title: isEn
        ? 'Placement Test · Cantonese → Mandarin'
        : 'Einstufungstest · Kantonesisch → Mandarin',
      subtitle: isEn
        ? 'Skip what you know and focus on Mandarin differences'
        : 'Wir überspringen Bekanntes und fokussieren Mandarin-Unterschiede',
      question: isEn ? 'Question' : 'Frage',
      reading: isEn ? 'Reading' : 'Lesen',
      listening: isEn ? 'Listening' : 'Hören',
      traditional: isEn ? 'Traditional:' : 'Traditionell:',
      listenBtn: isEn ? 'Listen to Mandarin' : 'Mandarin anhören',
      listenPrompt: isEn
        ? 'Listen to the Mandarin word and choose its German meaning'
        : 'Höre das Mandarin-Wort und wähle die Bedeutung',
      skipUnknown: isEn
        ? "I don't know this yet / skip"
        : 'Kenne ich noch nicht / überspringen',
      resultLabel: isEn ? 'Your Result' : 'Dein Ergebnis',
      recommendedStart: (lvl: number) =>
        isEn ? `Recommended Start: HSK ${lvl}` : `Start-Empfehlung: HSK ${lvl}`,
      breakdown: (rAcc: number, rLvl: number, lAcc: number, lLvl: number) =>
        isEn
          ? `Reading: ${rAcc}% (HSK ${rLvl}) · Listening: ${lAcc}% (HSK ${lLvl})`
          : `Lesen: ${rAcc}% (HSK ${rLvl}) · Hören: ${lAcc}% (HSK ${lLvl})`,
      calibrationNote: isEn
        ? 'Familiar cognates below your level are fast-tracked — Cantonese divergences (e.g. 吃, 喝, 看, 走, 没有) stay active.'
        : 'Vertraute Kognate unterhalb deines Niveaus werden beschleunigt — kantonesische Unterschiede (z. B. 吃, 喝, 看, 走, 没有) bleiben aktiv im Fokus.',
      applyBtn: isEn
        ? 'Calibrate Plan & Start'
        : 'Lernplan kalibrieren & loslegen',
    },
  };
}
