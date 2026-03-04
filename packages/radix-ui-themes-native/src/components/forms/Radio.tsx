import React from 'react';
import { StyleSheet, type ViewStyle, Vibration } from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import { Color, getContrast, getVariantColors } from '../../theme';
import {
  getAccentColor,
  getGrayAlpha,
} from '../../theme/color-helpers';
import AnimatedPressable from '../../components/primitives/AnimatedPressable';

interface RadioProps {
  /**
   * Whether the radio is checked by default (uncontrolled mode)
   */
  defaultChecked?: boolean;
  /**
   * Value of this radio button
   */
  value: string;
  /**
   * Currently selected value in the group
   */
  selected?: boolean;
  /**
   * Callback when radio is selected
   */
  onSelect?: (value: string) => void;
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
   * Badge variant
   * @default 'soft'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  /**
   * Enable haptic feedback on select
   * @default true
   */
  hapticFeedback?: boolean;
}

const Radio = React.forwardRef<React.ComponentRef<typeof AnimatedPressable>, RadioProps>(
  (
    {
      defaultChecked,
      value,
      selected,
      onSelect,
      disabled = false,
      size = '2',
      variant = 'solid',
      color,
      label,
      highContrast = false,
      accessibilityLabel,
      accessibilityHint,
      hapticFeedback = true,
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
    const activeColor = color || theme.accentColor;
    const radioContrast = getContrast(theme, activeColor, mode, highContrast);
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);
    // Internal state for uncontrolled mode
    const [isInternallySelected, setIsInternallySelected] = React.useState(defaultChecked ?? false);

    // Use controlled state if provided, otherwise use internal state
    const isSelected = selected !== undefined ? selected : isInternallySelected;

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            boxSize: 18,
            innerSize: 6,
            iconSize: 8,
            fontSize: theme.typography.fontSizes[1].fontSize,
            gap: theme.space[1],
          };
        case '3':
          return {
            boxSize: 28,
            innerSize: 12,
            iconSize: 16,
            fontSize: theme.typography.fontSizes[3].fontSize,
            gap: theme.space[3],
          };
        case '2':
        default:
          return {
            boxSize: 22,
            innerSize: 9,
            iconSize: 12,
            fontSize: theme.typography.fontSizes[2].fontSize,
            gap: theme.space[2],
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        if (onSelect) {
          onSelect(value);
        }
        // If uncontrolled, update internal state
        if (selected === undefined) {
          setIsInternallySelected(true);
        }
        // Trigger haptic feedback on select
        if (hapticFeedback) {
          Vibration.vibrate(10);
        }
      }
    };

    const outerStyle: ViewStyle = {
      width: sizeValues.boxSize,
      height: sizeValues.boxSize,
      borderRadius: sizeValues.boxSize / 2,
      borderWidth: 1.25,
      borderColor: isSelected ? variantColors.borderColor : variant !== 'soft' ? grayAlpha['8'] : variantColors.borderColor,
      backgroundColor: isSelected ? variantColors.backgroundColor : variant === 'soft' ? variantColors.backgroundColor : 'transparent',
      opacity: disabled ? 0.5 : 1,
      justifyContent: 'center',
      alignItems: 'center',
    };

    const innerStyle: ViewStyle = {
      width: sizeValues.innerSize,
      height: sizeValues.innerSize,
      borderRadius: sizeValues.boxSize * 2,
      // backgroundColor: 'transparent',
      backgroundColor: isSelected ? variantColors.textColor : 'transparent',
    };

    const labelStyle = {
      color: grayScale[12],
      fontSize: sizeValues.fontSize,
    };

    return (
      <AnimatedPressable
        ref={ref}
        style={styles.container}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint || 'Select option'}
        accessibilityState={{ checked: isSelected, disabled }}
        pressedScale={0.975}
        pressedOpacity={0.9}
        animationDuration={100}
        hapticFeedback={false}
        {...rest}
      >
        <View style={[styles.radioOuter, outerStyle]}>
          <View style={[styles.radioInner, innerStyle]} />
        </View>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </AnimatedPressable>
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
  radioInner: {borderRadius: 100},
  label: {
    marginLeft: 8,
  },
});

export { Radio };
export type { RadioProps };
