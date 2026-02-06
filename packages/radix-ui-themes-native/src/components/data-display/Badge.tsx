import React from 'react';
import { StyleSheet, type StyleProp, ViewStyle, TextStyle } from 'react-native';
import { View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import type { Color, RadiusSize } from '../../theme';
import {
  getVariantColors,
} from '../../theme/color-helpers';

interface BadgeProps {
  /**
   * Badge content
   */
  children: React.ReactNode;
  /**
   * Badge variant
   * @default 'soft'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Badge size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

const Badge = React.forwardRef<any, BadgeProps>(
  (
    {
      children,
      variant = 'soft',
      color,
      radius = 'medium',
      size = 2,
      highContrast = false,
      style,
      accessibilityLabel,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const radii = theme.radii[radius] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;

    const activeColor = color || theme.accentColor;

    // Get size values
    const getSizeValues = () => {
      // const radii = theme.radii;
      switch (size) {
        case 1:
          return {
            paddingVertical: 1,
            paddingHorizontal: 6,
            fontSize: theme.typography.fontSizes[1].fontSize,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
        case 3:
          return {
            paddingVertical: 6,
            paddingHorizontal: 12,
            fontSize: theme.typography.fontSizes[3].fontSize,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
        case 2:
        default:
          return {
            paddingVertical: 3,
            paddingHorizontal: 8,
            fontSize: theme.typography.fontSizes[2].fontSize,
            borderRadius: selectedRadius === 'full' ? 9999 : radii,
          };
      }
    };

    const sizeValues = getSizeValues();

    // Get colors based on variant and mode using the helper function
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    const badgeStyle: ViewStyle = {
      backgroundColor: variantColors.backgroundColor,
      borderColor: variantColors.borderColor,
      borderWidth: variant === 'outline' || 'surface' ? 1 : 0,
      borderRadius: sizeValues.borderRadius,
      paddingVertical: sizeValues.paddingVertical,
      paddingHorizontal: sizeValues.paddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const textStyle: TextStyle = {
      color: variantColors.textColor,
      fontSize: sizeValues.fontSize,
      fontWeight: '500',
    };

    return (
      <View
        ref={ref}
        style={[styles.badge, badgeStyle, style]}
        accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Badge')}
        accessibilityRole="none"
        {...rest}
      >
        {typeof children === 'string' ? (
          <Text style={[styles.text, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
});

export { Badge };
export type { BadgeProps };
