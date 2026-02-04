import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Slot } from '../../components';
import { PrimitiveText as RnText } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Color } from '@/theme';

interface TextProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Text
   */
  style?: StyleProp<TextStyle>;
  /**
   * Text size (1-9)
   * @default 3
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * Font weight
   */
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  /**
   * Text align
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Text color
   */
  color?: Color;
  /**
   * Whether to truncate text
   */
  truncate?: boolean | 'character' | 'token';
  /**
   * Number of lines for truncation
   */
  numberOfLines?: number;
  /**
   * Font family
   */
  fontFamily?: string;
  /**
   * Font style (normal or italic)
   */
  fontStyle?: 'normal' | 'italic';
  /**
   * Line height
   */
  lineHeight?: number;
  /**
   * Letter spacing
   */
  letterSpacing?: number;
  /**
   * Text decoration line
   */
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  /**
   * Opacity
   */
  opacity?: number;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Text to optimize re-renders
const areEqual = (prevProps: TextProps, nextProps: TextProps) => {
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
    prevProps.fontStyle === nextProps.fontStyle &&
    prevProps.lineHeight === nextProps.lineHeight &&
    prevProps.letterSpacing === nextProps.letterSpacing &&
    prevProps.textDecorationLine === nextProps.textDecorationLine &&
    prevProps.opacity === nextProps.opacity
  ) {
    return true;
  }
  return false;
};

const TextComponent = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
    (
      {
        asChild = false,
        children,
        style,
        size = 3,
        weight,
        align,
        color,
        truncate,
        numberOfLines,
        fontFamily,
        fontStyle,
        lineHeight,
        letterSpacing,
        textDecorationLine,
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

      // Determine font weight
      const fontWeight = weight ? fontWeights[weight] : undefined;

      // Determine text color
      const textColor = color || colors[12];

      // Determine truncation
      const truncateLines = truncate
        ? typeof truncate === 'number'
          ? truncate
          : numberOfLines
        : numberOfLines;

      const textStyle: TextStyle = useMemo(
        () => ({
          fontSize: fontSizes.fontSize,
          lineHeight: fontSizes.lineHeight,
          letterSpacing: fontSizes.letterSpacing,
          fontFamily,
          fontWeight,
          fontStyle,
          textAlign: align,
          color: textColor,
          textDecorationLine,
          opacity,
          // For character truncation, we need a different approach
          // This is a simplified version - full token/character truncation would need more work
        }),
        [
          fontSizes,
          fontFamily,
          fontWeight,
          fontStyle,
          align,
          textColor,
          textDecorationLine,
          opacity,
        ]
      );

      const Comp = asChild ? Slot : RnText;

      return (
        <Comp ref={ref} style={[textStyle, style]} numberOfLines={truncateLines} {...rest}>
          {children}
        </Comp>
      );
    }
  ),
  areEqual
);

TextComponent.displayName = 'Text';

export { TextComponent as Text };
export type { TextProps };
