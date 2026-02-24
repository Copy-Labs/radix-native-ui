import React, { useMemo } from 'react';
import { type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import type { Color } from '../../theme/types';

// ============================================================================
// Types
// ============================================================================

/**
 * Orientation of the separator
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Size scale using theme.space values for margins
 */
export type SeparatorMarginSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SeparatorProps {
  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;

  /**
   * Size/thickness of the separator in pixels
   * @default 1
   */
  size?: number;

  /**
   * Color using theme color system
   * @default 'gray'
   */
  color?: Color;

  /**
   * Whether to use decorative styling (no semantic meaning)
   * When true, the separator is purely visual
   * @default true
   */
  decorative?: boolean;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Margin on the sides (uses theme.space)
   */
  margin?: SeparatorMarginSize;

  /**
   * Margin vertical (for horizontal separators)
   */
  marginVertical?: SeparatorMarginSize;

  /**
   * Margin horizontal (for vertical separators)
   */
  marginHorizontal?: SeparatorMarginSize;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Separator is a visual divider between sections or groups of content.
 *
 * @example
 * // Horizontal separator
 * <Text>Section 1</Text>
 * <Separator />
 * <Text>Section 2</Text>
 *
 * @example
 * // Vertical separator
 * <HStack align="center">
 *   <Text>Left</Text>
 *   <Separator orientation="vertical" style={{ height: 20 }} />
 *   <Text>Right</Text>
 * </HStack>
 *
 * @example
 * // With custom color
 * <Separator color="blue" />
 *
 * @example
 * // With margin
 * <Separator marginVertical={4} />
 */
const Separator = React.memo<SeparatorProps>(
  ({
    orientation = 'horizontal',
    size = 1,
    color = 'gray',
    decorative = true,
    style,
    margin,
    marginVertical,
    marginHorizontal,
  }) => {
    const theme = useTheme();
    const mode = useThemeMode();

    const separatorStyle: ViewStyle = useMemo(() => {
      // Get the color scale for the specified color
      const colorScale = theme.colors[color];
      const grayScale = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      // Use color scale if available, otherwise use gray
      const colorValue = colorScale
        ? (mode === 'dark' && 'dark' in colorScale ? colorScale.dark[6] : colorScale[6])
        : grayScale[6];

      // Get margin values from theme.space
      const marginValue = margin !== undefined ? theme.space[margin] : undefined;
      const marginVerticalValue = marginVertical !== undefined ? theme.space[marginVertical] : marginValue;
      const marginHorizontalValue = marginHorizontal !== undefined ? theme.space[marginHorizontal] : marginValue;

      const baseStyle: ViewStyle = {
        backgroundColor: colorValue,
      };

      if (orientation === 'horizontal') {
        baseStyle.height = size;
        baseStyle.width = '100%';
        if (marginVerticalValue !== undefined) {
          baseStyle.marginVertical = marginVerticalValue;
        }
        if (marginHorizontalValue !== undefined) {
          baseStyle.marginHorizontal = marginHorizontalValue;
        }
      } else {
        baseStyle.width = size;
        baseStyle.height = '100%';
        if (marginHorizontalValue !== undefined) {
          baseStyle.marginHorizontal = marginHorizontalValue;
        }
        if (marginVerticalValue !== undefined) {
          baseStyle.marginVertical = marginVerticalValue;
        }
      }

      return baseStyle;
    }, [orientation, size, color, theme, mode, margin, marginVertical, marginHorizontal]);

    return (
      <View
        style={[separatorStyle, style]}
        accessibilityRole={decorative ? undefined : 'separator'}
        accessible={!decorative}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
