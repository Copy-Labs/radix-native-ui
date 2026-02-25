import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  type StyleProp,
  ViewStyle,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { type ButtonProps, Heading } from '../../components';
import { Button } from '../../components';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import type { HeadingProps } from '../typography/Heading';
import type { TextProps } from '../typography/Text';

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
}

export const BottomSheetRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  snapPoints = ['50%'],
  defaultSnapPoint = 0,
}: BottomSheetRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

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
  const isDark = mode === 'dark';
  const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

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
}

export const BottomSheetTrigger = ({
  children,
  asChild = true,
}: BottomSheetTriggerProps) => {
  const { onOpenChange, open } = useBottomSheet();

  const handlePress = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return <Pressable onPress={handlePress}>{children}</Pressable>;
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
}

export const BottomSheetOverlay = ({ style }: BottomSheetOverlayProps) => {
  const { onOpenChange } = useBottomSheet();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Use alpha black for overlay based on theme - matches radix-ui styling
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(10, 10, 10, 0.6)';

  const handlePress = () => {
    onOpenChange(false);
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
// BottomSheet.Handle - Visual drag handle at the top
// ============================================================================

interface BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

export const BottomSheetHandle = ({ style }: BottomSheetHandleProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const handleColor = isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View style={styles.handleContainer}>
      <View
        style={[
          styles.handle,
          {
            backgroundColor: handleColor,
          },
          style,
        ]}
      />
    </View>
  );
};

// ============================================================================
// BottomSheet.Content - The actual bottom sheet content
// ============================================================================

interface BottomSheetContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  snapPoints?: SnapPoint[];
  size?: 1 | 2 | 3 | 4;
  hideHandle?: boolean;
}

export const BottomSheetContent = ({
  children,
  style,
  snapPoints: localSnapPoints,
  size = 2,
  hideHandle = false,
}: BottomSheetContentProps) => {
  const { onOpenChange, radii, snapPoints: contextSnapPoints, currentSnapIndex } =
    useBottomSheet();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const { height: screenHeight } = Dimensions.get('window');
  const effectiveSnapPoints = localSnapPoints || contextSnapPoints;

  // Calculate snap heights first (before any animation)
  const snapHeights = effectiveSnapPoints.map((sp) =>
    parseSnapPoint(sp, screenHeight)
  );

  // Get the target height for the current snap point
  const targetSnapHeight = snapHeights[currentSnapIndex] || snapHeights[0];

  // Animation value - starts at targetSnapHeight (off-screen below)
  // We use targetSnapHeight so the content is just below the visible area
  const translateY = useRef(new Animated.Value(targetSnapHeight)).current;

  // Get size-specific styles
  const sizeStyles = getSizeStyles(size, theme.space, radii);

  // Get shadow for current theme mode
  const shadow = getShadow(6, isDark);

  // Animate to snap point (slide up from bottom)
  const animateToSnapPoint = useCallback(
    (index: number) => {
      // Animate to 0 to bring content to bottom of screen (visible)
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    },
    [translateY]
  );

  // Animate open when component mounts
  useEffect(() => {
    // Small delay to ensure the modal is visible before animating
    const timer = setTimeout(() => {
      animateToSnapPoint(currentSnapIndex);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentSnapIndex, animateToSnapPoint]);

  // Handle close animation
  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: targetSnapHeight,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onOpenChange(false);
    });
  };

  // Background color
  const backgroundColor = isDark ? theme.colors.gray.dark[2] : '#ffffff';

  // Top border radius
  const borderTopLeftRadius = radii.large;
  const borderTopRightRadius = radii.large;

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor,
            borderTopLeftRadius,
            borderTopRightRadius,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            height: targetSnapHeight,
            transform: [{ translateY }],
            ...(shadow || {}),
          },
          style,
        ]}
      >
        {/* Drag Handle */}
        {!hideHandle && <BottomSheetHandle />}

        {/* Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
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
}

export const BottomSheetClose = ({
  children,
  asChild = true,
  ...buttonProps
}: BottomSheetCloseProps) => {
  const { onOpenChange } = useBottomSheet();

  const handlePress = () => {
    onOpenChange(false);
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
}

export const BottomSheetAction = ({
  children,
  onPress,
  ...buttonProps
}: BottomSheetActionProps) => {
  const { onOpenChange } = useBottomSheet();

  const handlePress = () => {
    onPress?.();
    onOpenChange(false);
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
    marginTop: 8,
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
