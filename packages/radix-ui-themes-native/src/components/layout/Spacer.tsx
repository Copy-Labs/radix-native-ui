import React, { useMemo } from 'react';
import { type StyleProp, type ViewStyle, View as RNView } from 'react-native';
import { View } from '../primitives';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// Types
// ============================================================================

/**
 * Direction of the spacer
 * - 'horizontal': takes horizontal space (width)
 * - 'vertical': takes vertical space (height)
 * - 'both': takes space in both directions
 */
export type SpacerDirection = 'horizontal' | 'vertical' | 'both';

/**
 * Size scale using theme.space values
 */
export type SpacerSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SpacerProps {
  /**
   * Flex grow value - determines how the spacer grows
   * Used when size is not provided for flexible spacing
   * @default 1
   */
  flex?: number;

  /**
   * Size of the spacer using theme.space scale (1-9)
   * When provided, uses fixed size instead of flexible
   */
  size?: SpacerSize;

  /**
   * Direction of the spacer
   * - 'horizontal': takes horizontal space (width)
   * - 'vertical': takes vertical space (height)
   * - 'both': takes space in both directions
   * @default 'both'
   */
  direction?: SpacerDirection;

  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Spacer is a utility component that creates space between elements in flex containers.
 *
 * @example
 * // Flexible spacer - pushes items apart
 * <Flex direction="row">
 *   <Text>Left</Text>
 *   <Spacer />
 *   <Text>Right</Text>
 * </Flex>
 *
 * @example
 * // Fixed size spacer using theme.space
 * <Flex direction="row">
 *   <Text>Item 1</Text>
 *   <Spacer size={4} />
 *   <Text>Item 2</Text>
 * </Flex>
 *
 * @example
 * // Direction-specific spacer
 * <Flex direction="column">
 *   <Text>Top</Text>
 *   <Spacer direction="vertical" size={3} />
 *   <Text>Bottom</Text>
 * </Flex>
 */
const Spacer = React.memo<SpacerProps>(
  ({ flex = 1, size, direction = 'both', style }) => {
    const theme = useTheme();

    const spacerStyle: ViewStyle = useMemo(() => {
      const baseStyle: ViewStyle = {};

      // If size is provided, use fixed dimensions from theme.space
      if (size !== undefined) {
        const spaceValue = theme.space[size];

        switch (direction) {
          case 'horizontal':
            baseStyle.width = spaceValue;
            break;
          case 'vertical':
            baseStyle.height = spaceValue;
            break;
          case 'both':
          default:
            baseStyle.width = spaceValue;
            baseStyle.height = spaceValue;
            break;
        }
      } else {
        // If no size, use flex for flexible spacing
        baseStyle.flex = flex;

        // Set dimensions based on direction for flexible spacer
        switch (direction) {
          case 'horizontal':
            baseStyle.height = 'auto';
            break;
          case 'vertical':
            baseStyle.width = 'auto';
            break;
          case 'both':
          default:
            // For 'both', we just use flex without dimension constraints
            break;
        }
      }

      return baseStyle;
    }, [flex, size, direction, theme.space]);

    return <View style={[spacerStyle, style]} />;
  }
);

Spacer.displayName = 'Spacer';

export { Spacer };
