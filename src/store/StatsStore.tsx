import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CoinFace = 'heads' | 'tails';

export interface FlipRecord {
  face: CoinFace;
  at: number; // epoch ms
}

interface StatsState {
  heads: number;
  tails: number;
  streak: number;
  streakFace: CoinFace | null;
  recent: CoinFace[]; // newest first, capped at RECENT_LIMIT
  history: FlipRecord[]; // newest first, capped at HISTORY_LIMIT
}

interface StatsValue extends StatsState {
  total: number;
  recordFlip: (face: CoinFace) => void;
  resetStats: () => void;
  clearHistory: () => void;
}

const StatsContext = createContext<StatsValue | undefined>(undefined);

const STORAGE_KEY = '@toss/stats';
const RECENT_LIMIT = 10;
export const HISTORY_LIMIT = 500;

const defaultState: StatsState = {
  heads: 0,
  tails: 0,
  streak: 0,
  streakFace: null,
  recent: [],
  history: [],
};

const isFace = (v: unknown): v is CoinFace => v === 'heads' || v === 'tails';

const isFlipRecord = (v: unknown): v is FlipRecord => {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as { face?: unknown; at?: unknown };
  return isFace(r.face) && typeof r.at === 'number' && Number.isFinite(r.at);
};

// Stored JSON may come from an older app version — coerce every field defensively.
const sanitize = (raw: unknown): StatsState => {
  if (typeof raw !== 'object' || raw === null) return defaultState;
  const r = raw as Partial<Record<keyof StatsState, unknown>>;
  const count = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  return {
    heads: count(r.heads),
    tails: count(r.tails),
    streak: count(r.streak),
    streakFace: isFace(r.streakFace) ? r.streakFace : null,
    recent: Array.isArray(r.recent) ? r.recent.filter(isFace).slice(0, RECENT_LIMIT) : [],
    history: Array.isArray(r.history) ? r.history.filter(isFlipRecord).slice(0, HISTORY_LIMIT) : [],
  };
};

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StatsState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setState(sanitize(JSON.parse(raw)));
          } catch {
            setState(defaultState);
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, hydrated]);

  const recordFlip = useCallback((face: CoinFace) => {
    setState((s) => ({
      heads: s.heads + (face === 'heads' ? 1 : 0),
      tails: s.tails + (face === 'tails' ? 1 : 0),
      streak: s.streakFace === face ? s.streak + 1 : 1,
      streakFace: face,
      recent: [face, ...s.recent].slice(0, RECENT_LIMIT),
      history: [{ face, at: Date.now() }, ...s.history].slice(0, HISTORY_LIMIT),
    }));
  }, []);

  const resetStats = useCallback(() => setState(defaultState), []);

  const clearHistory = useCallback(() => setState((s) => ({ ...s, history: [] })), []);

  const value = useMemo(
    () => ({ ...state, total: state.heads + state.tails, recordFlip, resetStats, clearHistory }),
    [state, recordFlip, resetStats, clearHistory],
  );

  if (!hydrated) return null;

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

export const useStats = (): StatsValue => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStats must be used within a StatsProvider');
  return ctx;
};
