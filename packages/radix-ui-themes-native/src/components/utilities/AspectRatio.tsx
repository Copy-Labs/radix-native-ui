import React from 'react';
import { type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { View, type ViewProps } from '../primitives';

export interface AspectRatioProps extends Omit<ViewProps, 'style'> {
  /**
   * Aspect ratio of the container (width / height)
   * @default 1
   */
  ratio?: number;
  /**
   * Style overrides
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Children content
   */
  children?: React.ReactNode;
}

export const AspectRatio = React.forwardRef<React.ComponentRef<typeof RNView>, AspectRatioProps>(
  ({ ratio = 1, style, children, ...rest }, ref) => {
    return (
      <View ref={ref} style={[{ aspectRatio: ratio }, style]} {...rest}>
        {children}
      </View>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
