import React, { useMemo } from 'react';
import { type StyleProp, type ViewStyle, type ViewProps, View as RNView } from 'react-native';
import { Slot } from '../../components';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

// Padding size type (1-9 mapping to theme spacing scale)
type PaddingSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Side prop type
type InsetSide = 'all' | 'x' | 'y' | 'top' | 'bottom' | 'left' | 'right';

// Clip prop type
type InsetClip = 'overflow' | 'padding-box';

interface InsetProps extends ViewProps {
  /**
   * Whether to merge props onto the immediate child
   * @default false
   */
  asChild?: boolean;
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
   * - 'all': All four sides
   * - 'x': Horizontal (left and right)
   * - 'y': Vertical (top and bottom)
   * - 'top': Top only
   * - 'bottom': Bottom only
   * - 'left': Left only
   * - 'right': Right only
   * @default 'all'
   */
  side?: InsetSide;
  /**
   * Padding size (1-9) using theme spacing scale
   * @default 4
   */
  p?: PaddingSize;
  /**
   * Clip behavior for overflow content
   * - 'overflow': Clips content that overflows the container
   * - 'padding-box': Clips content to the padding box boundary
   */
  clip?: InsetClip;
  /**
   * @deprecated Use `p` instead. This prop will be removed in a future version.
   */
  trim?: PaddingSize;
}

// Padding styles lookup object (defined outside component for performance)
const getPaddingStyles = (side: InsetSide, spacing: number): ViewStyle => {
  const paddingMap: Record<InsetSide, ViewStyle> = {
    all: { padding: spacing },
    x: { paddingHorizontal: spacing },
    y: { paddingVertical: spacing },
    top: { paddingTop: spacing },
    bottom: { paddingBottom: spacing },
    left: { paddingLeft: spacing },
    right: { paddingRight: spacing },
  };
  return paddingMap[side] ?? paddingMap.all;
};

const Inset = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, InsetProps>(
    ({ asChild = false, children, style, side = 'all', p: pProp, trim, clip, ...rest }, ref) => {
      const theme = useTheme();

      // Support deprecated trim prop with warning
      const paddingSize = pProp ?? trim ?? 4;
      if (trim && !pProp) {
        console.warn(
          'Inset: `trim` prop is deprecated. Use `p` instead. This prop will be removed in a future version.'
        );
      }

      // Get spacing with fallback
      const spacing = theme.space[paddingSize] ?? theme.space[4] ?? 16;

      // Build style object
      const insetStyle: ViewStyle = useMemo(
        () => ({
          ...getPaddingStyles(side, spacing),
          ...(clip ? { overflow: 'hidden' as const } : {}),
        }),
        [side, spacing, clip]
      );

      const Comp = asChild ? Slot : View;

      return (
        <Comp ref={ref} style={[insetStyle, style]} {...rest}>
          {children}
        </Comp>
      );
    }
  )
);

Inset.displayName = 'Inset';

export { Inset };
export type { InsetProps };
