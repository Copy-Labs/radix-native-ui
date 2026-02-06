import React, { useMemo } from 'react';
import { DimensionValue, StyleSheet, type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

interface FlexProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Flex
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Flex direction
   * @default 'row'
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Align items on cross axis
   * @default 'stretch'
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Align content on cross axis (multi-line)
   */
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'space-between' | 'space-around';
  /**
   * Justify content on main axis
   * @default 'flex-start'
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Flex wrap
   * @default 'nowrap'
   */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  /**
   * Gap between items
   */
  gap?: number;
  /**
   * Flex grow
   */
  flexGrow?: number;
  /**
   * Flex shrink
   */
  flexShrink?: number;
  /**
   * Flex basis
   */
  flexBasis?: DimensionValue | undefined;
  /**
   * Flex shorthand (flexGrow, flexShrink, flexBasis)
   */
  flex?: number;
  /**
   * Align self
   */
  alignSelf?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Width
   */
  width?: DimensionValue | undefined;
  /**
   * Height
   */
  height?: DimensionValue | undefined;
  /**
   * Min width
   */
  minWidth?: DimensionValue | undefined;
  /**
   * Max width
   */
  maxWidth?: DimensionValue | undefined;
  /**
   * Min height
   */
  minHeight?: DimensionValue | undefined;
  /**
   * Max height
   */
  maxHeight?: DimensionValue | undefined;
  /**
   * Position
   */
  position?: 'absolute' | 'relative';
  /**
   * Top offset
   */
  top?: number;
  /**
   * Right offset
   */
  right?: number;
  /**
   * Bottom offset
   */
  bottom?: number;
  /**
   * Left offset
   */
  left?: number;
  /**
   * Z-index
   */
  zIndex?: number;
  /**
   * Overflow
   */
  overflow?: 'visible' | 'hidden' | 'scroll';
  /**
   * Margin
   */
  margin?: number;
  /**
   * Margin top
   */
  marginTop?: number;
  /**
   * Margin bottom
   */
  marginBottom?: number;
  /**
   * Margin left
   */
  marginLeft?: number;
  /**
   * Margin right
   */
  marginRight?: number;
  /**
   * Margin horizontal
   */
  marginHorizontal?: number;
  /**
   * Margin vertical
   */
  marginVertical?: number;
  /**
   * Padding
   */
  padding?: number;
  /**
   * Padding top
   */
  paddingTop?: number;
  /**
   * Padding bottom
   */
  paddingBottom?: number;
  /**
   * Padding left
   */
  paddingLeft?: number;
  /**
   * Padding right
   */
  paddingRight?: number;
  /**
   * Padding horizontal
   */
  paddingHorizontal?: number;
  /**
   * Padding vertical
   */
  paddingVertical?: number;
  /**
   * Gap column
   */
  columnGap?: number;
  /**
   * Gap row
   */
  rowGap?: number;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Border radius
   */
  borderRadius?: number;
  /**
   * Opacity
   */
  opacity?: number;
}

// Custom areEqual function for Flex to optimize re-renders
const areEqual = (prevProps: FlexProps, nextProps: FlexProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.direction === nextProps.direction &&
    prevProps.align === nextProps.align &&
    prevProps.justify === nextProps.justify &&
    prevProps.wrap === nextProps.wrap &&
    prevProps.gap === nextProps.gap &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.opacity === nextProps.opacity
  ) {
    return true;
  }
  return false;
};

const Flex = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, FlexProps>(
    (
      {
        asChild = false,
        children,
        style,
        direction = 'row',
        align = 'stretch',
        alignContent,
        justify = 'flex-start',
        wrap = 'nowrap',
        gap,
        flexGrow,
        flexShrink,
        flexBasis,
        flex,
        alignSelf,
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        position,
        top,
        right,
        bottom,
        left,
        zIndex,
        overflow,
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        marginHorizontal,
        marginVertical,
        padding,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingHorizontal,
        paddingVertical,
        columnGap,
        rowGap,
        backgroundColor,
        borderRadius,
        opacity,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const colors = theme.colors.gray;

      const flexStyle: ViewStyle = useMemo(
        () => ({
          display: 'flex',
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          alignContent,
          flexWrap: wrap,
          flexGrow,
          flexShrink,
          flexBasis,
          flex,
          alignSelf,
          width,
          height,
          minWidth,
          maxWidth,
          minHeight,
          maxHeight,
          position,
          top,
          right,
          bottom,
          left,
          zIndex,
          overflow,
          margin,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          marginHorizontal,
          marginVertical,
          padding,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingHorizontal,
          paddingVertical,
          columnGap: columnGap ?? gap,
          rowGap: rowGap ?? gap,
          // backgroundColor: backgroundColor || colors[1],
          borderRadius,
          opacity,
        }),
        [
          direction,
          justify,
          align,
          alignContent,
          wrap,
          flexGrow,
          flexShrink,
          flexBasis,
          flex,
          alignSelf,
          width,
          height,
          minWidth,
          maxWidth,
          minHeight,
          maxHeight,
          position,
          top,
          right,
          bottom,
          left,
          zIndex,
          overflow,
          margin,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          marginHorizontal,
          marginVertical,
          padding,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingHorizontal,
          paddingVertical,
          columnGap,
          rowGap,
          gap,
          backgroundColor,
          colors,
          borderRadius,
          opacity,
        ]
      );

      const Comp = asChild ? Slot : View;

      return (
        <Comp
          ref={ref}
          style={[flexStyle, style]}
          {...rest}
        >
          {children}
        </Comp>
      );
    }
  ),
  areEqual
);

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps };
