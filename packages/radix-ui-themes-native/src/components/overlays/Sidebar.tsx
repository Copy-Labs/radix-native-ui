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
  Vibration,
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
  onOpenChange: (open: boolean) => void;
  side: SidePosition;
  variant: SidebarVariant;
  width: number;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
  // Animation and gesture state
  translateX: Animated.Value;
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
const ANIMATION_DURATION = 300;

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
}

export const SidebarRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  side = 'left',
  variant = 'overlay',
  width = 280,
}: SidebarRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Animation value - shared across components
  // For left sidebar: closed = -width, open = 0
  // For right sidebar: closed = width, open = 0
  const initialTranslateX = side === 'left' ? -width : width;
  const translateX = useRef(new Animated.Value(open ? 0 : initialTranslateX)).current;

  // Swipe state refs
  const swipeDistance = useRef(0);
  const isSwiping = useRef(false);
  const startX = useRef(0);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
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
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }).start();
          } else if (gestureState.dx < -threshold || gestureState.vx < -velocityThreshold / 1000) {
            // Close - swipe left
            Vibration.vibrate(10);
            Animated.timing(translateX, {
              toValue: -width,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }).start(() => {
              handleOpenChange(false);
            });
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
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }).start();
          } else if (gestureState.dx > threshold || gestureState.vx > velocityThreshold / 1000) {
            // Close - swipe right
            Vibration.vibrate(10);
            Animated.timing(translateX, {
              toValue: width,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }).start(() => {
              handleOpenChange(false);
            });
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
    if (open) {
      translateX.setValue(side === 'left' ? -width : width);
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: side === 'left' ? -width : width,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [open, width, side, translateX]);

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
        colors,
        grayAlpha,
        radii,
        translateX,
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
      Vibration.vibrate(10);
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
      Vibration.vibrate(10);
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
    const positionStyle = side === 'left'
      ? { marginRight: -width } // Overlap slightly to avoid gaps during animation
      : { marginLeft: -width };

    return (
      <Animated.View
        style={[
          styles.content,
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
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {children}
        </ScrollView>
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
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {children}
      </ScrollView>
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
      Vibration.vibrate(10);
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
      Vibration.vibrate(10);
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
// ============================================================================

interface SidebarContainerProps {
  children: ReactNode;
}

export const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const { variant } = useSidebar();

  // Only use container layout for push variant
  if (variant !== 'push') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

interface SidebarMainProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarMain = ({ children, style }: SidebarMainProps) => {
  const { side, variant, width, open } = useSidebar();
  const theme = useTheme();

  // For push variant, the main content needs to animate
  // For left side: translateX from 0 to width (slide right to reveal sidebar behind)
  // For right side: translateX from 0 to -width (slide left to reveal sidebar behind)
  const mainTranslateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'push') {
      if (open) {
        Animated.timing(mainTranslateX, {
          toValue: side === 'left' ? width : -width,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(mainTranslateX, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [open, width, side, variant, mainTranslateX]);

  if (variant !== 'push') {
    // For overlay variant, no transformation needed
    return <>{children}</>;
  }

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
