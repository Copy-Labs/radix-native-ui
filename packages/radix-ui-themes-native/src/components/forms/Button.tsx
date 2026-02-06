import React, { useMemo, useCallback } from 'react';
import {
  type ViewStyle,
  type GestureResponderEvent,
  ActivityIndicator,
  DimensionValue,
} from 'react-native';
import { TouchableOpacity } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getAccentColor,
  getAccentAlpha,
  getGrayAlpha,
  getFocusColor,
  getContrast,
  getColorScale,
  getColorAlpha, getVariantColors,
} from '../../theme/color-helpers';
import RnTouchableOpacity from '@/components/primitives/TouchableOpacity';
import { Color, RadiusSize } from '../../theme';

interface ButtonProps {
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Button
   */
  style?: ViewStyle;
  /**
   * Button variant
   * @default 'classic'
   */
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'surface' | 'ghost';
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
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
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Width of the button
   */
  width?: DimensionValue;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
}

// Custom areEqual function for Button to optimize re-renders
const areEqual = (prevProps: ButtonProps, nextProps: ButtonProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.variant === nextProps.variant &&
    prevProps.color === nextProps.color &&
    prevProps.radius === nextProps.radius &&
    prevProps.size === nextProps.size &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.width === nextProps.width &&
    prevProps.highContrast === nextProps.highContrast
  ) {
    return true;
  }
  return false;
};

const Button = React.memo(
  React.forwardRef<React.ElementRef<typeof RnTouchableOpacity>, ButtonProps>(
    (
      {
        children,
        style,
        variant = 'classic',
        color,
        radius = 'medium',
        size = 2,
        disabled,
        loading,
        onPress,
        accessibilityLabel,
        width,
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
      const activeColor = color || theme.accentColor;
      const accentScale = getColorScale(theme, activeColor, mode);
      const accentAlpha = getColorAlpha(theme, activeColor);
      const focusColor = getFocusColor(theme, mode);
      const radii = theme.radii[radius] ?? theme.radii.medium;
      const selectedRadius = radius || theme.radius;

      // Get colors based on variant and mode
      /*const getVariantColors = useCallback(() => {
        // Text color for solid/solid-high-contrast: use contrast token
        /!*const solidTextColor = highContrast
          ? (['sky', 'mint', 'lime', 'yellow', 'amber'].includes(theme.accentColor) ? '#0c0a09' : '#ffffff')
          : accentScale.contrast;*!/
        const solidTextColor = getContrast(theme, activeColor, mode, highContrast);
        // console.log("[Button] solidTextColor", solidTextColor, activeColor, accentScale);

        // Text color for soft/outline/ghost: use alpha-11
        const alphaTextColor = highContrast ? accentScale['12'] : accentAlpha['11'];

        switch (variant) {
          case 'solid':
            return {
              backgroundColor: accentScale['9'],
              textColor: solidTextColor,
              borderColor: 'transparent',
            };
          case 'soft':
            return {
              backgroundColor: accentAlpha['3'],
              textColor: alphaTextColor,
              borderColor: 'transparent',
            };
          case 'outline':
            return {
              backgroundColor: 'transparent',
              textColor: alphaTextColor,
              borderColor: accentAlpha['8'],
            };
          case 'surface':
            return {
              backgroundColor: accentAlpha['2'],
              textColor: alphaTextColor,
              borderColor: accentAlpha['8'],
            };
          case 'ghost':
            return {
              backgroundColor: 'transparent',
              textColor: alphaTextColor,
              borderColor: 'transparent',
            };
          case 'classic':
          default:
            return {
              backgroundColor: accentScale[9],
              textColor: solidTextColor,
              borderColor: 'transparent',
            };
        }
      }, [color, variant, isDark, highContrast, theme.accentColor, accentScale, accentAlpha]);*/

      const variantColors = useMemo(() => getVariantColors(theme, activeColor, mode, variant, highContrast), [getVariantColors, color, variant, highContrast, isDark, theme]);

      // Get size values
      const getSizeValues = useCallback(() => {
        switch (size) {
          case 1:
            return {
              paddingVertical: theme.space[2],
              paddingHorizontal: theme.space[3],
              fontSize: theme.typography.fontSizes[1].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
          case 3:
            return {
              paddingVertical: theme.space[4],
              paddingHorizontal: theme.space[5],
              fontSize: theme.typography.fontSizes[4].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
          case 2:
          default:
            return {
              paddingVertical: theme.space[3],
              paddingHorizontal: theme.space[4],
              fontSize: theme.typography.fontSizes[2].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
        }
      }, [size, theme, radii]);

      const sizeValues = useMemo(() => getSizeValues(), [getSizeValues]);

      const buttonStyle: ViewStyle = useMemo(
        () => ({
          backgroundColor: disabled
            ? grayAlpha['3']
            : variantColors.backgroundColor,
          borderColor: variantColors.borderColor,
          borderWidth: variant === 'outline' || 'surface' ? 1 : 0,
          borderRadius: sizeValues.borderRadius,
          paddingVertical: sizeValues.paddingVertical,
          paddingHorizontal: sizeValues.paddingHorizontal,
          width,
          opacity: disabled ? 0.5 : 1,
          alignItems: 'center',
          justifyContent: 'center',
        }),
        [disabled, grayAlpha, variantColors, variant, sizeValues, width, color, activeColor]
      );

      const textStyle = useMemo(
        () => ({
          color: disabled ? grayAlpha['8'] : variantColors.textColor,
          fontSize: sizeValues.fontSize,
          fontWeight: '500' as const,
          lineHeight: sizeValues.fontSize * 1.4,
        }),
        [disabled, grayAlpha, variantColors, sizeValues]
      );

      const handlePress = useCallback(
        (event: GestureResponderEvent) => {
          if (!disabled && !loading) {
            onPress?.(event);
          }
        },
        [disabled, loading, onPress]
      );

      return (
        <TouchableOpacity
          ref={ref}
          style={[buttonStyle, style]}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabel || (typeof children === 'string' ? children : undefined)
          }
          accessibilityState={{ disabled }}
          {...rest}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variantColors.textColor} />
          ) : (
            <Text style={[textStyle]}>{children}</Text>
          )}
        </TouchableOpacity>
      );
    }
  ),
  areEqual
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
