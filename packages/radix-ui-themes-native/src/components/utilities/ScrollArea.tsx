import React from 'react';
import { type StyleProp, type ViewStyle, ScrollView as RNScrollView } from 'react-native';
import { ScrollView, type ScrollViewProps } from '../primitives';

export interface ScrollAreaProps extends Omit<ScrollViewProps, 'style'> {
  /**
   * Style prop for the ScrollArea
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Content container style
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Children components
   */
  children?: React.ReactNode;
}

export const ScrollArea = React.forwardRef<React.ComponentRef<typeof RNScrollView>, ScrollAreaProps>(
  ({ style, contentContainerStyle, children, ...rest }, ref) => {
    return (
      <ScrollView ref={ref} style={style} contentContainerStyle={contentContainerStyle} {...rest}>
        {children}
      </ScrollView>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
