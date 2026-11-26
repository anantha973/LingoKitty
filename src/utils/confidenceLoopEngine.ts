import {
  CantoneseBridgeKind,
  CardSrsState,
  ConfidenceRating,
  RatingKey,
  ReviewRating,
  StudyDirection,
} from '../types';

export const DE_TO_ZH_KEY_SUFFIX = '::de-to-zh';

export const LEGACY_RATING_MAP: Record<'again' | 'hard' | 'good' | 'easy', RatingKey> = {
  again: '1',
  hard: '2',
  good: '4',
  easy: '5',
};

export function normalizeRatingKey(value: unknown): RatingKey | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (
    trimmed === '1' ||
    trimmed === '2' ||
    trimmed === '3' ||
    trimmed === '4' ||
    trimmed === '5'
  ) {
    return trimmed;
  }
  if (trimmed in LEGACY_RATING_MAP) {
    return LEGACY_RATING_MAP[trimmed as keyof typeof LEGACY_RATING_MAP];
  }
  return undefined;
}

export function ratingToConfidence(rating: RatingKey): 1 | 2 | 3 | 4 | 5 {
  switch (rating) {
    case '1':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
  }
}

export function stripDirectionSuffix(cardOrStateKey: string): string {
  if (cardOrStateKey.endsWith(DE_TO_ZH_KEY_SUFFIX)) {
    return cardOrStateKey.slice(0, -DE_TO_ZH_KEY_SUFFIX.length);
  }
  return cardOrStateKey;
}

export function getSrsStateKey(
  cardId: string,
  direction: StudyDirection = 'zh-to-de'
): string {
  const baseId = stripDirectionSuffix(cardId);
  return direction === 'de-to-zh' ? `${baseId}${DE_TO_ZH_KEY_SUFFIX}` : baseId;
}

export interface ConfidenceLoopConfig {
  workingSetCap: number;
  minActiveWorkingSet: number;
  clearConsecutiveHighCount: number;
  clearThresholdRating: 1 | 2 | 3 | 4 | 5;
  minGapCards: number;
  gapTable: Record<1 | 2 | 3 | 4 | 5, readonly [number, number]>;
  fourMultiplier: number;
  fiveMultiplier: number;
  maxEndgameInterleaveLow: number;
  maxEndgameInterleaveHigh: number;
  maxFinalCheckCards: number;
  recentClearedCheckCount: number;
}

export const CONFIDENCE_LOOP_CONFIG: ConfidenceLoopConfig = {
  workingSetCap: 10,
  minActiveWorkingSet: 3,
  clearConsecutiveHighCount: 2,
  clearThresholdRating: 4,
  minGapCards: 1,
  gapTable: {
    1: [2, 3],
    2: [4, 5],
    3: [6, 9],
    4: [9, 14],
    5: [14, 22],
  },
  fourMultiplier: 1.5,
  fiveMultiplier: 1.4,
  maxEndgameInterleaveLow: 2,
  maxEndgameInterleaveHigh: 3,
  maxFinalCheckCards: 8,
  recentClearedCheckCount: 3,
};

export type DeckLoopPhase = 'loop' | 'sweep' | 'done';
export type LoopSlotKind = 'active' | 'interleave' | 'final-check';

export interface DeckLoopCardMeta {
  cardId: string;
  dueAt: number;
  confidence: ConfidenceRating;
  reviewCount: number;
  consecutiveHighCount: number;
  consecutiveFiveCount: number;
  lastShownAt: number;
  clearedAtClock: number | null;
  hadStruggleInSession: boolean;
  verifiedAfterClear: boolean;
  interleaveCount: number;
  cantoneseBridge?: CantoneseBridgeKind;
}

export interface DeckLoopState {
  deckId: string;
  direction: StudyDirection;
  phase: DeckLoopPhase;
  virtualClock: number;
  orderedCardIds: string[];
  waitingQueue: string[];
  activePool: string[];
  clearedIds: string[];
  sweepQueue: string[];
  sweepPassedIds: string[];
  sweepRound: number;
  lastCardId: string | null;
  recentCardIds: string[];
  currentCardId: string | null;
  currentSlotKind: LoopSlotKind | null;
  interleaveStreak: number;
  finalCheckTotal: number;
  cardLoopMeta: Record<string, DeckLoopCardMeta>;
}

export function deterministicHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function deterministicShuffle<T extends string>(
  items: readonly T[],
  seed: string
): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const h = deterministicHash(`${seed}:${i}:${arr[i]}`);
    const j = h % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function computeLoopGap(
  cardId: string,
  reviewCount: number,
  rating: 1 | 2 | 3 | 4 | 5,
  consecutiveHighAfter: number,
  consecutiveFiveAfter: number,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG,
  effectiveDeckSize?: number
): number {
  const [minBase, maxBase] = config.gapTable[rating];
  const span = Math.max(1, maxBase - minBase + 1);
  const jitter = deterministicHash(`${cardId}:${reviewCount}`) % span;
  const baseGap = minBase + jitter;

  let multiplier = 1;
  if (rating === 4) {
    multiplier = Math.pow(config.fourMultiplier, Math.max(0, consecutiveHighAfter - 1));
  } else if (rating === 5) {
    multiplier = Math.pow(config.fiveMultiplier, Math.max(0, consecutiveFiveAfter - 1));
  }

  let scaled = Math.round(baseGap * multiplier);

  if (typeof effectiveDeckSize === 'number' && effectiveDeckSize > 0) {
    const cap = Math.max(config.minGapCards, Math.ceil(effectiveDeckSize * 0.65));
    scaled = Math.min(scaled, cap);
  }

  return Math.max(config.minGapCards, scaled);
}

function canClearCard(
  meta: DeckLoopCardMeta,
  ratingNum: 1 | 2 | 3 | 4 | 5,
  nextConsHigh: number,
  config: ConfidenceLoopConfig
): boolean {
  if (ratingNum < config.clearThresholdRating) return false;
  // Cantonese-speaker acceleration:
  // Cognates / simplified_diff rated 5 ("Sofort") clear in 1 hit unless struggled earlier
  const isFastTrackable =
    meta.cantoneseBridge === 'cognate' || meta.cantoneseBridge === 'simplified_diff';
  if (isFastTrackable && ratingNum === 5 && !meta.hadStruggleInSession) {
    return true;
  }
  return nextConsHigh >= config.clearConsecutiveHighCount;
}

export function createInitialDeckLoopState(
  deckId: string,
  deckCardIds: readonly string[],
  persistedStates: Record<string, CardSrsState | undefined>,
  bridgeMap: Record<string, CantoneseBridgeKind | undefined> = {},
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG,
  direction: StudyDirection = 'zh-to-de',
  shuffleSeed?: string
): DeckLoopState {
  const uniqueIds = Array.from(new Set(deckCardIds.map(stripDirectionSuffix)));
  const cardLoopMeta: Record<string, DeckLoopCardMeta> = {};

  // Bucket priority:
  // 0: New non_cognate / false_friend (high-priority Cantonese divergences)
  // 1: Low-confidence / learning (1-3)
  // 2: New cognates
  // 3: Already high-confidence (4-5)
  const buckets: [string[], string[], string[], string[]] = [[], [], [], []];

  for (const id of uniqueIds) {
    const key = getSrsStateKey(id, direction);
    const st = persistedStates[key];
    const conf: ConfidenceRating = st?.confidence ?? 0;
    const bridge = bridgeMap[id];
    const isDivergent = bridge === 'non_cognate' || bridge === 'false_friend';

    cardLoopMeta[id] = {
      cardId: id,
      dueAt: 0,
      confidence: conf,
      reviewCount: st?.reviewCount ?? 0,
      consecutiveHighCount: st?.consecutiveHighCount ?? (conf >= 4 ? 1 : 0),
      consecutiveFiveCount: st?.consecutiveFiveCount ?? (conf === 5 ? 1 : 0),
      lastShownAt: -1,
      clearedAtClock: conf >= 4 && st?.mastered ? 0 : null,
      hadStruggleInSession: false,
      verifiedAfterClear: Boolean(st?.mastered),
      interleaveCount: 0,
      cantoneseBridge: bridge,
    };

    if (conf === 0) {
      buckets[isDivergent ? 0 : 2].push(id);
    } else if (conf <= 3) {
      buckets[1].push(id);
    } else {
      buckets[3].push(id);
    }
  }

  const orderedCardIds = shuffleSeed
    ? [
        ...deterministicShuffle(buckets[0], `${shuffleSeed}:b0`),
        ...deterministicShuffle(buckets[1], `${shuffleSeed}:b1`),
        ...deterministicShuffle(buckets[2], `${shuffleSeed}:b2`),
        ...deterministicShuffle(buckets[3], `${shuffleSeed}:b3`),
      ]
    : [...buckets[0], ...buckets[1], ...buckets[2], ...buckets[3]];

  const activeIds = orderedCardIds.filter(
    (id) => !cardLoopMeta[id].verifiedAfterClear
  );
  const preCleared = orderedCardIds.filter(
    (id) => cardLoopMeta[id].verifiedAfterClear
  );

  const workingCap = Math.min(config.workingSetCap, activeIds.length);
  const activePool = activeIds.slice(0, workingCap);
  const waitingQueue = activeIds.slice(workingCap);

  // If every card is already mastered, queue a quick refresh of the first batch
  if (activePool.length === 0 && orderedCardIds.length > 0) {
    const refreshIds = orderedCardIds.slice(0, Math.min(12, orderedCardIds.length));
    return {
      deckId,
      direction,
      phase: 'sweep',
      virtualClock: 0,
      orderedCardIds,
      waitingQueue: [],
      activePool: [],
      clearedIds: preCleared,
      sweepQueue: refreshIds,
      sweepPassedIds: [],
      sweepRound: 1,
      lastCardId: null,
      recentCardIds: [],
      currentCardId: refreshIds[0] ?? null,
      currentSlotKind: refreshIds.length > 0 ? 'final-check' : null,
      interleaveStreak: 0,
      finalCheckTotal: refreshIds.length,
      cardLoopMeta,
    };
  }

  return {
    deckId,
    direction,
    phase: activePool.length === 0 ? 'done' : 'loop',
    virtualClock: 0,
    orderedCardIds,
    waitingQueue,
    activePool,
    clearedIds: preCleared,
    sweepQueue: [],
    sweepPassedIds: [],
    sweepRound: 0,
    lastCardId: null,
    recentCardIds: [],
    currentCardId: activePool[0] ?? null,
    currentSlotKind: activePool.length > 0 ? 'active' : null,
    interleaveStreak: 0,
    finalCheckTotal: 0,
    cardLoopMeta,
  };
}

function admitFromWaitingQueue(
  state: DeckLoopState,
  config: ConfidenceLoopConfig
): DeckLoopState {
  if (state.waitingQueue.length === 0) return state;
  if (state.activePool.length >= config.workingSetCap) return state;

  const needed = Math.min(
    config.workingSetCap - state.activePool.length,
    state.waitingQueue.length
  );
  const admitted = state.waitingQueue.slice(0, needed);
  const remaining = state.waitingQueue.slice(needed);
  const nextMeta = { ...state.cardLoopMeta };

  for (const id of admitted) {
    nextMeta[id] = {
      ...nextMeta[id],
      dueAt: state.virtualClock,
    };
  }

  return {
    ...state,
    activePool: [...state.activePool, ...admitted],
    waitingQueue: remaining,
    cardLoopMeta: nextMeta,
  };
}

function selectNextCard(
  state: DeckLoopState,
  config: ConfidenceLoopConfig
): { cardId: string | null; slotKind: LoopSlotKind | null; interleaveStreak: number } {
  if (state.phase === 'done') {
    return { cardId: null, slotKind: null, interleaveStreak: 0 };
  }

  if (state.phase === 'sweep') {
    if (state.sweepQueue.length === 0) {
      return { cardId: null, slotKind: null, interleaveStreak: 0 };
    }
    const candidate =
      state.sweepQueue.find((id) => id !== state.lastCardId) ?? state.sweepQueue[0];
    return { cardId: candidate, slotKind: 'final-check', interleaveStreak: 0 };
  }

  if (state.activePool.length === 0) {
    return { cardId: null, slotKind: null, interleaveStreak: 0 };
  }

  const nonLast = state.activePool.filter((id) => id !== state.lastCardId);
  const candidates = nonLast.length > 0 ? nonLast : state.activePool;

  const sorted = [...candidates].sort((a, b) => {
    const ma = state.cardLoopMeta[a];
    const mb = state.cardLoopMeta[b];
    const aDue = ma.dueAt <= state.virtualClock ? 0 : 1;
    const bDue = mb.dueAt <= state.virtualClock ? 0 : 1;
    if (aDue !== bDue) return aDue - bDue;
    if (ma.dueAt !== mb.dueAt) return ma.dueAt - mb.dueAt;
    return ma.lastShownAt - mb.lastShownAt;
  });

  // Interleave cleared card if active pool is small and due card isn't urgent
  const top = sorted[0];
  const topMeta = state.cardLoopMeta[top];
  if (
    topMeta.dueAt > state.virtualClock &&
    state.clearedIds.length > 0 &&
    state.interleaveStreak < config.maxEndgameInterleaveLow
  ) {
    const interleaveCandidate = state.clearedIds.find(
      (id) => id !== state.lastCardId && !state.recentCardIds.includes(id)
    );
    if (interleaveCandidate) {
      return {
        cardId: interleaveCandidate,
        slotKind: 'interleave',
        interleaveStreak: state.interleaveStreak + 1,
      };
    }
  }

  return { cardId: top, slotKind: 'active', interleaveStreak: 0 };
}

export function applyLoopRating(
  state: DeckLoopState,
  cardId: string,
  rating: ReviewRating,
  config: ConfidenceLoopConfig = CONFIDENCE_LOOP_CONFIG
): DeckLoopState {
  const baseCardId = stripDirectionSuffix(cardId);
  const norm = normalizeRatingKey(rating) ?? '1';
  const ratingNum = ratingToConfidence(norm);
  const nextClock = state.virtualClock + 1;
  const nextRecent = [baseCardId, ...state.recentCardIds.filter((id) => id !== baseCardId)].slice(
    0,
    4
  );

  const prevMeta = state.cardLoopMeta[baseCardId];
  if (!prevMeta) return state;

  if (state.phase === 'sweep') {
    const passed = ratingNum >= config.clearThresholdRating;
    const remainingSweep = state.sweepQueue.filter((id) => id !== baseCardId);
    const nextPassed = passed
      ? Array.from(new Set([...state.sweepPassedIds, baseCardId]))
      : state.sweepPassedIds;

    const nextMeta: DeckLoopCardMeta = {
      ...prevMeta,
      confidence: ratingNum,
      reviewCount: prevMeta.reviewCount + 1,
      lastShownAt: nextClock,
      verifiedAfterClear: passed,
      hadStruggleInSession: prevMeta.hadStruggleInSession || !passed,
      consecutiveHighCount: passed ? prevMeta.consecutiveHighCount + 1 : 0,
      consecutiveFiveCount: ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0,
    };

    if (!passed) {
      // Re-admit failed sweep card into active loop
      const updatedState: DeckLoopState = {
        ...state,
        phase: 'loop',
        virtualClock: nextClock,
        activePool: [baseCardId],
        clearedIds: state.clearedIds.filter((id) => id !== baseCardId),
        sweepQueue: remainingSweep,
        sweepPassedIds: nextPassed,
        lastCardId: baseCardId,
        recentCardIds: nextRecent,
        cardLoopMeta: { ...state.cardLoopMeta, [baseCardId]: nextMeta },
      };
      const sel = selectNextCard(updatedState, config);
      return {
        ...updatedState,
        currentCardId: sel.cardId,
        currentSlotKind: sel.slotKind,
        interleaveStreak: sel.interleaveStreak,
      };
    }

    const doneSweep = remainingSweep.length === 0;
    const nextState: DeckLoopState = {
      ...state,
      phase: doneSweep ? 'done' : 'sweep',
      virtualClock: nextClock,
      sweepQueue: remainingSweep,
      sweepPassedIds: nextPassed,
      lastCardId: baseCardId,
      recentCardIds: nextRecent,
      cardLoopMeta: { ...state.cardLoopMeta, [baseCardId]: nextMeta },
    };
    const sel = selectNextCard(nextState, config);
    return {
      ...nextState,
      currentCardId: sel.cardId,
      currentSlotKind: sel.slotKind,
      interleaveStreak: sel.interleaveStreak,
    };
  }

  // Main 'loop' phase
  const nextConsHigh =
    ratingNum >= config.clearThresholdRating ? prevMeta.consecutiveHighCount + 1 : 0;
  const nextConsFive = ratingNum === 5 ? prevMeta.consecutiveFiveCount + 1 : 0;
  const isCleared = canClearCard(prevMeta, ratingNum, nextConsHigh, config);

  const effectiveSize = state.activePool.length + state.waitingQueue.length;
  const gap = computeLoopGap(
    baseCardId,
    prevMeta.reviewCount + 1,
    ratingNum,
    nextConsHigh,
    nextConsFive,
    config,
    effectiveSize
  );

  const nextMeta: DeckLoopCardMeta = {
    ...prevMeta,
    dueAt: nextClock + gap,
    confidence: ratingNum,
    reviewCount: prevMeta.reviewCount + 1,
    consecutiveHighCount: nextConsHigh,
    consecutiveFiveCount: nextConsFive,
    lastShownAt: nextClock,
    clearedAtClock: isCleared ? nextClock : prevMeta.clearedAtClock,
    hadStruggleInSession:
      prevMeta.hadStruggleInSession || ratingNum < config.clearThresholdRating,
    verifiedAfterClear: false,
  };

  let nextActivePool = state.activePool;
  let nextClearedIds = state.clearedIds;

  if (isCleared) {
    nextActivePool = state.activePool.filter((id) => id !== baseCardId);
    if (!nextClearedIds.includes(baseCardId)) {
      nextClearedIds = [...nextClearedIds, baseCardId];
    }
  } else if (!nextActivePool.includes(baseCardId)) {
    nextActivePool = [...nextActivePool, baseCardId];
  }

  let nextState: DeckLoopState = {
    ...state,
    virtualClock: nextClock,
    activePool: nextActivePool,
    clearedIds: nextClearedIds,
    lastCardId: baseCardId,
    recentCardIds: nextRecent,
    cardLoopMeta: {
      ...state.cardLoopMeta,
      [baseCardId]: nextMeta,
    },
  };

  nextState = admitFromWaitingQueue(nextState, config);

  if (nextState.activePool.length === 0 && nextState.waitingQueue.length === 0) {
    // Build compact final sweep of struggled + most recent cleared cards
    const struggled = nextState.clearedIds.filter(
      (id) => nextState.cardLoopMeta[id]?.hadStruggleInSession
    );
    const recent = nextState.clearedIds
      .slice(-config.recentClearedCheckCount)
      .filter((id) => !struggled.includes(id));
    const sweepQueue = [...struggled, ...recent].slice(0, config.maxFinalCheckCards);

    if (sweepQueue.length > 0) {
      const sweepState: DeckLoopState = {
        ...nextState,
        phase: 'sweep',
        sweepRound: nextState.sweepRound + 1,
        sweepQueue,
        sweepPassedIds: [],
        finalCheckTotal: sweepQueue.length,
      };
      const sel = selectNextCard(sweepState, config);
      return {
        ...sweepState,
        currentCardId: sel.cardId,
        currentSlotKind: sel.slotKind,
        interleaveStreak: sel.interleaveStreak,
      };
    }

    return {
      ...nextState,
      phase: 'done',
      currentCardId: null,
      currentSlotKind: null,
    };
  }

  const sel = selectNextCard(nextState, config);
  return {
    ...nextState,
    currentCardId: sel.cardId,
    currentSlotKind: sel.slotKind,
    interleaveStreak: sel.interleaveStreak,
  };
}

export function computeDeckLoopProgressPct(state: DeckLoopState): number {
  const total = state.orderedCardIds.length;
  if (total === 0) return 0;
  if (state.phase === 'done') return 100;

  if (state.phase === 'sweep') {
    const totalChecks = Math.max(
      1,
      state.finalCheckTotal || state.sweepPassedIds.length + state.sweepQueue.length
    );
    const passed = Math.min(totalChecks, state.sweepPassedIds.length);
    return Math.min(99, 90 + Math.round((passed / totalChecks) * 9));
  }

  let weighted = state.clearedIds.length;
  for (const id of state.activePool) {
    const meta = state.cardLoopMeta[id];
    if (meta && meta.consecutiveHighCount >= 1) {
      weighted += 0.45;
    }
  }
  return Math.min(90, Math.round((weighted / total) * 90));
}
