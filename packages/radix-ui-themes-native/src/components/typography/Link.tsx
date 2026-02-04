import React from 'react';
import { type TextStyle, Pressable as RNPressable } from 'react-native';
import { Pressable } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface LinkProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Link
   */
  style?: StyleProp<TextStyle>;
  /**
   * Href for the link
   */
  href?: string;
  /**
   * Callback when link is pressed
   */
  onPress?: (event: import('react-native').GestureResponderEvent) => void;
  /**
   * Text color
   */
  color?: string;
  /**
   * Whether the link is disabled
   */
  disabled?: boolean;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

type StyleProp<T> = T | T[];

const Link = React.forwardRef<React.ComponentRef<typeof RNPressable>, LinkProps>(
  ({ children, style, href, onPress, color, disabled, accessibilityLabel, ...rest }, ref) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;

    const textStyle: TextStyle = {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: theme.typography.fontSizes[3].fontSize,
      lineHeight: theme.typography.fontSizes[3].lineHeight,
      color: color || colors[9],
      textDecorationLine: 'underline',
    };

    const handlePress = (event: import('react-native').GestureResponderEvent) => {
      if (!disabled) {
        onPress?.(event);
        // In a real app, you might handle href navigation here
        if (href) {
          // Handle deep linking or URL opening
          console.log('Link pressed:', href);
        }
      }
    };

    return (
      <Pressable
        ref={ref}
        style={[textStyle, style]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="link"
        accessibilityLabel={
          accessibilityLabel || (typeof children === 'string' ? children : undefined)
        }
        accessibilityState={{ disabled }}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }
);

Link.displayName = 'Link';

export { Link };
export type { LinkProps };
