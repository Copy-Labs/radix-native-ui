import React, { useMemo } from 'react';
import { type ViewStyle, View as RNView } from 'react-native';
import { Slot } from '../../components';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';
import type { BoxProps } from './Box.props';
import type { RadiusSize } from '../../theme/types';

// Custom areEqual function for Box to optimize re-renders
const areEqual = (prevProps: BoxProps, nextProps: BoxProps) => {
  // Compare simple props that change frequently
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.display === nextProps.display &&
    prevProps.flexDirection === nextProps.flexDirection &&
    prevProps.opacity === nextProps.opacity &&
    prevProps.radius === nextProps.radius
  ) {
    return true;
  }
  return false;
};

const Box = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, BoxProps>(
    (
      {
        asChild = false,
        children,
        style,
        backgroundColor,
        radius,
        display,
        flexDirection,
        justifyContent,
        alignItems,
        flexWrap,
        flexGrow,
        flexShrink,
        flexBasis,
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
        borderWidth,
        borderRadius: borderRadiusProp,
        borderColor,
        opacity,
        elevation,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const colors = theme.colors.gray;
      const radii = theme.radii;

      // Determine background color
      let bgColor = colors[1];
      if (backgroundColor === 'transparent') {
        bgColor = 'transparent';
      } else if (typeof backgroundColor === 'string' && !backgroundColor.startsWith('gray')) {
        bgColor = backgroundColor;
      } else if (backgroundColor && backgroundColor !== 'gray') {
        bgColor = backgroundColor;
      }

      // Determine border radius
      let radiusValue: number | undefined;
      if (radius) {
        if (typeof radius === 'number') {
          // Support for legacy numeric radius values (deprecated)
          const radiusMap: Record<number, RadiusSize> = {
            1: 'small',
            2: 'small',
            3: 'medium',
            4: 'medium',
            5: 'large',
            6: 'large',
          };
          radiusValue = radii[radiusMap[radius] || 'medium'];
        } else {
          // Support for semantic radius values: 'none', 'small', 'medium', 'large', 'full'
          radiusValue = radii[radius];
        }
      }

      const boxStyle: ViewStyle = useMemo(
        () => ({
          display,
          flexDirection,
          justifyContent,
          alignItems,
          flexWrap,
          flexGrow,
          flexShrink,
          flexBasis,
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
          borderWidth,
          borderRadius: radiusValue ?? borderRadiusProp,
          borderColor,
          // backgroundColor: bgColor,
          opacity,
          elevation,
        }),
        [
          display,
          flexDirection,
          justifyContent,
          alignItems,
          flexWrap,
          flexGrow,
          flexShrink,
          flexBasis,
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
          borderWidth,
          radiusValue,
          borderRadiusProp,
          borderColor,
          bgColor,
          opacity,
          elevation,
        ]
      );

      const Comp = asChild ? Slot : View;

      return (
        <Comp ref={ref} style={[boxStyle, style]} {...rest}>
          {children}
        </Comp>
      );
    }
  ),
  areEqual
);

Box.displayName = 'Box';

export { Box };
export type { BoxProps };
