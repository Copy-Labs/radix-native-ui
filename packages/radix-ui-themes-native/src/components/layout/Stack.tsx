import React, { useMemo } from 'react';
import { DimensionValue, type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// Types
// ============================================================================

/**
 * Stack direction
 * - 'horizontal': stack items in a row
 * - 'vertical': stack items in a column
 */
export type StackDirection = 'horizontal' | 'vertical';

/**
 * Gap size using theme.space values
 */
export type StackGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Align items on cross axis
 */
export type StackAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

/**
 * Justify content on main axis
 */
export type StackJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Wrap behavior
 */
export type StackWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

export interface StackProps {
  /**
   * Children components
   */
  children?: React.ReactNode;

  /**
   * Stack direction
   * - 'horizontal': stack items in a row
   * - 'vertical': stack items in a column
   * @default 'vertical'
   */
  direction?: StackDirection;

  /**
   * Gap between items using theme.space scale (1-9)
   */
  gap?: StackGap;

  /**
   * Align items on cross axis
   */
  align?: StackAlign;

  /**
   * Justify content on main axis
   */
  justify?: StackJustify;

  /**
   * Wrap items
   * @default 'nowrap'
   */
  wrap?: StackWrap;

  /**
   * Whether to merge props onto immediate child
   */
  asChild?: boolean;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Width
   */
  width?: DimensionValue;

  /**
   * Height
   */
  height?: DimensionValue;

  /**
   * Flex grow
   */
  flexGrow?: number;

  /**
   * Flex shrink
   */
  flexShrink?: number;

  /**
   * Padding using theme.space scale
   */
  padding?: StackGap;

  /**
   * Background color
   */
  backgroundColor?: string;
}

// Omit direction for convenience wrappers
export interface VStackProps extends Omit<StackProps, 'direction'> {}
export interface HStackProps extends Omit<StackProps, 'direction'> {}

// ============================================================================
// Component
// ============================================================================

/**
 * Stack is a simplified flex container optimized for stacking elements with consistent gaps.
 *
 * @example
 * // Vertical stack (default)
 * <Stack gap={3}>
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 *   <Text>Item 3</Text>
 * </Stack>
 *
 * @example
 * // Horizontal stack
 * <Stack direction="horizontal" gap={2}>
 *   <Button>Cancel</Button>
 *   <Button>Confirm</Button>
 * </Stack>
 *
 * @example
 * // With wrap
 * <Stack direction="horizontal" gap={2} wrap="wrap">
 *   <Badge>Tag 1</Badge>
 *   <Badge>Tag 2</Badge>
 *   <Badge>Tag 3</Badge>
 * </Stack>
 */
const Stack = React.memo<StackProps>(
  ({
    children,
    direction = 'vertical',
    gap,
    align,
    justify,
    wrap = 'nowrap',
    asChild = false,
    style,
    width,
    height,
    flexGrow,
    flexShrink,
    padding,
    backgroundColor,
  }) => {
    const theme = useTheme();

    const stackStyle: ViewStyle = useMemo(() => {
      const baseStyle: ViewStyle = {
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        flexWrap: wrap,
      };

      // Add gap using theme.space
      if (gap !== undefined) {
        baseStyle.gap = theme.space[gap];
      }

      // Add alignment props
      if (align !== undefined) {
        baseStyle.alignItems = align;
      }

      if (justify !== undefined) {
        baseStyle.justifyContent = justify;
      }

      // Add dimension props
      if (width !== undefined) {
        baseStyle.width = width;
      }

      if (height !== undefined) {
        baseStyle.height = height;
      }

      // Add flex props
      if (flexGrow !== undefined) {
        baseStyle.flexGrow = flexGrow;
      }

      if (flexShrink !== undefined) {
        baseStyle.flexShrink = flexShrink;
      }

      // Add padding using theme.space
      if (padding !== undefined) {
        baseStyle.padding = theme.space[padding];
      }

      // Add background color
      if (backgroundColor !== undefined) {
        baseStyle.backgroundColor = backgroundColor;
      }

      return baseStyle;
    }, [direction, gap, align, justify, wrap, width, height, flexGrow, flexShrink, padding, backgroundColor, theme.space]);

    const Comp = asChild ? Slot : View;

    return (
      <Comp style={[stackStyle, style]}>
        {children}
      </Comp>
    );
  }
);

Stack.displayName = 'Stack';

// ============================================================================
// VStack - Vertical Stack convenience wrapper
// ============================================================================

/**
 * VStack is a Stack with direction="vertical" pre-set.
 *
 * @example
 * <VStack gap={4}>
 *   <Text>Vertical item 1</Text>
 *   <Text>Vertical item 2</Text>
 * </VStack>
 */
const VStack = React.memo<VStackProps>((props) => {
  return <Stack direction="vertical" {...props} />;
});

VStack.displayName = 'VStack';

// ============================================================================
// HStack - Horizontal Stack convenience wrapper
// ============================================================================

/**
 * HStack is a Stack with direction="horizontal" pre-set.
 *
 * @example
 * <HStack gap={2} align="center">
 *   <Text>Horizontal item 1</Text>
 *   <Text>Horizontal item 2</Text>
 * </HStack>
 */
const HStack = React.memo<HStackProps>((props) => {
  return <Stack direction="horizontal" {...props} />;
});

HStack.displayName = 'HStack';

export { Stack, VStack, HStack };
