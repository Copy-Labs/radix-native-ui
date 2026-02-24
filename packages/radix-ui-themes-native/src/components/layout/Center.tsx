import React, { useMemo } from 'react';
import { DimensionValue, type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';
import type { RadiusSize } from '../../theme/types';

// ============================================================================
// Types
// ============================================================================

/**
 * Axis to center on
 * - 'horizontal': center horizontally only
 * - 'vertical': center vertically only
 * - 'both': center on both axes
 */
export type CenterAxis = 'horizontal' | 'vertical' | 'both';

export interface CenterProps {
  /**
   * Children components
   */
  children?: React.ReactNode;

  /**
   * Axis to center on
   * - 'horizontal': center horizontally only
   * - 'vertical': center vertically only
   * - 'both': center on both axes (default)
   * @default 'both'
   */
  axis?: CenterAxis;

  /**
   * Whether to merge props onto immediate child
   */
  asChild?: boolean;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Width of the center container
   */
  width?: DimensionValue;

  /**
   * Height of the center container
   */
  height?: DimensionValue;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Border radius using theme radius scale
   */
  radius?: RadiusSize;
}

// Omit axis for convenience wrappers
export interface HCenterProps extends Omit<CenterProps, 'axis'> {}
export interface VCenterProps extends Omit<CenterProps, 'axis'> {}
export interface AbsoluteCenterProps extends Omit<CenterProps, 'axis'> {}

// ============================================================================
// Center Component
// ============================================================================

/**
 * Center is a utility component for centering content horizontally, vertically, or both.
 *
 * @example
 * // Center both axes (default)
 * <Center style={{ height: 200 }}>
 *   <Text>Centered content</Text>
 * </Center>
 *
 * @example
 * // Center horizontally only
 * <Center axis="horizontal">
 *   <Text>Horizontally centered</Text>
 * </Center>
 *
 * @example
 * // Center vertically only
 * <Center axis="vertical" style={{ height: 200 }}>
 *   <Text>Vertically centered</Text>
 * </Center>
 *
 * @example
 * // Full screen center
 * <Center width="100%" height="100%">
 *   <Spinner />
 * </Center>
 */
const Center = React.memo<CenterProps>(
  ({
    children,
    axis = 'both',
    asChild = false,
    style,
    width,
    height,
    backgroundColor,
    radius,
  }) => {
    const theme = useTheme();

    const centerStyle: ViewStyle = useMemo(() => {
      const baseStyle: ViewStyle = {
        display: 'flex',
      };

      // Apply centering based on axis
      switch (axis) {
        case 'horizontal':
          baseStyle.alignItems = 'center';
          break;
        case 'vertical':
          baseStyle.justifyContent = 'center';
          break;
        case 'both':
        default:
          baseStyle.alignItems = 'center';
          baseStyle.justifyContent = 'center';
          break;
      }

      // Add dimension props
      if (width !== undefined) {
        baseStyle.width = width;
      }

      if (height !== undefined) {
        baseStyle.height = height;
      }

      // Add background color
      if (backgroundColor !== undefined) {
        baseStyle.backgroundColor = backgroundColor;
      }

      // Add border radius from theme
      if (radius !== undefined) {
        baseStyle.borderRadius = theme.radii[radius];
      }

      return baseStyle;
    }, [axis, width, height, backgroundColor, radius, theme.radii]);

    const Comp = asChild ? Slot : View;

    return (
      <Comp style={[centerStyle, style]}>
        {children}
      </Comp>
    );
  }
);

Center.displayName = 'Center';

// ============================================================================
// HCenter - Horizontal Center convenience wrapper
// ============================================================================

/**
 * HCenter is a Center with axis="horizontal" pre-set.
 *
 * @example
 * <HCenter>
 *   <Text>Horizontally centered</Text>
 * </HCenter>
 */
const HCenter = React.memo<HCenterProps>((props) => {
  return <Center axis="horizontal" {...props} />;
});

HCenter.displayName = 'HCenter';

// ============================================================================
// VCenter - Vertical Center convenience wrapper
// ============================================================================

/**
 * VCenter is a Center with axis="vertical" pre-set.
 *
 * @example
 * <VCenter style={{ height: 200 }}>
 *   <Text>Vertically centered</Text>
 * </VCenter>
 */
const VCenter = React.memo<VCenterProps>((props) => {
  return <Center axis="vertical" {...props} />;
});

VCenter.displayName = 'VCenter';

// ============================================================================
// AbsoluteCenter Component
// ============================================================================

/**
 * AbsoluteCenter is a component for centering content using absolute positioning.
 *
 * @example
 * // Absolute center within a positioned parent
 * <Box style={{ position: 'relative', width: 200, height: 200 }}>
 *   <AbsoluteCenter>
 *     <Spinner />
 *   </AbsoluteCenter>
 * </Box>
 *
 * @example
 * // Overlay center
 * <Box style={{ position: 'absolute', inset: 0 }}>
 *   <AbsoluteCenter>
 *     <Text>Loading...</Text>
 *   </AbsoluteCenter>
 * </Box>
 */
const AbsoluteCenter = React.memo<AbsoluteCenterProps>(
  ({
    children,
    asChild = false,
    style,
    width,
    height,
    backgroundColor,
    radius,
  }) => {
    const theme = useTheme();

    const absoluteCenterStyle: ViewStyle = useMemo(() => {
      const baseStyle: ViewStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: -25 }],
      };

      // Add dimension props
      if (width !== undefined) {
        baseStyle.width = width;
      }

      if (height !== undefined) {
        baseStyle.height = height;
      }

      // Add background color
      if (backgroundColor !== undefined) {
        baseStyle.backgroundColor = backgroundColor;
      }

      // Add border radius from theme
      if (radius !== undefined) {
        baseStyle.borderRadius = theme.radii[radius];
      }

      return baseStyle;
    }, [width, height, backgroundColor, radius, theme.radii]);

    const Comp = asChild ? Slot : View;

    return (
      <Comp style={[absoluteCenterStyle, style]}>
        {children}
      </Comp>
    );
  }
);

AbsoluteCenter.displayName = 'AbsoluteCenter';

export { Center, HCenter, VCenter, AbsoluteCenter };
