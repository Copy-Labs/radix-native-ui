import React from 'react';
import { View as RNView, ViewProps as RNViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ViewProps extends RNViewProps {
  /**
   * Whether to wrap children in a flex row
   */
  wrap?: boolean;
}

export const RnView = React.memo(
  React.forwardRef<React.ElementRef<typeof RNView>, ViewProps>(
    ({ style, wrap, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      const themedStyle = wrap ? { flexDirection: 'row' as const } : undefined;

      return (
        <RNView
          ref={ref}
          style={[{
            // backgroundColor: colors[1]
          }, themedStyle, style]}
          {...rest}
        />
      );
    }
  )
);

RnView.displayName = 'RnView';

export default RnView;
