import React, { useState, useCallback } from 'react';
import { Pressable as RNPressable, PressableProps as RNPressableProps, GestureResponderEvent, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

export interface PressableProps extends RNPressableProps {
  /**
   * Whether to use hover state (web-like behavior simulation)
   */
  enableHover?: boolean;
}

export const RnPressable = React.memo(
  React.forwardRef<React.ElementRef<typeof RNPressable>, PressableProps>(
    ({ style, onPressIn, onPressOut, disabled, enableHover, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;

      const [isHovered, setIsHovered] = useState(false);

      const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
          onPressIn?.(event);
        },
        [onPressIn]
      );

      const handlePressOut = useCallback(
        (event: GestureResponderEvent) => {
          onPressOut?.(event);
        },
        [onPressOut]
      );

      const handleHoverIn = useCallback(() => {
        if (enableHover) {
          setIsHovered(true);
        }
      }, [enableHover]);

      const handleHoverOut = useCallback(() => {
        if (enableHover) {
          setIsHovered(false);
        }
      }, [enableHover]);

      const themedStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => {
        const baseStyle: ViewStyle = { backgroundColor: colors[1] };
        const pressedStyle: ViewStyle = pressed && !disabled ? { opacity: 0.6 } : {};
        const hoverStyle: ViewStyle = isHovered && enableHover ? { backgroundColor: colors[2] } : {};

        const computedStyle: StyleProp<ViewStyle> = [baseStyle, pressedStyle, hoverStyle];

        if (typeof style === 'function') {
          return [computedStyle, style({ pressed })];
        }
        return [computedStyle, style];
      };

      return (
        <RNPressable
          ref={ref}
          style={themedStyle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          {...rest}
        />
      );
    }
  )
);

RnPressable.displayName = 'RnPressable';

export default RnPressable;
