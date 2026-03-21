import React, { type ReactNode, createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, isValidElement, type ReactElement } from 'react';
import { StyleSheet, type StyleProp, ViewStyle, TextStyle, type LayoutChangeEvent, Animated, Easing, Vibration } from 'react-native';
import { View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode, useHaptics } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { BaseColorScale, Color, RadiusSize } from '../../theme';
import AnimatedPressable from '../primitives/AnimatedPressable';
import { triggerHaptic } from '../../utils';

// ============================================================================
// Context
// ============================================================================

interface SegmentedControlContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  size: 1 | 2 | 3 | 4;
  color?: Color;
  radius?: RadiusSize;
  highContrast?: boolean;
  isDark: boolean;
  grayScale: BaseColorScale;
  grayAlpha: BaseColorScale;
  activeColor: Color;
  radii: number;
  selectedRadius: RadiusSize;
  solidVariantColors: { backgroundColor: string; textColor: string };
  softVariantColors: { backgroundColor: string; textColor: string };
  sizeValues: {
    height: number;
    fontSize: number;
    paddingHorizontal: number;
  };
  onItemLayout: (value: string, event: LayoutChangeEvent) => void;
  theme: ReturnType<typeof useTheme>;
  pillBackgroundColor: string;
  hapticFeedback: boolean;
  globalHaptics: boolean;
  // For Value component
  itemValue: string | null;
  isItemSelected: boolean;
  itemDisabled: boolean;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext() {
  const context = useContext(SegmentedControlContext);
  if (!context) {
    throw new Error('SegmentedControl.Item must be used within SegmentedControl.Root');
  }
  return context;
}

// ============================================================================
// Value Component
// ============================================================================

interface SegmentedControlValueProps {
  /**
   * Content to display (typically text)
   */
  children: ReactNode;
}

const SegmentedControlValue = ({ children }: SegmentedControlValueProps) => {
  const {
    value: selectedValue,
    color,
    isDark,
    grayScale,
    activeColor,
    solidVariantColors,
    softVariantColors,
    sizeValues,
    theme,
    itemValue,
    isItemSelected,
    itemDisabled,
  } = useSegmentedControlContext();

  const textStyle = {
    color: itemDisabled
      ? grayScale['9']
      : color
        ? (isItemSelected ? solidVariantColors.textColor : softVariantColors.textColor)
        : (isItemSelected ? grayScale[12] : grayScale[10]),
    fontWeight: isItemSelected ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.regular,
    fontSize: sizeValues.fontSize,
  };

  return <Text style={textStyle}>{children}</Text>;
};

SegmentedControlValue.displayName = 'SegmentedControlValue';

// ============================================================================
// Icon Component
// ============================================================================

interface SegmentedControlIconProps {
  /**
   * Icon element to display
   */
  children: ReactElement;
}

const SegmentedControlIcon = ({ children }: SegmentedControlIconProps) => {
  const {
    color,
    isDark,
    grayScale,
    activeColor,
    solidVariantColors,
    softVariantColors,
    sizeValues,
    itemValue,
    isItemSelected,
    itemDisabled,
  } = useSegmentedControlContext();

  // Calculate the icon color based on selection state
  const iconColor = itemDisabled
    ? grayScale['9']
    : color
      ? (isItemSelected ? solidVariantColors.textColor : softVariantColors.textColor)
      : (isItemSelected ? grayScale[12] : grayScale[10]);

  // Get the appropriate size for the icon based on the segment size
  const iconSize = sizeValues.fontSize;

  // Clone the icon element with the appropriate color and size
  const iconElement = React.cloneElement(children, {
    ...children.props,
    color: iconColor,
    size: children.props.size ?? iconSize,
  } as any);

  return iconElement;
};

SegmentedControlIcon.displayName = 'SegmentedControlIcon';

// ============================================================================
// Item Component
// ============================================================================

interface SegmentedControlItemProps {
  /**
   * Unique value for this item
   */
  value: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
  /**
   * Content to display (can include icons, text, etc.)
   */
  children: ReactNode;
}

// Create a nested context for Item to Value communication
interface SegmentedControlItemContextValue {
  itemValue: string;
  isSelected: boolean;
  isDisabled: boolean;
}

const SegmentedControlItemContext = createContext<SegmentedControlItemContextValue | null>(null);

function useSegmentedControlItemContext() {
  return useContext(SegmentedControlItemContext);
}

const SegmentedControlItem = ({
  value,
  disabled: itemDisabled,
  children,
}: SegmentedControlItemProps) => {
  const {
    value: selectedValue,
    onValueChange,
    disabled,
    sizeValues,
    isDark,
    grayScale,
    grayAlpha,
    activeColor,
    radii,
    selectedRadius,
    softVariantColors,
    solidVariantColors,
    color,
    onItemLayout,
    theme,
    pillBackgroundColor,
    hapticFeedback,
    globalHaptics,
  } = useSegmentedControlContext();

  const isSelected = value === selectedValue;
  const isDisabled = disabled || itemDisabled;

  // Check if children is a SegmentedControlValue or SegmentedControlIcon element
  const hasValueChild = isValidElement(children) &&
    (children.type as any)?.displayName === 'SegmentedControlValue';
  const hasIconChild = isValidElement(children) &&
    (children.type as any)?.displayName === 'SegmentedControlIcon';

  // Create item context for nested Value component
  const itemContextValue: SegmentedControlItemContextValue = {
    itemValue: value,
    isSelected,
    isDisabled,
  };

  // Merge with parent context for Value component
  const mergedContext = {
    ...useSegmentedControlContext(),
    itemValue: value,
    isItemSelected: isSelected,
    itemDisabled: isDisabled,
  };

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      onValueChange(value);
      // Trigger haptic feedback on selection
      if (globalHaptics && hapticFeedback) {
        triggerHaptic('press')
      }
    }
  }, [isDisabled, onValueChange, value, globalHaptics, hapticFeedback]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    onItemLayout(value, event);
  }, [onItemLayout, value]);

  const optionStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: sizeValues.paddingHorizontal,
    opacity: isDisabled ? 0.5 : 1,
  };

  const textStyle = {
    color: isDisabled
      ? grayScale['9']
      : color
        ? (isSelected ? solidVariantColors.textColor : softVariantColors.textColor)
        : (isSelected ? grayScale[12] : grayScale[10]),
    fontWeight: isSelected ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.regular,
    fontSize: sizeValues.fontSize,
  };

  return (
    <SegmentedControlItemContext.Provider value={itemContextValue}>
      <SegmentedControlContext.Provider value={mergedContext}>
        <AnimatedPressable
          style={optionStyle}
          onPress={handlePress}
          onLayout={handleLayout}
          disabled={isDisabled}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected, disabled: isDisabled }}
          pressedScale={0.975}
          pressedOpacity={0.9}
          animationDuration={100}
          hapticFeedback={false}
        >
          {/* If children is a Value or Icon component, render it directly; otherwise wrap in Text */}
          {hasValueChild || hasIconChild ? children : <Text style={textStyle}>{children}</Text>}
        </AnimatedPressable>
      </SegmentedControlContext.Provider>
    </SegmentedControlItemContext.Provider>
  );
};

SegmentedControlItem.displayName = 'SegmentedControlItem';

// ============================================================================
// Root Component
// ============================================================================

interface SegmentedControlRootProps {
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
   * Whether the entire control is disabled
   */
  disabled?: boolean;
  /**
   * Color scheme for the segmented control
   */
  color?: Color;
  /**
   * Radius variant
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Size variant
   * @default 3
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Child items
   */
  children: ReactNode;
  /**
   * Enable haptic feedback on segment selection
   * @default true
   */
  hapticFeedback?: boolean;
}

const SegmentedControlRoot = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  disabled = false,
  color,
  radius,
  size = 3,
  style,
  highContrast = false,
  children,
  hapticFeedback = true,
}: SegmentedControlRootProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const globalHaptics = useHaptics();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius || theme.radius] ?? theme.radii.medium;
  const selectedRadius = radius || theme.radius;
  const solidVariant = 'solid';
  const softVariant = 'soft';
  const solidVariantColors = getVariantColors(theme, activeColor, mode, solidVariant, highContrast);
  const softVariantColors = getVariantColors(theme, activeColor, mode, softVariant, highContrast);

  // Get size values
  const getSizeValues = () => {
    switch (size) {
      case 1:
        return {
          height: 32,
          fontSize: theme.typography.fontSizes[1].fontSize,
          paddingHorizontal: theme.space[2],
        };
      case 2:
        return {
          height: 36,
          fontSize: theme.typography.fontSizes[2].fontSize,
          paddingHorizontal: theme.space[3],
        };
      case 4:
        return {
          height: 56,
          fontSize: theme.typography.fontSizes[4].fontSize,
          paddingHorizontal: theme.space[5],
        };
      case 3:
      default:
        return {
          height: 44,
          fontSize: theme.typography.fontSizes[3].fontSize,
          paddingHorizontal: theme.space[4],
        };
    }
  };

  const sizeValues = getSizeValues();

  // Uncontrolled vs controlled state
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue! : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  // Item layout tracking for pill animation
  const [itemLayouts, setItemLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const pillPosition = useRef(new Animated.Value(0)).current;

  const handleItemLayout = useCallback((value: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setItemLayouts(prev => {
      const newLayouts = { ...prev, [value]: { x, width } };
      // If this is the selected item, update pill position immediately
      if (value === currentValue) {
        Animated.timing(pillPosition, {
          toValue: x,
          duration: 0,
          useNativeDriver: true,
        }).start();
      }
      return newLayouts;
    });
  }, [currentValue, pillPosition]);

  // Animate pill when value changes
  useEffect(() => {
    const selectedLayout = itemLayouts[currentValue];
    if (selectedLayout) {
      Animated.timing(pillPosition, {
        toValue: selectedLayout.x,
        duration: 250,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [currentValue, itemLayouts, pillPosition]);

  // Determine pill background color
  const pillBackgroundColor = color
    ? solidVariantColors.backgroundColor
    : isDark ? theme.colors.gray.dark['4'] : theme.colors.gray['1'];

  const contextValue: SegmentedControlContextValue = {
    value: currentValue,
    onValueChange: handleValueChange,
    disabled,
    size,
    color,
    radius,
    highContrast,
    isDark,
    grayScale,
    grayAlpha,
    activeColor,
    radii,
    selectedRadius,
    solidVariantColors,
    softVariantColors,
    sizeValues,
    onItemLayout: handleItemLayout,
    theme,
    pillBackgroundColor,
    hapticFeedback,
    globalHaptics,
    // Default values for Value component (overridden by Item when nested)
    itemValue: null,
    isItemSelected: false,
    itemDisabled: false,
  };

  // Calculate pill dimensions
  const selectedLayout = itemLayouts[currentValue];
  const pillWidth = selectedLayout?.width || 0;
  const pillInnerRadius = selectedRadius === 'full' ? 9999 : radii;

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: color ? softVariantColors.backgroundColor : isDark ? grayScale['3'] :grayAlpha['3'],
            borderRadius: radii,
            height: sizeValues.height,
          },
          style,
        ]}
        accessibilityRole="radiogroup"
      >
        {/* Animated Pill Background */}
        <Animated.View
          style={[
            styles.pill,
            {
              transform: [{ translateX: pillPosition }],
              width: pillWidth,
              backgroundColor: pillBackgroundColor,
              borderRadius: pillInnerRadius,
            },
          ]}
        />
        {children}
      </View>
    </SegmentedControlContext.Provider>
  );
};

SegmentedControlRoot.displayName = 'SegmentedControlRoot';

// ============================================================================
// Compound Component
// ============================================================================

const SegmentedControl = {
  Item: SegmentedControlItem,
  Root: SegmentedControlRoot,
  Value: SegmentedControlValue,
  Icon: SegmentedControlIcon,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 1,
  },
  pill: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    // Border simulation for the pill
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
});

export { SegmentedControl };
export type { SegmentedControlRootProps, SegmentedControlItemProps, SegmentedControlValueProps, SegmentedControlIconProps };
