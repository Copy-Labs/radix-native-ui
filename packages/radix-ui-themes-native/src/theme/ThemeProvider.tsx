import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef, ReactNode } from 'react';
import type { Theme, ThemeMode, Color, RadiusSize, ThemeAppearance } from './types';
import { createTheme, defaultTheme } from './index';
import { useDeviceColorScheme } from '../hooks/useColorScheme';
import type { ToastConfig, ToastData, ToastOptions } from '../components/overlays/Toast.types';
import { DEFAULT_TOAST_CONFIG } from '../components/overlays/Toast.types';
import { ToastViewport } from '../components/overlays/Toast';

// Gray color type based on available options in the theme
type GrayColor = 'mauve' | 'olive' | 'sage' | 'sand' | 'slate' | 'gray';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  appearance: ThemeAppearance;
  setMode: (mode: ThemeAppearance) => void;
  toggleMode: () => void;
  // Haptics setting
  haptics: boolean;
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

  // ===== THEME CONFIGURATION (Flat Props - Preferred) =====
  /**
   * Primary accent color for the theme
   * @default 'indigo'
   */
  accentColor?: Color;
  /**
   * Gray scale color
   * @default 'mauve'
   */
  grayColor?: GrayColor;
  /**
   * Border radius scale
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Overall scaling factor (1 = 100%)
   * @default 1
   */
  scaling?: number;
  /**
   * Panel background style
   * @default 'solid'
   */
  panelBackground?: 'solid' | 'translucent';

  // ===== RUNTIME BEHAVIOR =====
  /**
   * Initial theme mode. If not provided, will inherit from parent ThemeProvider or use device color scheme.
   * @deprecated Use `appearance` instead for consistency with Radix web
   */
  mode?: ThemeMode;
  /**
   * Color scheme preference ('light' | 'dark' | 'inherit')
   * Alias for `mode` - matches Radix UI Themes web API
   * @default 'inherit'
   */
  appearance?: 'light' | 'dark' | 'inherit';
  /**
   * Force theme mode (overrides parent and device settings)
   */
  forcedMode?: ThemeMode;
  /**
   * Whether to apply background color to the container
   * @default true
   */
  hasBackground?: boolean;
  /**
   * Callback when theme mode changes
   */
  onModeChange?: (mode: ThemeMode) => void;

  // ===== LEGACY SUPPORT =====
  /**
   * Theme options object (legacy - use flat props instead)
   * If provided alongside flat props, flat props take precedence
   */
  themeOptions?: Partial<Theme>;

  // ===== TOAST CONFIGURATION =====
  /**
   * Toast configuration options
   */
  toastConfig?: ToastConfig;

  // ===== HAPTICS CONFIGURATION =====
  /**
   * Enable or disable haptic feedback globally
   * @default true
   */
  haptics?: boolean;
}

/**
 * ThemeProvider component that provides theme context to all children.
 *
 * Mode resolution priority:
 * 1. forcedMode prop (highest - overrides everything)
 * 2. appearance/mode prop (explicit initial mode)
 * 3. Parent ThemeProvider's mode (inheritance for nested providers)
 * 4. Device color scheme
 * 5. 'light' (default fallback)
 *
 * Theme configuration priority:
 * 1. Flat props (accentColor, radius, etc.) - highest precedence
 * 2. themeOptions object (legacy support)
 * 3. Default values
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  // Theme config (flat props)
  accentColor,
  grayColor,
  radius,
  scaling,
  panelBackground,
  // Runtime props
  mode: initialMode,
  appearance,
  forcedMode,
  onModeChange,
  // Legacy
  themeOptions = {},
  // Toast
  toastConfig: userToastConfig,
  // Haptics
  haptics: globalHaptics,
}) => {
  // Get parent theme context if it exists (for nested ThemeProviders)
  const parentContext = useContext(ThemeContext);
  const deviceColorScheme = useDeviceColorScheme();

  // Resolve mode from appearance or mode prop
  const resolvedInitialMode: ThemeMode | undefined =
    appearance === 'inherit' ? undefined : (appearance as ThemeMode) ?? initialMode;

  // Initialize mode with priority: resolvedInitialMode > parent mode > device scheme > 'light'
  const [mode, setMode] = useState<ThemeMode>(
    resolvedInitialMode ?? parentContext?.mode ?? deviceColorScheme ?? 'light'
  );

  // Toast state
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastIdCounter = useRef(0);

  // Handle mode changes from props and parent context
  useEffect(() => {
    if (forcedMode !== undefined) {
      // forcedMode takes highest priority
      setMode(forcedMode);
    } else if (resolvedInitialMode !== undefined) {
      // Explicit mode/appearance prop takes second priority
      setMode(resolvedInitialMode);
    } else if (parentContext?.mode !== undefined) {
      // Inherit from parent ThemeProvider
      setMode(parentContext.mode);
    } else {
      // Fall back to device color scheme
      setMode(deviceColorScheme ?? 'light');
    }
  }, [forcedMode, resolvedInitialMode, parentContext?.mode, deviceColorScheme]);

  const handleSetMode = (newAppearance: ThemeAppearance) => {
    // Store the appearance preference
    if (newAppearance === 'inherit') {
      // When 'inherit', fall back to the device color scheme
      setMode(deviceColorScheme ?? 'light');
    } else {
      setMode(newAppearance);
    }
    onModeChange?.(newAppearance === 'inherit' ? deviceColorScheme ?? 'light' : newAppearance);
  };

  const toggleMode = () => {
    handleSetMode(mode === 'light' ? 'dark' : 'light');
  };

  // Build theme config: flat props take precedence over themeOptions
  const finalThemeOptions = useMemo(() => {
    return {
      // Start with legacy themeOptions
      ...themeOptions,
      // Override with flat props if provided
      ...(accentColor !== undefined && { accentColor }),
      ...(grayColor !== undefined && { grayColor }),
      ...(radius !== undefined && { radius }),
      ...(scaling !== undefined && { scaling }),
      // panelBackground is not part of Theme type, would need separate handling
    };
  }, [themeOptions, accentColor, grayColor, radius, scaling]);

  const theme = useMemo(() => createTheme(finalThemeOptions), [finalThemeOptions]);

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

  // Resolve haptics from prop or default to true
  const resolvedHaptics = globalHaptics ?? true;

  const value = useMemo(
    () => ({
      theme,
      mode,
      appearance: appearance ?? 'inherit',
      setMode: handleSetMode,
      toggleMode,
      // Haptics setting
      haptics: resolvedHaptics,
      // Toast-related values
      toastConfig,
      toasts,
      showToast,
      hideToast,
      hideAllToasts,
      updateToast,
    }),
    [theme, mode, appearance, toggleMode, resolvedHaptics, toastConfig, toasts, showToast, hideToast, hideAllToasts, updateToast]
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
  const { setMode, toggleMode, mode, appearance } = useThemeContext();
  return { setMode, toggleMode, mode, appearance };
};

/**
 * Hook to access the global haptics setting
 * @returns boolean - whether haptics are enabled globally
 */
export const useHaptics = (): boolean => {
  return useThemeContext().haptics;
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
