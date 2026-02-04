import React from 'react';
import { StyleSheet, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { Radio, type RadioProps } from './Radio';

interface RadioItem {
  /**
   * Unique value for this radio item
   */
  value: string;
  /**
   * Label text displayed next to the radio
   */
  label: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
}

interface RadioGroupProps {
  /**
   * Currently selected value
   */
  value: string;
  /**
   * Callback when selection changes
   */
  onValueChange: (value: string) => void;
  /**
   * Array of radio items
   */
  items: RadioItem[];
  /**
   * Whether all radios are disabled
   */
  disabled?: boolean;
  /**
   * Size variant for radios
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Style prop for the Flex
   */
  style?: ViewStyle;
  /**
   * Direction of radio items
   * @default 'column'
   */
  direction?: 'row' | 'column';
  /**
   * Gap between radio items
   */
  gap?: number;
}

const RadioGroup = React.forwardRef<React.ComponentRef<typeof RNView>, RadioGroupProps>(
  (
    {
      value,
      onValueChange,
      items,
      disabled = false,
      size = '2',
      direction = 'column',
      gap,
      style,
      ...rest
    },
    ref
  ) => {
    const containerStyle: ViewStyle = {
      flexDirection: direction,
      gap: gap,
    };

    return (
      <View
        ref={ref}
        style={[styles.container, containerStyle, style]}
        accessibilityRole="radiogroup"
        {...rest}
      >
        {items.map(item => (
          <Radio
            key={item.value}
            value={item.value}
            selected={value === item.value}
            onSelect={onValueChange}
            label={item.label}
            disabled={disabled || item.disabled}
            size={size}
            accessibilityLabel={item.label}
          />
        ))}
      </View>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export { RadioGroup };
export type { RadioGroupProps, RadioItem };
