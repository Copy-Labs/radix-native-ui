import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';

interface CardProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Card size (affects padding)
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Card variant
   * @default 'solid'
   */
  variant?: 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

interface CardFooterProps {
  children: ReactNode;
  /**
   * Whether to separate footer with a border
   */
  separate?: boolean;
}

interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<any>> {
  Footer: React.FC<CardFooterProps>;
}

const Card = React.forwardRef<any, CardProps>(
  (
    {
      asChild = false,
      children,
      color,
      radius = 'medium',
      size = 2,
      highContrast = false,
      variant = 'solid',
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
    // const radii = theme.radii;
    const radii = theme.radii[radius] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case 1:
          return { padding: theme.space[3] };
        case 2:
          return { padding: theme.space[4] };
        case 3:
          return { padding: theme.space[5] };
        case 4:
          return { padding: theme.space[6] };
        default:
          return { padding: theme.space[4] };
      }
    };

    const sizeValues = getSizeValues();

    // Get variant styles - using alpha colors for better transparency
    const getVariantStyles = () => {
      switch (variant) {
        case 'surface':
          return {
            backgroundColor: color ? variantColors.backgroundColor : isDark ? grayAlpha['3'] : grayAlpha['2'],
            borderColor: color ? variantColors.borderColor : isDark ? grayAlpha['7'] : grayAlpha['8'],
            borderWidth: 0.5,
          };
        case 'soft':
          return {
            backgroundColor: color ? variantColors.backgroundColor : isDark ? grayAlpha['3'] : grayAlpha['2'],
            borderColor: 'transparent',
            borderWidth: 0,
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: color ? variantColors.borderColor : isDark ? grayAlpha['7'] : grayAlpha['8'],
            borderWidth: 0.6,
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
          };
        case 'solid':
        default:
          return {
            backgroundColor: color ? variantColors.backgroundColor : isDark ? grayAlpha['4'] : grayAlpha['3'],
            borderColor: 'transparent',
            borderWidth: 0,
          };
      }
    };

    const variantStyles = getVariantStyles();

    // Get shadow from theme based on mode
    const shadows = isDark ? theme.shadows.dark : theme.shadows.light;
    const shadowStyle = shadows?.[2]?.[0] || {};

    const cardStyle: ViewStyle = {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: variantStyles.borderWidth,
      borderRadius: selectedRadius === 'full' ? 9999 : radii, // radii.medium,
      padding: sizeValues.padding,
      ...shadowStyle,
    };

    if (asChild) {
      return (
        <Slot ref={ref} style={style as any} {...rest}>
          <View style={[styles.card, cardStyle]}>
            {children}
          </View>
        </Slot>
      );
    }

    return (
      <View
        ref={ref}
        style={[styles.card, cardStyle, style]}
        {...rest}
      >
        {children}
      </View>
    );
  }
) as CardComponent;

Card.displayName = 'Card';

// CardFooter sub-component
const CardFooter = ({ children, separate = true }: CardFooterProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayAlpha = getGrayAlpha(theme);

  return (
    <View
      style={[
        styles.footer,
        separate && {
          borderTopWidth: 1,
          borderTopColor: grayAlpha['6'],
          marginTop: theme.space[4],
          paddingTop: theme.space[4],
        },
      ]}
    >
      {children}
    </View>
  );
};

Card.Footer = CardFooter;

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});

export { Card };
export type { CardProps, CardFooterProps };
