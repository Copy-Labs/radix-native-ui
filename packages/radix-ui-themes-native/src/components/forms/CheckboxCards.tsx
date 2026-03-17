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
  getContrast,
} from '../../theme/color-helpers';
import type { Color, RadiusSize } from '../../theme';
import { Checkbox } from '../../components';
import AnimatedPressable from '../../components/primitives/AnimatedPressable';
import { triggerHaptic } from '../../utils';

// Context for CheckboxCards
interface CheckboxCardsContextValue {
  value: string[];
  onValueChange: (value: string[]) => void;
  variant: 'solid' | 'soft' | 'surface' | 'outline';
  size: '1' | '2' | '3';
  color?: Color;
  highContrast: boolean;
  radius: RadiusSize;
  side: 'left' | 'right';
  disabled: boolean;
}

const CheckboxCardsContext = createContext<CheckboxCardsContextValue | null>(null);

const useCheckboxCardsContext = () => {
  const context = useContext(CheckboxCardsContext);
  if (!context) {
    throw new Error('CheckboxCards.Item must be used within a CheckboxCards.Root');
  }
  return context;
};

// Root Props
interface CheckboxCardsRootProps {
  /**
   * Selected values (controlled mode)
   */
  value?: string[];
  /**
   * Default selected values (uncontrolled mode)
   */
  defaultValue?: string[];
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string[]) => void;
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
   * Children (CheckboxCards.Item components)
   */
  children: ReactNode;
}

// Item Props
interface CheckboxCardsItemProps {
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
const CheckboxCardsRoot = React.forwardRef<
  ComponentRef<typeof View>,
  CheckboxCardsRootProps
>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      variant = 'surface',
      size = '2',
      color,
      highContrast = false,
      radius = 'medium',
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
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);

    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string[]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: CheckboxCardsContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      variant,
      size,
      color,
      highContrast,
      radius,
      side,
      disabled,
    };

    const containerStyle: ViewStyle = {
      flexDirection: direction,
      gap: gap,
    };

    return (
      <CheckboxCardsContext.Provider value={contextValue}>
        <View
          ref={ref}
          style={[styles.rootContainer, containerStyle, style]}
          accessibilityRole="list"
        >
          {children}
        </View>
      </CheckboxCardsContext.Provider>
    );
  }
);

CheckboxCardsRoot.displayName = 'CheckboxCards.Root';

// Item Component
const CheckboxCardsItem = React.forwardRef<
  ComponentRef<typeof AnimatedPressable>,
  CheckboxCardsItemProps
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
    const context = useCheckboxCardsContext();
    const theme = useTheme();
    const mode = useThemeMode();
    const globalHaptics = useHaptics();
    const isDark = mode === 'dark';

    const {
      value: selectedValues,
      onValueChange,
      variant,
      size,
      color,
      highContrast,
      radius,
      side: rootSide,
      disabled: rootDisabled,
    } = context;

    const isChecked = selectedValues.includes(value);
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
            innerIndicatorSize: 6,
            borderWidth: 1,
            checkHeight: 2.2,
          };
        case '3':
          return {
            padding: theme.space[5],
            indicatorSize: 26,
            innerIndicatorSize: 10,
            borderWidth: 1.5,
            checkHeight: 2.8,
          };
        case '2':
        default:
          return {
            padding: theme.space[4],
            indicatorSize: 22,
            innerIndicatorSize: 8,
            borderWidth: 1,
            checkHeight: 2.5,
          };
      }
    };

    const sizeValues = getSizeValues();
    const radii = theme.radii[radius] ?? theme.radii.medium;

    const handlePress = () => {
      if (!isDisabled) {
        if (isChecked) {
          onValueChange(selectedValues.filter((v) => v !== value));
        } else {
          onValueChange([...selectedValues, value]);
        }
        // Trigger haptic feedback (check global setting)
        if (globalHaptics) {
          triggerHaptic('press')
        }
      }
    };

    // Card styling
    const cardStyle: ViewStyle = {
      padding: sizeValues.padding,
      borderRadius: radius === 'full' ? 9999 : radii,
      borderWidth: isChecked ? 1.5 : 1,
      borderColor: isChecked
        ? variantColors.borderColor
        : isDark
          ? grayAlpha['6']
          : grayAlpha['6'],
      backgroundColor: isChecked
        ? variantColors.backgroundColor
        : isDark
          ? grayAlpha['2']
          : grayAlpha['2'],
      opacity: isDisabled ? 0.5 : 1,
      flexDirection: indicatorSide === 'left' ? 'row' : 'row-reverse',
      alignItems: 'center',
      gap: theme.space[3],
    };

    // Indicator styling
    const indicatorStyle: ViewStyle = {
      width: sizeValues.indicatorSize,
      height: sizeValues.indicatorSize,
      borderRadius: 4,
      borderWidth: sizeValues.borderWidth,
      borderColor: isChecked ? variantColors.borderColor : grayAlpha['8'],
      backgroundColor: isChecked ? variantColors.backgroundColor : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <AnimatedPressable
        ref={ref}
        style={[styles.itemContainer, cardStyle, style]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint || 'Toggle selection'}
        accessibilityState={{ checked: isChecked, disabled: isDisabled }}
        accessibilityActions={[{ name: 'activate', label: 'Toggle' }]}
        pressedScale={0.975}
        pressedOpacity={0.95}
        animationDuration={100}
        hapticFeedback={false}
      >
        {/*<View style={indicatorStyle}>
          {isChecked && (
            <View
              style={{
                width: sizeValues.indicatorSize * 0.5,
                height: sizeValues.checkHeight,
                backgroundColor: variantColors.textColor,
                borderRadius: 1,
              }}
            />
          )}
        </View>*/}
        <Checkbox
          defaultChecked
          checked={isChecked}
          size={size}
          onCheckedChange={handlePress}
        />
        <View style={styles.content}>{children}</View>
      </AnimatedPressable>
    );
  }
);

CheckboxCardsItem.displayName = 'CheckboxCards.Item';

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
  },
  itemContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

// Compound Component
interface CheckboxCardsCompoundComponent {
  Root: typeof CheckboxCardsRoot;
  Item: typeof CheckboxCardsItem;
}

const CheckboxCards = {
  Root: CheckboxCardsRoot,
  Item: CheckboxCardsItem,
} as CheckboxCardsCompoundComponent;

export { CheckboxCards, CheckboxCardsRoot, CheckboxCardsItem };
export type {
  CheckboxCardsRootProps,
  CheckboxCardsItemProps,
  CheckboxCardsContextValue,
};
