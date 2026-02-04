import React, { useMemo } from 'react';
import { type ViewStyle, View as RNView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Flex } from './Flex';
import { useThemeMode } from '../../theme/ThemeProvider';

interface GridProps {
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Grid
   */
  style?: ViewStyle;
  /**
   * Number of columns
   * @default 1
   */
  columns?: number;
  /**
   * Gap between items
   */
  gap?: number;
  /**
   * Gap between rows
   */
  rowGap?: number;
  /**
   * Gap between columns
   */
  columnGap?: number;
  /**
   * Align items on cross axis
   * @default 'stretch'
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Justify content on main axis
   * @default 'flex-start'
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Width of each column (percentage or fixed)
   */
  columnWidth?: string | number;
}

// Custom areEqual function for Grid to optimize re-renders
const areEqual = (prevProps: GridProps, nextProps: GridProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.columns === nextProps.columns &&
    prevProps.gap === nextProps.gap &&
    prevProps.rowGap === nextProps.rowGap &&
    prevProps.columnGap === nextProps.columnGap &&
    prevProps.align === nextProps.align &&
    prevProps.justify === nextProps.justify &&
    prevProps.columnWidth === nextProps.columnWidth
  ) {
    return true;
  }
  return false;
};

const Grid = React.memo(
  React.forwardRef<React.ComponentRef<typeof RNView>, GridProps>(
    (
      {
        children,
        style = {},
        columns = 1,
        gap,
        rowGap,
        columnGap,
        align = 'stretch',
        justify = 'flex-start',
        columnWidth,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const colors = theme.colors.gray;

      // Calculate column width based on number of columns
      const getColumnWidth = (): string | number | undefined => {
        if (columnWidth) return columnWidth;
        if (columns > 1) {
          return `${100 / columns}%`;
        }
        return undefined;
      };

      const gridStyle: ViewStyle = useMemo(
        () => ({
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          columnGap: columnGap ?? gap,
          rowGap: rowGap ?? gap,
          backgroundColor: isDark ? colors.dark[1] : colors[1],
        }),
        [align, justify, columnGap, gap, rowGap, colors]
      );

      // Apply column width to children if specified
      const childrenWithWidth =
        columnWidth || columns > 1
          ? React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  style: [(child.props as any).style, { width: getColumnWidth() }],
                });
              }
              return child;
            })
          : children;

      return (
        <Flex ref={ref} style={[gridStyle, style]} wrap="wrap" {...rest}>
          {childrenWithWidth}
        </Flex>
      );
    }
  ),
  areEqual
);

Grid.displayName = 'Grid';

export { Grid };
export type { GridProps };
