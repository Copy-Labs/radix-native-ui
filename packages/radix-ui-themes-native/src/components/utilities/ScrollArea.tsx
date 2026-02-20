import React from 'react';
import { type ScrollView as RNScrollView } from 'react-native';
import { ScrollView, type ScrollViewProps } from '../primitives';

/**
 * ScrollArea is a semantic wrapper around ScrollView for designating scrollable regions.
 * It inherits all props from the primitive ScrollView and provides theme-aware styling.
 *
 * @example
 * ```tsx
 * <ScrollArea style={{ height: 300 }}>
 *   <Text>Scrollable content here</Text>
 * </ScrollArea>
 * ```
 */
export type ScrollAreaProps = ScrollViewProps;

export const ScrollArea = React.forwardRef<React.ComponentRef<typeof RNScrollView>, ScrollAreaProps>(
  (props, ref) => {
    return <ScrollView ref={ref} {...props} />;
  }
);

ScrollArea.displayName = 'ScrollArea';
