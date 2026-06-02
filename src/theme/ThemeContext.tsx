import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  accent: string;
  danger: string;
  success: string;
  iconBg: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F4F7',
  border: '#E5E7EB',
  text: '#111418',
  textMuted: '#6B7280',
  primary: '#1A73E8',
  primarySoft: '#E8F0FE',
  accent: '#0B6E99',
  danger: '#DC2626',
  success: '#16A34A',
  iconBg: '#EDEFF3',
};

const darkColors: ThemeColors = {
  background: '#0F1115',
  surface: '#161A21',
  surfaceAlt: '#1C2129',
  border: '#252B35',
  text: '#F3F4F6',
  textMuted: '#9AA3AF',
  primary: '#8AB4F8',
  primarySoft: '#1E3A5F',
  accent: '#6BB7D6',
  danger: '#F87171',
  success: '#4ADE80',
  iconBg: '#1F242D',
};

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = '@toss/theme-mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');
    return {
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      setMode,
    };
  }, [mode, system]);

  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
