import React, { useMemo } from 'react';
import { type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

interface InsetProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Inset
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Side(s) to apply padding to
   * @default 'all'
   */
  side?: 'all' | 'horizontal' | 'vertical' | 'top' | 'bottom' | 'left' | 'right';
  /**
   * Inset size (1-9)
   * @default 4
   */
  trim?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

// Custom areEqual function for Inset to optimize re-renders
const areEqual = (prevProps: InsetProps, nextProps: InsetProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.side === nextProps.side &&
    prevProps.trim === nextProps.trim
  ) {
    return true;
  }
  return false;
};

const Inset = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, InsetProps>(
    (
      {
        children,
        style,
        side = 'all',
        trim = 4,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const spacing = theme.space[trim];

      // Calculate padding based on side prop
      const getPadding = (): ViewStyle => {
        switch (side) {
          case 'all':
            return { padding: spacing };
          case 'horizontal':
            return { paddingHorizontal: spacing };
          case 'vertical':
            return { paddingVertical: spacing };
          case 'top':
            return { paddingTop: spacing };
          case 'bottom':
            return { paddingBottom: spacing };
          case 'left':
            return { paddingLeft: spacing };
          case 'right':
            return { paddingRight: spacing };
          default:
            return { padding: spacing };
        }
      };

      const insetStyle: ViewStyle = useMemo(
        () => getPadding(),
        [side, spacing]
      );

      return (
        <View
          ref={ref}
          style={[insetStyle, style]}
          {...rest}
        >
          {children}
        </View>
      );
    }
  ),
  areEqual
);

Inset.displayName = 'Inset';

export { Inset };
export type { InsetProps };
