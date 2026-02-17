import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type ComponentRef,
} from 'react';
import {
  StyleSheet,
  type ViewStyle,
  type StyleProp,
  Animated,
  type LayoutChangeEvent,
} from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';
import { ChevronDownIcon } from '../utilities/icons';

// ============================================================================
// Types
// ============================================================================

type AccordionType = 'single' | 'multiple';
type AccordionSize = '1' | '2' | '3';
type Direction = 'ltr' | 'rtl';

// ============================================================================
// Accordion Context
// ============================================================================

interface AccordionContextValue {
  type: AccordionType;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  collapsible: boolean;
  disabled: boolean;
  dir: Direction;
  size: AccordionSize;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.Root');
  }
  return context;
};

// ============================================================================
// Accordion Item Context
// ============================================================================

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Item components must be used within an Accordion.Item');
  }
  return context;
};

// ============================================================================
// Accordion.Root
// ============================================================================

interface AccordionRootProps {
  /**
   * Type of accordion - single allows one item open, multiple allows many
   */
  type: AccordionType;
  /**
   * Children (Accordion.Item components)
   */
  children: ReactNode;
  /**
   * Controlled value(s) of open items
   */
  value?: string | string[];
  /**
   * Default uncontrolled value(s)
   */
  defaultValue?: string | string[];
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * When type is single, allows closing the open item
   * @default false
   */
  collapsible?: boolean;
  /**
   * Disable all items
   * @default false
   */
  disabled?: boolean;
  /**
   * Direction for chevron rotation
   * @default 'ltr'
   */
  dir?: Direction;
  /**
   * Size variant
   * @default '2'
   */
  size?: AccordionSize;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const AccordionRoot = React.forwardRef<
  ComponentRef<typeof View>,
  AccordionRootProps
>(
  (
    {
      type,
      children,
      value: controlledValue,
      defaultValue,
      onValueChange,
      collapsible = false,
      disabled = false,
      dir = 'ltr',
      size = '2',
      style,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue || (type === 'multiple' ? [] : '')
    );

    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = useCallback(
      (newValue: string | string[]) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const contextValue: AccordionContextValue = {
      type,
      value: currentValue,
      onValueChange: handleValueChange,
      collapsible,
      disabled,
      dir,
      size,
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.root, style]} accessibilityRole="list">
          {children}
        </View>
      </AccordionContext.Provider>
    );
  }
);

AccordionRoot.displayName = 'Accordion.Root';

// ============================================================================
// Accordion.Item
// ============================================================================

interface AccordionItemProps {
  /**
   * Unique value identifier for this item
   */
  value: string;
  /**
   * Children (Header and Content components)
   */
  children: ReactNode;
  /**
   * Disable this specific item
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const AccordionItem = React.forwardRef<
  ComponentRef<typeof View>,
  AccordionItemProps
>(({ value, children, disabled = false, style }, ref) => {
  const context = useAccordionContext();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayAlpha = getGrayAlpha(theme);

  const isOpen = context.type === 'single'
    ? context.value === value
    : Array.isArray(context.value) && context.value.includes(value);

  const isDisabled = context.disabled || disabled;

  const itemContextValue: AccordionItemContextValue = {
    value,
    open: isOpen,
    disabled: isDisabled,
  };

  const itemStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? grayAlpha['6'] : grayAlpha['7'],
    opacity: isDisabled ? 0.5 : 1,
  };

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <View
        ref={ref}
        style={[styles.item, itemStyle, style]}
        accessibilityRole="list"
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
});

AccordionItem.displayName = 'Accordion.Item';

// ============================================================================
// Accordion.Header
// ============================================================================

interface AccordionHeaderProps {
  /**
   * Children (Accordion.Trigger component)
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const AccordionHeader = React.forwardRef<
  ComponentRef<typeof View>,
  AccordionHeaderProps
>(({ children, style }, ref) => {
  return (
    <View ref={ref} style={[styles.header, style]}>
      {children}
    </View>
  );
});

AccordionHeader.displayName = 'Accordion.Header';

// ============================================================================
// Accordion.Trigger
// ============================================================================

interface AccordionTriggerProps {
  /**
   * Trigger text/content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom chevron icon
   */
  icon?: ReactNode;
}

const AccordionTrigger = React.forwardRef<
  ComponentRef<typeof TouchableOpacity>,
  AccordionTriggerProps
>(({ children, style, icon }, ref) => {
  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const { value, open, disabled } = itemContext;
  const { size, dir, collapsible, type, onValueChange } = accordionContext;

  const grayAlpha = getGrayAlpha(theme);

  // Animation for chevron rotation
  const rotationAnim = useRef(new Animated.Value(open ? 1 : 0)).current;

  // Animate rotation when open state changes
  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [open, rotationAnim]);

  // Size-based styling
  const getSizeStyles = () => {
    switch (size) {
      case '1':
        return {
          paddingVertical: theme.space[2],
          paddingHorizontal: theme.space[3],
          fontSize: theme.typography.fontSizes[1].fontSize,
          lineHeight: theme.typography.fontSizes[1].lineHeight,
          iconSize: 14,
        };
      case '3':
        return {
          paddingVertical: theme.space[4],
          paddingHorizontal: theme.space[5],
          fontSize: theme.typography.fontSizes[4].fontSize,
          lineHeight: theme.typography.fontSizes[4].lineHeight,
          iconSize: 20,
        };
      case '2':
      default:
        return {
          paddingVertical: theme.space[3],
          paddingHorizontal: theme.space[4],
          fontSize: theme.typography.fontSizes[2].fontSize,
          lineHeight: theme.typography.fontSizes[2].lineHeight,
          iconSize: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handlePress = () => {
    if (disabled) return;

    if (type === 'single') {
      if (open && collapsible) {
        onValueChange('');
      } else if (!open) {
        onValueChange(value);
      }
    } else {
      // Multiple type
      const currentValue = Array.isArray(accordionContext.value)
        ? accordionContext.value
        : [];
      if (open) {
        onValueChange(currentValue.filter((v) => v !== value));
      } else {
        onValueChange([...currentValue, value]);
      }
    }
  };

  // RTL support for rotation
  const rtlRotationInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: dir === 'rtl' ? ['0deg', '-180deg'] : ['0deg', '180deg'],
  });

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    width: '100%',
  };

  // Get text color based on state
  const getTextColor = () => {
    return isDark ? grayAlpha['12'] : grayAlpha['12'];
  };

  // Get icon color
  const getIconColor = () => {
    return isDark ? grayAlpha['11'] : grayAlpha['11'];
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[triggerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
      accessibilityLabel={`Toggle ${typeof children === 'string' ? children : 'accordion item'}`}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            flex: 1,
            fontSize: sizeStyles.fontSize,
            lineHeight: sizeStyles.lineHeight,
            color: getTextColor(),
            fontWeight: open ? '600' : '500',
          }}
        >
          {children}
        </Text>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {icon ? (
        icon
      ) : (
        <Animated.View
          style={{
            transform: [{ rotate: rtlRotationInterpolate }],
            marginLeft: theme.space[2],
          }}
        >
          <ChevronDownIcon
            width={sizeStyles.iconSize}
            height={sizeStyles.iconSize}
            color={getIconColor()}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
});

AccordionTrigger.displayName = 'Accordion.Trigger';

// ============================================================================
// Accordion.Content
// ============================================================================

interface AccordionContentProps {
  /**
   * Content to show/hide
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const AccordionContent = React.forwardRef<
  ComponentRef<typeof View>,
  AccordionContentProps
>(({ children, style }, ref) => {
  const itemContext = useAccordionItemContext();
  const accordionContext = useAccordionContext();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const { open } = itemContext;
  const { size } = accordionContext;

  const grayAlpha = getGrayAlpha(theme);

  // Track content height
  const [contentHeight, setContentHeight] = useState(0);

  // Animation value for height
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Animation value for opacity
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Size-based padding
  const getContentPadding = () => {
    switch (size) {
      case '1':
        return theme.space[2];
      case '3':
        return theme.space[5];
      case '2':
      default:
        return theme.space[4];
    }
  };

  // Handle content layout to get height
  const handleLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
    }
  };

  // Animate when open state or content height changes
  useEffect(() => {
    if (open && contentHeight > 0) {
      // Opening animation
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: contentHeight,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (!open && contentHeight > 0) {
      // Closing animation
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [open, contentHeight, heightAnim, opacityAnim]);

  const contentPadding = getContentPadding();

  const contentStyle: ViewStyle = {
    paddingVertical: contentPadding,
    paddingHorizontal: contentPadding,
  };

  return (
    <Animated.View
      style={[
        styles.contentWrapper,
        {
          height: contentHeight > 0 ? heightAnim : undefined,
          opacity: opacityAnim,
          overflow: 'hidden',
        },
      ]}
    >
      <View
        ref={ref}
        style={[styles.content, contentStyle, style]}
        onLayout={handleLayout}
        accessibilityState={{ expanded: open }}
      >
        {typeof children === 'string' ? (
          <Text
            style={{
              color: isDark ? grayAlpha['11'] : grayAlpha['11'],
              fontSize: theme.typography.fontSizes[2].fontSize,
              lineHeight: theme.typography.fontSizes[2].lineHeight,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Animated.View>
  );
});

AccordionContent.displayName = 'Accordion.Content';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  item: {
    width: '100%',
  },
  header: {
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
  },
  content: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

// ============================================================================
// Compound Component Export
// ============================================================================

interface AccordionCompoundComponent {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
}

const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
} as AccordionCompoundComponent;

export {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
};

export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionType,
  AccordionSize,
};
