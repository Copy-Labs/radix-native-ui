import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, type ViewStyle, Animated, Easing } from 'react-native';
import { View, TouchableOpacity } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import {
  getAccentColor,
  getContrast,
  getGrayAlpha,
  getVariantColors,
} from '../../theme/color-helpers';
import { Color, gray, RadiusSize } from '../../theme';

interface SwitchProps {
  /**
   * If the switch is checked by default. Use in controlled mode.
   */
  defaultChecked?: boolean;
  /**
   * Whether the switch is checked
   */
  checked?: boolean;
  /**
   * Callback when checked state changes
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Badge variant
   * @default 'soft'
   */
  variant?: 'solid' | 'soft' | 'surface';
  /**
   * Custom color for checked state
   */
  color?: Color;
  /**
   * Custom color for thumb
   */
  thumbColor?: string;
  /**
   * Label text displayed next to the switch
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

const Switch = React.forwardRef<unknown, SwitchProps>(
  (
    {
      defaultChecked,
      checked,
      onCheckedChange,
      disabled = false,
      radius = 'full',
      size = '2',
      color,
      variant = 'solid',
      thumbColor,
      label,
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
    const switchColor = color || accentScale[9];
    // const switchContrast = accentScale.contrast;
    const activeColor = color || theme.accentColor;
    const switchContrast = getContrast(theme, activeColor, mode, highContrast);
    const defaultThumbColor = isDark ? grayScale[4] : grayScale[1];
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);
    const radii = theme.radii[radius] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;

    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    // Use checked if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked;
    const setChecked = (value: boolean) => {
      if (checked === undefined) {
        setInternalChecked(value);
      }
      if (onCheckedChange) {
        onCheckedChange(value);
      }
    };

    const animatedValue = useRef(new Animated.Value(isChecked ? 1 : 0));

    useEffect(() => {
      Animated.timing(animatedValue.current, {
        toValue: isChecked ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }, [isChecked]);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            trackWidth: 32,
            trackHeight: 20,
            thumbSize: 14,
            gap: theme.space[1],
            fontSize: theme.typography.fontSizes[1].fontSize,
          };
        case '3':
          return {
            trackWidth: 58,
            trackHeight: 32,
            thumbSize: 26,
            gap: theme.space[3],
            fontSize: theme.typography.fontSizes[3].fontSize,
          };
        case '2':
        default:
          return {
            trackWidth: 44,
            trackHeight: 26,
            thumbSize: 20,
            gap: theme.space[2],
            fontSize: theme.typography.fontSizes[2].fontSize,
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        // onCheckedChange(!checked);
        setChecked(!isChecked);
      }
    };

    const trackStyle: ViewStyle = {
      width: sizeValues.trackWidth + 2,
      height: sizeValues.trackHeight,
      // borderRadius: sizeValues.trackHeight / 2,
      borderRadius: selectedRadius === 'full' ? 9999 : radii,
      // backgroundColor: checked ? switchColor : isDark ? grayAlpha['8'] : grayAlpha['6'],
      backgroundColor: isChecked ? variantColors.backgroundColor : grayAlpha['6'],
      borderWidth: 1,
      // borderColor: checked ? switchColor : isDark ? grayAlpha['8'] : grayAlpha['7'],
      borderColor: isChecked ? variantColors.borderColor : grayAlpha['7'],
      opacity: disabled ? 0.5 : 1,
    };

    const thumbTranslateX = animatedValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [-0.65, sizeValues.trackWidth - sizeValues.trackHeight + 0.65],
    });

    const thumbStyle: ViewStyle = {
      width: sizeValues.trackHeight,
      height: sizeValues.trackHeight,
      borderWidth: 1,
      // borderColor: checked ? switchColor : isDark ? gray['9'] : gray['8'],
      borderColor: isChecked
        ? variant === 'surface'
          ? variantColors.borderColor
          : variantColors.backgroundColor
        : gray['8'],
      // borderRadius: sizeValues.thumbSize + 5 / 2,
      borderRadius: selectedRadius === 'full' ? 9999 : radii,
      backgroundColor: thumbColor || (isChecked ? switchContrast : defaultThumbColor),
      transform: [{ translateX: thumbTranslateX }],
      /*shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 1,
      elevation: 0,*/
    };

    const labelStyle = {
      color: grayScale[12],
      fontSize: sizeValues.fontSize,
    };

    return (
      <TouchableOpacity
        ref={ref as any}
        style={styles.container}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint || 'Toggle switch'}
        accessibilityState={{ checked, disabled }}
        accessibilityActions={[{ name: 'activate', label: 'Toggle' }]}
        {...rest}
      >
        <View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </TouchableOpacity>
    );
  }
);

Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
  },
  label: {
    marginLeft: 8,
  },
});

export { Switch };
export type { SwitchProps };
