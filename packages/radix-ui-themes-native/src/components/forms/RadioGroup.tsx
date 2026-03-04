import React, { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { StyleSheet, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { Radio, type RadioProps } from './Radio';
import { type Color } from '../../theme';

// ============================================================================
// RadioGroup Context
// ============================================================================

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: '1' | '2' | '3';
  color?: Color;
  variant: 'solid' | 'soft' | 'surface' | 'outline';
  highContrast: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroup.Item must be used within a RadioGroup.Root');
  }
  return context;
};

// ============================================================================
// RadioGroup.Root
// ============================================================================

interface RadioGroupRootProps {
  /**
   * Currently selected value (controlled mode)
   */
  value?: string;
  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: string;
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Whether all radios are disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Size variant for radios
   * @default '2'
   */
  size?: '1' | '2' | '3';
  /**
   * Custom color for selected state
   */
  color?: Color;
  /**
   * Visual variant
   * @default 'soft'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  /**
   * High contrast mode for accessibility
   * @default false
   */
  highContrast?: boolean;
  /**
   * Direction of radio items
   * @default 'column'
   */
  direction?: 'row' | 'column';
  /**
   * Gap between radio items
   */
  gap?: number;
  /**
   * Style prop for the container
   */
  style?: ViewStyle;
  /**
   * Child components
   */
  children: ReactNode;
}

const RadioGroupRoot = React.forwardRef<React.ComponentRef<typeof RNView>, RadioGroupRootProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      size = '2',
      color,
      variant = 'soft',
      highContrast = false,
      direction = 'column',
      gap,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    // Uncontrolled vs controlled state
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue! : internalValue;

    const handleValueChange = useCallback((newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }, [isControlled, onValueChange]);

    const containerStyle: ViewStyle = {
      flexDirection: direction,
      gap: gap,
    };

    const contextValue: RadioGroupContextValue = {
      value,
      onValueChange: handleValueChange,
      disabled,
      size,
      color,
      variant,
      highContrast,
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <View
          ref={ref}
          style={[styles.container, containerStyle, style]}
          accessibilityRole="radiogroup"
          {...rest}
        >
          {children}
        </View>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroupRoot.displayName = 'RadioGroup.Root';

// ============================================================================
// RadioGroup.Item
// ============================================================================

interface RadioGroupItemProps extends Omit<RadioProps, 'selected' | 'onSelect'> {
  /**
   * Value of this radio button
   */
  value: string;
  /**
   * Custom content (overrides label)
   */
  children?: ReactNode;
}

const RadioGroupItem = React.forwardRef<React.ComponentRef<typeof Radio>, RadioGroupItemProps>(
  ({ value, disabled: itemDisabled, ...props }, ref) => {
    const context = useRadioGroup();

    const isSelected = context.value === value;
    const isDisabled = context.disabled || itemDisabled;

    const handleSelect = useCallback(() => {
      context.onValueChange(value);
    }, [context, value]);

    return (
      <Radio
        ref={ref}
        value={value}
        selected={isSelected}
        onSelect={handleSelect}
        disabled={isDisabled}
        size={context.size}
        color={context.color}
        variant={context.variant}
        highContrast={context.highContrast}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = 'RadioGroup.Item';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

// ============================================================================
// Exports
// ============================================================================

// Compound component export
export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};

// Named exports for destructuring
export { RadioGroupRoot, RadioGroupItem };

// Types
export type {
  RadioGroupRootProps,
  RadioGroupItemProps,
  RadioGroupContextValue,
};
