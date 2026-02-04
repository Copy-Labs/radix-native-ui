import React, { useEffect, useRef } from 'react';
import { StyleSheet, type ViewStyle, Animated, Easing } from 'react-native';
import { View, TouchableOpacity } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import { getAccentColor, getContrast, getGrayAlpha } from '../../theme/color-helpers';
import { Color, gray } from '../../theme';

interface SwitchProps {
  /**
   * Whether the switch is checked
   */
  checked: boolean;
  /**
   * Callback when checked state changes
   */
  onCheckedChange: (checked: boolean) => void;
  /**
   * Whether the switch is disabled
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

type StyleProp<T> = T | T[];

const Switch = React.forwardRef<unknown, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      size = '2',
      color,
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

    const animatedValue = useRef(new Animated.Value(checked ? 1 : 0));

    useEffect(() => {
      Animated.timing(animatedValue.current, {
        toValue: checked ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }, [checked]);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            trackWidth: 32,
            trackHeight: 18,
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
            trackHeight: 24,
            thumbSize: 20,
            gap: theme.space[2],
            fontSize: theme.typography.fontSizes[2].fontSize,
          };
      }
    };

    const sizeValues = getSizeValues();

    const handlePress = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    const trackStyle: ViewStyle = {
      width: sizeValues.trackWidth + 2,
      height: sizeValues.trackHeight,
      borderRadius: sizeValues.trackHeight / 2,
      backgroundColor: checked ? switchColor : isDark ? grayAlpha['8'] : grayAlpha['6'],
      borderWidth: 1,
      borderColor: checked ? switchColor : isDark ? grayAlpha['8'] : grayAlpha['7'],
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
      borderColor: checked ? switchColor : isDark ? gray['9'] : gray['8'],
      borderRadius: sizeValues.thumbSize + 5 / 2,
      backgroundColor: thumbColor || (checked ? switchContrast : defaultThumbColor),
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
