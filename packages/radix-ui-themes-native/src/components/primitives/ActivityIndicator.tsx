import React from 'react';
import { ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps as RNActivityIndicatorProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ActivityIndicatorProps extends RNActivityIndicatorProps {}

export const RnActivityIndicator = React.memo(
  React.forwardRef<React.ElementRef<typeof RNActivityIndicator>, ActivityIndicatorProps>(
    ({ color, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
      const accentColors = mode === 'dark'
        ? theme.colors[theme.accentColor as keyof typeof theme.colors]?.dark
        : theme.colors[theme.accentColor as keyof typeof theme.colors];

      // Use accent color or fallback to gray
      const defaultColor = color || (accentColors ? accentColors[9] : colors[9]);

      return (
        <RNActivityIndicator
          ref={ref}
          color={defaultColor}
          {...rest}
        />
      );
    }
  )
);

RnActivityIndicator.displayName = 'RnActivityIndicator';

export default RnActivityIndicator;
