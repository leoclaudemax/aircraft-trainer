// Session engine: card queueing, spaced repetition logic, scoring, and mastery.
// Pure functions (no React) — easy to unit-test or swap a backend later.

import { aircraft, aircraftById } from '../data/aircraft.js';
import { confusionPairs, partnersFor } from '../data/confusionPairs.js';

// ----- Mastery -----
// Per spec section 6.

export function computeMastery(id, progress) {
  const recCount = progress.recognition.length;
  const perfCount = progress.performance.length;
  const exposures = progress.exposures || 0;

  if (exposures === 0) {
    return { state: 'New', label: 'New', strict: 0, assisted: 0, perf: 0, percent: 0 };
  }

  const easyCount = progress.recognition.filter(r => r.rating === 'easy').length;
  const unsureCount = progress.recognition.filter(r => r.rating === 'unsure').length;
  const wrongCount = progress.recognition.filter(r => r.rating === 'wrong').length;
  const knowCount = progress.performance.filter(r => r.rating === 'know').length;

  const strict = recCount ? (easyCount / recCount) * 100 : 0;
  const assisted = recCount ? ((easyCount + unsureCount) / recCount) * 100 : 0;
  const perf = perfCount ? (knowCount / perfCount) * 100 : 0;

  // Recent error gate (last 3 sessions worth of recognition events)
  const recentRec = progress.recognition.slice(-3);
  const recentWrong = recentRec.filter(r => r.rating === 'wrong').length;

  let stateLabel = 'Learning';
  if (strict >= 90 && perf >= 85 && exposures >= 6 && perfCount >= 3 && recentWrong === 0 && !progress.flagged) {
    stateLabel = 'Mastered';
  } else if (strict >= 80 && perf >= 80 && exposures >= 4 && recentWrong <= 1) {
    stateLabel = 'Strong';
  } else if (strict >= 60 || perf >= 70) {
    stateLabel = 'Uncertain';
  } else {
    stateLabel = 'Learning';
  }

  // Composite percent for progress bar (recognition-weighted).
  const percent = Math.min(100, Math.round(strict * 0.7 + perf * 0.3));

  return { state: stateLabel, label: stateLabel, strict, assisted, perf, percent, exposures, recentWrong };
}

// ----- "Weak" detection per spec -----
export function isWeak(id, progress) {
  if (!progress) return false;
  const last5Rec = progress.recognition.slice(-5);
  if (last5Rec.length) {
    const easy = last5Rec.filter(r => r.rating === 'easy').length;
    if ((easy / last5Rec.length) * 100 < 70) return true;
  }
  const last5Perf = progress.performance.slice(-5);
  if (last5Perf.length) {
    const know = last5Perf.filter(r => r.rating === 'know').length;
    if ((know / last5Perf.length) * 100 < 70) return true;
  }
  if (progress.flagged) {
    const days = progress.lastSeen ? (Date.now() - progress.lastSeen) / (1000 * 60 * 60 * 24) : Infinity;
    if (days > 3) return true;
  }
  return false;
}

// ----- Build session deck from filters -----
export function buildSession(opts, progress, masteryById) {
  const {
    tiers = [1, 2, 3],            // learning tiers (NOT performance tiers)
    categories = null,            // null = all
    perfTier = null,              // single performance tier or null
    size = 20,
    order = 'random',             // 'random' | 'tier' | 'category' | 'weakness'
    mixConfusionPairs = true,
    onlyWeak = false,
    onlyNew = false,
    onlyFavorites = false,
    aircraftIds = null            // explicit list to use (overrides filters)
  } = opts;

  let pool;
  if (aircraftIds && aircraftIds.length) {
    pool = aircraftIds.map(id => aircraftById[id]).filter(Boolean);
  } else {
    pool = aircraft.filter(a => {
      if (!tiers.includes(a.tier)) return false;
      if (categories && !categories.includes(a.category)) return false;
      if (perfTier && a.perfTier !== perfTier) return false;
      const p = progress[a.id];
      if (onlyWeak && !isWeak(a.id, p)) return false;
      if (onlyNew && p.exposures > 0) return false;
      if (onlyFavorites && !p.favorite) return false;
      return true;
    });
  }

  // Order
  if (order === 'random') {
    pool = shuffle(pool);
  } else if (order === 'tier') {
    pool = [...pool].sort((a, b) => a.tier - b.tier);
  } else if (order === 'category') {
    pool = [...pool].sort((a, b) => a.category.localeCompare(b.category));
  } else if (order === 'weakness') {
    pool = [...pool].sort((a, b) => {
      const ma = masteryById[a.id]?.strict ?? 0;
      const mb = masteryById[b.id]?.strict ?? 0;
      return ma - mb; // weakest first
    });
  }

  // Trim to size
  let deck = pool.slice(0, size);

  // Mix confusion pairs: ensure partners are present where possible
  if (mixConfusionPairs && deck.length < pool.length) {
    const inDeck = new Set(deck.map(a => a.id));
    for (const a of [...deck]) {
      const partners = partnersFor(a.id);
      for (const pid of partners) {
        if (!inDeck.has(pid) && aircraftById[pid] && deck.length < size + 2) {
          // small overflow allowed for pairing
          deck.push(aircraftById[pid]);
          inDeck.add(pid);
        }
      }
    }
  }

  return deck.map(a => ({ aircraftId: a.id }));
}

// ----- In-session spaced repetition queue -----
//
// Strategy per spec:
//   easy   → if Tier 1 or confusion-prone: requeue once near end; else remove
//   unsure → requeue after 3-4 cards
//   wrong  → requeue after 1-2 cards (priority)
//   hard-flagged at moment of card: always requeue immediately after next card
//
// We model the queue as an array of card descriptors. Each descriptor:
//   { aircraftId, requeueCount, source: 'initial' | 'requeue' }

export function createQueue(initialCards) {
  return initialCards.map(c => ({ ...c, requeueCount: 0, source: 'initial' }));
}

// Apply rating to current card; return next queue.
export function applyRating(queue, currentIndex, rating, opts = {}) {
  const card = queue[currentIndex];
  if (!card) return queue;
  const ac = aircraftById[card.aircraftId];
  const isTier1 = ac?.tier === 1;
  const hasPartners = partnersFor(card.aircraftId).length > 0;
  const wasHardFlagged = !!opts.hardFlagged;

  // Build the remainder (after current).
  const before = queue.slice(0, currentIndex + 1); // includes current as "done"
  const after = queue.slice(currentIndex + 1);

  if (wasHardFlagged) {
    // Insert just after the next card (or at end if no next).
    return reinsert(before, after, card, 1);
  }

  if (rating === 'easy') {
    if (card.requeueCount >= 1) return [...before, ...after]; // already requeued; remove
    if (isTier1 || hasPartners) {
      // Requeue near end
      return reinsert(before, after, card, after.length); // at the very end
    }
    return [...before, ...after];
  }

  if (rating === 'unsure') {
    if (card.requeueCount >= 2) return [...before, ...after];
    return reinsert(before, after, card, Math.min(after.length, 3 + Math.floor(Math.random() * 2)));
  }

  if (rating === 'wrong') {
    if (card.requeueCount >= 3) return [...before, ...after];
    return reinsert(before, after, card, Math.min(after.length, 1 + Math.floor(Math.random() * 2)));
  }

  // 'skip' — push to end without bump
  return reinsert(before, after, card, after.length);
}

function reinsert(before, after, card, offset) {
  const newCard = { ...card, requeueCount: card.requeueCount + 1, source: 'requeue' };
  const insertIdx = Math.max(0, Math.min(after.length, offset));
  const newAfter = [...after.slice(0, insertIdx), newCard, ...after.slice(insertIdx)];
  return [...before, ...newAfter];
}

// ----- Session summary -----

export function summarize(session, masteryBefore, masteryAfter) {
  const results = session.results;
  const totals = { easy: 0, unsure: 0, wrong: 0, perfKnow: 0, perfUnsure: 0, perfDont: 0 };
  for (const r of results) {
    if (r.recognitionRating === 'easy') totals.easy++;
    if (r.recognitionRating === 'unsure') totals.unsure++;
    if (r.recognitionRating === 'wrong') totals.wrong++;
    if (r.performanceRating === 'know') totals.perfKnow++;
    if (r.performanceRating === 'unsure') totals.perfUnsure++;
    if (r.performanceRating === 'dont') totals.perfDont++;
  }

  // Unique aircraft seen in session
  const uniqueIds = [...new Set(results.map(r => r.aircraftId))];

  const recCount = totals.easy + totals.unsure + totals.wrong;
  const perfCount = totals.perfKnow + totals.perfUnsure + totals.perfDont;

  const recognitionAccuracy = recCount ? Math.round((totals.easy / recCount) * 100) : 0;
  const performanceAccuracy = perfCount ? Math.round((totals.perfKnow / perfCount) * 100) : 0;

  const newlyMastered = uniqueIds.filter(
    id => masteryBefore[id]?.state !== 'Mastered' && masteryAfter[id]?.state === 'Mastered'
  );
  const stillUnsure = uniqueIds.filter(id => masteryAfter[id]?.state === 'Learning' || masteryAfter[id]?.state === 'Uncertain');

  // Category breakdown by accuracy (this session only)
  const byCategory = {};
  for (const r of results) {
    const ac = aircraftById[r.aircraftId];
    if (!ac) continue;
    if (!byCategory[ac.category]) byCategory[ac.category] = { total: 0, easy: 0 };
    byCategory[ac.category].total++;
    if (r.recognitionRating === 'easy') byCategory[ac.category].easy++;
  }
  const bestCategory = Object.entries(byCategory)
    .map(([k, v]) => ({ k, acc: v.total ? v.easy / v.total : 0, total: v.total }))
    .filter(e => e.total >= 2)
    .sort((a, b) => b.acc - a.acc)[0];

  return {
    cardsReviewed: results.length,
    uniqueAircraft: uniqueIds.length,
    recognitionAccuracy,
    performanceAccuracy,
    totals,
    newlyMastered,
    stillUnsure,
    byCategory,
    bestCategory: bestCategory ? { name: bestCategory.k, accuracy: Math.round(bestCategory.acc * 100) } : null
  };
}

// ----- helpers -----
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----- Answer matching (family-level vs exact) -----
// Used optionally: spec says ratings are confidence-based, but the matcher
// is offered for users who type-then-rate (future enhancement / exam mode).
export function matchAnswer(input, aircraftRecord, mode = 'learning') {
  const norm = s => s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');
  const target = norm(input);
  if (!target) return 'wrong';

  const exactCandidates = [aircraftRecord.name, ...(aircraftRecord.aliases || [])].map(norm);
  const family = norm(aircraftRecord.family || '');

  const exact = exactCandidates.some(c => c === target || c.includes(target) || target.includes(c));
  if (exact) return 'easy';

  if (mode === 'exam') return 'wrong';

  if (family && (target === family || target.includes(family) || family.includes(target))) {
    return mode === 'learning' ? 'easy' : 'unsure';
  }
  return 'wrong';
}
