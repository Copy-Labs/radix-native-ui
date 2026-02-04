import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Box Component
// ============================================================================

export interface BoxProps {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Box
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Background color variant
   */
  backgroundColor?: 'gray' | 'transparent' | string;
  /**
   * Border radius variant
   */
  radius?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'none' | 'full';
  /**
   * Display prop
   */
  display?: 'flex' | 'none';
  /**
   * Flex direction
   */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Justify content
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Align items
   */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Flex wrap
   */
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
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
   * Border width
   */
  borderWidth?: number;
  /**
   * Border radius
   */
  borderRadius?: number;
  /**
   * Border color
   */
  borderColor?: string;
  /**
   * Opacity
   */
  opacity?: number;
  /**
   * Elevation (Android)
   */
  elevation?: number;
}

export default BoxProps;
