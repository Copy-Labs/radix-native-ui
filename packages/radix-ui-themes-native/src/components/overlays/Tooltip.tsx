import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, type StyleProp, ViewStyle, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { getGrayAlpha, getAccentColor } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';

// ============================================================================
// Tooltip Context
// ============================================================================

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale | Record<number, number>;
  delayDuration: number;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip.Provider');
  }
  return context;
};

// ============================================================================
// Tooltip.Provider - Wraps tooltip content and provides context
// ============================================================================

interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

export const TooltipProvider = ({
  children,
  delayDuration = 300,
  skipDelayDuration = 100,
}: TooltipProviderProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  return (
    <TooltipContext.Provider value={{ open: false, onOpenChange: () => {}, colors, grayAlpha, radii, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  );
};

// ============================================================================
// Tooltip.Root - Manages tooltip state
// ============================================================================

interface TooltipRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  delayDuration?: number;
}

export const TooltipRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  delayDuration: customDelayDuration,
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
  const providerDelayDuration = customDelayDuration ?? 300;

  return (
    <TooltipContext.Provider value={{ open, onOpenChange: handleOpenChange, colors, grayAlpha, radii, delayDuration: providerDelayDuration }}>
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

export const TooltipTrigger = ({
  children,
  asChild = true,
  onPointerEnter,
  onPointerLeave,
  onPress,
}: TooltipTriggerProps) => {
  const { onOpenChange, delayDuration } = useTooltip();
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerEnter = useCallback(() => {
    // Clear any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Schedule open with delay
    openTimeoutRef.current = setTimeout(() => {
      onOpenChange(true);
    }, delayDuration);

    onPointerEnter?.();
  }, [delayDuration, onOpenChange, onPointerEnter]);

  const handlePointerLeave = useCallback(() => {
    // Clear any pending open
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Schedule close
    closeTimeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, 100);

    onPointerLeave?.();
  }, [onOpenChange, onPointerLeave]);

  const handlePress = useCallback(() => {
    onOpenChange(false); // Close on press
    onPress?.();
  }, [onOpenChange, onPress]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Pressable
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPress={handlePress}
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

export const TooltipPortal = ({ children }: TooltipPortalProps) => {
  const { open } = useTooltip();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {}}
      hardwareAccelerated={false}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// Tooltip.Content - The tooltip content
// ============================================================================

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipContentProps {
  children: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  style?: StyleProp<ViewStyle>;
  avoidCollisions?: boolean;
}

export const TooltipContent = ({
  children,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  style,
  avoidCollisions = true,
}: TooltipContentProps) => {
  const { colors, grayAlpha, radii } = useTooltip();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Use solid gray 9 for tooltip background (matches original Radix)
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const tooltipBackground = isDark ? grayScale[9] : grayScale[12];

  // Calculate position based on screen center for simplicity
  const getPositionStyle = (): ViewStyle => {
    const spacing = sideOffset;

    switch (side) {
      case 'top':
        return {
          position: 'absolute',
          bottom: screenHeight - 100 + spacing,
          left: screenWidth / 2 - 100 + alignOffset,
          width: 200,
        };
      case 'bottom':
        return {
          position: 'absolute',
          top: 100 + spacing,
          left: screenWidth / 2 - 100 + alignOffset,
          width: 200,
        };
      case 'left':
        return {
          position: 'absolute',
          right: screenWidth / 2 + spacing,
          top: screenHeight / 2 - 30 + alignOffset,
          width: 180,
        };
      case 'right':
        return {
          position: 'absolute',
          left: screenWidth / 2 + spacing,
          top: screenHeight / 2 - 30 + alignOffset,
          width: 180,
        };
      default:
        return {
          position: 'absolute',
          bottom: screenHeight - 100 + spacing,
          left: screenWidth / 2 - 100 + alignOffset,
          width: 200,
        };
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          styles.content,
          {
            backgroundColor: tooltipBackground,
            borderRadius: radii[2],
            paddingHorizontal: theme.space[3],
            paddingVertical: theme.space[2],
          },
          getPositionStyle(),
          style,
        ]}
      >
        <Text
          style={{
            color: grayScale[1],
            fontSize: theme.typography.fontSizes[1].fontSize,
            textAlign: 'center',
          }}
        >
          {children}
        </Text>
        {/* Arrow */}
        <View
          style={[
            styles.arrow,
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
// Tooltip.Arrow - Arrow indicator
// ============================================================================

interface TooltipArrowProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const TooltipArrow = ({ size = 6, style }: TooltipArrowProps) => {
  const { colors } = useTooltip();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const arrowColor = grayScale[9];

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
  delayDuration?: number;
}

export const Tooltip = ({
  children,
  content,
  side = 'top',
  sideOffset = 8,
  delayDuration = 300,
}: SimpleTooltipProps) => {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side={side} sideOffset={sideOffset}>
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
  content: {
    minWidth: 120,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowTop: {
    top: -6,
    borderBottomColor: '#27272a',
  },
  arrowBottom: {
    bottom: -6,
    borderTopColor: '#27272a',
    borderBottomWidth: 0,
    borderTopWidth: 6,
  },
  arrowLeft: {
    left: -6,
    borderRightColor: '#27272a',
    borderLeftWidth: 0,
    borderRightWidth: 6,
  },
  arrowRight: {
    right: -6,
    borderLeftColor: '#27272a',
    borderRightWidth: 0,
    borderLeftWidth: 6,
  },
});

// ============================================================================
// Export all Tooltip components
// ============================================================================

export const TooltipComponent = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Tooltip: Tooltip,
};

export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
  SimpleTooltipProps,
};

// For backward compatibility
const TooltipExport = TooltipComponent;
export default TooltipExport;
