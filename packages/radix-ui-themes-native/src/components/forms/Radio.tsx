import React from 'react';
import { StyleSheet, type ViewStyle, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import { Color, getContrast } from '../../theme';
import {
  getAccentColor,
  getGrayAlpha,
} from '../../theme/color-helpers';

interface RadioProps {
  /**
   * Value of this radio button
   */
  value: string;
  /**
   * Currently selected value in the group
   */
  selected: boolean;
  /**
   * Callback when radio is selected
   */
  onSelect: (value: string) => void;
  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Custom color for selected state
   */
  color?: Color;
  /**
   * Label text displayed next to the radio
   */
  label?: string;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
}

type StyleProp<T> = T | T[];

const Radio = React.forwardRef<React.ComponentRef<typeof RNTouchableOpacity>, RadioProps>(
  (
    {
      value,
      selected,
      onSelect,
      disabled = false,
      size = '2',
      color,
      label,
      highContrast = false,
      accessibilityLabel,
      accessibilityHint,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const accentScale = getAccentColor(theme, mode);
    const selectedColor = color || accentScale[9];
    // const radioContrast = accentScale.contrast;
    const activeColor = color || theme.accentColor;
    const radioContrast = getContrast(theme, activeColor, mode, highContrast);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            boxSize: 16,
            innerSize: 8,
            iconSize: 8,
            fontSize: theme.typography.fontSizes[1].fontSize,
            gap: theme.space[1],
          };
        case '3':
          return {
            boxSize: 28,
            innerSize: 16,
            iconSize: 16,
            fontSize: theme.typography.fontSizes[3].fontSize,
            gap: theme.space[3],
          };
        case '2':
        default:
          return {
            boxSize: 22,
            innerSize: 12,
            iconSize: 12,
            fontSize: theme.typography.fontSizes[2].fontSize,
            gap: theme.space[2],
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        onSelect(value);
      }
    };

    const outerStyle: ViewStyle = {
      width: sizeValues.boxSize,
      height: sizeValues.boxSize,
      borderRadius: sizeValues.boxSize / 2,
      borderWidth: 2,
      borderColor: selected ? selectedColor : grayAlpha['8'],
      backgroundColor: 'transparent',
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const innerStyle: ViewStyle = {
      width: sizeValues.innerSize,
      height: sizeValues.innerSize,
      borderRadius: sizeValues.innerSize / 2,
      backgroundColor: selected ? selectedColor : 'transparent',
    };

    const labelStyle = {
      color: grayScale[12],
      fontSize: sizeValues.fontSize,
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={styles.container}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint || 'Select option'}
        accessibilityState={{ checked: selected, disabled }}
        accessibilityActions={[{ name: 'activate', label: 'Select' }]}
        {...rest}
      >
        <View style={[styles.radioOuter, outerStyle]}>
          <View style={[styles.radioInner, innerStyle]} />
        </View>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </TouchableOpacity>
    );
  }
);

Radio.displayName = 'Radio';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {},
  label: {
    marginLeft: 8,
  },
});

export { Radio };
export type { RadioProps };
