import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { Color } from '../../theme';
import { ReactNode } from 'react';

// ============================================================================
// Toast Variants
// ============================================================================

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'accent';

// ============================================================================
// Toast Position
// ============================================================================

export type ToastPosition = 'top' | 'bottom';

// ============================================================================
// Toast Action
// ============================================================================

export interface ToastAction {
  /**
   * Label for the action button
   */
  label: string;
  /**
   * Callback when action is pressed
   */
  onPress: () => void;
}

// ============================================================================
// Toast Options (for showing a toast)
// ============================================================================

export interface ToastOptions {
  /**
   * Toast title (required)
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: ToastVariant;

  /**
   * Override color (overrides variant color)
   */
  color?: Color;

  /**
   * Duration in milliseconds before auto-dismiss
   * Set to Infinity for no auto-dismiss
   * @default 5000 (from ThemeProvider config)
   */
  duration?: number;

  /**
   * Position override for this specific toast
   * @default from ThemeProvider config
   */
  position?: ToastPosition;

  /**
   * Optional action button
   */
  action?: ToastAction;

  /**
   * Callback when toast is dismissed (manually or auto)
   */
  onDismiss?: () => void;

  /**
   * Callback when toast auto-closes (not when manually dismissed)
   */
  onAutoClose?: () => void;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Custom icon (React node)
   */
  icon?: ReactNode;

  /**
   * Whether to show close button
   * @default true
   */
  showClose?: boolean;

  /**
   * Custom style for the toast container
   */
  style?: StyleProp<ViewStyle>;
}

// ============================================================================
// Toast Data (internal state)
// ============================================================================

export interface ToastData extends Required<Pick<ToastOptions, 'title'>> {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Timestamp when toast was created
   */
  createdAt: number;

  /**
   * Toast title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Variant
   */
  variant: ToastVariant;

  /**
   * Override color
   */
  color?: Color;

  /**
   * Duration (ms)
   */
  duration: number;

  /**
   * Position
   */
  position: ToastPosition;

  /**
   * Optional action
   */
  action?: ToastAction;

  /**
   * Dismiss callback
   */
  onDismiss?: () => void;

  /**
   * Auto-close callback
   */
  onAutoClose?: () => void;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Custom icon
   */
  icon?: ReactNode;

  /**
   * Show close button
   */
  showClose: boolean;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether the toast is currently visible (for animation)
   */
  visible: boolean;

  /**
   * Animation state
   */
  isAnimating: boolean;

  /**
   * Internal: dismissal was requested (hide/hideAll/max-visible eviction).
   * The mounted toast plays its exit animation, then removes itself — so
   * every path off-screen is animated, never popped.
   */
  leaving?: boolean;
}

// ============================================================================
// Toast Config (ThemeProvider prop)
// ============================================================================

export interface ToastConfig {
  /**
   * Position of toast container
   * @default 'bottom'
   */
  position?: ToastPosition;

  /**
   * Maximum number of visible toasts in stack
   * @default 3
   */
  maxVisible?: number;

  /**
   * Default duration in milliseconds
   * @default 5000
   */
  duration?: number;

  /**
   * Default variant
   * @default 'default'
   */
  defaultVariant?: ToastVariant;

  /**
   * Whether toasts can be dismissed by swiping
   * @default true
   */
  swipeToDismiss?: boolean;

  /**
   * Gap between stacked toasts (in pixels)
   * @default 8
   */
  gap?: number;

  /**
   * Whether to enable haptic feedback
   * @default true
   */
  hapticFeedback?: boolean;
}

// ============================================================================
// Toast Controller (returned by useToast)
// ============================================================================

export interface ToastController {
  /**
   * Show a toast with options
   * @returns Toast ID for programmatic dismissal
   */
  show: (options: ToastOptions) => string;

  /**
   * Show a success toast
   */
  success: (options: Omit<ToastOptions, 'variant'>) => string;

  /**
   * Show an error toast
   */
  error: (options: Omit<ToastOptions, 'variant'>) => string;

  /**
   * Show a warning toast
   */
  warning: (options: Omit<ToastOptions, 'variant'>) => string;

  /**
   * Show an info toast
   */
  info: (options: Omit<ToastOptions, 'variant'>) => string;

  /**
   * Show an accent toast
   */
  accent: (options: Omit<ToastOptions, 'variant'>) => string;

  /**
   * Hide a specific toast by ID
   */
  hide: (id: string) => void;

  /**
   * Hide all toasts
   */
  hideAll: () => void;

  /**
   * Update an existing toast
   */
  update: (id: string, options: Partial<ToastOptions>) => void;
}

// ============================================================================
// Toast Context Value
// ============================================================================

export interface ToastContextValue {
  /**
   * Current toast configuration
   */
  config: Required<ToastConfig>;

  /**
   * Array of active toasts
   */
  toasts: ToastData[];

  /**
   * Show a toast
   */
  showToast: (options: ToastOptions) => string;

  /**
   * Hide a toast (requests its animated exit; the toast removes itself once
   * the animation finishes)
   */
  hideToast: (id: string) => void;

  /**
   * Remove a toast from state immediately (no exit animation) — used by the
   * viewport once a toast has already animated out.
   */
  removeToast: (id: string) => void;

  /**
   * Hide all toasts
   */
  hideAllToasts: () => void;

  /**
   * Update a toast
   */
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
}

// ============================================================================
// Toast Component Props
// ============================================================================

export interface ToastRootProps {
  /**
   * Toast data
   */
  toast: ToastData;

  /**
   * Called when toast is dismissed
   */
  onDismiss: () => void;

  /**
   * Config for styling
   */
  config: Required<ToastConfig>;

  /**
   * Visual index in the stack (0 = the toast at the screen edge).
   */
  index: number;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

export interface ToastViewportProps {
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

export interface ToastTitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface ToastDescriptionProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface ToastCloseProps {
  children?: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface ToastActionProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// ============================================================================
// Default Config
// ============================================================================

export const DEFAULT_TOAST_CONFIG: Required<ToastConfig> = {
  position: 'bottom',
  maxVisible: 3,
  duration: 5000,
  defaultVariant: 'default',
  swipeToDismiss: true,
  gap: 8,
  hapticFeedback: true,
};
