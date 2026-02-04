import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Slot, Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface HeadingProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Heading
   */
  style?: StyleProp<TextStyle>;
  /**
   * Heading size (1-5)
   * @default 4
   */
  size?: 1 | 2 | 3 | 4 | 5;
  /**
   * Font weight
   * @default 'bold'
   */
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  /**
   * Text align
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Text color
   */
  color?: string;
  /**
   * Whether to truncate text
   */
  truncate?: boolean;
  /**
   * Number of lines for truncation
   */
  numberOfLines?: number;
  /**
   * Font family override
   */
  fontFamily?: string;
  /**
   * Opacity
   */
  opacity?: number;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Heading to optimize re-renders
const areEqual = (prevProps: HeadingProps, nextProps: HeadingProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.size === nextProps.size &&
    prevProps.weight === nextProps.weight &&
    prevProps.align === nextProps.align &&
    prevProps.color === nextProps.color &&
    prevProps.truncate === nextProps.truncate &&
    prevProps.numberOfLines === nextProps.numberOfLines &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.opacity === nextProps.opacity
  ) {
    return true;
  }
  return false;
};

const Heading = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, HeadingProps>(
    (
      {
        asChild = false,
        children,
        style = {},
        size = 4,
        weight = 'bold',
        align,
        color,
        truncate,
        numberOfLines,
        fontFamily,
        opacity,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const fontSizes = theme.typography.fontSizes[size];
      const fontWeights = theme.typography.fontWeights;
      const headingFont = theme.typography.fonts.heading;

      // Map size 1-5 to fontSizes index (5 = size 7, 4 = size 6, 3 = size 5, 2 = size 4, 1 = size 3)
      const sizeMap: Record<number, keyof typeof theme.typography.fontSizes> = {
        1: 3,
        2: 4,
        3: 5,
        4: 6,
        5: 7,
      };
      const fontSizeKey = sizeMap[size] || 6;
      const fontSizeSpec = theme.typography.fontSizes[fontSizeKey];

      const textStyle: TextStyle = useMemo(
        () => ({
          fontSize: fontSizeSpec.fontSize,
          lineHeight: fontSizeSpec.lineHeight,
          letterSpacing: fontSizeSpec.letterSpacing,
          fontFamily: fontFamily || headingFont.fontFamily,
          fontWeight: fontWeights[weight] || headingFont.fontWeight,
          fontStyle: headingFont.fontStyle,
          textAlign: align,
          color: color || colors[12],
          opacity,
        }),
        [fontSizeSpec, fontFamily, headingFont, fontWeights, weight, align, color, opacity, colors]
      );

      const Comp = asChild ? Slot : Text;

      return (
        <Comp
          ref={ref}
          style={[textStyle, style]}
          numberOfLines={truncate ? numberOfLines : undefined}
          {...rest}
        >
          {children}
        </Comp>
      );
    }
  ),
  areEqual
);

Heading.displayName = 'Heading';

export { Heading };
export type { HeadingProps };
