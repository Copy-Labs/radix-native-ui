import React from 'react';
import { type ViewStyle } from 'react-native';
import { ActivityIndicator, TouchableOpacity } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getAccentColor,
  getAccentAlpha,
  getGrayAlpha, getContrast,
} from '../../theme/color-helpers';
import RnTouchableOpacity from '../../components/primitives/TouchableOpacity';
import type { Color } from '../../theme';

interface IconButtonProps {
  /**
   * Icon component to render
   */
  icon: React.ReactNode;
  /**
   * Style prop for the IconButton
   */
  style?: ViewStyle;
  /**
   * Button variant
   * @default 'classic'
   */
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Button size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Callback when button is pressed
   */
  onPress?: (event: import('react-native').GestureResponderEvent) => void;
  /**
   * Callback when button is long-pressed
   */
  onLongPress?: (event: import('react-native').GestureResponderEvent) => void;
  /**
   * Duration (in milliseconds) before onLongPress is called
   * @default 500
   */
  delayLongPress?: number;
  /**
   * Accessibility label (required for accessibility)
   */
  accessibilityLabel: string;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
}

const IconButton = React.forwardRef<React.ElementRef<typeof RnTouchableOpacity>, IconButtonProps>(
  (
    {
      icon,
      style = {},
      variant = 'classic',
      color,
      size = 2,
      disabled,
      loading,
      onPress,
      accessibilityLabel,
      highContrast,
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
    const accentAlpha = getAccentAlpha(theme);
    const radii = theme.radii;
    const activeColor = color || theme.accentColor;

    // Get colors based on variant and mode
    const getVariantColors = () => {
      // Solid/high-contrast text color
      // const solidTextColor = highContrast
      //   ? (['sky', 'mint', 'lime', 'yellow', 'amber'].includes(theme.accentColor) ? '#0c0a09' : '#ffffff')
      //   : accentScale.contrast;
      const solidTextColor = getContrast(theme, activeColor, mode, highContrast);

      // Icon color (uses alpha[11] for soft/outline/ghost)
      const iconColor = highContrast ? accentScale[12] : accentAlpha['11'];

      switch (variant) {
        case 'solid':
          return {
            backgroundColor: accentScale[9],
            iconColor: highContrast ? solidTextColor : accentScale[1],
            borderColor: 'transparent',
          };
        case 'soft':
          return {
            backgroundColor: accentAlpha['3'],
            iconColor: iconColor,
            borderColor: 'transparent',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            iconColor: iconColor,
            borderColor: accentAlpha['8'],
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            iconColor: iconColor,
            borderColor: 'transparent',
          };
        case 'classic':
        default:
          return {
            backgroundColor: isDark ? grayScale[3] : grayScale[2],
            iconColor: grayScale[12],
            borderColor: 'transparent',
          };
      }
    };

    const variantColors = getVariantColors();

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case 1:
          return {
            size: 32,
            iconSize: 16,
            borderRadius: radii.small,
          };
        case 3:
          return {
            size: 56,
            iconSize: 24,
            borderRadius: radii.medium,
          };
        case 2:
        default:
          return {
            size: 40,
            iconSize: 20,
            borderRadius: radii.medium,
          };
      }
    };

    const sizeValues = getSizeValues();

    const buttonStyle: ViewStyle = {
      width: sizeValues.size,
      height: sizeValues.size,
      backgroundColor: disabled ? grayAlpha['3'] : variantColors.backgroundColor,
      borderColor: variantColors.borderColor,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderRadius: sizeValues.borderRadius,
      opacity: disabled ? 0.5 : 1,
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[buttonStyle, style]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantColors.iconColor} />
        ) : React.isValidElement(icon) ? (
          React.cloneElement(icon as React.ReactElement<any>, {
            size: sizeValues.iconSize,
            color: variantColors.iconColor,
          })
        ) : (
          icon
        )}
      </TouchableOpacity>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
