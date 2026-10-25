import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  type StyleProp,
  ViewStyle,
  Pressable,
  ScrollView,
  Platform,
  type GestureResponderHandlers,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import AnimatedPressable from '../primitives/AnimatedPressable';
import { useTheme, useThemeMode, useHaptics } from '../../hooks/useTheme';
import { Text } from '../typography';
import { type ButtonProps, Heading } from '../../components';
import { Button } from '../../components';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import type { HeadingProps } from '../typography/Heading';
import type { TextProps } from '../typography/Text';
import { triggerHaptic } from '../../utils';

// ============================================================================
// Types
// ============================================================================

export type SnapPoint = string | number;

// ============================================================================
// BottomSheet Context
// ============================================================================

interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
  snapPoints: SnapPoint[];
  currentSnapIndex: number;
  onSnapChange: (index: number) => void;
  // Animation and gesture state (shared between Handle and Content)
  translateY: Animated.Value;
  snapHeights: number[];
  targetSnapHeight: number;
  maxSnapHeight: number;
  screenHeight: number;
  panHandlers: GestureResponderHandlers;
  requestClose: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet components must be used within a BottomSheet.Root');
  }
  return context;
};

// ============================================================================
// Helpers
// ============================================================================

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_DURATION = 300;

const parseSnapPoint = (snapPoint: SnapPoint, screenHeight: number): number => {
  if (typeof snapPoint === 'number') {
    return snapPoint;
  }
  if (typeof snapPoint === 'string' && snapPoint.endsWith('%')) {
    const percentage = parseFloat(snapPoint) / 100;
    return screenHeight * percentage;
  }
  return parseFloat(snapPoint);
};

const getSizeStyles = (
  size: 1 | 2 | 3 | 4,
  space: SpaceScale,
  radii: RadiusScale
) => {
  const sizeConfig = {
    1: {
      paddingHorizontal: space[3],
      paddingVertical: space[3],
      radius: radii.small,
    },
    2: {
      paddingHorizontal: space[4],
      paddingVertical: space[4],
      radius: radii.medium,
    },
    3: {
      paddingHorizontal: space[5],
      paddingVertical: space[5],
      radius: radii.medium,
    },
    4: {
      paddingHorizontal: space[6],
      paddingVertical: space[6],
      radius: radii.large,
    },
  };
  return sizeConfig[size];
};

// ============================================================================
// BottomSheet.Root - Main component that manages state
// ============================================================================

interface BottomSheetRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  snapPoints?: SnapPoint[];
  defaultSnapPoint?: number;
  /** Fires whenever the sheet settles on a snap point (index into snapPoints). */
  onSnapPointChange?: (index: number) => void;
}

export const BottomSheetRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  snapPoints = ['50%'],
  defaultSnapPoint = 0,
  onSnapPointChange,
}: BottomSheetRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const { height: screenHeight } = Dimensions.get('window');

  // Calculate snap heights
  const snapHeights = useMemo(
    () => snapPoints.map((sp) => parseSnapPoint(sp, screenHeight)),
    [snapPoints, screenHeight]
  );

  // Get the target height for the current snap point
  const targetSnapHeight = snapHeights[currentSnapIndex] || snapHeights[0];

  // Fully-extended height. The sheet is always laid out at this height and
  // positioned purely through translateY: resting offset for snap i is
  // maxSnapHeight - snapHeights[i]; maxSnapHeight itself means fully hidden.
  const maxSnapHeight = useMemo(
    () => (snapHeights.length ? Math.max(...snapHeights) : 0),
    [snapHeights]
  );

  // Animation value - shared across components
  const translateY = useRef(new Animated.Value(maxSnapHeight)).current;

  // Animated.Value with useNativeDriver does not reliably sync __getValue back
  // to JS, so gesture math tracks the authoritative offset ourselves.
  const offsetRef = useRef(maxSnapHeight);
  const baseOffsetRef = useRef(maxSnapHeight);
  const grantIndexRef = useRef(defaultSnapPoint);

  // Swipe state refs
  const isSwiping = useRef(false);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  const handleSnapChange = useCallback((index: number) => {
    setCurrentSnapIndex(index);
  }, []);

  const theme = useTheme();
  const mode = useThemeMode();
  const globalHaptics = useHaptics();
  const isDark = mode === 'dark';
  const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  // Animate to a specific snap point
  const animateToSnapPoint = useCallback(
    (index: number, animated: boolean = true) => {
      const target = maxSnapHeight - snapHeights[index];
      if (target === undefined) return;
      offsetRef.current = target;
      setCurrentSnapIndex(index);
      onSnapPointChange?.(index);
      if (animated) {
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      } else {
        translateY.setValue(target);
      }
    },
    [translateY, snapHeights, maxSnapHeight, onSnapPointChange]
  );

  // Close animation
  const animateClose = useCallback(() => {
    offsetRef.current = maxSnapHeight;
    Animated.timing(translateY, {
      toValue: maxSnapHeight,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      handleOpenChange(false);
    });
  }, [translateY, maxSnapHeight, handleOpenChange]);

  // Find the nearest snap point based on the current translateY offset
  const findNearestSnapIndex = useCallback(
    (offset: number) => {
      let closestIndex = 0;
      let closestDistance = Infinity;
      snapHeights.forEach((height, index) => {
        const distance = Math.abs(maxSnapHeight - height - offset);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      return closestIndex;
    },
    [snapHeights, maxSnapHeight]
  );

  // Pan responder for drag gestures - shared between Handle and Content.
  // Supports both directions: drag down dismisses (or falls back to the
  // nearest snap), drag up promotes to a higher snap when snapPoints has
  // more than one entry.
  const panResponder = useMemo(() => {
    const isVerticalDrag = (_: any, gestureState: any) =>
      Math.abs(gestureState.dy) > 10 &&
      Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: isVerticalDrag,
      // Steal the gesture from interactive children (Button, TextField, …)
      // that claimed the touch on press-down, so dragging works anywhere on
      // the sheet — including over controls. A tap without vertical movement
      // never trips this, so buttons keep firing onPress.
      onMoveShouldSetPanResponderCapture: isVerticalDrag,
      onPanResponderGrant: () => {
        isSwiping.current = true;
        baseOffsetRef.current = offsetRef.current;
        grantIndexRef.current = currentSnapIndex;
      },
      onPanResponderMove: (_, gestureState) => {
        const next = Math.min(
          Math.max(baseOffsetRef.current + gestureState.dy, 0),
          maxSnapHeight
        );
        isSwiping.current = true;
        offsetRef.current = next;
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gestureState) => {
        isSwiping.current = false;

        // Project the gesture forward with its release velocity so a short
        // fast flick still reaches the snap (or dismissal) it was aimed at,
        // while a long slow drag settles exactly where it was left.
        const projected = Math.min(
          Math.max(offsetRef.current + gestureState.vy * 120, 0),
          maxSnapHeight
        );
        const visibleHeight = maxSnapHeight - projected;
        // Dismiss only once the projected position drops below the smallest
        // snap — dragging down from a tall snap to a lower one must snap,
        // not close.
        if (visibleHeight < snapHeights[0] * 0.6) {
          // Trigger haptic feedback when dismissing via swipe
          if (globalHaptics) {
            triggerHaptic('selection');
          }
          animateClose();
        } else {
          const nearest = findNearestSnapIndex(projected);
          // Haptic when the gesture changed the resting snap point
          if (globalHaptics && nearest !== grantIndexRef.current) {
            triggerHaptic('selection');
          }
          animateToSnapPoint(nearest);
        }
      },
    });
  }, [
    translateY,
    maxSnapHeight,
    snapHeights,
    currentSnapIndex,
    globalHaptics,
    animateClose,
    animateToSnapPoint,
    findNearestSnapIndex,
  ]);

  // Reset animation when opening; snap the transform to the hidden position
  // immediately whenever the sheet is closed (even for controlled/immediate
  // closes) so the first frame of the next open never paints at the open
  // position (that stale translateY was the re-open flicker).
  useEffect(() => {
    if (open) {
      translateY.setValue(maxSnapHeight);
      offsetRef.current = maxSnapHeight;
      // Animate open after a small delay
      const timer = setTimeout(() => {
        animateToSnapPoint(currentSnapIndex);
      }, 50);
      return () => clearTimeout(timer);
    }
    translateY.setValue(maxSnapHeight);
    offsetRef.current = maxSnapHeight;
  }, [open]);

  return (
    <BottomSheetContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        colors,
        grayAlpha,
        radii,
        snapPoints,
        currentSnapIndex,
        onSnapChange: handleSnapChange,
        translateY,
        snapHeights,
        targetSnapHeight,
        maxSnapHeight,
        screenHeight,
        panHandlers: panResponder.panHandlers,
        requestClose: animateClose,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

// ============================================================================
// BottomSheet.Trigger - The button that opens the bottom sheet
// ============================================================================

interface BottomSheetTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  /** Enable haptic feedback on press */
  hapticFeedback?: boolean;
}

export const BottomSheetTrigger = ({
  children,
  asChild = true,
  hapticFeedback = false,
}: BottomSheetTriggerProps) => {
  const { onOpenChange, open } = useBottomSheet();
  const globalHaptics = useHaptics();

  const handlePress = () => {
    onOpenChange(true);
    // Trigger haptic feedback when opening
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('press');
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      pressedScale={0.98}
      pressedOpacity={0.95}
      animationDuration={100}
      hapticFeedback={false}
    >
      {children}
    </AnimatedPressable>
  );
};

// ============================================================================
// BottomSheet.Portal - Renders content at root level using Modal
// ============================================================================

interface BottomSheetPortalProps {
  children: ReactNode;
  hostId?: string;
}

export const BottomSheetPortal = ({
  children,
  hostId,
}: BottomSheetPortalProps) => {
  const { open } = useBottomSheet();

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {}}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// BottomSheet.Overlay - The backdrop that dims the background
// ============================================================================

interface BottomSheetOverlayProps {
  style?: StyleProp<ViewStyle>;
  blur?: boolean;
  /** Enable haptic feedback when closing via overlay press */
  hapticFeedback?: boolean;
}

export const BottomSheetOverlay = ({ style, hapticFeedback = true }: BottomSheetOverlayProps) => {
  const { requestClose } = useBottomSheet();
  const mode = useThemeMode();
  const globalHaptics = useHaptics();
  const isDark = mode === 'dark';

  // Use alpha black for overlay based on theme - matches radix-ui styling
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(10, 10, 10, 0.6)';

  const handlePress = () => {
    // Animate the sheet down before unmounting the Modal — matches the
    // swipe-dismiss lifecycle and keeps translateY in sync for the next open.
    requestClose();
    // Trigger haptic feedback when closing via overlay
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: overlayColor,
          },
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// BottomSheet.Handle - Visual drag handle at the top with gesture support
// ============================================================================

interface BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

export const BottomSheetHandle = ({ style }: BottomSheetHandleProps) => {
  const { panHandlers } = useBottomSheet();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const handleColor = isDark
    ? theme.colors.gray.dark[8]
    : theme.colors.gray[8];

  return (
    <Pressable style={styles.handleContainer} {...panHandlers}>
      <View
        style={[
          styles.handle,
          {
            backgroundColor: handleColor,
          },
          style,
        ]}
      />
    </Pressable>
  );
};

// ============================================================================
// BottomSheet.Content - The actual bottom sheet content
// ============================================================================

interface BottomSheetContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** @deprecated Snap points are owned by BottomSheet.Root — setting them here has no effect. */
  snapPoints?: SnapPoint[];
  size?: 1 | 2 | 3 | 4;
  hideHandle?: boolean;
}

export const BottomSheetContent = ({
  children,
  style,
  size = 2,
  hideHandle = false,
}: BottomSheetContentProps) => {
  const { radii, translateY, panHandlers, maxSnapHeight } = useBottomSheet();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Get size-specific styles
  const sizeStyles = getSizeStyles(size, theme.space, radii);

  // Get shadow for current theme mode
  const shadow = getShadow(6, isDark);

  // Background color
  const backgroundColor = isDark ? theme.colors.gray.dark[2] : '#ffffff';

  // Top border radius
  const borderTopLeftRadius = radii.large;
  const borderTopRightRadius = radii.large;

  return (
    <Animated.View
      style={[
        styles.content,
        {
          backgroundColor,
          borderTopLeftRadius,
          borderTopRightRadius,
          // Always laid out at the tallest snap height; translateY positions
          // it (this is what makes multi-snap dragging work in both directions).
          height: maxSnapHeight,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          transform: [{ translateY }],
          ...(shadow || {}),
        },
        style,
      ]}
      {...panHandlers}
    >
      {/* Drag Handle */}
      {!hideHandle && <BottomSheetHandle />}

      {/* Content */}
      {/*<ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >*/}
        {children}
      {/*</ScrollView>*/}
    </Animated.View>
  );
};

// ============================================================================
// BottomSheet.Title - Accessible title for screen readers
// ============================================================================

interface BottomSheetTitleProps extends Omit<HeadingProps, 'children'> {
  children: ReactNode;
  style?: HeadingProps['style'];
}

export const BottomSheetTitle = ({
  children,
  style = {},
  size = 4,
  weight = 'bold',
  align,
  color,
  truncate,
  numberOfLines,
  fontFamily,
  opacity,
  asChild = false,
  ...rest
}: BottomSheetTitleProps) => {
  const { colors } = useBottomSheet();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const sheetColors = isDark ? theme.colors.gray.dark : theme.colors.gray;

  return (
    <Heading
      asChild={asChild}
      size={size}
      weight={weight}
      align={align}
      color={color || sheetColors[12]}
      truncate={truncate}
      numberOfLines={numberOfLines}
      fontFamily={fontFamily}
      opacity={opacity}
      style={[style]}
      {...rest}
    >
      {children}
    </Heading>
  );
};

// ============================================================================
// BottomSheet.Description - Accessible description
// ============================================================================

interface BottomSheetDescriptionProps extends Omit<TextProps, 'children'> {
  children: ReactNode;
  style?: TextProps['style'];
}

export const BottomSheetDescription = ({
  children,
  style = {},
  size = 2,
  weight,
  align,
  color,
  truncate,
  numberOfLines,
  fontFamily,
  fontStyle,
  lineHeight,
  letterSpacing,
  textDecorationLine,
  opacity,
  asChild = false,
  ...rest
}: BottomSheetDescriptionProps) => {
  const { colors } = useBottomSheet();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const sheetColors = isDark ? theme.colors.gray.dark : theme.colors.gray;

  return (
    <Text
      asChild={asChild}
      size={size}
      weight={weight}
      align={align}
      color={color || sheetColors[11]}
      truncate={truncate}
      numberOfLines={numberOfLines}
      fontFamily={fontFamily}
      fontStyle={fontStyle}
      lineHeight={lineHeight || theme.typography.fontSizes[2].lineHeight}
      letterSpacing={letterSpacing}
      textDecorationLine={textDecorationLine}
      opacity={opacity}
      style={[{ marginVertical: theme.space[2] }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// BottomSheet.Footer - Sticky footer for action buttons
// ============================================================================

interface BottomSheetFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  withBorder?: boolean;
  withPadding?: boolean;
}

export const BottomSheetFooter = ({
  children,
  style,
  withBorder = true,
  withPadding = true,
}: BottomSheetFooterProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View
      style={[
        styles.footer,
        withBorder && {
          borderTopWidth: 1,
          borderTopColor: borderColor,
        },
        withPadding && {
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
        },
        style,
      ]}
    >
      <View style={styles.footerContent}>{children}</View>
    </View>
  );
};

// ============================================================================
// BottomSheet.Close - Button to close the bottom sheet
// ============================================================================

interface BottomSheetCloseProps extends Omit<ButtonProps, 'children'> {
  children?: ReactNode;
  asChild?: boolean;
  /** Enable haptic feedback on press */
  hapticFeedback?: boolean;
}

export const BottomSheetClose = ({
  children,
  asChild = true,
  hapticFeedback = false,
  ...buttonProps
}: BottomSheetCloseProps) => {
  const { requestClose } = useBottomSheet();
  const globalHaptics = useHaptics();

  const handlePress = () => {
    requestClose();
    // Trigger haptic feedback when closing
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  if (asChild && children && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Button variant="soft" {...buttonProps} onPress={handlePress}>
      {children || 'Close'}
    </Button>
  );
};

// ============================================================================
// BottomSheet.Action - Action buttons
// ============================================================================

interface BottomSheetActionProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  onPress?: () => void;
  /** Enable haptic feedback on press */
  hapticFeedback?: boolean;
}

export const BottomSheetAction = ({
  children,
  onPress,
  hapticFeedback = true,
  ...buttonProps
}: BottomSheetActionProps) => {
  const { requestClose } = useBottomSheet();
  const globalHaptics = useHaptics();

  const handlePress = () => {
    onPress?.();
    requestClose();
    // Trigger haptic feedback when action is pressed
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <Button {...buttonProps} onPress={handlePress}>
      {children}
    </Button>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Shadow
    elevation: 4,
    paddingBottom: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop: 8,
  },
  footerContent: {
    flexDirection: 'row',
    gap: 8,
  },
});

// ============================================================================
// Export all BottomSheet components
// ============================================================================

export const BottomSheet = {
  Root: BottomSheetRoot,
  Trigger: BottomSheetTrigger,
  Portal: BottomSheetPortal,
  Overlay: BottomSheetOverlay,
  Content: BottomSheetContent,
  Handle: BottomSheetHandle,
  Title: BottomSheetTitle,
  Description: BottomSheetDescription,
  Footer: BottomSheetFooter,
  Close: BottomSheetClose,
  Action: BottomSheetAction,
};

export type {
  BottomSheetRootProps,
  BottomSheetTriggerProps,
  BottomSheetPortalProps,
  BottomSheetOverlayProps,
  BottomSheetContentProps,
  BottomSheetHandleProps,
  BottomSheetTitleProps,
  BottomSheetDescriptionProps,
  BottomSheetFooterProps,
  BottomSheetCloseProps,
  BottomSheetActionProps,
};
