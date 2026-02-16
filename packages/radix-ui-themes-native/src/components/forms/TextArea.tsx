import React, { useState } from 'react';
import {
  StyleSheet,
  type ViewStyle,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import { TextInput as RadixTextInputPrimitive, PrimitiveText } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';

// ============================================================================
// Types
// ============================================================================

interface TextAreaProps extends Omit<RNTextInputProps, 'multiline'> {
  /**
   * Color scheme
   */
  color?: Color;
  /**
   * Radius variant
   */
  radius?: RadiusSize;
  /**
   * Value of the textarea
   */
  value?: string;
  /**
   * Variant
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
   * Label text displayed above
   */
  label?: string;
  /**
   * Error message displayed below
   */
  error?: string;
  /**
   * Whether disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   */
  size?: '1' | '2' | '3';
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Auto-grow height
   */
  autoGrow?: boolean;
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

// ============================================================================
// Root Component
// ============================================================================

const TextAreaRoot = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextAreaProps
>((props, ref) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  const {
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
    rows = 4,
    autoGrow = false,
    accessibilityLabel,
    accessibilityHint,
    style,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius] ?? theme.radii.medium;
  const selectedRadius = radius || theme.radius;
  const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

  // Size values (fixed height for textarea)
  const getSizeValues = () => {
    switch (size) {
      case '1':
        return {
          fontSize: theme.typography.fontSizes[4].fontSize,
          padding: theme.space[2],
          height: 100,
        };
      case '3':
        return {
          fontSize: theme.typography.fontSizes[6].fontSize,
          padding: theme.space[4],
          height: 140,
        };
      case '2':
      default:
        return {
          fontSize: theme.typography.fontSizes[5].fontSize,
          padding: theme.space[3],
          height: 120,
        };
    }
  };

  const sizeValues = getSizeValues();

  const containerStyle: ViewStyle = {
    gap: theme.space[2],
  };

  const labelStyle = {
    color: variantColors.textColor || theme.colors.gray['11'],
    fontSize: sizeValues.fontSize,
    fontWeight: '500' as const,
  };

  const inputContainerBorderColor = () => {
    if (error) {
      return theme.colors.ruby[9];
    } else {
      return isFocused ? theme.colors[activeColor]['8'] : 'transparent';
    }
  };

  const inputContainerBackgroundColor = () => {
    if (disabled) {
      return isDark ? grayAlpha['3'] : grayAlpha['2'];
    } else {
      return variantColors.backgroundColor;
    }
  };

  const inputBorderColor = () => {
    if (isFocused) {
      return 'transparent';
    } else {
      return variantColors.borderColor;
    }
  };

  const inputContainerStyle: ViewStyle = {
    width: '100%',
    borderWidth: 2,
    borderColor: inputContainerBorderColor(),
    backgroundColor: inputContainerBackgroundColor(),
    borderRadius: selectedRadius === 'full' ? theme.radii.large : radii,
    opacity: disabled ? 0.6 : 1,
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: inputBorderColor(),
    borderRadius: selectedRadius === 'full' ? theme.radii.large : radii,
    fontSize: sizeValues.fontSize,
    color: color !== 'gray' ? variantColors.textColor : grayScale[12],
    padding: sizeValues.padding,
    textAlignVertical: 'top' as const,
    minHeight: sizeValues.height,
    maxHeight: sizeValues.height + (sizeValues.height / 2),
  };

  const errorStyle = {
    color: theme.colors.ruby[10],
    fontSize: theme.typography.fontSizes[3].fontSize,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <PrimitiveText style={labelStyle} accessibilityLabel={accessibilityLabel}>
          {label}
        </PrimitiveText>
      )}
      <View style={inputContainerStyle}>
        <RadixTextInputPrimitive
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color !== 'gray' ? theme.colors[color][12]+'99' : theme.colors.gray[9]}
          editable={!disabled}
          multiline={true}
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
});

TextAreaRoot.displayName = 'TextAreaRoot';

// ============================================================================
// Main TextArea Component
// ============================================================================

interface TextAreaCompoundComponent extends React.ForwardRefExoticComponent<TextAreaProps> {}

const TextArea = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextAreaProps
>((props, ref) => {
  return <TextAreaRoot ref={ref} {...props} />;
}) as TextAreaCompoundComponent;

TextArea.displayName = 'TextArea';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    minHeight: 100,
  },
});

export { TextArea, TextAreaRoot };
export type { TextAreaProps };
