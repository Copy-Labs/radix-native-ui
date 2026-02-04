import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface KbdProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Kbd
   */
  style?: TextStyle;
  /**
   * Text color
   */
  color?: string;
  /**
   * Background color
   */
  backgroundColor?: string;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Kbd to optimize re-renders
const areEqual = (prevProps: KbdProps, nextProps: KbdProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.color === nextProps.color &&
    prevProps.backgroundColor === nextProps.backgroundColor
  ) {
    return true;
  }
  return false;
};

const Kbd = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, KbdProps>(
    ({ children, style = {}, color, backgroundColor, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const radii = theme.radii;

      const textStyle: TextStyle = useMemo(
        () => ({
          fontFamily: 'System',
          fontWeight: '500',
          fontSize: theme.typography.fontSizes[1].fontSize,
          lineHeight: theme.typography.fontSizes[1].lineHeight,
          letterSpacing: theme.typography.fontSizes[1].letterSpacing,
          color: color || colors[12],
          backgroundColor: backgroundColor || (isDark ? colors[3] : colors[5]),
        }),
        [color, backgroundColor, isDark, colors, theme]
      );

      const containerStyle: TextStyle = useMemo(
        () => ({
          borderRadius: radii[1],
          paddingHorizontal: theme.space[2],
          paddingVertical: theme.space[1],
        }),
        [radii, theme]
      );

      return (
        <Text ref={ref} style={[containerStyle, textStyle, style]} {...rest}>
          {children}
        </Text>
      );
    }
  ),
  areEqual
);

Kbd.displayName = 'Kbd';

export { Kbd };
export type { KbdProps };
