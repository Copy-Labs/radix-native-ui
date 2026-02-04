import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getAccentColor, getContrast, getGrayAlpha } from '../../theme/color-helpers';
import RnTouchableOpacity from '../../components/primitives/TouchableOpacity';
import { Text } from '../../components';
import type { Color } from '../../theme';

interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;
  /**
   * Callback when checked state changes
   */
  onCheckedChange: (checked: boolean) => void;
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
      onCheckedChange,
      disabled = false,
      size = '2',
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

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            boxSize: 18,
            iconSize: 10,
            fontSize: theme.typography.fontSizes[1].fontSize,
            gap: theme.space[1],
            borderWidth: 2,
          };
        case '3':
          return {
            boxSize: 28,
            iconSize: 16,
            fontSize: theme.typography.fontSizes[3].fontSize,
            gap: theme.space[3],
            borderWidth: 2,
          };
        case '2':
        default:
          return {
            boxSize: 22,
            iconSize: 12,
            fontSize: theme.typography.fontSizes[2].fontSize,
            gap: theme.space[2],
            borderWidth: 2,
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    const boxStyle: ViewStyle = {
      width: sizeValues.boxSize,
      height: sizeValues.boxSize,
      borderRadius: 4,
      borderWidth: sizeValues.borderWidth,
      borderColor: checked || indeterminate ? checkboxColor : grayAlpha['8'],
      backgroundColor: checked || indeterminate ? checkboxColor : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    const iconStyle: ViewStyle = {
      width: sizeValues.iconSize,
      height: sizeValues.iconSize,
    };

    // Checkmark or indeterminate dash path
    const getIconPath = () => {
      if (indeterminate) {
        // Horizontal dash for indeterminate state
        return `M${sizeValues.iconSize * 0.2} ${sizeValues.iconSize / 2} L${sizeValues.iconSize * 0.8} ${sizeValues.iconSize / 2}`;
      }
      // Checkmark path
      return `M${sizeValues.iconSize * 0.2} ${sizeValues.iconSize / 2} L${sizeValues.iconSize * 0.45} ${sizeValues.iconSize * 0.75} L${sizeValues.iconSize * 0.85} ${sizeValues.iconSize * 0.25}`;
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
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={
          accessibilityHint || (indeterminate ? 'Partially selected' : 'Toggle checkbox')
        }
        accessibilityState={{ checked: checked ? true : indeterminate ? 'mixed' : false, disabled }}
        accessibilityActions={[{ name: 'activate', label: 'Toggle' }]}
        {...rest}
      >
        <View style={[styles.checkbox, boxStyle]}>
          {(checked || indeterminate) && (
            <View
              style={[
                styles.icon,
                iconStyle,
                {
                  backgroundColor: 'transparent',
                },
              ]}
            >
              {/* Checkmark or indeterminate dash rendered as a simple View */}
              <Text style={{ color: 'white', fontSize: 32 }}>-</Text>
              {/*<View
                style={{
                  width: indeterminate ? sizeValues.iconSize * 0.6 : sizeValues.iconSize * 0.8,
                  height: 2,
                  backgroundColor: checkboxContrast,
                  borderRadius: 1,
                  transform: indeterminate
                    ? []
                    : [
                        { translateX: sizeValues.iconSize * 0.1 },
                        { translateY: sizeValues.iconSize * 0.35 },
                        { rotate: '-45deg' },
                      ],
                }}
              />*/}
              {checked && !indeterminate && (
                <Text>✓</Text>
                // <View
                //   style={{
                //     position: 'absolute',
                //     width: sizeValues.iconSize * 0.8,
                //     height: 2,
                //     backgroundColor: checkboxContrast,
                //     borderRadius: 1,
                //     transform: [
                //       { translateX: sizeValues.iconSize * 0.1 },
                //       { translateY: sizeValues.iconSize * 0.75 },
                //       { rotate: '45deg' },
                //     ],
                //   }}
                // />
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
