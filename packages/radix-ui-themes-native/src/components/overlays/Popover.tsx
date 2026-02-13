import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  type StyleProp,
  ViewStyle,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  TextStyle,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { getGrayAlpha, getAccentColor } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';
import {
  useAnchorPosition,
  calculatePopoverPosition,
  type AnchorPosition,
  type PopoverSide,
  type PopoverAlign,
} from '../../hooks/useAnchorPosition';

// ============================================================================
// Popover Context
// ============================================================================

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  accentColor: string;
  radii: RadiusScale;
  anchorRef: React.RefObject<View | null>;
  anchorPosition: AnchorPosition;
  measureAnchor: () => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover.Root');
  }
  return context;
};

// ============================================================================
// Popover.Root - Main component that manages state
// ============================================================================

interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export const PopoverRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: PopoverRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [controlledOpen, onOpenChange]);

  const theme = useTheme();
  const mode = useThemeMode();
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const accentColor = getAccentColor(theme, mode)[9];
  const radii = theme.radii;
  const { anchorRef, anchorPosition, measureAnchor } = useAnchorPosition();

  return (
    <PopoverContext.Provider value={{
      open,
      onOpenChange: handleOpenChange,
      colors,
      grayAlpha,
      accentColor,
      radii,
      anchorRef,
      anchorPosition,
      measureAnchor,
    }}>
      {children}
    </PopoverContext.Provider>
  );
};

// ============================================================================
// Popover.Trigger - The anchor element that opens the popover
// ============================================================================

interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = ({ children, asChild = true }: PopoverTriggerProps) => {
  const { onOpenChange, open, anchorRef, measureAnchor } = usePopover();

  const handlePress = () => {
    // Measure the anchor position before opening
    measureAnchor();
    onOpenChange(!open);
  };

  if (asChild && React.isValidElement(children)) {
    // Clone the child element and inject our ref and onPress handler
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: anchorRef,
      onPress: (e: any) => {
        // Call the original onPress if it exists
        child.props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Pressable ref={anchorRef} onPress={handlePress}>
      {children}
    </Pressable>
  );
};

// ============================================================================
// Popover.Portal - Renders popover content in a modal
// ============================================================================

interface PopoverPortalProps {
  children: ReactNode;
}

export const PopoverPortal = ({ children }: PopoverPortalProps) => {
  const { open } = usePopover();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {}}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// Popover.Overlay - Backdrop for popover
// ============================================================================

interface PopoverOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const PopoverOverlay = ({ style }: PopoverOverlayProps) => {
  const { onOpenChange } = usePopover();

  return (
    <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
      <View style={[styles.overlay, style]} />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Popover.Content - The popover content panel
// ============================================================================

export type { PopoverSide, PopoverAlign };

/**
 * Size variant for Popover content
 * - 1: Small - compact padding, smaller fonts
 * - 2: Medium - default padding and font sizes
 * - 3: Large - generous padding, larger fonts
 */
type PopoverSize = 1 | 2 | 3;

interface PopoverContentProps {
  children: ReactNode;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  avoidCollisions?: boolean;
  /**
   * Size of the popover content
   * @default 2
   */
  size?: PopoverSize;
  style?: StyleProp<ViewStyle>;
}

export const PopoverContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  avoidCollisions = true,
  size = 2,
  style,
}: PopoverContentProps) => {
  const { colors, grayAlpha, radii, onOpenChange, anchorPosition } = usePopover();
  const theme = useTheme();
  const contentRef = useRef<View>(null);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<{ top?: number; left?: number }>({});
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Get size-based styles
  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 1:
        return {
          padding: theme.space[2],
          minWidth: 140,
          maxWidth: 220,
        };
      case 3:
        return {
          padding: theme.space[5],
          minWidth: 240,
          maxWidth: 360,
        };
      case 2:
      default:
        return {
          padding: theme.space[4],
          minWidth: 180,
          maxWidth: 280,
        };
    }
  }, [size, theme.space]);

  const sizeStyles = getSizeStyles();

  // Calculate position when content size or anchor position changes
  const updatePosition = useCallback(() => {
    if (contentSize.width === 0 || contentSize.height === 0) {
      return;
    }

    const calculatedPosition = calculatePopoverPosition(
      anchorPosition,
      contentSize,
      { width: screenWidth, height: screenHeight },
      side,
      align,
      sideOffset,
      alignOffset,
      avoidCollisions
    );

    setPosition({
      top: calculatedPosition.top,
      left: calculatedPosition.left,
    });
  }, [anchorPosition, contentSize, screenWidth, screenHeight, side, align, sideOffset, alignOffset, avoidCollisions]);

  // Update position when dependencies change
  React.useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  // Handle content layout to get size
  const handleLayout = useCallback((event: { nativeEvent: { layout: { width: number; height: number } } }) => {
    const { width, height } = event.nativeEvent.layout;
    setContentSize({ width, height });
  }, []);

  // Don't render until we have valid anchor position
  const hasValidPosition = anchorPosition.x !== 0 || anchorPosition.y !== 0;
  const hasContentSize = contentSize.width > 0 && contentSize.height > 0;

  return (
    <TouchableWithoutFeedback>
      <View
        ref={contentRef}
        onLayout={handleLayout}
        style={[
          styles.content,
          {
            backgroundColor: colors['1'] || grayAlpha['12'],
            borderRadius: radii.medium,
            borderWidth: 1,
            borderColor: grayAlpha['7'],
            // Apply size-based styles
            padding: sizeStyles.padding,
            minWidth: sizeStyles.minWidth,
            maxWidth: sizeStyles.maxWidth,
            // Only apply position styles when we have valid measurements
            ...(hasValidPosition && hasContentSize ? {
              position: 'absolute',
              top: position.top ?? 0,
              left: position.left ?? 0,
            } : {
              position: 'absolute',
              left: -9999, // Off-screen until positioned
              opacity: 0,
            }),
          },
          style,
        ]}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Popover.Arrow - The arrow indicator
// ============================================================================

interface PopoverArrowProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const PopoverArrow = ({ size = 8, style }: PopoverArrowProps) => {
  const { grayAlpha } = usePopover();

  return (
    <View
      style={[
        {
          width: 0,
          height: 0,
          borderLeftWidth: size,
          borderRightWidth: size,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: grayAlpha['7'],
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// Popover.Title - Accessible title
// ============================================================================

interface PopoverTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

export const PopoverTitle = ({ children, style = {} }: PopoverTitleProps) => {
  const { colors } = usePopover();
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: colors[12],
          fontSize: theme.typography.fontSizes[2].fontSize,
          fontWeight: '600',
          marginBottom: theme.space[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// Popover.Description - Accessible description
// ============================================================================

interface PopoverDescriptionProps {
  children: ReactNode;
  style?: TextStyle;
}

export const PopoverDescription = ({ children, style = {} }: PopoverDescriptionProps) => {
  const { colors } = usePopover();
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: colors[11],
          fontSize: theme.typography.fontSizes[1].fontSize,
          lineHeight: theme.typography.fontSizes[1].lineHeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// Popover.Close - Close button
// ============================================================================

interface PopoverCloseProps {
  children?: ReactNode;
  ariaLabel?: string;
}

export const PopoverClose = ({
  children,
  ariaLabel = 'Close popover',
}: PopoverCloseProps) => {
  const { onOpenChange, colors } = usePopover();

  return (
    <Pressable
      onPress={() => onOpenChange(false)}
      style={styles.closeButton}
      accessibilityLabel={ariaLabel}
      accessibilityRole="button"
    >
      {children || (
        <Text style={{ color: colors[11], fontSize: 16 }}>✕</Text>
      )}
    </Pressable>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)', // Nearly transparent for touch-through
  },
  content: {
    // Padding, minWidth, maxWidth are now controlled by size prop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ============================================================================
// Export all Popover components
// ============================================================================

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Overlay: PopoverOverlay,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
};

export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverOverlayProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverCloseProps,
  PopoverSize,
};
