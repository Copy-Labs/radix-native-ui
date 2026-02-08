import React from 'react';
import { FlatList as RNFlatList, FlatListProps as RNFlatListProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface FlatListProps<T> extends RNFlatListProps<T> {}

const FlatListComponent = React.memo(
  React.forwardRef<React.ElementRef<typeof RNFlatList>, FlatListProps<any>>(
    ({ style, contentContainerStyle, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      return (
        <RNFlatList
          ref={ref}
          style={[{ backgroundColor: colors[1] }, style]}
          contentContainerStyle={contentContainerStyle}
          {...rest}
        />
      );
    }
  )
) as <T>(props: FlatListProps<T> & { ref?: React.Ref<React.ComponentRef<typeof RNFlatList>> }) => React.ReactElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(FlatListComponent as any).displayName = 'RnFlatList';

export const RnFlatList = FlatListComponent;

export default RnFlatList;
