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
} from 'react-native';
import AnimatedPressable from '../primitives/AnimatedPressable';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { Heading } from '../typography';
import type { HeadingProps } from '../typography/Heading';
import type { TextProps } from '../typography/Text';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import { triggerHaptic } from '../../utils/haptics';

// ============================================================================
// Types
// ============================================================================

export type SidePosition = 'left' | 'right';
export type SidebarVariant = 'overlay' | 'push';

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextValue {
  open: boolean;
  onOpenChange: (open: boolean, skipAnimation?: boolean) => void;
  side: SidePosition;
  variant: SidebarVariant;
  width: number;
  animationDuration: number;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
  // Animation and gesture state
  translateX: Animated.Value;
  mainTranslateX: Animated.Value;
  panHandlers: any;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar components must be used within a Sidebar.Root');
  }
  return context;
};

// ============================================================================
// Helpers
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_ANIMATION_DURATION = 300;

// ============================================================================
// Sidebar.Root - Main component that manages state
// ============================================================================

interface SidebarRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SidePosition;
  variant?: SidebarVariant;
  width?: number;
  animationDuration?: number;
}

export const SidebarRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  side = 'left',
  variant = 'overlay',
  width = 280,
  animationDuration = 300,
}: SidebarRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  // const { onOpenChange: onSidebarOpenChange } = useSidebar();
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Animation value - shared across components
  // For left sidebar: closed = -width, open = 0
  // For right sidebar: closed = width, open = 0
  const initialTranslateX = side === 'left' ? -width : width;
  const translateX = useRef(new Animated.Value(open ? 0 : initialTranslateX)).current;

  // Animation value for main content (push variant)
  const mainTranslateX = useRef(new Animated.Value(0)).current;

  // Ref to skip animation in useEffect (used by swipe gestures)
  const skipAnimationRef = useRef(false);

  // Swipe state refs
  const swipeDistance = useRef(0);
  const isSwiping = useRef(false);
  const startX = useRef(0);

  const handleOpenChange = useCallback(
    (newOpen: boolean, skipAnimation = false) => {
      skipAnimationRef.current = skipAnimation;
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  // Pan responder for swipe/drag gestures
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderGrant: () => {
        startX.current = 0;
        isSwiping.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        isSwiping.current = true;
        swipeDistance.current = gestureState.dx;

        if (side === 'left') {
          // For left sidebar:
          // Positive dx = swipe right (open)
          // Negative dx = swipe left (close)
          const newTranslateX = initialTranslateX + gestureState.dx;
          // Clamp values between -width and 0
          const clampedValue = Math.max(-width, Math.min(0, newTranslateX));
          translateX.setValue(clampedValue);
        } else {
          // For right sidebar:
          // Negative dx = swipe left (open)
          // Positive dx = swipe right (close)
          const newTranslateX = initialTranslateX + gestureState.dx;
          // Clamp values between 0 and width
          const clampedValue = Math.max(0, Math.min(width, newTranslateX));
          translateX.setValue(clampedValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = width * 0.25; // 25% of width
        const velocityThreshold = 500;

        if (side === 'left') {
          // For left sidebar
          if (gestureState.dx > threshold || gestureState.vx > velocityThreshold / 1000) {
            // Open - swipe right
            Animated.timing(translateX, {
              toValue: 0,
              duration: animationDuration,
              useNativeDriver: true,
            }).start();
          } else if (gestureState.dx < -threshold || gestureState.vx < -velocityThreshold / 1000) {
            // Close - swipe left
            triggerHaptic('selection');
            // onSidebarOpenChange(false, true); // Call immediately for smooth animation
            Animated.timing(translateX, {
              toValue: -width,
              duration: animationDuration,
              useNativeDriver: true,
            }).start();
          } else {
            // Snap back to current state
            Animated.spring(translateX, {
              toValue: open ? 0 : -width,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            }).start();
          }
        } else {
          // For right sidebar
          if (gestureState.dx < -threshold || gestureState.vx < -velocityThreshold / 1000) {
            // Open - swipe left
            Animated.timing(translateX, {
              toValue: 0,
              duration: animationDuration,
              useNativeDriver: true,
            }).start();
          } else if (gestureState.dx > threshold || gestureState.vx > velocityThreshold / 1000) {
            // Close - swipe right
            triggerHaptic('selection');
            // onSidebarOpenChange(false, true); // Call immediately for smooth animation
            Animated.timing(translateX, {
              toValue: width,
              duration: animationDuration,
              useNativeDriver: true,
            }).start();
          } else {
            // Snap back to current state
            Animated.spring(translateX, {
              toValue: open ? 0 : width,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            }).start();
          }
        }
        isSwiping.current = false;
      },
    });
  }, [translateX, width, side, open, initialTranslateX, handleOpenChange]);

  // Handle open/close state changes
  useEffect(() => {
    // Skip animation if triggered by swipe gesture (animation already completed in swipe handler)
    if (skipAnimationRef.current) {
      skipAnimationRef.current = false;
      return;
    }

    if (open) {
      translateX.setValue(side === 'left' ? -width : width);
      Animated.timing(translateX, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: side === 'left' ? -width : width,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [open, width, side, translateX, animationDuration]);

  // Also animate mainTranslateX for push variant
  useEffect(() => {
    // Skip animation if triggered by swipe gesture
    if (skipAnimationRef.current) {
      return;
    }

    if (variant === 'push') {
      if (open) {
        Animated.timing(mainTranslateX, {
          toValue: side === 'left' ? width : -width,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(mainTranslateX, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [open, width, side, variant, mainTranslateX, animationDuration]);

  const theme = useTheme();
  const mode = useThemeMode();
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  return (
    <SidebarContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        side,
        variant,
        width,
        animationDuration,
        colors,
        grayAlpha,
        radii,
        translateX,
        mainTranslateX,
        panHandlers: panResponder.panHandlers,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// ============================================================================
// Sidebar.Trigger - The button that opens the sidebar
// ============================================================================

interface SidebarTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  hapticFeedback?: boolean;
}

export const SidebarTrigger = ({
  children,
  asChild = true,
  hapticFeedback = false,
}: SidebarTriggerProps) => {
  const { onOpenChange } = useSidebar();

  const handlePress = () => {
    onOpenChange(true);
    if (hapticFeedback) {
      triggerHaptic('selection');
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
// Sidebar.Portal - Renders content at root level using Modal
// ============================================================================

interface SidebarPortalProps {
  children: ReactNode;
  hostId?: string;
}

export const SidebarPortal = ({ children }: SidebarPortalProps) => {
  const { open, variant } = useSidebar();

  // For push variant, don't use Portal - render inline instead
  if (variant === 'push') {
    return null;
  }

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
// Sidebar.Overlay - The backdrop that dims the background
// ============================================================================

interface SidebarOverlayProps {
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarOverlay = ({ style, hapticFeedback = true }: SidebarOverlayProps) => {
  const { onOpenChange, variant } = useSidebar();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Only show overlay for overlay variant
  if (variant === 'push') {
    return null;
  }

  // Use alpha black for overlay based on theme - matches radix-ui styling
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(10, 10, 10, 0.6)';

  const handlePress = () => {
    onOpenChange(false);
    if (hapticFeedback) {
      triggerHaptic('press');
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
// Sidebar.Content - The actual sidebar content
// ============================================================================

interface SidebarContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarContent = ({ children, style }: SidebarContentProps) => {
  const { side, variant, width, translateX, panHandlers, radii, colors } = useSidebar();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Background color
  const backgroundColor = isDark ? theme.colors.gray.dark[2] : '#ffffff';

  // Get shadow for current theme mode
  const shadow = getShadow(6, isDark);

  // Border radius based on side
  const borderRadius = side === 'left'
    ? { borderTopRightRadius: radii.large, borderBottomRightRadius: radii.large }
    : { borderTopLeftRadius: radii.large, borderBottomLeftRadius: radii.large };

  // For push variant: render inline (no absolute positioning)
  // The sidebar appears beside the main content
  if (variant === 'push') {
    // For LEFT sidebar: marginRight = -width (overlaps main content on right)
    // For RIGHT sidebar: marginLeft = -width (overlaps main content on left)
    // AND we need to position it on the correct side
    const positionStyle = side === 'left'
      ? { marginRight: -width }  // Content on left, overlaps main from right
      : { marginLeft: -width }; // Content on right, overlaps main from left

    return (
      <Animated.View
        style={[
          {
            backgroundColor,
            width,
            ...borderRadius,
            transform: [{ translateX }],
            ...(shadow || {}),
            ...positionStyle,
          },
          style,
        ]}
        {...panHandlers}
      >
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
  }

  // For overlay variant: use absolute positioning
  const positionStyle = side === 'left'
    ? { left: 0 }
    : { right: 0 };

  return (
    <Animated.View
      style={[
        styles.content,
        {
          backgroundColor,
          width,
          ...borderRadius,
          ...positionStyle,
          transform: [{ translateX }],
          ...(shadow || {}),
        },
        style,
      ]}
      {...panHandlers}
    >
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
// Sidebar.Header - Header section
// ============================================================================

interface SidebarHeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarHeader = ({ children, style }: SidebarHeaderProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// Sidebar.Item - Menu item
// ============================================================================

interface SidebarItemProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarItem = ({
  children,
  onPress,
  style,
  hapticFeedback = true,
}: SidebarItemProps) => {
  const { onOpenChange } = useSidebar();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const handlePress = () => {
    onPress?.();
    onOpenChange(false);
    if (hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [
        styles.item,
        {
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
          backgroundColor: pressed
            ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
            : 'transparent',
        },
        style,
      ]}
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
};

// ============================================================================
// Sidebar.Separator - Divider
// ============================================================================

interface SidebarSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const SidebarSeparator = ({ style }: SidebarSeparatorProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View
      style={[
        styles.separator,
        {
          marginHorizontal: theme.space[4],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// Sidebar.Backdrop - Optional backdrop for push variant (to close when tapping outside)
// ============================================================================

interface SidebarBackdropProps {
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarBackdrop = ({ style, hapticFeedback = true }: SidebarBackdropProps) => {
  const { onOpenChange, variant } = useSidebar();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Only show backdrop for push variant
  if (variant === 'overlay') {
    return null;
  }

  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)';

  const handlePress = () => {
    onOpenChange(false);
    if (hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.backdrop,
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
// Sidebar.Container - Container for push variant that renders sidebar and main side by side
// Also handles swipe gestures for the entire container area
// ============================================================================

interface SidebarContainerProps {
  children: ReactNode;
}

export const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const { animationDuration, variant, side, width, open, onOpenChange, translateX, mainTranslateX } = useSidebar();

  // Only use container layout for push variant
  if (variant !== 'push') {
    return <>{children}</>;
  }

  // Create pan responder for swipe gestures on the entire container
  const containerPanResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        if (Math.abs(gestureState.dx) <= 10 || Math.abs(gestureState.dx) <= Math.abs(gestureState.dy)) {
          return false;
        }

        // When sidebar is CLOSED: only respond to swipe in direction that opens it
        // When sidebar is OPEN: respond to both directions
        if (!open) {
          if (side === 'left') {
            // Left sidebar: only respond to swipe RIGHT (to open)
            return gestureState.dx > 10;
          } else {
            // Right sidebar: only respond to swipe LEFT (to open)
            return gestureState.dx < -10;
          }
        }

        // When open, allow swipe in both directions
        return true;
      },
      onPanResponderGrant: () => {
        // Could add haptic feedback here
      },
      onPanResponderMove: (_, gestureState) => {
        if (side === 'left') {
          // For left sidebar:
          // Positive dx = swipe right (open)
          // Negative dx = swipe left (close)
          if (open) {
            // Currently open - swiping left should close
            const newTranslateX = gestureState.dx; // Going negative closes
            const clampedValue = Math.max(-width, Math.min(0, newTranslateX));
            translateX.setValue(clampedValue);
            // Also animate main content in opposite direction
            mainTranslateX.setValue(clampedValue + width);
          } else {
            // Currently closed - swiping right should open
            const newTranslateX = -width + gestureState.dx;
            const clampedValue = Math.max(-width, Math.min(0, newTranslateX));
            translateX.setValue(clampedValue);
            // Also animate main content
            mainTranslateX.setValue(gestureState.dx);
          }
        } else {
          // For right sidebar:
          // Negative dx = swipe left (open)
          // Positive dx = swipe right (close)
          if (open) {
            // Currently open - swiping right should close
            const newTranslateX = width + gestureState.dx;
            const clampedValue = Math.max(0, Math.min(width, newTranslateX));
            translateX.setValue(clampedValue);
            // Also animate main content
            mainTranslateX.setValue(clampedValue - width);
          } else {
            // Currently closed - swiping left should open
            const newTranslateX = width + gestureState.dx;
            const clampedValue = Math.max(0, Math.min(width, newTranslateX));
            translateX.setValue(clampedValue);
            // Also animate main content
            mainTranslateX.setValue(gestureState.dx);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = width * 0.25;
        const velocityThreshold = 500;

        if (side === 'left') {
          if (open) {
            // Closing
            if (gestureState.dx < -threshold || gestureState.vx < -velocityThreshold / 1000) {
              // Close - swipe left
              triggerHaptic('selection');
              onOpenChange(false, true); // Call immediately to trigger smooth animation
              Animated.timing(translateX, {
                toValue: -width,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              Animated.timing(mainTranslateX, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
            } else {
              // Snap back to open
              Animated.spring(translateX, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
              Animated.spring(mainTranslateX, {
                toValue: width,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
            }
          } else {
            // Opening
            if (gestureState.dx > threshold || gestureState.vx > velocityThreshold / 1000) {
              // Open - swipe right
              Animated.timing(translateX, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              Animated.timing(mainTranslateX, {
                toValue: width,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              onOpenChange(true, true); // skipAnimation=true
            } else {
              // Snap back to closed
              Animated.spring(translateX, {
                toValue: -width,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
              Animated.spring(mainTranslateX, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
            }
          }
        } else {
          // Right side
          if (open) {
            // Closing
            if (gestureState.dx > threshold || gestureState.vx > velocityThreshold / 1000) {
              // Close - swipe right
              triggerHaptic('selection');
              onOpenChange(false, true); // Call immediately to trigger smooth animation
              Animated.timing(translateX, {
                toValue: width,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              Animated.timing(mainTranslateX, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
            } else {
              // Snap back to open
              Animated.spring(translateX, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
              Animated.spring(mainTranslateX, {
                toValue: -width,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
            }
          } else {
            // Opening
            if (gestureState.dx < -threshold || gestureState.vx < -velocityThreshold / 1000) {
              // Open - swipe left
              Animated.timing(translateX, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              Animated.timing(mainTranslateX, {
                toValue: -width, // For right sidebar, main content moves LEFT (negative) to make room
                duration: animationDuration,
                useNativeDriver: true,
              }).start();
              onOpenChange(true, true); // skipAnimation=true
            } else {
              // Snap back to closed
              Animated.spring(translateX, {
                toValue: width,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
              Animated.spring(mainTranslateX, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
              }).start();
            }
          }
        }
      },
    });
  }, [side, width, open, onOpenChange, translateX, mainTranslateX, animationDuration]);

  // For push variant, we need to reorder children based on side
  // For LEFT sidebar: Content (sidebar) first, then Main (content)
  // For RIGHT sidebar: Main first, then Content (sidebar)
  const childArray = React.Children.toArray(children);

  // Find Content and Main children
  let contentChild: React.ReactNode | null = null;
  let mainChild: React.ReactNode | null = null;

  childArray.forEach((child) => {
    if (React.isValidElement(child) && child.type === SidebarContent) {
      contentChild = child;
    } else if (React.isValidElement(child) && child.type === SidebarMain) {
      mainChild = child;
    }
  });

  // For right sidebar, render Main first (it will be on the left), then Content (sidebar on right)
  // For left sidebar, render Content first (sidebar on left), then Main
  if (side === 'right' && mainChild && contentChild) {
    return (
      <View style={styles.container} {...containerPanResponder.panHandlers}>
        {mainChild}
        {contentChild}
      </View>
    );
  }

  return (
    <View style={styles.container} {...containerPanResponder.panHandlers}>
      {children}
    </View>
  );
};

interface SidebarMainProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarMain = ({ children, style }: SidebarMainProps) => {
  const { side, variant, width, open, mainTranslateX } = useSidebar();
  const theme = useTheme();

  // For push variant, use the shared mainTranslateX from context
  // This is animated by both the Root (when using Trigger) and Container (when swiping)
  if (variant === 'push') {
    return (
      <Animated.View
        style={[
          styles.mainContent,
          {
            flex: 1,
            transform: [{ translateX: mainTranslateX }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  // For overlay variant, no transformation needed
  return <>{children}</>;
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  header: {
    // Styles defined inline
  },
  item: {
    // Styles defined inline
  },
  separator: {
    height: 1,
  },
  mainContent: {
    // Main content wrapper for push variant
  },
});

// ============================================================================
// Export all Sidebar components
// ============================================================================

export const Sidebar = {
  Root: SidebarRoot,
  Trigger: SidebarTrigger,
  Portal: SidebarPortal,
  Overlay: SidebarOverlay,
  Content: SidebarContent,
  Header: SidebarHeader,
  Item: SidebarItem,
  Separator: SidebarSeparator,
  Main: SidebarMain,
  Backdrop: SidebarBackdrop,
  Container: SidebarContainer,
};

export type {
  SidebarRootProps,
  SidebarTriggerProps,
  SidebarPortalProps,
  SidebarOverlayProps,
  SidebarContentProps,
  SidebarHeaderProps,
  SidebarItemProps,
  SidebarSeparatorProps,
  SidebarMainProps,
  SidebarBackdropProps,
  SidebarContainerProps,
};
