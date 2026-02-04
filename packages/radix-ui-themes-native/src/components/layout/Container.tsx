import React, { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

interface ContainerProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Size of the container (1-4)
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;
  /**
   * Whether to disable responsive behavior
   */
  responsive?: boolean;
}

// Container max widths matching Radix Themes
const containerMaxWidths = {
  1: 448,   // Small
  2: 512,   // Medium (default)
  3: 640,   // Large
  4: 896,   // XLarge
};

// Breakpoint widths for responsive behavior
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

// Custom areEqual function for Container to optimize re-renders
const areEqual = (prevProps: ContainerProps, nextProps: ContainerProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.size === nextProps.size &&
    prevProps.responsive === nextProps.responsive
  ) {
    return true;
  }
  return false;
};

const Container = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, ContainerProps>(
    (
      {
        children,
        style,
        size = 2,
        responsive = true,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();

      // Get max width based on size
      const maxWidth = containerMaxWidths[size];

      // For responsive containers, we apply different max widths based on screen width
      // In React Native, we typically handle this with media queries or responsive hooks
      // For now, we'll use the maxWidth directly and let consumers handle responsiveness
      const containerStyle: ViewStyle = useMemo(
        () => ({
          width: '100%',
          maxWidth: responsive ? maxWidth : undefined,
          paddingHorizontal: theme.space[4],
          backgroundColor: 'transparent',
        }),
        [responsive, maxWidth, theme]
      );

      return (
        <View
          ref={ref}
          style={[containerStyle, style]}
          {...rest}
        >
          {children}
        </View>
      );
    }
  ),
  areEqual
);

Container.displayName = 'Container';

export { Container };
export type { ContainerProps };
