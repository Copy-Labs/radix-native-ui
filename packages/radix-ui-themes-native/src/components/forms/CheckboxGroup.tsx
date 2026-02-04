import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { View } from '../primitives';
import { Checkbox, type CheckboxProps } from './Checkbox';
import RnView from '../../components/primitives/View';

interface CheckboxItem {
  /**
   * Unique value for this checkbox item
   */
  value: string;
  /**
   * Label text displayed next to the checkbox
   */
  label: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
  /**
   * Custom color for this item's checkbox
   */
  color?: string;
}

interface CheckboxGroupProps {
  /**
   * Array of currently selected values
   */
  value: string[];
  /**
   * Callback when selection changes
   */
  onValueChange: (value: string[]) => void;
  /**
   * Array of checkbox items
   */
  items: CheckboxItem[];
  /**
   * Whether all checkboxes are disabled
   */
  disabled?: boolean;
  /**
   * Size variant for checkboxes
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Direction of checkbox items
   * @default 'column'
   */
  direction?: 'row' | 'column';
  /**
   * Gap between checkbox items
   */
  gap?: number;
  /**
   * Custom color for all checkboxes
   */
  color?: string;
}

type StyleProp<T> = T | T[];

const CheckboxGroup = React.forwardRef<React.ElementRef<typeof RnView>, CheckboxGroupProps>(
  (
    {
      value,
      onValueChange,
      items,
      disabled = false,
      size = '2',
      direction = 'column',
      gap,
      color,
      style,
      ...rest
    },
    ref
  ) => {
    const handleItemChange = (itemValue: string, checked: boolean) => {
      if (checked) {
        onValueChange([...value, itemValue]);
      } else {
        onValueChange(value.filter(v => v !== itemValue));
      }
    };

    const containerStyle: ViewStyle = {
      flexDirection: direction,
      gap: gap,
    };

    return (
      <View
        ref={ref}
        style={[styles.container, containerStyle, style]}
        accessibilityRole="checkbox"
        accessibilityLabel="Checkbox group"
        {...rest}
      >
        {items.map(item => (
          <Checkbox
            key={item.value}
            checked={value.includes(item.value)}
            onCheckedChange={checked => handleItemChange(item.value, checked)}
            label={item.label}
            disabled={disabled || item.disabled}
            size={size}
            color={item.color || color}
            accessibilityLabel={item.label}
          />
        ))}
      </View>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export { CheckboxGroup };
export type { CheckboxGroupProps, CheckboxItem };
