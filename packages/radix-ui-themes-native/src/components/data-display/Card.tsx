import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getGrayAlpha,
} from '../../theme/color-helpers';

interface CardProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Card size (affects padding)
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * Card variant
   * @default 'classic'
   */
  variant?: 'classic' | 'surface' | 'outline' | 'ghost';
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
      size = 2,
      variant = 'classic',
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
    const radii = theme.radii;

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
            backgroundColor: isDark ? grayAlpha['3'] : grayAlpha['2'],
            borderColor: 'transparent',
            borderWidth: 0,
          };
        case 'outline':
          return {
            backgroundColor: isDark ? grayAlpha['4'] : grayAlpha['2'],
            borderColor: isDark ? grayAlpha['7'] : grayAlpha['8'],
            borderWidth: 1,
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
          };
        case 'classic':
        default:
          return {
            backgroundColor: isDark ? grayAlpha['4'] : grayAlpha['3'],
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
      borderRadius: radii[3],
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
