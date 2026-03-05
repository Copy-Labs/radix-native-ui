import React, { useMemo } from 'react';
import { type TextStyle, Text as RNText, View } from 'react-native';
import { Text } from '../../components';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Color } from '../../theme';

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
  color?: Color;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Size of the Kbd (1-9)
   * @default 1
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

type StyleProp<T> = T | T[];

// Custom areEqual function for Kbd to optimize re-renders
const areEqual = (prevProps: KbdProps, nextProps: KbdProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.color === nextProps.color &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.size === nextProps.size
  ) {
    return true;
  }
  return false;
};

const Kbd = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, KbdProps>(
    ({ children, style = {}, color, backgroundColor, size = 1, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const radii = theme.radii;

      // Get font size config based on size prop
      const fontSizeConfig = theme.typography.fontSizes[size];

      // Determine text color - match Text component pattern
      const textColor = theme.colors[color!]?.['11'] || color || colors[12];

      // Background color for the key
      const bgColor = backgroundColor || (isDark ? colors[3] : colors[2]);

      const textStyle: TextStyle = useMemo(
        () => ({
          fontFamily: 'System',
          fontWeight: '500',
          fontSize: fontSizeConfig.fontSize,
          lineHeight: fontSizeConfig.lineHeight,
          letterSpacing: fontSizeConfig.letterSpacing,
          color: textColor,
        }),
        [textColor, fontSizeConfig]
      );

      const containerStyle: TextStyle = useMemo(
        () => ({
          borderRadius: size > 5 ? radii.large : radii.medium,
          paddingHorizontal: theme.space[2],
          paddingTop: theme.space[1],
          paddingBottom: theme.space[1] + 2, // Extra padding at bottom for key depth
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
          // Border styling to create keyboard key depth effect
          borderWidth: 1,
          borderColor: isDark ? colors[6] : colors[5],
          borderBottomWidth: size < 7 ? 3 : size === 9 ? 5 : 4, // Thicker bottom border for key depth
          borderBottomColor: isDark ? colors[7] : colors[6],
        }),
        [radii, theme, isDark, colors, bgColor, size]
      );

      return (
        <View style={[containerStyle]}>
          <Text ref={ref} style={[textStyle, style]} {...rest}>
            {children}
          </Text>
        </View>
      );
    }
  ),
  areEqual
);

Kbd.displayName = 'Kbd';

export { Kbd };
export type { KbdProps };
