import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ComponentRef,
} from 'react';
import {
  StyleSheet,
  type ViewStyle,
  type StyleProp,
  TouchableOpacity as RNTouchableOpacity,
  Vibration,
} from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { useTheme, useThemeMode, useHaptics } from '../../hooks/useTheme';
import {
  getAccentColor,
  getGrayAlpha,
  getVariantColors,
} from '../../theme/color-helpers';
import type { Color, RadiusSize } from '../../theme';
import { Radio } from '../../components';
import AnimatedPressable from '../../components/primitives/AnimatedPressable';
import { triggerHaptic } from '../../utils';

// Context for RadioCards
interface RadioCardsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: 'solid' | 'soft' | 'surface' | 'outline';
  size: '1' | '2' | '3';
  color?: Color;
  highContrast: boolean;
  radius: RadiusSize;
  side: 'left' | 'right';
  disabled: boolean;
}

const RadioCardsContext = createContext<RadioCardsContextValue | null>(null);

const useRadioCardsContext = () => {
  const context = useContext(RadioCardsContext);
  if (!context) {
    throw new Error('RadioCards.Item must be used within a RadioCards.Root');
  }
  return context;
};

// Root Props
interface RadioCardsRootProps {
  /**
   * Selected value (controlled mode)
   */
  value?: string;
  /**
   * Default selected value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Card variant
   * @default 'surface'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  /**
   * Size variant
   * @default '2'
   */
  size?: '1' | '2' | '3';
  /**
   * Custom color
   */
  color?: Color;
  /**
   * High contrast mode
   */
  highContrast?: boolean;
  /**
   * Border radius
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Layout direction
   * @default 'column'
   */
  direction?: 'row' | 'column';
  /**
   * Gap between items
   */
  gap?: number;
  /**
   * Indicator position for all children
   * @default 'right'
   */
  side?: 'left' | 'right';
  /**
   * Whether all items are disabled
   */
  disabled?: boolean;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Children (RadioCards.Item components)
   */
  children: ReactNode;
}

// Item Props
interface RadioCardsItemProps {
  /**
   * Unique value for this item
   */
  value: string;
  /**
   * Indicator position override
   */
  side?: 'left' | 'right';
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Content
   */
  children?: ReactNode;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
}

// Root Component
const RadioCardsRoot = React.forwardRef<
  ComponentRef<typeof View>,
  RadioCardsRootProps
>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      variant = 'surface',
      size = '2',
      color,
      highContrast = false,
      radius,
      direction = 'column',
      gap,
      side = 'right',
      disabled = false,
      style,
      children,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: RadioCardsContextValue = {
      value: currentValue || '',
      onValueChange: handleValueChange,
      variant,
      size,
      color,
      highContrast,
      radius: 'medium',
      side,
      disabled,
    };

    const containerStyle: ViewStyle = {
      flexDirection: direction,
      gap: gap,
    };

    return (
      <RadioCardsContext.Provider value={contextValue}>
        <View
          ref={ref}
          style={[styles.rootContainer, containerStyle, style]}
          accessibilityRole="radiogroup"
        >
          {children}
        </View>
      </RadioCardsContext.Provider>
    );
  }
);

RadioCardsRoot.displayName = 'RadioCards.Root';

// Item Component
const RadioCardsItem = React.forwardRef<
  ComponentRef<typeof AnimatedPressable>,
  RadioCardsItemProps
>(
  (
    {
      value,
      side: itemSide,
      disabled: itemDisabled,
      style,
      children,
      accessibilityLabel,
      accessibilityHint,
    },
    ref
  ) => {
    const context = useRadioCardsContext();
    const theme = useTheme();
    const mode = useThemeMode();
    const globalHaptics = useHaptics();
    const isDark = mode === 'dark';

    const {
      value: selectedValue,
      onValueChange,
      variant,
      size,
      color,
      highContrast,
      radius,
      side: rootSide,
      disabled: rootDisabled,
    } = context;

    const isSelected = selectedValue === value;
    const isDisabled = rootDisabled || itemDisabled;
    const indicatorSide = itemSide || rootSide;

    const grayAlpha = getGrayAlpha(theme, mode);
    const accentScale = getAccentColor(theme, mode);
    const activeColor = color || theme.accentColor;
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            padding: theme.space[3],
            indicatorSize: 18,
            innerIndicatorSize: 8,
            borderWidth: 1,
          };
        case '3':
          return {
            padding: theme.space[5],
            indicatorSize: 26,
            innerIndicatorSize: 12,
            borderWidth: 1.5,
          };
        case '2':
        default:
          return {
            padding: theme.space[4],
            indicatorSize: 22,
            innerIndicatorSize: 10,
            borderWidth: 1,
          };
      }
    };

    const sizeValues = getSizeValues();
    const radii = theme.radii[radius || theme.radius] ?? theme.radii.medium;

    const handlePress = () => {
      if (!isDisabled) {
        onValueChange(value);
        // Trigger haptic feedback (check both global and local settings)
        if (globalHaptics) {
          triggerHaptic('press')
        }
      }
    };

    // Card styling
    const cardStyle: ViewStyle = {
      padding: sizeValues.padding,
      borderRadius: radius === 'full' ? 9999 : radii,
      borderWidth: isSelected ? 1.5 : 1,
      borderColor: isSelected
        ? variantColors.borderColor
        : isDark
          ? grayAlpha['6']
          : grayAlpha['6'],
      backgroundColor: isSelected
        ? variantColors.backgroundColor
        : isDark
          ? grayAlpha['2']
          : grayAlpha['2'],
      opacity: isDisabled ? 0.5 : 1,
      flexDirection: indicatorSide === 'left' ? 'row' : 'row-reverse',
      alignItems: 'center',
      gap: theme.space[3],
    };

    // Indicator styling (circular for radio)
    const indicatorStyle: ViewStyle = {
      width: sizeValues.indicatorSize,
      height: sizeValues.indicatorSize,
      borderRadius: sizeValues.indicatorSize / 2,
      borderWidth: sizeValues.borderWidth,
      borderColor: isSelected ? variantColors.borderColor : grayAlpha['8'],
      backgroundColor: isSelected ? variantColors.backgroundColor : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    };

    // Inner dot for selected state
    const innerDotStyle: ViewStyle = {
      width: sizeValues.innerIndicatorSize,
      height: sizeValues.innerIndicatorSize,
      borderRadius: sizeValues.innerIndicatorSize / 2,
      backgroundColor: variantColors.textColor,
    };

    return (
      <AnimatedPressable
        ref={ref}
        style={[styles.itemContainer, cardStyle, style]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="radio"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint || 'Select option'}
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        accessibilityActions={[{ name: 'activate', label: 'Select' }]}
        pressedScale={0.975}
        pressedOpacity={0.95}
        animationDuration={100}
        hapticFeedback={false}
      >
        <View style={indicatorStyle}>
          {isSelected && <View style={innerDotStyle} />}
        </View>
        {/*<Radio size={size} value={value} variant={'surface'} color={color} selected={isSelected} disabled={isDisabled} onSelect={handlePress} />*/}
        <View style={styles.content}>{children}</View>
      </AnimatedPressable>
    );
  }
);

RadioCardsItem.displayName = 'RadioCards.Item';

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
  },
  itemContainer: {
    // flex: 1,
  },
  content: {
    flex: 1,
  },
});

// Compound Component
interface RadioCardsCompoundComponent {
  Root: typeof RadioCardsRoot;
  Item: typeof RadioCardsItem;
}

const RadioCards = {
  Root: RadioCardsRoot,
  Item: RadioCardsItem,
} as RadioCardsCompoundComponent;

export { RadioCards, RadioCardsRoot, RadioCardsItem };
export type {
  RadioCardsRootProps,
  RadioCardsItemProps,
  RadioCardsContextValue,
};
