import React from 'react';
import { type ViewStyle, type TextStyle, type ImageStyle } from 'react-native';

/**
 * Props for the Slot component
 */
interface SlotProps {
  /**
   * Single child element to clone and merge props onto
   */
  children: React.ReactNode;
  /**
   * Style to merge onto the child
   */
  style?: ViewStyle | TextStyle | ImageStyle | (ViewStyle | TextStyle | ImageStyle)[];
  /**
   * Ref to forward to the child
   */
  ref?: React.Ref<any>;
}

/**
 * Merges two style objects/arrays into a single array
 * The child's style takes precedence over the slot's style
 */
function mergeStyles(
  slotStyle: SlotProps['style'],
  childStyle: SlotProps['style']
): (ViewStyle | TextStyle | ImageStyle)[] {
  const slotStyles = slotStyle ? (Array.isArray(slotStyle) ? slotStyle : [slotStyle]) : [];
  const childStyles = childStyle ? (Array.isArray(childStyle) ? childStyle : [childStyle]) : [];
  return [...slotStyles, ...childStyles];
}

/**
 * Slot component for React Native
 *
 * The Slot component is used to merge props onto the immediate child element.
 * This is useful for creating polymorphic components that can render as different
 * elements while still maintaining their styling and behavior.
 *
 * @example
 * ```tsx
 * <Slot style={{ padding: 10 }}>
 *   <View style={{ backgroundColor: 'red' }}>
 *     <Text>Content</Text>
 *   </View>
 * </Slot>
 * // Results in: <View style={[{ padding: 10 }, { backgroundColor: 'red' }]}>
 * ```
 */
const Slot = React.forwardRef<any, SlotProps>(
  ({ children, style, ...props }, forwardedRef) => {
    // Validate that we have a single valid React element as children
    if (!React.isValidElement(children)) {
      console.warn('Slot component expects a single React element as children');
      return null;
    }

    // Get the child's props
    const childProps = children.props as Record<string, any>;

    // Merge styles: slot style first, then child style (child takes precedence)
    const mergedStyle = mergeStyles(style, childProps.style);

    // Merge all props: child props first, then slot props
    // Slot props take precedence except for style which is merged
    const mergedProps: Record<string, any> = {
      ...childProps,
      ...props,
      style: mergedStyle,
    };

    // Handle ref merging - use the forwarded ref
    if (forwardedRef) {
      mergedProps.ref = forwardedRef;
    }

    // Clone the element with merged props
    return React.cloneElement(children, mergedProps);
  }
);

Slot.displayName = 'Slot';

export { Slot };
export type { SlotProps };
