import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, type StyleProp, ViewStyle, Modal, Dimensions, TouchableWithoutFeedback, GestureResponderEvent, type LayoutChangeEvent, TextStyle } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { BaseColorScale, type Color, ColorScale, RadiusScale } from '../../theme';
import {
  calculateContextMenuPosition,
  type ContextMenuSide,
  type ContextMenuAlign,
  type ContextMenuPosition,
} from '../../hooks/useAnchorPosition';

// ============================================================================
// ContextMenu Types
// ============================================================================

/**
 * Size variant for ContextMenu content
 * - 1: Small - compact padding, smaller fonts
 * - 2: Medium - default padding and font sizes
 * - 3: Large - generous padding, large fonts
 * - 4: Larger - generous padding, larger fonts
 */
type ContextMenuSize = 1 | 2 | 3 | 4;

// ============================================================================
// ContextMenu Context
// ============================================================================

interface ContextMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale;
  size: ContextMenuSize;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenu components must be used within a ContextMenu.Root');
  }
  return context;
};

// ============================================================================
// ContextMenu.Root - Manages menu state
// ============================================================================

interface ContextMenuRootProps {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state for uncontrolled mode */
  defaultOpen?: boolean;
}

export const ContextMenuRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: ContextMenuRootProps) => {
  const theme = useTheme();
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const radii = theme.radii;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Support controlled and uncontrolled modes
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [controlledOpen, onOpenChange]);

  // Default size is 2, will be overridden by ContextMenuContent
  const [size, setSize] = useState<ContextMenuSize>(2);

  return (
    <ContextMenuContext.Provider value={{ open, onOpenChange: handleOpenChange, position, setPosition, colors, radii, size }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// ============================================================================
// ContextMenu.Trigger - Wraps content that shows context menu on long press
// ============================================================================

interface ContextMenuTriggerProps {
  children: ReactNode;
  /** Callback when long press occurs */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** Whether to use child element as trigger (clones props to child) */
  asChild?: boolean;
}

export const ContextMenuTrigger = ({
  children,
  onLongPress,
  asChild = true,
}: ContextMenuTriggerProps) => {
  const { setPosition, onOpenChange } = useContextMenuContext();

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setPosition({ x: pageX, y: pageY });
    onOpenChange(true);
    onLongPress?.(event);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      onLongPress: (e: GestureResponderEvent) => {
        // Call the original onLongPress if it exists
        child.props?.onLongPress?.(e);
        handleLongPress(e);
      },
    });
  }

  return (
    <Pressable onLongPress={handleLongPress}>
      {children}
    </Pressable>
  );
};

// ============================================================================
// ContextMenu.Portal - Renders menu in modal
// ============================================================================

interface ContextMenuPortalProps {
  children: ReactNode;
}

export const ContextMenuPortal = ({ children }: ContextMenuPortalProps) => {
  const { open, onOpenChange } = useContextMenuContext();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => onOpenChange(false)}
      hardwareAccelerated={false}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// ContextMenu.Overlay - Touchable overlay
// ============================================================================

interface ContextMenuOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuOverlay = ({ style }: ContextMenuOverlayProps) => {
  const { onOpenChange } = useContextMenuContext();

  return (
    <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
      <View style={[styles.overlay, style]} />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// ContextMenu.Content - The context menu content
// ============================================================================

export type { ContextMenuSide, ContextMenuAlign };

interface ContextMenuContentProps {
  children: ReactNode;
  /** Preferred side to show menu (flips if collision detected) */
  side?: ContextMenuSide;
  /** Distance from touch point to menu */
  sideOffset?: number;
  /** Horizontal alignment relative to touch point */
  align?: ContextMenuAlign;
  /** Horizontal offset from aligned position */
  alignOffset?: number;
  /** Whether to flip when colliding with screen edges */
  avoidCollisions?: boolean;
  /** Size of the context menu content */
  size?: ContextMenuSize;
  style?: StyleProp<ViewStyle>;
}

/**
 * Helper to get size-based styles for context menu content
 */
const getSizeStyles = (size: ContextMenuSize, theme: ReturnType<typeof useTheme>) => {
  switch (size) {
    case 1:
      return {
        paddingVertical: theme.space[1],
        paddingHorizontal: theme.space[1],
        minWidth: 140,
        maxWidth: 220,
      };
    case 3:
      return {
        paddingVertical: theme.space[3],
        paddingHorizontal: theme.space[2],
        minWidth: 240,
        maxWidth: 360,
      };
    case 4:
      return {
        paddingVertical: theme.space[3],
        paddingHorizontal: theme.space[2],
        minWidth: 240,
        maxWidth: 360,
      };
    case 2:
    default:
      return {
        paddingVertical: theme.space[2],
        paddingHorizontal: theme.space[2],
        minWidth: 180,
        maxWidth: 280,
      };
  }
};

export const ContextMenuContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  avoidCollisions = true,
  size = 2,
  style,
}: ContextMenuContentProps) => {
  const { colors, radii, position } = useContextMenuContext();
  const theme = useTheme();
  const contentRef = useRef<View>(null);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [calculatedPosition, setCalculatedPosition] = useState<ContextMenuPosition | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const sizeStyles = getSizeStyles(size, theme);

  // Calculate position when content size or position changes
  const updatePosition = useCallback(() => {
    if (contentSize.width === 0 || contentSize.height === 0) return;

    const pos = calculateContextMenuPosition(
      position,
      contentSize,
      { width: screenWidth, height: screenHeight },
      side,
      align,
      sideOffset,
      alignOffset,
      avoidCollisions
    );
    setCalculatedPosition(pos);
  }, [position, contentSize, screenWidth, screenHeight, side, align, sideOffset, alignOffset, avoidCollisions]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  // Handle content layout to get size
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentSize({ width, height });
  }, []);

  // Get context value and update with size
  const contextValue = useContextMenuContext();
  const contextWithSize = { ...contextValue, size };

  return (
    <TouchableWithoutFeedback>
      <ContextMenuContext.Provider value={contextWithSize}>
        <View
          ref={contentRef}
          onLayout={handleLayout}
          style={[
            styles.content,
            {
              backgroundColor: colors[1],
              borderRadius: radii.medium,
              borderWidth: 1,
              borderColor: colors[6],
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              minWidth: sizeStyles.minWidth,
              maxWidth: sizeStyles.maxWidth,
              ...(calculatedPosition ? {
                position: 'absolute',
                top: calculatedPosition.top,
                left: calculatedPosition.left,
              } : {
                position: 'absolute',
                left: -9999,
                opacity: 0,
              }),
            },
            style,
          ]}
        >
          <View style={{ paddingVertical: theme.space[1] }}>
            {children}
          </View>
        </View>
      </ContextMenuContext.Provider>
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// ContextMenu.Group - Groups menu items
// ============================================================================

interface ContextMenuGroupProps {
  children: ReactNode;
}

export const ContextMenuGroup = ({ children }: ContextMenuGroupProps) => {
  return <View>{children}</View>;
};

// ============================================================================
// ContextMenu.Item - Individual menu item
// ============================================================================

interface ContextMenuItemProps {
  children: ReactNode;
  /** Color scheme for the item */
  color?: Color;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is destructive (shows in red) */
  destructive?: boolean;
  /** Icon to display before the item text */
  icon?: ReactNode;
  /** Keyboard shortcut to display */
  shortcut?: string;
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuItem = ({
  children,
  color,
  onSelect,
  disabled = false,
  destructive = false,
  icon,
  shortcut,
  style,
}: ContextMenuItemProps) => {
  const { colors, onOpenChange, size } = useContextMenuContext();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  // Get font size based on size prop
  const getFontSize = useCallback(() => {
    switch (size) {
      case 1:
        return theme.typography.fontSizes[2].fontSize;
      case 3:
        return theme.typography.fontSizes[4].fontSize;
      case 4:
        return theme.typography.fontSizes[5].fontSize;
      case 2:
      default:
        return theme.typography.fontSizes[3].fontSize;
    }
  }, [size, theme.typography.fontSizes]);

  // Get padding based on size prop
  const getItemPadding = useCallback(() => {
    switch (size) {
      case 1:
        return { paddingHorizontal: theme.space[2], paddingVertical: theme.space[1] };
      case 3:
        return { paddingHorizontal: theme.space[4], paddingVertical: theme.space[3] };
      case 4:
        return { paddingHorizontal: theme.space[5], paddingVertical: theme.space[4] };
      case 2:
      default:
        return { paddingHorizontal: theme.space[3], paddingVertical: theme.space[2] };
    }
  }, [size, theme.space]);

  const fontSize = getFontSize();
  const itemPadding = getItemPadding();

  // Use theme red color for destructive items
  const destructiveColor = theme.colors.red[11];
  const textColor = disabled ? colors[8] : destructive ? destructiveColor : colors[12];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.item, disabled && styles.itemDisabled, itemPadding, style]}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
    >
      {icon && <View style={{ marginRight: theme.space[2] }}>{icon}</View>}
      <Text style={{ color: textColor, flex: 1, fontSize }}>
        {children}
      </Text>
      {shortcut && (
        <Text style={{ color: colors[11], fontSize: fontSize * 0.95 }}>
          {shortcut}
        </Text>
      )}
    </Pressable>
  );
};

// ============================================================================
// ContextMenu.Separator - Visual divider
// ============================================================================

interface ContextMenuSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuSeparator = ({ style }: ContextMenuSeparatorProps) => {
  const { colors } = useContextMenuContext();

  return <View style={[styles.separator, { backgroundColor: colors[6] }, style]} />;
};

// ============================================================================
// ContextMenu.Label - Section label
// ============================================================================

interface ContextMenuLabelProps {
  children: ReactNode;
  style?: TextStyle;
}

export const ContextMenuLabel = ({ children, style = {} }: ContextMenuLabelProps) => {
  const { colors, size } = useContextMenuContext();
  const theme = useTheme();

  // Get font size based on size prop
  const getFontSize = useCallback(() => {
    switch (size) {
      case 1:
        return theme.typography.fontSizes[1].fontSize;
      case 3:
        return theme.typography.fontSizes[3].fontSize;
      case 2:
      default:
        return theme.typography.fontSizes[2].fontSize;
    }
  }, [size, theme.typography.fontSizes]);

  // Get padding based on size prop
  const getPadding = useCallback(() => {
    switch (size) {
      case 1:
        return { paddingHorizontal: theme.space[2], paddingVertical: theme.space[1] };
      case 3:
        return { paddingHorizontal: theme.space[4], paddingVertical: theme.space[2] };
      case 2:
      default:
        return { paddingHorizontal: theme.space[3], paddingVertical: theme.space[1] };
    }
  }, [size, theme.space]);

  const padding = getPadding();

  return (
    <Text
      style={[
        {
          color: colors[10],
          fontSize: getFontSize(),
          fontWeight: '600',
          paddingHorizontal: padding.paddingHorizontal,
          paddingVertical: padding.paddingVertical,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// ContextMenu.CheckboxItem - Checkable menu item
// ============================================================================

interface ContextMenuCheckboxItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  shortcut?: string;
}

export const ContextMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
  disabled = false,
  shortcut,
}: ContextMenuCheckboxItemProps) => {
  const { colors, size } = useContextMenuContext();
  const theme = useTheme();

  // Get font size based on size prop
  const getFontSize = useCallback(() => {
    switch (size) {
      case 1:
        return theme.typography.fontSizes[1].fontSize;
      case 3:
        return theme.typography.fontSizes[3].fontSize;
      case 2:
      default:
        return theme.typography.fontSizes[2].fontSize;
    }
  }, [size, theme.typography.fontSizes]);

  // Get checkbox size based on size prop
  const getCheckboxSize = useCallback(() => {
    switch (size) {
      case 1:
        return 14;
      case 3:
        return 22;
      case 2:
      default:
        return 18;
    }
  }, [size]);

  const fontSize = getFontSize();
  const checkboxSize = getCheckboxSize();

  return (
    <ContextMenuItem
      onSelect={() => onCheckedChange(!checked)}
      disabled={disabled}
      shortcut={shortcut}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              borderColor: colors[9],
              backgroundColor: checked ? colors[9] : 'transparent',
            },
          ]}
        >
          {checked && (
            <Text style={{ color: colors[1], fontSize: checkboxSize * 0.6, fontWeight: 'bold' }}>✓</Text>
          )}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2], fontSize }}>
          {children}
        </Text>
      </View>
    </ContextMenuItem>
  );
};

// ============================================================================
// ContextMenu.RadioItem - Radio menu item
// ============================================================================

interface ContextMenuRadioItemProps {
  children: ReactNode;
  value: string;
  checked: boolean;
  onCheckedChange: (value: string) => void;
  disabled?: boolean;
}

export const ContextMenuRadioItem = ({
  children,
  value,
  checked,
  onCheckedChange,
  disabled = false,
}: ContextMenuRadioItemProps) => {
  const { colors, size } = useContextMenuContext();
  const theme = useTheme();

  // Get font size based on size prop
  const getFontSize = useCallback(() => {
    switch (size) {
      case 1:
        return theme.typography.fontSizes[1].fontSize;
      case 3:
        return theme.typography.fontSizes[3].fontSize;
      case 2:
      default:
        return theme.typography.fontSizes[2].fontSize;
    }
  }, [size, theme.typography.fontSizes]);

  // Get radio size based on size prop
  const getRadioSize = useCallback(() => {
    switch (size) {
      case 1:
        return 14;
      case 3:
        return 22;
      case 2:
      default:
        return 18;
    }
  }, [size]);

  const fontSize = getFontSize();
  const radioSize = getRadioSize();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(value);
    }
  };

  // Get padding based on size prop
  const getItemPadding = useCallback(() => {
    switch (size) {
      case 1:
        return { paddingHorizontal: theme.space[2], paddingVertical: theme.space[1] };
      case 3:
        return { paddingHorizontal: theme.space[4], paddingVertical: theme.space[3] };
      case 2:
      default:
        return { paddingHorizontal: theme.space[3], paddingVertical: theme.space[2] };
    }
  }, [size, theme.space]);

  const itemPadding = getItemPadding();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.item, disabled && styles.itemDisabled, itemPadding]}
      accessibilityRole="menuitem"
      accessibilityState={{ checked, disabled }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={[
            styles.radio,
            {
              width: radioSize,
              height: radioSize,
              borderRadius: radioSize / 2,
              borderColor: colors[9],
              backgroundColor: checked ? colors[9] : 'transparent',
            },
          ]}
        >
          {checked && (
            <View
              style={{
                width: radioSize * 0.4,
                height: radioSize * 0.4,
                borderRadius: radioSize * 0.2,
                backgroundColor: colors[1],
              }}
            />
          )}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2], fontSize }}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  content: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10000,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  checkbox: {
    borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ============================================================================
// Export all ContextMenu components
// ============================================================================

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Overlay: ContextMenuOverlay,
  Content: ContextMenuContent,
  Group: ContextMenuGroup,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioItem: ContextMenuRadioItem,
};

export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuOverlayProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuSize,
};

export default ContextMenu;
