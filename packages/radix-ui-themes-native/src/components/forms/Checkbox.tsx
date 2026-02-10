import React, { useState } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getAccentColor,
  getContrast,
  getGrayAlpha,
  getVariantColors,
} from '../../theme/color-helpers';
import RnTouchableOpacity from '../../components/primitives/TouchableOpacity';
import type { Color } from '../../theme';
import { Text } from '../../components';

interface CheckboxProps {
  /**
   * Whether the checkbox is checked (controlled mode)
   */
  checked?: boolean;
  /**
   * Default checked state (uncontrolled mode)
   */
  defaultChecked?: boolean;
  /**
   * Callback when checked state changes
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Badge variant
   * @default 'soft'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  /**
   * Custom color for checked state
   */
  color?: Color;
  /**
   * Label text displayed next to the checkbox
   */
  label?: string;
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean;
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

const Checkbox = React.forwardRef<React.ElementRef<typeof RnTouchableOpacity>, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      size = '2',
      variant = 'solid',
      color,
      label,
      indeterminate = false,
      highContrast,
      accessibilityLabel,
      accessibilityHint,
      ...rest
    },
    ref
  ) => {
    // Determine if uncontrolled mode
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Use controlled value if provided, otherwise use internal state
    const isChecked = isControlled ? checked : internalChecked;

    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const accentScale = getAccentColor(theme, mode);
    const checkboxColor = color || accentScale[9];
    // const checkboxContrast = accentScale.contrast;
    const activeColor = color || theme.accentColor;
    const checkboxContrast = getContrast(theme, activeColor, mode, highContrast);
    // Get colors based on variant and mode using the helper function
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            boxSize: 20,
            iconSize: 11,
            fontSize: theme.typography.fontSizes[1].fontSize,
            gap: theme.space[1],
            borderWidth: 1,
            height: 2.5,
          };
        case '3':
          return {
            boxSize: 28,
            iconSize: 16,
            fontSize: theme.typography.fontSizes[3].fontSize,
            gap: theme.space[3],
            borderWidth: 1,
            height: 3,
          };
        case '2':
        default:
          return {
            boxSize: 24,
            iconSize: 12,
            fontSize: theme.typography.fontSizes[2].fontSize,
            gap: theme.space[2],
            borderWidth: 1,
            height: 2.7,
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        if (isControlled) {
          onCheckedChange?.(!checked);
        } else {
          const newChecked = !internalChecked;
          setInternalChecked(newChecked);
          onCheckedChange?.(newChecked);
        }
      }
    };

    const boxStyle: ViewStyle = {
      width: sizeValues.boxSize,
      height: sizeValues.boxSize,
      borderRadius: 5,
      borderWidth: sizeValues.borderWidth,
      borderColor: isChecked || indeterminate ? variantColors.borderColor : grayAlpha['8'],
      backgroundColor: isChecked || indeterminate ? variantColors.backgroundColor : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    const iconStyle: ViewStyle = {
      width: sizeValues.iconSize,
      height: sizeValues.iconSize,
    };

    const labelStyle = {
      color: theme.colors.gray || grayScale[12],
      fontSize: sizeValues.fontSize,
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={styles.container}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={
          accessibilityHint || (indeterminate ? 'Partially selected' : 'Toggle checkbox')
        }
        accessibilityState={{ checked: isChecked ? true : indeterminate ? 'mixed' : false, disabled }}
        accessibilityActions={[{ name: 'activate', label: 'Toggle' }]}
        {...rest}
      >
        <View style={[styles.checkbox, boxStyle]}>
          {(isChecked || indeterminate) && (
            <View style={[styles.icon, iconStyle]}>
              {indeterminate ? (
                // Indeterminate dash
                <View
                  style={{
                    width: sizeValues.iconSize * 0.9,
                    height: 2.8,
                    backgroundColor: variantColors.textColor,
                    borderRadius: 3,
                  }}
                />
              ) : (
                // Checkmark - composed of two rotated lines
                // Short stroke (down-right, 45deg) starts from left-middle
                // Long stroke (up-right, -45deg) goes from bottom-left to top-right
                <>
                  <View
                    style={{
                      position: 'absolute',
                      width: sizeValues.iconSize * 0.46,
                      height: sizeValues.height,
                      backgroundColor: variantColors.textColor,
                      borderRadius: 1,
                      transform: [
                        { translateX: sizeValues.iconSize * -0.36 },
                        { translateY: sizeValues.iconSize * 0.18 },
                        { rotate: '45deg' },
                      ],
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      width: sizeValues.iconSize * 1.1,
                      height: sizeValues.height,
                      backgroundColor: variantColors.textColor,
                      borderRadius: 3,
                      transform: [
                        { translateX: sizeValues.iconSize * 0.1 },
                        { translateY: sizeValues.iconSize * 0.0001 },
                        { rotate: '-55deg' },
                      ],
                    }}
                  />
                </>
              )}
            </View>
          )}
        </View>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </TouchableOpacity>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
  },
});

export { Checkbox };
export type { CheckboxProps };
