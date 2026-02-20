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
  Text,
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
import { Button } from '../../components';

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
    hideAllToasts: context.hideAllToasts,
    updateToast: context.updateToast,
  };
};

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

    // Swipe state
    const swipeDistance = useRef(0);
    const isSwiping = useRef(false);

    // Get colors
    const colors = getToastColors(theme, toast.variant, toast.color, isDark);

    // Auto-dismiss timer
    useEffect(() => {
      if (toast.duration === Infinity) return;

      const timer = setTimeout(() => {
        handleDismiss(false);
      }, toast.duration);

      return () => clearTimeout(timer);
    }, [toast.duration]);

    // Enter animation
    useEffect(() => {
      Animated.parallel([
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
      ]).start();
    }, []);

    // Handle dismiss with animation
    const handleDismiss = useCallback((manual: boolean = true) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: toast.position === 'top' ? -100 : 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (manual) {
          toast.onDismiss?.();
        } else {
          toast.onAutoClose?.();
        }
        onDismiss();
      });
    }, [toast.position, onDismiss]);

    // Pan responder for swipe-to-dismiss
    const panResponder = useMemo(() => {
      if (!config.swipeToDismiss) return undefined;

      return PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          // Only allow horizontal swipe
          if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
            isSwiping.current = true;
            swipeDistance.current = gestureState.dx;
            translateX.setValue(gestureState.dx);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const threshold = 100;
          if (Math.abs(gestureState.dx) > threshold) {
            // Swipe to dismiss
            Animated.timing(translateX, {
              toValue: gestureState.dx > 0 ? Dimensions.get('window').width : -Dimensions.get('window').width,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              toast.onDismiss?.();
              onDismiss();
            });
          } else {
            // Snap back
            Animated.spring(translateX, {
              toValue: 0,
              tension: 100,
              friction: 10,
              useNativeDriver: true,
            }).start();
          }
          isSwiping.current = false;
        },
      });
    }, [config.swipeToDismiss, onDismiss]);

    // Calculate stack offset
    const stackOffset = index * (config.gap + 8);

    const containerStyle: Animated.AnimatedProps<ViewStyle> = {
      opacity,
      transform: [
        { translateY },
        { translateX },
      ],
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: 1,
      borderRadius: theme.radii.large,
      padding: theme.space[4],
      marginBottom: index === 0 ? 0 : stackOffset,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      maxWidth: Dimensions.get('window').width - 32,
      width: Dimensions.get('window').width - 32,
      flex: 1,
    };

    return (
      <Animated.View
        ref={ref}
        style={[containerStyle, style]}
        {...(panResponder?.panHandlers || {})}
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
            <Button style={{ backgroundColor: colors.textColor }} radius={'large'} size={1} onPress={() => handleDismiss(true)}>Close</Button>
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
  const { toasts, hideToast, config } = useToastContext();
  const theme = useTheme();

  // Group toasts by position
  const topToasts = toasts.filter(t => t.position === 'top');
  const bottomToasts = toasts.filter(t => t.position === 'bottom');

  if (toasts.length === 0) return null;

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
              onDismiss={() => hideToast(toast.id)}
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
              onDismiss={() => hideToast(toast.id)}
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
    marginTop: 2,
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
