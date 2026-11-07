import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';

export type AppearancePreference = 'dark' | 'light' | 'system';
type ThemeContextValue = {
  preference: AppearancePreference;
  mode: 'dark' | 'light';
  colors: ThemeColors;
  setPreference: (preference: AppearancePreference) => void;
};

const STORAGE_KEY = 'directional-works:appearance';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: (ready: boolean) => ReactNode }) {
  const systemMode = useColorScheme();
  const [preference, setSavedPreference] = useState<AppearancePreference>('dark');
  const [ready, setReady] = useState(false);
  const pendingWrite = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (active && (saved === 'dark' || saved === 'light' || saved === 'system')) setSavedPreference(saved);
      })
      .catch((error) => console.warn('Could not load appearance preference', error))
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const setPreference = useCallback((next: AppearancePreference) => {
    setSavedPreference(next);
    pendingWrite.current = pendingWrite.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, next))
      .catch((error) => console.warn('Could not save appearance preference', error));
  }, []);

  const mode = preference === 'system' ? (systemMode === 'light' ? 'light' : 'dark') : preference;
  const value = useMemo<ThemeContextValue>(() => ({
    preference, mode, colors: mode === 'light' ? lightColors : darkColors, setPreference,
  }), [preference, mode, setPreference]);

  return <ThemeContext.Provider value={value}>{children(ready)}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be inside AppThemeProvider');
  return value;
}
