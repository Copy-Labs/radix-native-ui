import React, { type ReactNode, createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, type StyleProp, ViewStyle, type LayoutChangeEvent, Animated, Easing } from 'react-native';
import { View, TouchableOpacity } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { BaseColorScale, Color, RadiusSize } from '../../theme';

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
  } = useSegmentedControlContext();

  const isSelected = value === selectedValue;
  const isDisabled = disabled || itemDisabled;

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      onValueChange(value);
    }
  }, [isDisabled, onValueChange, value]);

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
      ? grayAlpha['8']
      : color
        ? (isSelected ? solidVariantColors.textColor : softVariantColors.textColor)
        : (isSelected ? grayScale[12] : grayAlpha[10]),
    fontWeight: isSelected ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.regular,
    fontSize: sizeValues.fontSize,
  };

  return (
    <TouchableOpacity
      style={optionStyle}
      onPress={handlePress}
      onLayout={handleLayout}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
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
}

const SegmentedControlRoot = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  disabled = false,
  color,
  radius = 'medium',
  size = 3,
  style,
  highContrast = false,
  children,
}: SegmentedControlRootProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius] ?? theme.radii.medium;
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
    : theme.colors.gray['1'];

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
            backgroundColor: color ? softVariantColors.backgroundColor : grayAlpha['3'],
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
export type { SegmentedControlRootProps, SegmentedControlItemProps };
