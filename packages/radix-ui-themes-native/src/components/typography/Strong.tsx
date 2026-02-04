import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText } from 'react-native';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface StrongProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Strong
   */
  style?: TextStyle;
  /**
   * Text color
   */
  color?: string;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Strong to optimize re-renders
const areEqual = (prevProps: StrongProps, nextProps: StrongProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.color === nextProps.color
  ) {
    return true;
  }
  return false;
};

const Strong = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, StrongProps>(
    ({ children, style = {}, color, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const strongFont = theme.typography.fonts.strong;

      const textStyle: TextStyle = useMemo(
        () => ({
          fontFamily: strongFont.fontFamily,
          fontWeight: strongFont.fontWeight,
          fontStyle: strongFont.fontStyle,
          color: color || colors[12],
        }),
        [strongFont, color, colors]
      );

      return (
        <Text ref={ref} style={[textStyle, style]} {...rest}>
          {children}
        </Text>
      );
    }
  ),
  areEqual
);

Strong.displayName = 'Strong';

export { Strong };
export type { StrongProps };
