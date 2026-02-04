import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';
import type { Theme, ThemeMode } from '../theme';

/**
 * Hook to access the current theme
 * @returns The current theme object
 */
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

/**
 * Hook to access the current theme mode
 * @returns The current theme mode ('light' or 'dark')
 */
export const useThemeMode = (): ThemeMode => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context.mode;
};

/**
 * Hook to access theme actions (setMode, toggleMode)
 * @returns Object with setMode, toggleMode, and mode
 */
export const useThemeActions = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeActions must be used within a ThemeProvider');
  }
  return {
    setMode: context.setMode,
    toggleMode: context.toggleMode,
    mode: context.mode,
  };
};

/**
 * Hook to get theme colors for the current mode
 * @returns Object with colors for the current mode
 */
export const useThemeColors = () => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  return {
    gray: isDark ? theme.colors.gray.dark : theme.colors.gray,
    background: isDark ? theme.colors.gray.dark[1] : '#ffffff',
    surface: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.85)',
    panel: isDark ? theme.colors.gray.dark[2] : '#ffffff',
  };
};

export default useTheme;
// export {ThemeContext, ThemeProvider, useThemeContext} from '@/theme/ThemeProvider';
