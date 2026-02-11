import React from 'react';
import { StyleSheet, type ViewStyle, TextInput as RNTextInput, type KeyboardType } from 'react-native';
import { TextInput, View, PrimitiveText } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';

interface TextFieldProps {
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Radius variant
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * The value of the text input
   */
  value?: string;
  /**
   * Badge variant
   * @default 'soft'
   */
  variant?: 'surface' | 'soft' | 'outline';
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Callback when text changes
   */
  onChangeText?: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Error message displayed below the input
   */
  error?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Whether this is a multiline input
   */
  multiline?: boolean;
  /**
   * Whether to hide text input (password mode)
   */
  secureTextEntry?: boolean;
  /**
   * Keyboard type
   * @default 'default'
   */
  keyboardType?: KeyboardType;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  /**
   * Additional container style
   */
  style?: ViewStyle;
}

const TextField = React.forwardRef<React.ComponentRef<typeof RNTextInput>, TextFieldProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      label,
      error,
      disabled = false,
      color = 'gray',
      highContrast = false,
      radius = 'medium',
      size = '2',
      variant = 'outline',
      multiline = false,
      secureTextEntry = false,
      keyboardType = 'default',
      accessibilityLabel,
      accessibilityHint,
      style,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const activeColor = color || theme.accentColor;
    const radii = theme.radii[radius] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);
    const [isFocused, setIsFocused] = React.useState(false);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            fontSize: theme.typography.fontSizes[4].fontSize,
            paddingVertical: theme.space[2],
            paddingHorizontal: theme.space[3],
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
            height: multiline ? undefined : 36,
          };
        case '3':
          return {
            fontSize: theme.typography.fontSizes[6].fontSize,
            paddingVertical: theme.space[4],
            paddingHorizontal: theme.space[4],
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
            height: multiline ? undefined : 56,
          };
        case '2':
        default:
          return {
            fontSize: theme.typography.fontSizes[5].fontSize,
            paddingVertical: theme.space[3],
            paddingHorizontal: theme.space[3],
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
            height: multiline ? undefined : 44,
          };
      }
    };

    const sizeValues = getSizeValues();

    const containerStyle: ViewStyle = {
      gap: theme.space[1],
    };

    const labelStyle = {
      color: variantColors.textColor || isDark ? grayScale[11] : grayScale[10],
      fontSize: sizeValues.fontSize,
      fontWeight: '500' as const,
    };

    const inputContainerBorderColor = () => {
      if (error) {
        return theme.colors.ruby[9];
      } else {
        return isFocused ? theme.colors[activeColor]['8'] : 'transparent';
      }
      // else {
      //   return isFocused ? grayAlpha['8'] : 'transparent';
      // }
    }

    const inputContainerBackgroundColor = () => {
      if (disabled) {
        return isDark ? grayAlpha['3'] : grayAlpha['2'];
      } else {
        return variantColors.backgroundColor;
      }
      // else {
      //   return 'transparent';
      // }
    }

    const inputBorderColor = () => {
      if (isFocused) {
        return 'transparent';
      } else if (error) {
        return theme.colors.ruby[9];
      } else {
        return variantColors.borderColor;
      }
      // else {
      //   return grayAlpha['8'];
      // }
    }

    // Use alpha colors for background and border to match original Radix Themes
    const inputContainerStyle: ViewStyle = {
      borderWidth: 2,
      borderColor: inputContainerBorderColor(),
      backgroundColor: inputContainerBackgroundColor(),
      borderRadius: sizeValues.borderRadius,
      opacity: disabled ? 0.6 : 1,
    };

    const inputStyle = {
      borderWidth: 1,
      // borderColor: isFocused ? 'transparent' : color ? variantColors.borderColor : grayAlpha['8'],
      borderColor: inputBorderColor(),
      borderRadius: sizeValues.borderRadius,
      fontSize: sizeValues.fontSize,
      color: color ? variantColors.textColor : grayScale[12],
      paddingVertical: sizeValues.paddingVertical,
      paddingHorizontal: sizeValues.paddingHorizontal,
      minHeight: multiline ? sizeValues.height : undefined,
      height: multiline ? undefined : sizeValues.height,
      textAlignVertical: multiline ? 'top' as const : ('center' as const),
    };

    const errorStyle = {
      color: theme.colors.ruby[10],
      fontSize: theme.typography.fontSizes[1].fontSize,
    };

    return (
      <View style={[styles.container, containerStyle, style]}>
        {label && (
          <PrimitiveText style={labelStyle} accessibilityLabel={accessibilityLabel}>
            {label}
          </PrimitiveText>
        )}
        <View style={inputContainerStyle}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={color ? theme.colors[activeColor].alpha['7'] : grayScale[4]}
            editable={!disabled}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            style={[styles.input, inputStyle]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
        </View>
        {error && <PrimitiveText style={errorStyle}>{error}</PrimitiveText>}
      </View>
    );
  }
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
});

export { TextField };
export type { TextFieldProps };
