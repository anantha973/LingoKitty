import {
  CardSrsState,
  ConfidenceRating,
  Flashcard,
  PlacementResult,
  ReviewRating,
  StudyDirection,
} from '../types';
import {
  getSrsStateKey,
  normalizeRatingKey,
  ratingToConfidence,
} from './confidenceLoopEngine';

export function createDefaultSrsState(stateKey: string): CardSrsState {
  return {
    cardId: stateKey,
    confidence: 0,
    consecutiveHighCount: 0,
    consecutiveFiveCount: 0,
    reviewCount: 0,
    repetitions: 0,
    lapses: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    lastReviewedAt: null,
    dueAt: new Date(0).toISOString(),
    mastered: false,
  };
}

export function getCardSrsForDirection(
  srsMap: Record<string, CardSrsState | undefined>,
  cardId: string,
  direction: StudyDirection = 'zh-to-en'
): CardSrsState {
  const key = getSrsStateKey(cardId, direction);
  return srsMap[key] || createDefaultSrsState(key);
}

export function confidenceToEase(confidence: ConfidenceRating): number {
  switch (confidence) {
    case 1:
      return 1.3;
    case 2:
      return 1.7;
    case 3:
      return 2.1;
    case 4:
      return 2.6;
    case 5:
      return 3.0;
    default:
      return 2.5;
  }
}

export function computeNextSrsState(
  current: CardSrsState,
  rating: ReviewRating,
  card?: Pick<Flashcard, 'cantoneseBridge'>,
  now: Date = new Date()
): CardSrsState {
  const norm = normalizeRatingKey(rating) ?? '1';
  const conf = ratingToConfidence(norm);
  const nextConsHigh = conf >= 4 ? (current.consecutiveHighCount || 0) + 1 : 0;
  const nextConsFive = conf === 5 ? (current.consecutiveFiveCount || 0) + 1 : 0;
  const isCognate =
    card?.cantoneseBridge === 'cognate' || card?.cantoneseBridge === 'simplified_diff';

  // Cantonese-accelerated cross-session spacing
  let intervalDays = 0;
  if (conf <= 2) {
    intervalDays = 0;
  } else if (conf === 3) {
    intervalDays = 1;
  } else if (conf === 4) {
    intervalDays = current.intervalDays > 0 ? Math.round(current.intervalDays * 2.2) : isCognate ? 4 : 2;
  } else {
    // conf === 5 ("Sofort gewusst")
    intervalDays =
      current.intervalDays > 0
        ? Math.round(current.intervalDays * 2.8)
        : isCognate
        ? 14
        : 5;
  }

  const dueDate = new Date(now.getTime() + intervalDays * 86400_000).toISOString();
  const mastered = conf >= 4 && (isCognate ? conf === 5 || nextConsHigh >= 2 : nextConsHigh >= 2);

  return {
    cardId: current.cardId,
    confidence: conf,
    consecutiveHighCount: nextConsHigh,
    consecutiveFiveCount: nextConsFive,
    reviewCount: (current.reviewCount || 0) + 1,
    repetitions: conf >= 4 ? (current.repetitions || 0) + 1 : 0,
    lapses: conf <= 2 ? (current.lapses || 0) + 1 : current.lapses || 0,
    intervalDays,
    easeFactor: confidenceToEase(conf),
    lastReviewedAt: now.toISOString(),
    dueAt: dueDate,
    lastRating: norm,
    mastered,
  };
}

/**
 * Applies placement test calibration to SRS state:
 * - Cognates below the learner's calibrated HSK level are fast-tracked (mastered / 14d).
 * - Cognates at the calibrated HSK level start at confidence 3 (7d check) so Mandarin pronunciation is still verified.
 * - Cantonese non-cognates & false friends ALWAYS stay at confidence 0 (New) so they are drilled thoroughly.
 */
export function applyPlacementCalibration(
  cards: readonly Flashcard[],
  existingSrs: Record<string, CardSrsState>,
  placement: PlacementResult,
  now: Date = new Date()
): Record<string, CardSrsState> {
  const nextSrs: Record<string, CardSrsState> = { ...existingSrs };
  const isoNow = now.toISOString();

  for (const card of cards) {
    const level = card.hskLevel ?? 1;
    const isDivergent =
      card.cantoneseBridge === 'non_cognate' || card.cantoneseBridge === 'false_friend';

    if (isDivergent) continue;

    // Recognition track (zh-to-en)
    const recKey = getSrsStateKey(card.id, 'zh-to-en');
    if (nextSrs[recKey] && nextSrs[recKey].reviewCount > 0) continue;

    if (level < placement.recommendedHskLevel) {
      const due = new Date(now.getTime() + 14 * 86400_000).toISOString();
      nextSrs[recKey] = {
        ...createDefaultSrsState(recKey),
        confidence: 4,
        consecutiveHighCount: 2,
        reviewCount: 1,
        repetitions: 1,
        intervalDays: 14,
        easeFactor: 2.6,
        lastReviewedAt: isoNow,
        dueAt: due,
        lastRating: '4',
        mastered: true,
      };
    } else if (level === placement.recommendedHskLevel && placement.recommendedHskLevel > 1) {
      const due = new Date(now.getTime() + 5 * 86400_000).toISOString();
      nextSrs[recKey] = {
        ...createDefaultSrsState(recKey),
        confidence: 3,
        reviewCount: 1,
        intervalDays: 5,
        easeFactor: 2.1,
        lastReviewedAt: isoNow,
        dueAt: due,
        lastRating: '3',
        mastered: false,
      };
    }
  }

  return nextSrs;
}
