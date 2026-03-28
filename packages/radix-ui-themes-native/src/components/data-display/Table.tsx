import React, {
  createContext,
  useContext,
  type ReactNode,
  type ComponentRef,
} from 'react';
import { StyleSheet, type StyleProp, ViewStyle, ScrollView, View } from 'react-native';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';

// ============================================================================
// Types
// ============================================================================

type TableSize = '1' | '2' | '3';

// ============================================================================
// Table Context
// ============================================================================

interface TableContextValue {
  size: TableSize;
  isRoot: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within Table.Root');
  }
  return context;
};

// ============================================================================
// Table.Root
// ============================================================================

interface TableRootProps {
  /**
   * Table content
   */
  children: ReactNode;
  /**
   * Size variant
   * @default '2'
   */
  size?: TableSize;
  /**
   * Enable horizontal scrolling
   * @default true
   */
  scrollable?: boolean;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableRoot = React.forwardRef<
  ComponentRef<typeof View>,
  TableRootProps
>(
  (
    {
      children,
      size = '2',
      scrollable = true,
      style,
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayAlpha = getGrayAlpha(theme, mode);

    const tableStyle: ViewStyle = {
      borderRadius: theme.radii.medium,
      overflow: 'hidden',
      backgroundColor: isDark ? grayAlpha['2'] : grayAlpha['1'],
    };

    const contextValue: TableContextValue = {
      size,
      isRoot: true,
    };

    const content = (
      <TableContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.root, tableStyle, style]}>
          {children}
        </View>
      </TableContext.Provider>
    );

    if (scrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  }
);

TableRoot.displayName = 'Table.Root';

// ============================================================================
// Table.Header
// ============================================================================

interface TableHeaderProps {
  /**
   * Header row content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableHeader = React.forwardRef<
  ComponentRef<typeof View>,
  TableHeaderProps
>(({ children, style }, ref) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayAlpha = getGrayAlpha(theme, mode);

  return (
    <View
      ref={ref}
      style={[
        styles.header,
        {
          backgroundColor: isDark ? grayAlpha['3'] : grayAlpha['2'],
          borderBottomWidth: 0,
          borderBottomColor: isDark ? grayAlpha['6'] : grayAlpha['5'],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
});

TableHeader.displayName = 'Table.Header';

// ============================================================================
// Table.Body
// ============================================================================

interface TableBodyProps {
  /**
   * Body rows content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableBody = React.forwardRef<
  ComponentRef<typeof View>,
  TableBodyProps
>(({ children, style }, ref) => {
  return (
    <View ref={ref} style={[styles.body, style]}>
      {children}
    </View>
  );
});

TableBody.displayName = 'Table.Body';

// ============================================================================
// Table.Row
// ============================================================================

interface TableRowProps {
  /**
   * Row cells content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableRow = React.forwardRef<
  ComponentRef<typeof View>,
  TableRowProps
>(({ children, style }, ref) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayAlpha = getGrayAlpha(theme, mode);

  return (
    <View
      ref={ref}
      style={[
        styles.row,
        {
          flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? grayAlpha['6'] : grayAlpha['5'],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
});

TableRow.displayName = 'Table.Row';

// ============================================================================
// Table.ColumnHeaderCell
// ============================================================================

interface TableColumnHeaderCellProps {
  /**
   * Cell content
   */
  children: ReactNode;
  /**
   * Column width
   */
  width?: number | string;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableColumnHeaderCell = React.forwardRef<
  ComponentRef<typeof View>,
  TableColumnHeaderCellProps
>(({ children, width, align = 'left', style }, ref) => {
  const context = useTableContext();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;

  // Size-based padding
  const getSizePadding = () => {
    switch (context.size) {
      case '1':
        return { paddingVertical: theme.space[2], paddingHorizontal: theme.space[3] };
      case '3':
        return { paddingVertical: theme.space[4], paddingHorizontal: theme.space[5] };
      case '2':
      default:
        return { paddingVertical: theme.space[3], paddingHorizontal: theme.space[4] };
    }
  };

  // Size-based font
  const getSizeFont = () => {
    switch (context.size) {
      case '1':
        return { fontSize: theme.typography.fontSizes[1].fontSize };
      case '3':
        return { fontSize: theme.typography.fontSizes[3].fontSize };
      case '2':
      default:
        return { fontSize: theme.typography.fontSizes[2].fontSize };
    }
  };

  const padding = getSizePadding();
  const fontSize = getSizeFont();

  const alignStyle = {
    left: 'flex-start' as const,
    center: 'center' as const,
    right: 'flex-end' as const,
  };

  return (
    <View
      ref={ref}
      style={[
        styles.cell,
        {
          width: width as any,
          // justifyContent: alignStyle[align],
          alignItems: alignStyle[align],
          ...padding,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: grayScale[12],
          fontWeight: '600',
          ...fontSize,
        }}
      >
        {children}
      </Text>
    </View>
  );
});

TableColumnHeaderCell.displayName = 'Table.ColumnHeaderCell';

// ============================================================================
// Table.Cell
// ============================================================================

interface TableCellProps {
  /**
   * Cell content
   */
  children: ReactNode;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const TableCell = React.forwardRef<
  ComponentRef<typeof View>,
  TableCellProps
>(({ children, align = 'left', style }, ref) => {
  const context = useTableContext();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;

  // Size-based padding
  const getSizePadding = () => {
    switch (context.size) {
      case '1':
        return { paddingVertical: theme.space[2], paddingHorizontal: theme.space[3] };
      case '3':
        return { paddingVertical: theme.space[4], paddingHorizontal: theme.space[5] };
      case '2':
      default:
        return { paddingVertical: theme.space[3], paddingHorizontal: theme.space[4] };
    }
  };

  // Size-based font
  const getSizeFont = () => {
    switch (context.size) {
      case '1':
        return { fontSize: theme.typography.fontSizes[1].fontSize };
      case '3':
        return { fontSize: theme.typography.fontSizes[3].fontSize };
      case '2':
      default:
        return { fontSize: theme.typography.fontSizes[2].fontSize };
    }
  };

  const padding = getSizePadding();
  const fontSize = getSizeFont();

  const alignStyle = {
    left: 'flex-start' as const,
    center: 'center' as const,
    right: 'flex-end' as const,
  };

  return (
    <View
      ref={ref}
      style={[
        styles.cell,
        {
          // justifyContent: alignStyle[align],
          alignItems: alignStyle[align],
          ...padding,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: grayScale[11],
          ...fontSize,
        }}
      >
        {children}
      </Text>
    </View>
  );
});

TableCell.displayName = 'Table.Cell';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  root: {
    minWidth: '100%',
  },
  header: {
    flexDirection: 'row',
    minHeight: 44,
  },
  body: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    minHeight: 44,
  },
  cell: {
    flex: 1,
    minWidth: 80,
  },
});

// ============================================================================
// Compound Component Export
// ============================================================================

interface TableCompoundComponent {
  Root: typeof TableRoot;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  ColumnHeaderCell: typeof TableColumnHeaderCell;
  Cell: typeof TableCell;
}

const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  ColumnHeaderCell: TableColumnHeaderCell,
  Cell: TableCell,
} as TableCompoundComponent;

export { Table };
export type {
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableColumnHeaderCellProps,
  TableCellProps,
  TableSize,
};
