import React, { useState, useCallback } from 'react';
import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps as RNTouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';


export interface TouchableOpacityProps extends RNTouchableOpacityProps {}

export const RnTouchableOpacity = React.memo(
  React.forwardRef<React.ElementRef<typeof RNTouchableOpacity>, TouchableOpacityProps>(
    ({ style, onPressIn, onPressOut, disabled, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;

      const [isPressed, setIsPressed] = useState(false);

      const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
          setIsPressed(true);
          onPressIn?.(event);
        },
        [onPressIn]
      );

      const handlePressOut = useCallback(
        (event: GestureResponderEvent) => {
          setIsPressed(false);
          onPressOut?.(event);
        },
        [onPressOut]
      );

      return (
        <RNTouchableOpacity
          ref={ref}
          style={[
            { backgroundColor: colors[1] },
            style,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          {...rest}
        />
      );
    }
  )
);

RnTouchableOpacity.displayName = 'RnTouchableOpacity';

export default RnTouchableOpacity;
