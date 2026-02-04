import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextProps extends RNTextProps {
  /**
   * Whether this is a selectable text
   */
  selectable?: boolean;
}

export const RnText = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
    ({ style, selectable, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      return (
        <RNText
          ref={ref}
          style={[{ color: colors[12] }, style]}
          selectable={selectable}
          {...rest}
        />
      );
    }
  )
);

RnText.displayName = 'RnText';

export default RnText;
