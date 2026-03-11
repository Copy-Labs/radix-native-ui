import React from 'react';
import { type ViewStyle } from 'react-native';
import { ActivityIndicator } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getAccentColor,
  getAccentAlpha,
  getGrayAlpha,
  getVariantColors,
} from '../../theme/color-helpers';
import AnimatedPressable from '../../components/primitives/AnimatedPressable';
import type { Color, RadiusSize } from '../../theme';

interface IconButtonProps {
  /**
   * Icon component to render as children
   */
  children?: React.ReactNode;
  /**
   * Style prop for the IconButton
   */
  style?: ViewStyle;
  /**
   * Button variant
   * @default 'classic'
   */
  variant?: 'surface' | 'solid' | 'soft' | 'outline' | 'ghost';
  /**
   * Color scheme for the button
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Button size
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * Border radius override
   */
  radius?: RadiusSize;
  /**
   * Merge props onto the child element
   * @default false
   */
  asChild?: boolean;
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
  /**
   * Enable haptic feedback on press
   * @default true (inherited from AnimatedPressable)
   */
  hapticFeedback?: boolean;
}

const IconButton = React.forwardRef<React.ElementRef<typeof AnimatedPressable>, IconButtonProps>(
  (
    {
      children,
      style = {},
      variant = 'classic',
      color,
      size = 2,
      radius,
      asChild = false,
      disabled,
      loading,
      onPress,
      accessibilityLabel,
      highContrast,
      hapticFeedback,
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
    // const radii = theme.radii;
    const radii = theme.radii[radius || theme.radius] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;
    const activeColor = color || theme.accentColor;

    // Get border radius based on radius prop or default
    /*const getBorderRadius = () => {
      if (radius) {
        return radius === 'full' ? 9999 : radii[radius];
      }
      return undefined; // Will use size-based default
    };*/

    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case 1:
          return {
            size: 32,
            iconSize: 16,
            // borderRadius: radii.small,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
        case 3:
          return {
            size: 56,
            iconSize: 24,
            // borderRadius: radii.medium,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
        case 4:
          return {
            size: 64,
            iconSize: 28,
            // borderRadius: radii.large,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
        case 2:
        default:
          return {
            size: 40,
            iconSize: 20,
            // borderRadius: radii.medium,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
      }
    };

    const sizeValues = getSizeValues();
    // const customBorderRadius = getBorderRadius();

    const buttonStyle: ViewStyle = {
      width: sizeValues.size,
      height: sizeValues.size,
      backgroundColor: disabled ? grayAlpha['3'] : variantColors.backgroundColor,
      borderColor: variantColors.borderColor,
      borderWidth: variant === 'outline' ? 1 : 0,
      // borderRadius: customBorderRadius !== undefined ? customBorderRadius : sizeValues.borderRadius,
      borderRadius: sizeValues.borderRadius,
      opacity: disabled ? 0.5 : 1,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Handle asChild pattern - merge props onto child element
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        style: [buttonStyle, style, child.props.style],
        onPress: child.props.onPress || onPress,
        disabled: disabled || child.props.disabled,
        accessibilityRole: 'button',
        accessibilityLabel,
        accessibilityState: { disabled },
        ...rest,
        ...child.props,
      });
    }

    return (
      <AnimatedPressable
        ref={ref}
        style={[buttonStyle, style]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        pressedScale={0.9}
        pressedOpacity={0.8}
        animationDuration={100}
        hapticFeedback={hapticFeedback}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantColors.textColor} />
        ) : React.isValidElement(children) ? (
          React.cloneElement(children as React.ReactElement<any>, {
            size: children.props?.size || sizeValues.iconSize,
            color: variantColors.textColor,
          })
        ) : (
          children
        )}
      </AnimatedPressable>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
