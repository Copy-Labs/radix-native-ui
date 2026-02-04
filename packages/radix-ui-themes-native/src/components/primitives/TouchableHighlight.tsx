import React from 'react';
import { TouchableHighlight as RNTouchableHighlight, TouchableHighlightProps as RNTouchableHighlightProps } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

export interface TouchableHighlightProps extends RNTouchableHighlightProps {}

export const RnTouchableHighlight = React.memo(
  React.forwardRef<React.ElementRef<typeof RNTouchableHighlight>, TouchableHighlightProps>(
    ({ style, underlayColor, ...rest }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;

      const defaultUnderlayColor = underlayColor || colors[3];

      return (
        <RNTouchableHighlight
          ref={ref}
          style={[{ backgroundColor: colors[1] }, style]}
          underlayColor={defaultUnderlayColor}
          {...rest}
        />
      );
    }
  )
);

RnTouchableHighlight.displayName = 'RnTouchableHighlight';

export default RnTouchableHighlight;
