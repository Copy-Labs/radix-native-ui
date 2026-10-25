import type { ColorValue } from '../../theme/types';
import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface EmProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Em
   */
  style?: TextStyle;
  /**
   * Text color
   */
  color?: ColorValue;
}

type StyleProp<T> = T | T[];

const Em = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, EmProps>(
    ({ children, style = {}, color, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const emFont = theme.typography.fonts.em;

      const textStyle: TextStyle = useMemo(
        () => ({
          fontFamily: emFont.fontFamily,
          fontWeight: emFont.fontWeight,
          fontStyle: emFont.fontStyle,
          color: color || colors[12],
        }),
        [emFont, color, colors]
      );

      return (
        <Text ref={ref} style={[textStyle, style]} {...rest}>
          {children}
        </Text>
      );
    }
  )
);

Em.displayName = 'Em';

export { Em };
export type { EmProps };
