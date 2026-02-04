import React from 'react';
import { StyleSheet, type ViewStyle, TextInput as RNTextInput } from 'react-native';
import { TextInput, View, PrimitiveText } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getGrayAlpha,
} from '../../theme/color-helpers';

interface TextFieldProps {
  /**
   * The value of the text input
   */
  value: string;
  /**
   * Callback when text changes
   */
  onChangeText: (value: string) => void;
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
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
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
      size = '2',
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

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            fontSize: theme.typography.fontSizes[1].fontSize,
            paddingVertical: theme.space[2],
            paddingHorizontal: theme.space[3],
            borderRadius: theme.radii[1],
            height: multiline ? undefined : 36,
          };
        case '3':
          return {
            fontSize: theme.typography.fontSizes[3].fontSize,
            paddingVertical: theme.space[4],
            paddingHorizontal: theme.space[4],
            borderRadius: theme.radii[2],
            height: multiline ? undefined : 52,
          };
        case '2':
        default:
          return {
            fontSize: theme.typography.fontSizes[2].fontSize,
            paddingVertical: theme.space[3],
            paddingHorizontal: theme.space[3],
            borderRadius: theme.radii[2],
            height: multiline ? undefined : 44,
          };
      }
    };

    const sizeValues = getSizeValues();

    const containerStyle: ViewStyle = {
      gap: theme.space[1],
    };

    const labelStyle = {
      color: isDark ? grayScale[11] : grayScale[10],
      fontSize: theme.typography.fontSizes[1].fontSize,
      fontWeight: '500' as const,
    };

    // Use alpha colors for background and border to match original Radix Themes
    const inputContainerStyle: ViewStyle = {
      borderWidth: 1,
      borderColor: error
        ? theme.colors.ruby[9]
        : isDark
          ? grayAlpha['7']
          : grayAlpha['8'],
      backgroundColor: disabled
        ? isDark
          ? grayAlpha['3']
          : grayAlpha['2']
        : isDark
          ? grayAlpha['4']
          : grayAlpha['3'],
      borderRadius: sizeValues.borderRadius,
      opacity: disabled ? 0.6 : 1,
    };

    const inputStyle = {
      fontSize: sizeValues.fontSize,
      color: grayScale[12],
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
      <View style={[styles.container, containerStyle, style]} {...rest}>
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
            placeholderTextColor={isDark ? grayAlpha['9'] : grayScale[8]}
            editable={!disabled}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            style={[styles.input, inputStyle]}
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
