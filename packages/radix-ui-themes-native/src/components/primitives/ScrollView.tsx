import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps as RNScrollViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ScrollViewProps extends RNScrollViewProps {}

export const RnScrollView = React.memo(
  React.forwardRef<React.ElementRef<typeof RNScrollView>, ScrollViewProps>(
    ({ style, contentContainerStyle, children, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      return (
        <RNScrollView
          ref={ref}
          style={[{ backgroundColor: colors[1] }, style]}
          contentContainerStyle={contentContainerStyle}
          {...rest}
        >
          {children}
        </RNScrollView>
      );
    }
  )
);

RnScrollView.displayName = 'RnScrollView';

export default RnScrollView;
