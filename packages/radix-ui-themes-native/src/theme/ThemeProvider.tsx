import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import type { Theme, ThemeMode } from './types';
import { createTheme, defaultTheme } from './index';
import { useDeviceColorScheme } from '../hooks/useColorScheme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export { ThemeContext };

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Initial theme mode. If not provided, will use device color scheme.
   */
  mode?: ThemeMode;
  /**
   * Force theme mode (overrides device settings)
   */
  forcedMode?: ThemeMode;
  /**
   * Theme options
   */
  themeOptions?: Partial<Theme>;
  /**
   * Callback when theme mode changes
   */
  onModeChange?: (mode: ThemeMode) => void;
}

/**
 * ThemeProvider component that provides theme context to all children
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode: initialMode,
  forcedMode,
  themeOptions = {},
  onModeChange,
}) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode || deviceColorScheme || 'light');

  useEffect(() => {
    if (forcedMode !== undefined) {
      setMode(forcedMode);
    } else if (initialMode === undefined) {
      setMode(deviceColorScheme || 'light');
    }
  }, [forcedMode, initialMode, deviceColorScheme]);

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const toggleMode = () => {
    handleSetMode(mode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode: handleSetMode,
      toggleMode,
    }),
    [theme, mode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to access the current theme
 */
export const useTheme = (): Theme => {
  return useThemeContext().theme;
};

/**
 * Hook to access the current theme mode
 */
export const useThemeMode = (): ThemeMode => {
  return useThemeContext().mode;
};

/**
 * Hook to access theme mode setter and toggle
 */
export const useThemeActions = () => {
  const { setMode, toggleMode, mode } = useThemeContext();
  return { setMode, toggleMode, mode };
};

export default ThemeProvider;
