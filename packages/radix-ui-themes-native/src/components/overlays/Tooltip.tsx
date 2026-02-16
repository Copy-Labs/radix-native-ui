import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, type StyleProp, ViewStyle, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';
import {
  useAnchorPosition,
  calculatePopoverPosition,
  type AnchorPosition,
  type PopoverSide,
  type PopoverAlign,
} from '../../hooks/useAnchorPosition';

// ============================================================================
// Tooltip Context
// ============================================================================

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
  delayDuration: number;
  longPressDuration: number;
  anchorRef: React.RefObject<View | null>;
  anchorPosition: AnchorPosition;
  measureAnchor: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip.Root');
  }
  return context;
};

// ============================================================================
// Tooltip.Root - Manages tooltip state and provides context
// ============================================================================

interface TooltipRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  delayDuration?: number;
  /** Duration for long-press to show tooltip on mobile (in ms). Default: 500 */
  longPressDuration?: number;
}

const TooltipRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  delayDuration = 300,
  longPressDuration = 500,
}: TooltipRootProps) => {
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
  const isDark = mode === 'dark';
  const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;
  const { anchorRef, anchorPosition, measureAnchor } = useAnchorPosition();

  return (
    <TooltipContext.Provider value={{
      open,
      onOpenChange: handleOpenChange,
      colors,
      grayAlpha,
      radii,
      delayDuration,
      longPressDuration,
      anchorRef,
      anchorPosition,
      measureAnchor,
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

// ============================================================================
// Tooltip.Trigger - Wraps the trigger element
// ============================================================================

interface TooltipTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPress?: () => void;
}

const TooltipTrigger = ({
  children,
  asChild = true,
  onPointerEnter,
  onPointerLeave,
  onPress,
}: TooltipTriggerProps) => {
  const { onOpenChange, delayDuration, longPressDuration, measureAnchor, anchorRef } = useTooltip();
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerEnter = useCallback(() => {
    // Clear any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Measure anchor position before opening
    measureAnchor();

    // Schedule open with delay
    openTimeoutRef.current = setTimeout(() => {
      onOpenChange(true);
    }, delayDuration);

    onPointerEnter?.();
  }, [delayDuration, onOpenChange, onPointerEnter, measureAnchor]);

  const handlePointerLeave = useCallback(() => {
    // Clear any pending open
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Schedule close with short delay
    closeTimeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, 100);

    onPointerLeave?.();
  }, [onOpenChange, onPointerLeave]);

  const handlePress = useCallback(() => {
    // Clear any pending timeouts
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    onOpenChange(false); // Close on press
    onPress?.();
  }, [onOpenChange, onPress]);

  // Long-press handler for mobile
  const handleLongPress = useCallback(() => {
    // Measure anchor position before opening
    measureAnchor();
    onOpenChange(true);
  }, [measureAnchor, onOpenChange]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: anchorRef,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPress: (e: any) => {
        child.props?.onPress?.(e);
        handlePress();
      },
      onLongPress: handleLongPress,
      delayLongPress: longPressDuration,
    });
  }

  return (
    <Pressable
      ref={anchorRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={longPressDuration}
    >
      {children}
    </Pressable>
  );
};

// ============================================================================
// Tooltip.Portal - Renders tooltip in modal
// ============================================================================

interface TooltipPortalProps {
  children: ReactNode;
}

const TooltipPortal = ({ children }: TooltipPortalProps) => {
  const { open, onOpenChange } = useTooltip();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => onOpenChange(false)}
      hardwareAccelerated={false}
    >
      <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
        <View style={styles.overlay}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ============================================================================
// Tooltip.Content - The tooltip content
// ============================================================================

export type TooltipSide = PopoverSide;
export type TooltipAlign = PopoverAlign;

interface TooltipContentProps {
  children: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  align?: TooltipAlign;
  alignOffset?: number;
  style?: StyleProp<ViewStyle>;
  avoidCollisions?: boolean;
  /** Radius variant for the tooltip. Inherits from theme by default. */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

const TooltipContent = ({
  children,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  style,
  avoidCollisions = true,
  radius,
}: TooltipContentProps) => {
  const { colors, grayAlpha, radii, anchorPosition } = useTooltip();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const contentRef = useRef<View>(null);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<{ top?: number; left?: number }>({});
  const [actualSide, setActualSide] = useState<TooltipSide>(side);

  // Use solid gray for tooltip background (matches Radix UI)
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const tooltipBackground = isDark ? grayScale[9] : grayScale[12];
  const textColor = grayScale[1];

  // Get the border radius based on radius prop or theme default
  const borderRadius = radius ? radii[radius] : radii.medium;

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
    setActualSide(calculatedPosition.actualSide);
  }, [anchorPosition, contentSize, screenWidth, screenHeight, side, align, sideOffset, alignOffset, avoidCollisions]);

  // Update position when dependencies change
  useEffect(() => {
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

  // Get arrow color based on actual side
  const arrowColor = tooltipBackground;

  return (
    <View
      ref={contentRef}
      onLayout={handleLayout}
      style={[
        styles.content,
        {
          backgroundColor: tooltipBackground,
          borderRadius: borderRadius,
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[2],
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
      <Text
        style={{
          color: textColor,
          fontSize: theme.typography.fontSizes[1].fontSize,
          textAlign: 'center',
        }}
      >
        {children}
      </Text>
      {/* Arrow - rendered by default */}
      <View
        style={[
          styles.arrow,
          actualSide === 'top' && [styles.arrowBottom, { borderTopColor: arrowColor }],
          actualSide === 'bottom' && [styles.arrowTop, { borderBottomColor: arrowColor }],
          actualSide === 'left' && [styles.arrowRight, { borderLeftColor: arrowColor, borderTopColor: 'transparent', borderBottomColor: 'transparent' }],
          actualSide === 'right' && [styles.arrowLeft, { borderRightColor: arrowColor, borderTopColor: 'transparent', borderBottomColor: 'transparent' }],
        ]}
      />
    </View>
  );
};

// ============================================================================
// Tooltip.Arrow - Optional standalone arrow (for custom positioning)
// ============================================================================

interface TooltipArrowProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const TooltipArrow = ({ size = 6, style }: TooltipArrowProps) => {
  const { colors } = useTooltip();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const arrowColor = isDark ? grayScale[9] : grayScale[12];

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
          borderBottomColor: arrowColor,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// Simple Tooltip - Convenience component
// ============================================================================

interface SimpleTooltipProps {
  children: ReactNode;
  content: string;
  side?: TooltipSide;
  sideOffset?: number;
  align?: TooltipAlign;
  alignOffset?: number;
  delayDuration?: number;
  /** Duration for long-press to show tooltip on mobile (in ms). Default: 500 */
  longPressDuration?: number;
  avoidCollisions?: boolean;
  /** Radius variant for the tooltip. Inherits from theme by default. */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

const Tooltip = ({
  children,
  content,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  delayDuration = 300,
  longPressDuration = 500,
  avoidCollisions = true,
  radius,
}: SimpleTooltipProps) => {
  return (
    <TooltipRoot delayDuration={delayDuration} longPressDuration={longPressDuration}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          avoidCollisions={avoidCollisions}
          radius={radius}
        >
          {content}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)', // Nearly transparent
  },
  content: {
    minWidth: 80,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  // Arrow at top of tooltip (tooltip is below trigger) - points up
  arrowTop: {
    top: -6,
    left: '50%',
    marginLeft: 6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderTopWidth: 0,
  },
  // Arrow at bottom of tooltip (tooltip is above trigger) - points down
  arrowBottom: {
    bottom: -6,
    left: '50%',
    marginLeft: 6,
    borderTopWidth: 6,
    borderBottomWidth: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
  },
  // Arrow at left of tooltip (tooltip is to the right of trigger) - points left
  arrowLeft: {
    left: -6,
    top: '50%',
    marginTop: 6 / 3,
    borderRightWidth: 6,
    borderLeftWidth: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
  },
  // Arrow at right of tooltip (tooltip is to the left of trigger) - points right
  arrowRight: {
    right: -6,
    top: '50%',
    marginTop: 6 / 3,
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
  },
});

// ============================================================================
// Export all Tooltip components
// ============================================================================

// Create the compound component object
const TooltipCompound = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};

// Create a callable function that also has the compound properties
// This allows both <Tooltip content="..."> and <Tooltip.Root>
const TooltipExport = Object.assign(Tooltip, TooltipCompound);

export { TooltipExport as Tooltip };

export type {
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
  SimpleTooltipProps,
};
