import React, {
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  type ReactNode,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  PanResponder,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  SafeAreaView,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getVariantColors, getColorAlpha } from '../../theme/color-helpers';
import { useThemeContext } from '../../theme/ThemeProvider';
import type { Color } from '../../theme';
import {
  type ToastVariant,
  type ToastPosition,
  type ToastData,
  type ToastConfig,
  type ToastContextValue,
  type ToastController,
  type ToastOptions,
  type ToastRootProps,
  type ToastViewportProps,
  type ToastTitleProps,
  type ToastDescriptionProps,
  type ToastCloseProps,
  type ToastActionProps,
  DEFAULT_TOAST_CONFIG,
} from './Toast.types';
import { Button, Text } from '../../components';

// ============================================================================
// Toast Context - Uses ThemeContext from ThemeProvider
// ============================================================================

// Re-export useToastContext that uses ThemeContext
export const useToastContext = (): ToastContextValue => {
  const context = useThemeContext();
  // Return only toast-related values
  return {
    config: context.toastConfig,
    toasts: context.toasts,
    showToast: context.showToast,
    hideToast: context.hideToast,
    removeToast: context.removeToast,
    hideAllToasts: context.hideAllToasts,
    updateToast: context.updateToast,
  };
};

// ============================================================================
// Stack helpers (pure, unit-tested)
// ============================================================================

/**
 * When a stack is already at `maxVisible` active toasts, the oldest active
 * toast is marked `leaving` (and animates out) instead of being popped from
 * state. Toasts already leaving don't count towards the limit.
 */
export function markEvictionOnOverflow<T extends { leaving?: boolean }>(
  samePosition: T[],
  maxVisible: number
): T[] {
  const active = samePosition.filter((t) => !t.leaving);
  if (active.length < maxVisible) return samePosition;
  const oldestIdx = samePosition.findIndex((t) => !t.leaving);
  if (oldestIdx < 0) return samePosition;
  return samePosition.map((t, i) => (i === oldestIdx ? { ...t, leaving: true } : t));
}

// ============================================================================
// Variant Color Mapping
// ============================================================================

const getVariantColorName = (variant: ToastVariant): Color => {
  switch (variant) {
    case 'success':
      return 'jade';
    case 'error':
      return 'red';
    case 'warning':
      return 'amber';
    case 'info':
      return 'blue';
    case 'accent':
      return 'indigo'; // Will use theme's accentColor
    default:
      return 'gray';
  }
};

const getToastColors = (
  theme: ReturnType<typeof useTheme>,
  variant: ToastVariant,
  overrideColor?: Color,
  isDark: boolean = false
) => {
  const colorName = overrideColor || getVariantColorName(variant);
  const actualColor = variant === 'accent' ? theme.accentColor : colorName;

  const colorScale = theme.colors[actualColor];
  const colorAlpha = getColorAlpha(theme, actualColor);

  // Get background color based on variant
  let backgroundColor: string;
  let textColor: string;
  let borderColor: string;

  if (variant === 'default') {
    // Default uses gray tones
    backgroundColor = isDark ? theme.colors.gray.dark[3] : theme.colors.gray[2];
    textColor = isDark ? theme.colors.gray.dark[12] : theme.colors.gray[12];
    borderColor = isDark ? theme.colors.gray.dark[6] : theme.colors.gray[6];
  } else {
    // Other variants use soft background with colored text
    backgroundColor = isDark ? theme.colors.gray.dark[3] : theme.colors.gray[1]; // colorAlpha[3];
    textColor = colorAlpha[9];
    borderColor = colorAlpha[6];
  }

  return {
    backgroundColor,
    textColor,
    borderColor,
    accentColor: isDark ? colorScale.dark?.[9] : colorScale[9],
  };
};

// ============================================================================
// Toast Root Component
// ============================================================================

const ToastRoot = forwardRef<View, ToastRootProps>(
  ({ toast, onDismiss, config, index, style }, ref) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';

    // Animation values
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(toast.position === 'top' ? -100 : 100)).current;
    const translateX = useRef(new Animated.Value(0)).current;

    // Get colors
    const colors = getToastColors(theme, toast.variant, toast.color, isDark);

    // Latest props/two closures used by long-lived callbacks (timer, pan
    // responder) so they never pin a stale render's values.
    const latest = useRef({ toast, onDismiss });
    latest.current = { toast, onDismiss };
    const isDismissing = useRef(false);
    // Follow-up work queued when a second dismissal races the in-flight exit.
    const exitQueue = useRef<Array<() => void>>([]);
    const enterAnim = useRef<Animated.CompositeAnimation | null>(null);

    /** Play the exit animation exactly once, then run every queued `after`. */
    const playExit = useCallback(
      (after: () => void) => {
        if (isDismissing.current) {
          // Already animating out — chain onto the in-flight exit instead of
          // double-animating (auto timer vs manual close race).
          exitQueue.current.push(after);
          return;
        }
        isDismissing.current = true;
        // A dismissal during the enter spring must not fight it for the
        // same values.
        enterAnim.current?.stop();
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: latest.current.toast.position === 'top' ? -100 : 100,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          const queued = exitQueue.current;
          exitQueue.current = [];
          after();
          queued.forEach((fn) => fn());
        });
      },
      [opacity, translateY]
    );

    // Auto-dismiss timer with pause-on-touch (a held toast never expires).
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startedAtRef = useRef(0);
    const remainingRef = useRef(toast.duration);

    const clearTimer = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    }, []);

    const dismiss = useCallback(
      (manual: boolean) => {
        playExit(() => {
          const { toast: t, onDismiss: remove } = latest.current;
          if (manual) {
            t.onDismiss?.();
          } else {
            t.onAutoClose?.();
          }
          remove();
        });
      },
      [playExit]
    );

    const startTimer = useCallback(
      (ms: number) => {
        if (latest.current.toast.duration === Infinity || isDismissing.current) return;
        clearTimer();
        startedAtRef.current = Date.now();
        remainingRef.current = ms;
        timerRef.current = setTimeout(() => dismiss(false), ms);
      },
      [clearTimer, dismiss]
    );

    const pauseTimer = useCallback(() => {
      if (!timerRef.current) return;
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current)
      );
      clearTimer();
    }, [clearTimer]);

    const resumeTimer = useCallback(() => {
      if (isDismissing.current || latest.current.toast.leaving) return;
      if (remainingRef.current <= 0) {
        // Expired while held — dismiss now.
        dismiss(false);
        return;
      }
      startTimer(remainingRef.current);
    }, [dismiss, startTimer]);

    // Arm the auto-dismiss countdown; re-arms when `duration` is updated via
    // `toast.update()`, and stands down once the toast is leaving.
    useEffect(() => {
      if (toast.leaving || toast.duration === Infinity) return;
      remainingRef.current = toast.duration;
      startTimer(toast.duration);
      return clearTimer;
    }, [toast.duration, toast.leaving, startTimer, clearTimer]);

    // Leave requests (hide/hideAll/max-visible eviction) animate out, then
    // remove themselves from state.
    useEffect(() => {
      if (!toast.leaving) return;
      clearTimer();
      playExit(() => {
        latest.current.toast.onDismiss?.();
        latest.current.onDismiss();
      });
    }, [toast.leaving, clearTimer, playExit]);

    // Enter animation
    useEffect(() => {
      const anim = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]);
      enterAnim.current = anim;
      anim.start();
    }, [opacity, translateY]);

    // Pan responder for swipe-to-dismiss. Built once per config and reads
    // through `latest` — recreating it on every render would cancel an
    // in-flight swipe whenever a sibling toast enters or leaves.
    const panResponder = useMemo(() => {
      if (!config.swipeToDismiss) return undefined;

      const snapBack = () => {
        Animated.spring(translateX, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }).start();
      };

      return PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Horizontal-dominant drags only — vertical scrolls must not be
          // captured (they used to grab the responder and then do nothing).
          return (
            Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },
        onPanResponderMove: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
            translateX.setValue(gestureState.dx);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const threshold = 100;
          if (Math.abs(gestureState.dx) > threshold) {
            // Swipe to dismiss
            isDismissing.current = true;
            clearTimer();
            Animated.timing(translateX, {
              toValue: gestureState.dx > 0 ? Dimensions.get('window').width : -Dimensions.get('window').width,
              duration: 200,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (!finished) return;
              const { toast: t, onDismiss: remove } = latest.current;
              t.onDismiss?.();
              remove();
            });
          } else {
            snapBack();
          }
        },
        onPanResponderTerminate: snapBack,
      });
    }, [config.swipeToDismiss, translateX, clearTimer]);

    const containerStyle: Animated.AnimatedProps<ViewStyle> = {
      opacity,
      transform: [
        { translateY },
        { translateX },
      ],
      backgroundColor: colors.backgroundColor,
      borderColor: 'transparent', // colors.borderColor,
      borderWidth: 1,
      borderRadius: theme.radii.large,
      padding: theme.space[4],
      // Uniform `gap` separation within the visual stack — `index` is the
      // visual position (0 = the toast at the screen edge).
      marginTop: index === 0 ? 0 : config.gap,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      maxWidth: Dimensions.get('window').width - 32,
      width: Dimensions.get('window').width - 32,
    };

    return (
      <Animated.View
        ref={ref}
        style={[containerStyle, style]}
        {...(panResponder?.panHandlers || {})}
        onTouchStart={pauseTimer}
        onTouchEnd={resumeTimer}
        onTouchCancel={resumeTimer}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={toast.accessibilityLabel || toast.title}
      >
        <View style={[styles.contentContainer, { alignItems: toast.description ? 'flex-start' : 'center' }]}>
          {/* Icon */}
          {toast.icon && <View style={styles.iconContainer}>{toast.icon}</View>}

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                { color: colors.textColor, fontSize: theme.typography.fontSizes[3].fontSize },
              ]}
              numberOfLines={1}
            >
              {toast.title}
            </Text>
            {toast.description && (
              <Text
                style={[
                  styles.description,
                  {
                    // color: colors.textColor,
                    fontSize: theme.typography.fontSizes[2].fontSize,
                    lineHeight: theme.typography.fontSizes[2].fontSize * 1.5,
                    opacity: 0.8,
                  },
                ]}
                numberOfLines={2}
              >
                {toast.description}
              </Text>
            )}
          </View>

          {/* Action */}
          {toast.action && (
            <Pressable
              onPress={toast.action.onPress}
              style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[styles.actionText, { color: colors.accentColor }]}>
                {toast.action.label}
              </Text>
            </Pressable>
          )}

          {/* Close button */}
          {toast.showClose && (
            <Button color={getVariantColorName(toast.variant)} radius={'large'} size={1} onPress={() => dismiss(true)}>Close</Button>
            /*<Pressable
              onPress={() => handleDismiss(true)}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ color: colors.textColor, fontSize: 14 }}>✕</Text>
            </Pressable>*/
          )}
        </View>
      </Animated.View>
    );
  }
);

ToastRoot.displayName = 'Toast.Root';

// ============================================================================
// Toast Viewport Component
// ============================================================================

const ToastViewport = forwardRef<View, ToastViewportProps>(({ style }, ref) => {
  const { toasts, removeToast, config } = useToastContext();

  if (toasts.length === 0) return null;

  // Group toasts by position. Newest sits nearest the screen edge it expands
  // from: the top stack renders newest-first, the bottom stack oldest-first
  // (so its last child — the newest — is the bottom-most).
  const topToasts = toasts.filter((t) => t.position === 'top').reverse();
  const bottomToasts = toasts.filter((t) => t.position === 'bottom');

  return (
    <View
      ref={ref}
      style={[styles.viewport, style]}
      pointerEvents="box-none"
    >
      {/* Top positioned toasts */}
      {topToasts.length > 0 && (
        <SafeAreaView style={styles.topContainer} pointerEvents="box-none">
          {topToasts.map((toast, index) => (
            <ToastRoot
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
              config={config}
              index={index}
            />
          ))}
        </SafeAreaView>
      )}

      {/* Bottom positioned toasts */}
      {bottomToasts.length > 0 && (
        <SafeAreaView style={styles.bottomContainer} pointerEvents="box-none">
          {bottomToasts.map((toast, index) => (
            <ToastRoot
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
              config={config}
              index={index}
            />
          ))}
        </SafeAreaView>
      )}
    </View>
  );
});

ToastViewport.displayName = 'Toast.Viewport';

// ============================================================================
// Toast Title Component (for custom toasts)
// ============================================================================

const ToastTitle = forwardRef<Text, ToastTitleProps>(({ children, style }, ref) => {
  const theme = useTheme();

  return (
    <Text
      ref={ref}
      style={[
        styles.title,
        { fontSize: theme.typography.fontSizes[2].fontSize },
        style,
      ]}
    >
      {children}
    </Text>
  );
});

ToastTitle.displayName = 'Toast.Title';

// ============================================================================
// Toast Description Component (for custom toasts)
// ============================================================================

const ToastDescription = forwardRef<Text, ToastDescriptionProps>(({ children, style }, ref) => {
  const theme = useTheme();

  return (
    <Text
      ref={ref}
      style={[
        styles.description,
        { fontSize: theme.typography.fontSizes[1].fontSize },
        style,
      ]}
    >
      {children}
    </Text>
  );
});

ToastDescription.displayName = 'Toast.Description';

// ============================================================================
// Toast Close Component (for custom toasts)
// ============================================================================

const ToastClose = forwardRef<View, ToastCloseProps>(({ children, onPress, style }, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [
        styles.closeButton,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {children || <Text>✕</Text>}
    </Pressable>
  );
});

ToastClose.displayName = 'Toast.Close';

// ============================================================================
// Toast Action Component
// ============================================================================

const ToastAction = forwardRef<View, ToastActionProps>(({ label, onPress, style }, ref) => {
  const theme = useTheme();

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text
        style={[
          styles.actionText,
          { color: theme.accentColor === 'indigo'
            ? theme.colors.indigo[9]
            : theme.colors[theme.accentColor]?.[9] || theme.colors.indigo[9]
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
});

ToastAction.displayName = 'Toast.Action';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  viewport: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  topContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconContainer: {
    marginRight: 4,
  },
  textContainer: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
  },
  description: {
    marginTop: 1,
    opacity: 0.8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});

// ============================================================================
// Compound Export
// ============================================================================

/**
 * Toast component for displaying brief notifications.
 *
 * @example
 * ```tsx
 * // In your app root
 * <ThemeProvider toastConfig={{ position: 'bottom', maxVisible: 3 }}>
 *   <App />
 * </ThemeProvider>
 *
 * // In any component
 * const { toast } = useToast();
 *
 * toast.success({ title: 'Saved!' });
 * toast.error({ title: 'Failed to save', description: 'Please try again' });
 * ```
 */
const Toast = {
  Root: ToastRoot,
  Viewport: ToastViewport,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
};

export {
  Toast,
  ToastRoot,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};

// Export types
export type {
  ToastVariant,
  ToastPosition,
  ToastOptions,
  ToastData,
  ToastConfig,
  ToastController,
  ToastContextValue,
  ToastRootProps,
  ToastViewportProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToastActionProps,
};
