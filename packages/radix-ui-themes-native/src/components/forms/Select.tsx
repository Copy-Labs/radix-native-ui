import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  type StyleProp,
  ViewStyle,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  TextStyle,
  ScrollView,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { BaseColorScale, type Color, ColorScale, RadiusScale } from '../../theme';
import {
  useAnchorPosition,
  calculatePopoverPosition,
  type AnchorPosition,
  type PopoverSide,
  type PopoverAlign,
} from '../../hooks/useAnchorPosition';
import { ChevronDownIcon } from '../../components/utilities/icons';

// ============================================================================
// Select Context
// ============================================================================

/**
 * Size variant for Select content
 * - 1: Small - compact padding, smaller fonts
 * - 2: Medium - default padding and font sizes
 * - 3: Large - generous padding, large fonts
 * - 4: Larger - generous padding, larger fonts
 */
export type SelectSize = 1 | 2 | 3 | 4;

interface SelectContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale;
  anchorRef: React.RefObject<View | null>;
  anchorPosition: AnchorPosition;
  measureAnchor: () => void;
  size: SelectSize;
  // For Select.Value to know the selected item text
  selectedItemText: string;
  setSelectedItemText: (text: string) => void;
  // Track all items for Select.Value
  itemTexts: Map<string, string>;
  registerItem: (value: string, text: string) => void;
  unregisterItem: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select.Root');
  }
  return context;
};

// ============================================================================
// Select.Root - Main component
// ============================================================================

interface SelectRootProps {
  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Current value (controlled mode)
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Whether the select is open (controlled mode)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the select is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Child components
   */
  children: ReactNode;
}

export const SelectRoot = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  disabled = false,
  children,
}: SelectRootProps) => {
  // Uncontrolled vs controlled state for open
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlledOpen = controlledOpen !== undefined;
  const open = isControlledOpen ? controlledOpen : internalOpen;

  // Uncontrolled vs controlled state for value
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlledValue = controlledValue !== undefined;
  const value = isControlledValue ? controlledValue! : internalValue;

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!isControlledOpen) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlledOpen, onOpenChange]);

  const handleValueChange = useCallback((newValue: string) => {
    if (!isControlledValue) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    // Close the select when a value is selected
    handleOpenChange(false);
  }, [isControlledValue, onValueChange, handleOpenChange]);

  const theme = useTheme();
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const radii = theme.radii;
  const { anchorRef, anchorPosition, measureAnchor } = useAnchorPosition();

  // Default size is 2, will be overridden by SelectContent
  const [size, setSize] = useState<SelectSize>(2);

  // Track selected item text for Select.Value
  const [selectedItemText, setSelectedItemText] = useState<string>('');

  // Track all registered items - use state so changes trigger re-renders
  const [itemTexts, setItemTexts] = useState<Map<string, string>>(new Map());

  const registerItem = useCallback((itemValue: string, text: string) => {
    setItemTexts(prev => {
      const newMap = new Map(prev);
      newMap.set(itemValue, text);
      return newMap;
    });
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setItemTexts(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemValue);
      return newMap;
    });
  }, []);

  // Pre-register items from children on mount so Select.Value can display defaultValue text
  React.useEffect(() => {
    // Helper to extract text from children (same as in SelectItem)
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (!node) return '';
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (React.isValidElement(node) && node.props.children) {
        return extractText(node.props.children);
      }
      return '';
    };

    // Walk through children and register SelectItem components
    const walkChildren = (node: ReactNode) => {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walkChildren);
        return;
      }
      if (React.isValidElement(node)) {
        // Check if this is a SelectItem (has value prop and children)
        if (node.props && 'value' in node.props && node.props.children) {
          const itemValue = node.props.value;
          const itemText = extractText(node.props.children);
          if (itemValue && itemText) {
            registerItem(String(itemValue), itemText);
          }
        }
        // Recursively walk children
        if (node.props.children) {
          walkChildren(node.props.children);
        }
      }
    };

    walkChildren(children);
  }, [children, registerItem]);

  // Initialize selectedItemText from defaultValue when items are registered
  React.useEffect(() => {
    if (defaultValue && itemTexts.size > 0 && !selectedItemText) {
      const text = itemTexts.get(defaultValue);
      if (text) {
        setSelectedItemText(text);
      }
    }
  }, [defaultValue, itemTexts, selectedItemText, setSelectedItemText]);

  return (
    <SelectContext.Provider value={{
      open,
      onOpenChange: handleOpenChange,
      value,
      onValueChange: handleValueChange,
      disabled,
      colors,
      radii,
      anchorRef,
      anchorPosition,
      measureAnchor,
      size,
      selectedItemText,
      setSelectedItemText,
      itemTexts: itemTexts,
      registerItem,
      unregisterItem,
    }}>
      {children}
    </SelectContext.Provider>
  );
};

// ============================================================================
// Select.Trigger - The button that opens the select
// ============================================================================

interface SelectTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const SelectTrigger = ({ children, asChild = true }: SelectTriggerProps) => {
  const { onOpenChange, open, anchorRef, measureAnchor, disabled } = useSelect();

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
        if (!disabled) {
          handlePress();
        }
      },
    });
  }

  return (
    <Pressable ref={anchorRef} onPress={handlePress} disabled={disabled}>
      {children}
    </Pressable>
  );
};

// ============================================================================
// Select.Value - Displays the selected value
// ============================================================================

interface SelectValueProps {
  placeholder?: string;
  style?: TextStyle;
}

export const SelectValue = ({ placeholder = 'Select an option', style }: SelectValueProps) => {
  const { value, itemTexts, selectedItemText, colors, size } = useSelect();

  // Priority: selectedItemText > itemTexts lookup > placeholder
  // selectedItemText persists even when the dropdown closes (itemTexts gets cleared)
  const selectedText = selectedItemText || (value ? itemTexts.get(value) : undefined);

  const sizeStyles = () => {
    switch (size) {
      case 1: return 14;
      case 2: return 16;
      case 3: return 20;
      case 4: return 24;
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
      <Text style={[
        { color: selectedText ? colors[12] : colors[9], flex: 1, flexShrink: 1 },
        style || {}
      ]}>
        {selectedText || placeholder}
      </Text>
      <ChevronDownIcon color={selectedText ? colors[12] : colors[9]} width={sizeStyles()} height={sizeStyles()} style={{ justifyContent: 'center' }} />
    </View>
  );
};

// ============================================================================
// Select.Portal - Renders content in modal
// ============================================================================

interface SelectPortalProps {
  children: ReactNode;
}

export const SelectPortal = ({ children }: SelectPortalProps) => {
  const { open } = useSelect();

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
// Select.Overlay - Backdrop
// ============================================================================

interface SelectOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const SelectOverlay = ({ style }: SelectOverlayProps) => {
  const { onOpenChange } = useSelect();

  return (
    <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
      <View style={[styles.overlay, style]} />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Select.Content - The dropdown content
// ============================================================================

export type { PopoverSide as SelectSide, PopoverAlign as SelectAlign };

interface SelectContentProps {
  children: ReactNode;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  avoidCollisions?: boolean;
  size?: SelectSize;
  style?: StyleProp<ViewStyle>;
}

export const SelectContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  avoidCollisions = true,
  size = 2,
  style,
}: SelectContentProps) => {
  const { colors, radii, anchorPosition } = useSelect();
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
  const contextValue = useSelect();
  const contextWithSize = { ...contextValue, size };

  return (
    <TouchableWithoutFeedback>
      <SelectContext.Provider value={contextWithSize}>
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
        <ScrollView style={{ flex: 1 }}>
            {children}
        </ScrollView>
          </View>
      </SelectContext.Provider>
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Select.Group - Groups select items
// ============================================================================

interface SelectGroupProps {
  children: ReactNode;
}

export const SelectGroup = ({ children }: SelectGroupProps) => {
  return <View>{children}</View>;
};

// ============================================================================
// Select.Item - Individual select item
// ============================================================================

interface SelectItemProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SelectItem = ({
  children,
  value: itemValue,
  disabled = false,
  style,
}: SelectItemProps) => {
  const { value, onValueChange, colors, onOpenChange, size, registerItem, unregisterItem, setSelectedItemText } = useSelect();
  const theme = useTheme();
  const isSelected = value === itemValue;

  // Helper to extract text from children
  const extractText = useCallback((node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node) && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  }, []);

  // Extract text from children for Select.Value
  React.useEffect(() => {
    const text = extractText(children);
    registerItem(itemValue, text);

    return () => unregisterItem(itemValue);
  }, [children, itemValue, registerItem, unregisterItem, extractText]);

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

  const handlePress = () => {
    if (!disabled) {
      // Store the selected item text before closing the dropdown
      // This ensures Select.Value can display the text even after items unmount
      const text = extractText(children);
      setSelectedItemText(text);
      onValueChange(itemValue);
    }
  };

  const itemPadding = getItemPadding();
  const fontSize = getFontSize();
  const accentColor = theme.accentColor;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.item,
        disabled && styles.itemDisabled,
        itemPadding,
        style,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Text
          style={[
            {
              color: disabled ? colors[8] : isSelected ? accentColor : colors[12],
              fontSize,
              flex: 1,
            },
          ]}
        >
          {children}
        </Text>
        {isSelected && (
          <Text style={{ color: accentColor, fontSize, marginLeft: theme.space[2] }}>✓</Text>
        )}
      </View>
    </Pressable>
  );
};

// ============================================================================
// Select.Separator - Visual divider
// ============================================================================

interface SelectSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const SelectSeparator = ({ style }: SelectSeparatorProps) => {
  const { colors } = useSelect();

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
// Select.Label - Section label
// ============================================================================

interface SelectLabelProps {
  children: ReactNode;
  style?: TextStyle;
}

export const SelectLabel = ({ children, style = {} }: SelectLabelProps) => {
  const { colors, size } = useSelect();
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
});

// ============================================================================
// Export all Select components
// ============================================================================

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Portal: SelectPortal,
  Overlay: SelectOverlay,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
  Value: SelectValue,
};

export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectPortalProps,
  SelectOverlayProps,
  SelectContentProps,
  SelectItemProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectValueProps,
};
