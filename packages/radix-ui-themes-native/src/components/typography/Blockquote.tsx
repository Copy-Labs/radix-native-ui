import React, { useMemo } from 'react';
import { type ViewStyle, type TextStyle, Text as RNText } from 'react-native';
import { View } from '../primitives';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface BlockquoteProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Blockquote
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Text style prop
   */
  textStyle?: TextStyle;
  /**
   * Text color
   */
  color?: string;
  /**
   * Border color
   */
  borderColor?: string;
  /**
   * Quote color
   */
  quoteColor?: string;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Blockquote to optimize re-renders
const areEqual = (prevProps: BlockquoteProps, nextProps: BlockquoteProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.textStyle === nextProps.textStyle &&
    prevProps.color === nextProps.color &&
    prevProps.borderColor === nextProps.borderColor &&
    prevProps.quoteColor === nextProps.quoteColor
  ) {
    return true;
  }
  return false;
};

const Blockquote = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, BlockquoteProps>(
    ({ children, style, textStyle = {}, color, borderColor, quoteColor, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const quoteFont = theme.typography.fonts.quote;
      const radii = theme.radii;

      const containerStyle: ViewStyle = useMemo(
        () => ({
          borderLeftWidth: 4,
          borderLeftColor: borderColor || colors[6],
          paddingLeft: theme.space[4],
          marginVertical: theme.space[3],
        }),
        [borderColor, colors, theme]
      );

      const textStyleObj: TextStyle = useMemo(
        () => ({
          fontFamily: quoteFont.fontFamily,
          fontWeight: quoteFont.fontWeight,
          fontStyle: quoteFont.fontStyle,
          fontSize: theme.typography.fontSizes[3].fontSize,
          lineHeight: theme.typography.fontSizes[3].lineHeight,
          color: color || colors[11],
        }),
        [quoteFont, color, colors, theme]
      );

      return (
        <View ref={ref} style={[containerStyle, style]} {...rest}>
          <Text style={[textStyleObj, textStyle]}>
            {/* Render quote symbol before content */}
            <Text style={{ color: quoteColor || colors[6], fontSize: 24 }}>"</Text>
            {children}
            <Text style={{ color: quoteColor || colors[6], fontSize: 24 }}>"</Text>
          </Text>
        </View>
      );
    }
  ),
  areEqual
);

Blockquote.displayName = 'Blockquote';

export { Blockquote };
export type { BlockquoteProps };
