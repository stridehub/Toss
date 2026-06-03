import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FlipAxis = 'horizontal' | 'vertical';

interface SettingsState {
  voiceAssist: boolean;
  flipAxis: FlipAxis;
}

interface SettingsValue extends SettingsState {
  setVoiceAssist: (on: boolean) => void;
  setFlipAxis: (axis: FlipAxis) => void;
}

const SettingsContext = createContext<SettingsValue | undefined>(undefined);

const STORAGE_KEY = '@toss/settings';

const defaultState: SettingsState = { voiceAssist: false, flipAxis: 'vertical' };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SettingsState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setState({ ...defaultState, ...(JSON.parse(raw) as Partial<SettingsState>) });
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

  const setVoiceAssist = useCallback((on: boolean) => {
    setState((s) => ({ ...s, voiceAssist: on }));
  }, []);

  const setFlipAxis = useCallback((axis: FlipAxis) => {
    setState((s) => ({ ...s, flipAxis: axis }));
  }, []);

  const value = useMemo(
    () => ({ ...state, setVoiceAssist, setFlipAxis }),
    [state, setVoiceAssist, setFlipAxis],
  );

  if (!hydrated) return null;

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
};
