import React, { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react';
import { aircraft } from '../data/aircraft.js';
import { computeMastery } from './sessionEngine.js';

const STORAGE_KEY = 'aircraft-trainer-v1';
const SCHEMA_VERSION = 1;

// ----- Initial state -----
function freshProgress() {
  // Per-aircraft progress.
  const out = {};
  for (const ac of aircraft) {
    out[ac.id] = {
      // recognition history: list of { ts, rating: 'easy' | 'unsure' | 'wrong' }
      recognition: [],
      // performance history: list of { ts, rating: 'know' | 'unsure' | 'dont' }
      performance: [],
      flagged: false,
      favorite: false,
      notes: '',
      lastSeen: null,
      exposures: 0
    };
  }
  return out;
}

function freshState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    settings: {
      theme: 'dark',
      defaultDifficulty: 'learning', // learning | strong | exam
      defaultSessionSize: 20,
      examTimerSeconds: 30,
      keyboardShortcuts: true
    },
    progress: freshProgress(),
    sessions: [], // { ts, durationMs, results: [{aircraftId, recognitionRating, performanceRating?}], stats: {...} }
    streak: { count: 0, lastDate: null }
  };
}

// ----- Persistence -----
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const data = JSON.parse(raw);
    if (data.schemaVersion !== SCHEMA_VERSION) return freshState();
    // Merge in any new aircraft progress entries (dataset can grow).
    const fresh = freshState();
    for (const id in fresh.progress) {
      if (data.progress[id]) fresh.progress[id] = { ...fresh.progress[id], ...data.progress[id] };
    }
    return {
      ...fresh,
      settings: { ...fresh.settings, ...(data.settings || {}) },
      sessions: data.sessions || [],
      streak: data.streak || fresh.streak
    };
  } catch (e) {
    console.warn('loadState failed', e);
    return freshState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('saveState failed', e);
  }
}

// ----- Reducer -----
function reducer(state, action) {
  switch (action.type) {
    case 'SETTINGS_UPDATE':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'AIRCRAFT_FLAG_TOGGLE': {
      const cur = state.progress[action.id];
      return {
        ...state,
        progress: { ...state.progress, [action.id]: { ...cur, flagged: !cur.flagged } }
      };
    }

    case 'AIRCRAFT_FAVORITE_TOGGLE': {
      const cur = state.progress[action.id];
      return {
        ...state,
        progress: { ...state.progress, [action.id]: { ...cur, favorite: !cur.favorite } }
      };
    }

    case 'AIRCRAFT_NOTES_SET': {
      const cur = state.progress[action.id];
      return {
        ...state,
        progress: { ...state.progress, [action.id]: { ...cur, notes: action.notes } }
      };
    }

    case 'SESSION_RECORD': {
      // action.session: { ts, durationMs, results }
      const session = action.session;
      const newProgress = { ...state.progress };
      for (const r of session.results) {
        const cur = newProgress[r.aircraftId];
        if (!cur) continue;
        const recognition = r.recognitionRating
          ? [...cur.recognition, { ts: session.ts, rating: r.recognitionRating }]
          : cur.recognition;
        const performance = r.performanceRating
          ? [...cur.performance, { ts: session.ts, rating: r.performanceRating }]
          : cur.performance;
        newProgress[r.aircraftId] = {
          ...cur,
          recognition,
          performance,
          lastSeen: session.ts,
          exposures: cur.exposures + 1
        };
      }

      // Update streak.
      const today = dateKey(session.ts);
      const lastDate = state.streak.lastDate;
      let count = state.streak.count;
      if (lastDate === today) {
        // same-day session, no change
      } else if (lastDate && isYesterday(lastDate, today)) {
        count = count + 1;
      } else {
        count = 1;
      }

      return {
        ...state,
        progress: newProgress,
        sessions: [...state.sessions, session],
        streak: { count, lastDate: today }
      };
    }

    case 'RESET_ALL':
      return freshState();

    case 'IMPORT_STATE':
      return action.state;

    default:
      return state;
  }
}

function dateKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function isYesterday(prev, today) {
  const [py, pm, pd] = prev.split('-').map(Number);
  const prevDate = new Date(py, pm - 1, pd);
  const [ty, tm, td] = today.split('-').map(Number);
  const todayDate = new Date(ty, tm - 1, td);
  const diffDays = Math.round((todayDate - prevDate) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// ----- Image cache (Wikipedia API) -----
const imageMemoryCache = new Map();
const IMAGE_STORAGE_KEY = 'aircraft-trainer-images-v1';

function loadImageCache() {
  try {
    const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    for (const k in data) imageMemoryCache.set(k, data[k]);
  } catch {}
}
function saveImageCache() {
  try {
    const obj = Object.fromEntries(imageMemoryCache);
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}
loadImageCache();

export async function fetchAircraftImage(wikipediaTitle) {
  if (!wikipediaTitle) return null;
  if (imageMemoryCache.has(wikipediaTitle)) return imageMemoryCache.get(wikipediaTitle);
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      wikipediaTitle
    )}&prop=pageimages&format=json&pithumbsize=800&origin=*&redirects=1`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    const src = page?.thumbnail?.source || null;
    imageMemoryCache.set(wikipediaTitle, src);
    saveImageCache();
    return src;
  } catch (e) {
    console.warn('image fetch failed', wikipediaTitle, e);
    return null;
  }
}

// ----- Context -----
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => { saveState(state); }, [state]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  const masteryById = useMemo(() => {
    const out = {};
    for (const id in state.progress) {
      out[id] = computeMastery(id, state.progress[id]);
    }
    return out;
  }, [state.progress]);

  const value = useMemo(() => ({
    state,
    dispatch,
    masteryById,
    actions: {
      updateSettings: (patch) => dispatch({ type: 'SETTINGS_UPDATE', patch }),
      toggleFlag: (id) => dispatch({ type: 'AIRCRAFT_FLAG_TOGGLE', id }),
      toggleFavorite: (id) => dispatch({ type: 'AIRCRAFT_FAVORITE_TOGGLE', id }),
      setNotes: (id, notes) => dispatch({ type: 'AIRCRAFT_NOTES_SET', id, notes }),
      recordSession: (session) => dispatch({ type: 'SESSION_RECORD', session }),
      resetAll: () => dispatch({ type: 'RESET_ALL' }),
      importState: (s) => dispatch({ type: 'IMPORT_STATE', state: s })
    }
  }), [state, masteryById]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
