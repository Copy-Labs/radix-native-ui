import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, Animated, type StyleProp, ViewStyle, Modal, Dimensions, TouchableWithoutFeedback, FlatList,
  TextStyle
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';

// ============================================================================
// DropdownMenu Context
// ============================================================================

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale | Record<number, number>;
  openSubmenu: string | null;
  onOpenSubmenu: (id: string | null) => void;
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

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: handleOpenChange, colors, radii, openSubmenu, onOpenSubmenu: setOpenSubmenu }}>
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
  const { onOpenChange, open } = useDropdownMenu();

  const handlePress = () => {
    onOpenChange(!open);
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
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
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

interface DropdownMenuContentProps {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuContent = ({
  children,
  align = 'start',
  sideOffset = 4,
  style,
}: DropdownMenuContentProps) => {
  const { colors, radii } = useDropdownMenu();
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const getAlignStyle = (): ViewStyle => {
    switch (align) {
      case 'start':
        return { left: 16 };
      case 'end':
        return { right: 16 };
      case 'center':
      default:
        return { left: screenWidth / 2 - 100 };
    }
  };

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors[1],
          borderRadius: radii[3],
          borderWidth: 1,
          borderColor: colors[6],
          minWidth: 200,
          maxWidth: screenWidth - 32,
        },
        getAlignStyle(),
        { top: 80 + sideOffset }, // Below typical header area
        style,
      ]}
    >
      <View style={{ paddingVertical: theme.space[1] }}>
        {children}
      </View>
    </View>
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
  onSelect?: () => void;
  disabled?: boolean;
  shortcut?: string;
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenuItem = ({
  children,
  onSelect,
  disabled = false,
  shortcut,
  style,
}: DropdownMenuItemProps) => {
  const { colors, onOpenChange } = useDropdownMenu();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.item,
        disabled && styles.itemDisabled,
        { backgroundColor: disabled ? 'transparent' : 'transparent' },
        style,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          {
            color: disabled ? colors[8] : colors[12],
            fontSize: theme.typography.fontSizes[2].fontSize,
            flex: 1,
          },
        ]}
      >
        {children}
      </Text>
      {shortcut && (
        <Text style={{ color: colors[8], fontSize: theme.typography.fontSizes[1].fontSize }}>
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
  const { colors } = useDropdownMenu();
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: colors[10],
          fontSize: theme.typography.fontSizes[1].fontSize,
          fontWeight: '600',
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[2],
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
  const { colors } = useDropdownMenu();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

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
              borderColor: colors[9],
              backgroundColor: checked ? colors[9] : 'transparent',
            },
          ]}
        >
          {checked && (
            <Text style={{ color: colors[1], fontSize: 12, fontWeight: 'bold' }}>✓</Text>
          )}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2] }}>
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
  const { colors } = useDropdownMenu();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.item,
        disabled && styles.itemDisabled,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ checked, disabled }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={[
            styles.radio,
            {
              borderColor: colors[9],
              backgroundColor: checked ? colors[9] : 'transparent',
            },
          ]}
        >
          {checked && (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors[1],
              }}
            />
          )}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2] }}>
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
  const { colors, openSubmenu, onOpenSubmenu } = useDropdownMenu();
  const theme = useTheme();
  const submenuId = 'submenu'; // In a real implementation, this would be unique

  const handlePress = () => {
    onOpenSubmenu(openSubmenu === submenuId ? null : submenuId);
  };

  return (
    <Pressable onPress={handlePress} style={styles.item}>
      <Text style={{ color: colors[12], flex: 1 }}>{children}</Text>
      <Text style={{ color: colors[8] }}>›</Text>
    </Pressable>
  );
};

interface DropdownMenuSubContentProps {
  children: ReactNode;
}

export const DropdownMenuSubContent = ({ children }: DropdownMenuSubContentProps) => {
  const { colors, radii } = useDropdownMenu();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors[1],
          borderRadius: radii[3],
          borderWidth: 1,
          borderColor: colors[6],
          minWidth: 180,
          position: 'absolute',
          left: '100%',
          top: 0,
          marginLeft: 4,
        },
      ]}
    >
      <View style={{ paddingVertical: theme.space[1] }}>
        {children}
      </View>
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
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
