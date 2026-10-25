import type { ColorValue } from '../../theme/types';
import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface CodeProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Code
   */
  style?: TextStyle;
  /**
   * Text size (1-9)
   * @default 2
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * Text color
   */
  color?: ColorValue;
  /**
   * Background color
   */
  backgroundColor?: string;
}

type StyleProp<T> = T | T[];

const Code = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, CodeProps>(
    ({ children, style = {}, size = 2, color, backgroundColor, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const codeFont = theme.typography.fonts.code;
      const fontSizes = theme.typography.fontSizes[size];

      const textStyle: TextStyle = useMemo(
        () => ({
          fontFamily: codeFont.fontFamily,
          fontWeight: codeFont.fontWeight,
          fontStyle: codeFont.fontStyle,
          fontSize: fontSizes.fontSize,
          lineHeight: fontSizes.lineHeight,
          letterSpacing: fontSizes.letterSpacing,
          color: color || (isDark ? colors[11] : colors[10]),
          backgroundColor: backgroundColor || (isDark ? colors[2] : colors[3]),
        }),
        [codeFont, fontSizes, color, backgroundColor, isDark, colors]
      );

      return (
        <Text ref={ref} style={[textStyle, style]} {...rest}>
          {children}
        </Text>
      );
    }
  )
);

Code.displayName = 'Code';

export { Code };
export type { CodeProps };
