import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
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

// ============================================================================
// Popover Context
// ============================================================================

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  accentColor: string;
  radii: RadiusScale | Record<number, number>;
  anchorRef: React.RefObject<View | null>;
  contentRef: React.RefObject<View | null>;
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
  const anchorRef = useRef<View>(null);
  const contentRef = useRef<View>(null);

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange, colors, grayAlpha, accentColor, radii, anchorRef, contentRef }}>
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
  const { onOpenChange, open } = usePopover();

  const handlePress = () => {
    onOpenChange(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: (usePopover() as any).anchorRef,
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Pressable ref={(usePopover() as any).anchorRef} onPress={handlePress}>
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

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

interface PopoverContentProps {
  children: ReactNode;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  avoidCollisions?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PopoverContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  avoidCollisions = true,
  style,
}: PopoverContentProps) => {
  const { colors, grayAlpha, accentColor, radii, onOpenChange, anchorRef } = usePopover();
  const theme = useTheme();
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const contentRef = useRef<View>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // In React Native, we position the content absolutely based on anchor
  // For simplicity, we'll use a centered approach with side-based positioning

  const getPositionStyle = (): ViewStyle => {
    const spacing = sideOffset;

    switch (side) {
      case 'top':
        return {
          position: 'absolute',
          bottom: screenHeight - anchorPosition.y + spacing,
          left: anchorPosition.x + (anchorPosition.width / 2) - 100 + alignOffset,
          width: 200,
        };
      case 'bottom':
        return {
          position: 'absolute',
          top: anchorPosition.y + anchorPosition.height + spacing,
          left: anchorPosition.x + (anchorPosition.width / 2) - 100 + alignOffset,
          width: 200,
        };
      case 'left':
        return {
          position: 'absolute',
          right: screenWidth - anchorPosition.x + spacing,
          top: anchorPosition.y + (anchorPosition.height / 2) - 50 + alignOffset,
          width: 200,
        };
      case 'right':
        return {
          position: 'absolute',
          left: anchorPosition.x + anchorPosition.width + spacing,
          top: anchorPosition.y + (anchorPosition.height / 2) - 50 + alignOffset,
          width: 200,
        };
      default:
        return {
          position: 'absolute',
          top: anchorPosition.y + anchorPosition.height + spacing,
          left: anchorPosition.x + (anchorPosition.width / 2) - 100 + alignOffset,
          width: 200,
        };
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View
        ref={contentRef}
        style={[
          styles.content,
          {
            backgroundColor: grayAlpha['2'],
            borderRadius: radii[3],
            borderWidth: 1,
            borderColor: grayAlpha['7'],
          },
          getPositionStyle(),
          style,
        ]}
      >
        {children}
        {/* Arrow indicator */}
        <View
          style={[
            styles.arrow,
            {
              borderColor: grayAlpha['7'],
            },
            side === 'bottom' && styles.arrowTop,
            side === 'top' && styles.arrowBottom,
            side === 'left' && styles.arrowRight,
            side === 'right' && styles.arrowLeft,
          ]}
        />
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
  const theme = useTheme();

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
  const { onOpenChange, colors, grayAlpha } = usePopover();
  const theme = useTheme();

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
    padding: 16,
    minWidth: 180,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowTop: {
    top: -8,
    borderBottomColor: '#fff',
  },
  arrowBottom: {
    bottom: -8,
    borderTopColor: '#fff',
    borderBottomWidth: 0,
    borderTopWidth: 8,
  },
  arrowLeft: {
    left: -8,
    borderRightColor: '#fff',
    borderLeftWidth: 0,
    borderRightWidth: 8,
  },
  arrowRight: {
    right: -8,
    borderLeftColor: '#fff',
    borderRightWidth: 0,
    borderLeftWidth: 8,
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
};
