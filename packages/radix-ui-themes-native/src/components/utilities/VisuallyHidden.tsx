import React from 'react';
import { StyleSheet, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';

interface VisuallyHiddenProps {
  /**
   * Content that should be available to assistive technologies
   */
  children: React.ReactNode;
  /**
   * Optional style overrides
   */
  style?: StyleProp<ViewStyle>;
}

type StyleProp<T> = T | T[];

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    borderWidth: 0,
    overflow: 'hidden',
    opacity: 0,
  },
});

const VisuallyHidden = React.forwardRef<React.ComponentRef<typeof RNView>, VisuallyHiddenProps>(
  ({ children, style }, ref) => {
    return (
      <View ref={ref} style={[styles.hidden, style]}>
        {children}
      </View>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
export type { VisuallyHiddenProps };
