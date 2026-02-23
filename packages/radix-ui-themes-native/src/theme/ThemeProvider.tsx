import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef, ReactNode } from 'react';
import type { Theme, ThemeMode } from './types';
import { createTheme, defaultTheme } from './index';
import { useDeviceColorScheme } from '../hooks/useColorScheme';
import type { ToastConfig, ToastData, ToastOptions } from '../components/overlays/Toast.types';
import { DEFAULT_TOAST_CONFIG } from '../components/overlays/Toast.types';
import { ToastViewport } from '../components/overlays/Toast';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  // Toast-related values
  toastConfig: Required<ToastConfig>;
  toasts: ToastData[];
  showToast: (options: ToastOptions) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
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
   * Initial theme mode. If not provided, will inherit from parent ThemeProvider or use device color scheme.
   */
  mode?: ThemeMode;
  /**
   * Force theme mode (overrides parent and device settings)
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
  /**
   * Toast configuration options
   */
  toastConfig?: ToastConfig;
}

/**
 * ThemeProvider component that provides theme context to all children.
 *
 * Mode resolution priority:
 * 1. forcedMode prop (highest - overrides everything)
 * 2. mode prop (explicit initial mode)
 * 3. Parent ThemeProvider's mode (inheritance for nested providers)
 * 4. Device color scheme
 * 5. 'light' (default fallback)
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode: initialMode,
  forcedMode,
  themeOptions = {},
  onModeChange,
  toastConfig: userToastConfig,
}) => {
  // Get parent theme context if it exists (for nested ThemeProviders)
  const parentContext = useContext(ThemeContext);
  const deviceColorScheme = useDeviceColorScheme();

  // Initialize mode with priority: initialMode > parent mode > device scheme > 'light'
  const [mode, setMode] = useState<ThemeMode>(
    initialMode ?? parentContext?.mode ?? deviceColorScheme ?? 'light'
  );

  // Toast state
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastIdCounter = useRef(0);

  // Handle mode changes from props and parent context
  useEffect(() => {
    if (forcedMode !== undefined) {
      // forcedMode takes highest priority
      setMode(forcedMode);
    } else if (initialMode !== undefined) {
      // Explicit mode prop takes second priority
      setMode(initialMode);
    } else if (parentContext?.mode !== undefined) {
      // Inherit from parent ThemeProvider
      setMode(parentContext.mode);
    } else {
      // Fall back to device color scheme
      setMode(deviceColorScheme ?? 'light');
    }
  }, [forcedMode, initialMode, parentContext?.mode, deviceColorScheme]);

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const toggleMode = () => {
    handleSetMode(mode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  // Merge toast config with defaults
  const toastConfig = useMemo<Required<ToastConfig>>(
    () => ({ ...DEFAULT_TOAST_CONFIG, ...userToastConfig }),
    [userToastConfig]
  );

  // Show toast
  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${++toastIdCounter.current}`;
      const now = Date.now();

      const newToast: ToastData = {
        id,
        createdAt: now,
        title: options.title,
        description: options.description,
        variant: options.variant || toastConfig.defaultVariant,
        color: options.color,
        duration: options.duration ?? toastConfig.duration,
        position: options.position || toastConfig.position,
        action: options.action,
        onDismiss: options.onDismiss,
        onAutoClose: options.onAutoClose,
        accessibilityLabel: options.accessibilityLabel,
        icon: options.icon,
        showClose: options.showClose ?? true,
        style: options.style,
        visible: true,
        isAnimating: false,
      };

      setToasts((prev) => {
        // Filter toasts by position
        const samePosition = prev.filter(t => t.position === newToast.position);
        const otherPosition = prev.filter(t => t.position !== newToast.position);

        // Check if we need to remove oldest toast
        let updatedSamePosition = [...samePosition];
        if (updatedSamePosition.length >= toastConfig.maxVisible) {
          // Remove the oldest toast
          updatedSamePosition = updatedSamePosition.slice(1);
        }

        return [...otherPosition, ...updatedSamePosition, newToast];
      });

      return id;
    },
    [toastConfig]
  );

  // Hide toast
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hide all toasts
  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Update toast
  const updateToast = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...options } : t
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode: handleSetMode,
      toggleMode,
      // Toast-related values
      toastConfig,
      toasts,
      showToast,
      hideToast,
      hideAllToasts,
      updateToast,
    }),
    [theme, mode, toggleMode, toastConfig, toasts, showToast, hideToast, hideAllToasts, updateToast]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ThemeContext.Provider>
  );
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

/**
 * Hook to access toast functionality
 */
export const useToast = () => {
  const { showToast, hideToast, hideAllToasts, updateToast } = useThemeContext();

  return useMemo(
    () => ({
      show: showToast,
      success: (options: Omit<ToastOptions, 'variant'>) => showToast({ ...options, variant: 'success' }),
      error: (options: Omit<ToastOptions, 'variant'>) => showToast({ ...options, variant: 'error' }),
      warning: (options: Omit<ToastOptions, 'variant'>) => showToast({ ...options, variant: 'warning' }),
      info: (options: Omit<ToastOptions, 'variant'>) => showToast({ ...options, variant: 'info' }),
      accent: (options: Omit<ToastOptions, 'variant'>) => showToast({ ...options, variant: 'accent' }),
      hide: hideToast,
      hideAll: hideAllToasts,
      update: updateToast,
    }),
    [showToast, hideToast, hideAllToasts, updateToast]
  );
};

export default ThemeProvider;
