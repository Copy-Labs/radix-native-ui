import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, type StyleProp, ViewStyle, Modal, Dimensions, TouchableWithoutFeedback,
  TextStyle
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { BaseColorScale, type Color, ColorScale, getVariantColors, RadiusScale } from '../../theme';
import {
  useAnchorPosition,
  calculatePopoverPosition,
  type AnchorPosition,
  type PopoverSide,
  type PopoverAlign,
} from '../../hooks/useAnchorPosition';

// ============================================================================
// DropdownMenu Context
// ============================================================================

/**
 * Size variant for DropdownMenu content
 * - 1: Small - compact padding, smaller fonts
 * - 2: Medium - default padding and font sizes
 * - 3: Large - generous padding, large fonts
 * - 4: Larger - generous padding, larger fonts
 */
export type DropdownMenuSize = 1 | 2 | 3 | 4;

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale;
  openSubmenu: string | null;
  onOpenSubmenu: (id: string | null) => void;
  anchorRef: React.RefObject<View | null>;
  anchorPosition: AnchorPosition;
  measureAnchor: () => void;
  size: DropdownMenuSize;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenu.Root');
  }
  return context;
};

// ============================================================================
// DropdownMenu.Root - Main component
// ============================================================================

interface DropdownMenuRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export const DropdownMenuRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: DropdownMenuRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [controlledOpen, onOpenChange]);

  const theme = useTheme();
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const radii = theme.radii;
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { anchorRef, anchorPosition, measureAnchor } = useAnchorPosition();

  // Default size is 2, will be overridden by DropdownMenuContent
  const [size, setSize] = useState<DropdownMenuSize>(2);

  return (
    <DropdownMenuContext.Provider value={{
      open,
      onOpenChange: handleOpenChange,
      colors,
      radii,
      openSubmenu,
      onOpenSubmenu: setOpenSubmenu,
      anchorRef,
      anchorPosition,
      measureAnchor,
      size,
    }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

// ============================================================================
// DropdownMenu.Trigger - The button that opens the menu
// ============================================================================

interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const DropdownMenuTrigger = ({ children, asChild = true }: DropdownMenuTriggerProps) => {
  const { onOpenChange, open, anchorRef, measureAnchor } = useDropdownMenu();

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
// DropdownMenu.TriggerIcon - Icon button trigger
// ============================================================================

import { IconButton } from '../forms/IconButton';

/**
 * Default down chevron icon for dropdown menu trigger
 * Uses Unicode character for React Native compatibility
 */
const ChevronDownIcon = ({ size, color }: { size?: number; color?: string }) => (
  <Text style={{
    fontSize: size || 16,
    color: color || 'currentColor',
    lineHeight: size ? size + 2 : 18,
  }}>
    ▾
  </Text>
);

interface DropdownMenuTriggerIconProps {
  /**
   * Custom icon to render (defaults to down chevron ▾)
   */
  icon?: React.ReactNode;
  /**
   * Button variant
   * @default 'ghost'
   */
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
  /**
   * Color scheme for the button
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Button size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Accessibility label (required for accessibility)
   * @default 'Open menu'
   */
  accessibilityLabel?: string;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Additional style for the button
   */
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuTriggerIcon = ({
  icon,
  variant = 'ghost',
  color,
  size = 2,
  disabled,
  accessibilityLabel = 'Open menu',
  highContrast,
  style,
}: DropdownMenuTriggerIconProps) => {
  const { onOpenChange, open, anchorRef, measureAnchor } = useDropdownMenu();

  const handlePress = () => {
    measureAnchor();
    onOpenChange(!open);
  };

  const defaultIcon = <ChevronDownIcon />;

  return (
    <IconButton
      ref={anchorRef as React.RefObject<React.ElementRef<typeof IconButton>>}
      icon={icon || defaultIcon}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      highContrast={highContrast}
      style={style}
    />
  );
};

// ============================================================================
// DropdownMenu.Portal - Renders menu in modal
// ============================================================================

interface DropdownMenuPortalProps {
  children: ReactNode;
}

export const DropdownMenuPortal = ({ children }: DropdownMenuPortalProps) => {
  const { open } = useDropdownMenu();

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
// DropdownMenu.Overlay - Backdrop
// ============================================================================

interface DropdownMenuOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuOverlay = ({ style }: DropdownMenuOverlayProps) => {
  const { onOpenChange } = useDropdownMenu();

  return (
    <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
      <View style={[styles.overlay, style]} />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// DropdownMenu.Content - The menu content
// ============================================================================

export type { PopoverSide as DropdownMenuSide, PopoverAlign as DropdownMenuAlign };

interface DropdownMenuContentProps {
  children: ReactNode;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  avoidCollisions?: boolean;
  /**
   * Size of the dropdown menu content
   * @default 2
   */
  size?: DropdownMenuSize;
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  avoidCollisions = true,
  size = 2,
  style,
}: DropdownMenuContentProps) => {
  const { colors, radii, anchorPosition } = useDropdownMenu();
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

  // Create a new context with the size value for children
  const contextValue = useDropdownMenu();
  const contextWithSize = { ...contextValue, size };

  return (
    <TouchableWithoutFeedback>
      <DropdownMenuContext.Provider value={contextWithSize}>
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
              // Apply size-based styles
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
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
      </DropdownMenuContext.Provider>
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// DropdownMenu.Group - Groups menu items
// ============================================================================

interface DropdownMenuGroupProps {
  children: ReactNode;
}

export const DropdownMenuGroup = ({ children }: DropdownMenuGroupProps) => {
  return <View>{children}</View>;
};

// ============================================================================
// DropdownMenu.Item - Individual menu item
// ============================================================================

interface DropdownMenuItemProps {
  children: ReactNode;
  color?: Color;
  onSelect?: () => void;
  disabled?: boolean;
  shortcut?: string;
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuItem = ({
  children,
  color,
  onSelect,
  disabled = false,
  shortcut,
  style,
}: DropdownMenuItemProps) => {
  const { colors, onOpenChange, size } = useDropdownMenu();
  const theme = useTheme();
  const mode = useThemeMode();
  const activeColor = color || theme.accentColor;
  const itemVariant = 'solid';
  const itemHighContrast = false;
  const variantColors = getVariantColors(
    theme,
    activeColor,
    mode,
    itemVariant,
    itemHighContrast
  );

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
  }, [size, theme.typography.fontSizes, activeColor]);

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
  }, [size, theme.space, activeColor]);

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  const itemPadding = getItemPadding();
  const fontSize = getFontSize();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.item,
        disabled && styles.itemDisabled,
        { backgroundColor: disabled ? 'transparent' : 'transparent' },
        itemPadding,
        style,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
    >
      <Text
        color={color}
        style={[
          {
            // color: disabled ? colors[8] : '',
            fontSize,
            flex: 1,
          },
        ]}
      >
        {children}
      </Text>
      {shortcut && (
        <Text style={{ color: theme.colors.gray['11'], fontSize: fontSize * 0.95 }}>
          {shortcut}
        </Text>
      )}
    </Pressable>
  );
};

// ============================================================================
// DropdownMenu.Separator - Visual divider
// ============================================================================

interface DropdownMenuSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuSeparator = ({ style }: DropdownMenuSeparatorProps) => {
  const { colors } = useDropdownMenu();

  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: colors[6] },
        style,
      ]}
    />
  );
};

// ============================================================================
// DropdownMenu.Label - Section label
// ============================================================================

interface DropdownMenuLabelProps {
  children: ReactNode;
  style?: TextStyle;
}

export const DropdownMenuLabel = ({ children, style = {} }: DropdownMenuLabelProps) => {
  const { colors, size } = useDropdownMenu();
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
// DropdownMenu.CheckboxItem - Checkable menu item
// ============================================================================

interface DropdownMenuCheckboxItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  shortcut?: string;
}

export const DropdownMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
  disabled = false,
  shortcut,
}: DropdownMenuCheckboxItemProps) => {
  const { colors, size } = useDropdownMenu();
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
    <DropdownMenuItem
      onSelect={() => onCheckedChange(!checked)}
      disabled={disabled}
      shortcut={shortcut}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    </DropdownMenuItem>
  );
};

// ============================================================================
// DropdownMenu.RadioItem - Radio menu item
// ============================================================================

interface DropdownMenuRadioItemProps {
  children: ReactNode;
  value: string;
  checked: boolean;
  onCheckedChange: (value: string) => void;
  disabled?: boolean;
}

export const DropdownMenuRadioItem = ({
  children,
  value,
  checked,
  onCheckedChange,
  disabled = false,
}: DropdownMenuRadioItemProps) => {
  const { colors, size } = useDropdownMenu();
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
      style={[
        styles.item,
        disabled && styles.itemDisabled,
        itemPadding,
      ]}
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
// Submenu components
// ============================================================================

interface DropdownMenuSubProps {
  children: ReactNode;
}

export const DropdownMenuSub = ({ children }: DropdownMenuSubProps) => {
  return <View>{children}</View>;
};

interface DropdownMenuSubTriggerProps {
  children: ReactNode;
}

export const DropdownMenuSubTrigger = ({ children }: DropdownMenuSubTriggerProps) => {
  const { colors, openSubmenu, onOpenSubmenu, size } = useDropdownMenu();
  const theme = useTheme();
  const submenuId = 'submenu'; // In a real implementation, this would be unique

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

  const handlePress = () => {
    onOpenSubmenu(openSubmenu === submenuId ? null : submenuId);
  };

  const itemPadding = getItemPadding();
  const fontSize = getFontSize();

  return (
    <Pressable onPress={handlePress} style={[styles.item, itemPadding]}>
      <Text style={{ color: colors[12], flex: 1, fontSize }}>{children}</Text>
      <Text style={{ color: colors[8], fontSize }}>›</Text>
    </Pressable>
  );
};

interface DropdownMenuSubContentProps {
  children: ReactNode;
}

export const DropdownMenuSubContent = ({ children }: DropdownMenuSubContentProps) => {
  const { colors, radii, size } = useDropdownMenu();
  const theme = useTheme();

  // Get size-based styles
  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 1:
        return {
          paddingVertical: theme.space[1],
          minWidth: 120,
        };
      case 3:
        return {
          paddingVertical: theme.space[3],
          minWidth: 200,
        };
      case 2:
      default:
        return {
          paddingVertical: theme.space[2],
          minWidth: 160,
        };
    }
  }, [size, theme.space]);

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors[1],
          borderRadius: radii.medium,
          borderWidth: 1,
          borderColor: colors[6],
          paddingVertical: sizeStyles.paddingVertical,
          minWidth: sizeStyles.minWidth,
          position: 'absolute',
          left: '100%',
          top: 0,
          marginLeft: 4,
        },
      ]}
    >
      {children}
    </View>
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
// Export all DropdownMenu components
// ============================================================================

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  TriggerIcon: DropdownMenuTriggerIcon,
  Portal: DropdownMenuPortal,
  Overlay: DropdownMenuOverlay,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};

export type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuTriggerIconProps,
  DropdownMenuPortalProps,
  DropdownMenuOverlayProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
};
