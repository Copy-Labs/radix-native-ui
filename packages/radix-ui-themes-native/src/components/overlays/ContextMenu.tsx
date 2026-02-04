import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { View, StyleSheet, Pressable, type StyleProp, ViewStyle, TextStyle, Modal, Dimensions, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';

// ============================================================================
// ContextMenu Context
// ============================================================================

interface ContextMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale | Record<number, number>;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenu components must be used within a ContextMenu.Provider');
  }
  return context;
};

// ============================================================================
// ContextMenu.Provider - Wraps the app and provides context
// ============================================================================

interface ContextMenuProviderProps {
  children: ReactNode;
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps) => {
  const theme = useTheme();
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const radii = theme.radii;
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <ContextMenuContext.Provider value={{ open, onOpenChange, position, setPosition, colors, radii }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// ============================================================================
// ContextMenu.Root - Manages menu state
// ============================================================================

interface ContextMenuRootProps {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export const ContextMenuRoot = ({
  children,
  onOpenChange,
}: ContextMenuRootProps) => {
  const theme = useTheme();
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const radii = theme.radii;
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  return (
    <ContextMenuContext.Provider value={{ open, onOpenChange: handleOpenChange, position, setPosition, colors, radii }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// ============================================================================
// ContextMenu.Trigger - Wraps content that shows context menu on long press
// ============================================================================

interface ContextMenuTriggerProps {
  children: ReactNode;
  onLongPress?: (event: GestureResponderEvent) => void;
}

export const ContextMenuTrigger = ({
  children,
  onLongPress,
}: ContextMenuTriggerProps) => {
  const { setPosition, onOpenChange } = useContextMenuContext();
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setPosition({ x: pageX, y: pageY });
    onOpenChange(true);
    onLongPress?.(event);
  };

  const handlePress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onLongPress: handleLongPress,
      onPress: handlePress,
    });
  }

  return (
    <Pressable onLongPress={handleLongPress} onPress={handlePress}>
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
  const { open } = useContextMenuContext();

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

interface ContextMenuContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuContent = ({ children, style }: ContextMenuContentProps) => {
  const { colors, radii, position } = useContextMenuContext();
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const menuWidth = 200;
  const menuHeight = 200;
  const padding = 16;

  let left = position.x;
  let top = position.y;

  if (left + menuWidth > screenWidth - padding) {
    left = screenWidth - menuWidth - padding;
  }
  if (left < padding) {
    left = padding;
  }
  if (top + menuHeight > screenHeight - padding) {
    top = position.y - menuHeight - padding;
  }
  if (top < padding) {
    top = padding;
  }

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
          maxWidth: screenWidth - 32,
          left,
          top,
        },
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
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuItem = ({
  children,
  onSelect,
  disabled = false,
  destructive = false,
  icon,
  style,
}: ContextMenuItemProps) => {
  const { colors, onOpenChange } = useContextMenuContext();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  const textColor = disabled ? colors[8] : destructive ? '#dc2626' : colors[12];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.item, disabled && styles.itemDisabled, style]}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
    >
      {icon && <View style={{ marginRight: theme.space[2] }}>{icon}</View>}
      <Text style={{ color: textColor, flex: 1, fontSize: theme.typography.fontSizes[2].fontSize }}>
        {children}
      </Text>
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
  const { colors } = useContextMenuContext();
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
// ContextMenu.CheckboxItem - Checkable menu item
// ============================================================================

interface ContextMenuCheckboxItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ContextMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
  disabled = false,
}: ContextMenuCheckboxItemProps) => {
  const { colors } = useContextMenuContext();
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.item, disabled && styles.itemDisabled]}
      accessibilityRole="menuitem"
      accessibilityState={{ checked, disabled }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={[
            styles.checkbox,
            { borderColor: colors[9], backgroundColor: checked ? colors[9] : 'transparent' },
          ]}
        >
          {checked && <Text style={{ color: colors[1], fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2] }}>
          {children}
        </Text>
      </View>
    </Pressable>
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
  const { colors } = useContextMenuContext();
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
      style={[styles.item, disabled && styles.itemDisabled]}
      accessibilityRole="menuitem"
      accessibilityState={{ checked, disabled }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={[
            styles.radio,
            { borderColor: colors[9], backgroundColor: checked ? colors[9] : 'transparent' },
          ]}
        >
          {checked && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors[1] }} />}
        </View>
        <Text style={{ color: disabled ? colors[8] : colors[12], marginLeft: theme.space[2] }}>
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
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.01)' },
  content: {
    position: 'absolute',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10000,
  },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, minHeight: 44 },
  itemDisabled: { opacity: 0.5 },
  separator: { height: 1, marginVertical: 4, marginHorizontal: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 3, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});

// ============================================================================
// Export all ContextMenu components
// ============================================================================

export const ContextMenu = {
  Provider: ContextMenuProvider,
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
  ContextMenuProviderProps,
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
};

export default ContextMenu;
