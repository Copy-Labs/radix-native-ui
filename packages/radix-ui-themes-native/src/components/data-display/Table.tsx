import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle, type DimensionValue } from 'react-native';
import { ScrollView, View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';

// ============================================================================
// Table Types
// ============================================================================

interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: number | string;
  render?: (item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T = any> {
  /**
   * Table columns definition
   */
  columns: TableColumn<T>[];
  /**
   * Table data rows
   */
  data: T[];
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether table should be scrollable horizontally
   */
  scrollable?: boolean;
}

interface TheadProps {
  children: ReactNode;
}

interface TbodyProps {
  children: ReactNode;
}

interface TrProps {
  children: ReactNode;
  /**
   * Whether this is a header row
   */
  isHeader?: boolean;
}

interface ThProps {
  children: ReactNode;
  /**
   * Column width
   */
  width?: number | string;
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';
}

interface TdProps {
  children: ReactNode;
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';
}

// ============================================================================
// Table Components
// ============================================================================

const Table = <T extends Record<string, any>>({
  columns,
  data,
  style,
  scrollable = true,
}: TableProps<T>) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  const tableStyle: ViewStyle = {
    borderRadius: theme.radii[2],
    overflow: 'hidden',
  };

  const TableContent = () => (
    <View style={[styles.table, tableStyle]}>
      <Thead>
        <Tr isHeader>
          {columns.map((column) => (
            <Th key={column.key} width={column.width} align={column.align}>
              {column.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {columns.map((column) => (
              <Td key={column.key} align={column.align}>
                {column.render
                  ? column.render(row, rowIndex)
                  : String(row[column.key] ?? '')}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        style={[styles.scrollContainer, style]}
        showsHorizontalScrollIndicator={false}
      >
        <TableContent />
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TableContent />
    </View>
  );
};

Table.displayName = 'Table';

// Thead component
const Thead = ({ children }: TheadProps) => {
  return <View style={styles.thead}>{children}</View>;
};

// Tbody component
const Tbody = ({ children }: TbodyProps) => {
  return <View style={styles.tbody}>{children}</View>;
};

// Tr component
const Tr = ({ children, isHeader = false }: TrProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  // Use alpha colors for subtle backgrounds
  const headerBackground = isDark ? grayAlpha['3'] : grayAlpha['2'];
  const borderColor = isDark ? grayAlpha['6'] : grayAlpha['5'];

  return (
    <View
      style={[
        styles.tr,
        isHeader && {
          backgroundColor: headerBackground,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        !isHeader && {
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
      ]}
    >
      {children}
    </View>
  );
};

// Th component
const Th = ({ children, width, align = 'left' }: ThProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;

  const thStyle: ViewStyle = {
    width: width as DimensionValue,
  };

  return (
    <View style={[styles.th, thStyle, justifyContentMap[align]]}>
      <Text
        style={{
          color: grayScale[12],
          fontWeight: '600',
          fontSize: theme.typography.fontSizes[1].fontSize,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

// Td component
const Td = ({ children, align = 'left' }: TdProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;

  return (
    <View style={[styles.td, justifyContentMap[align]]}>
      <Text
        style={{
          color: grayScale[11],
          fontSize: theme.typography.fontSizes[1].fontSize,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

// Helper for alignment
const justifyContentMap = {
  left: { justifyContent: 'flex-start' as const },
  center: { justifyContent: 'center' as const },
  right: { justifyContent: 'flex-end' as const },
};

// Export sub-components
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  table: {
    minWidth: '100%',
  },
  thead: {
    flexDirection: 'row',
  },
  tbody: {
    flexDirection: 'column',
  },
  tr: {
    flexDirection: 'row',
    minHeight: 44,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  th: {
    padding: 12,
    minHeight: 44,
  },
  td: {
    padding: 12,
    minHeight: 44,
  },
});

export { Table };
export type { TableProps, TableColumn, TheadProps, TbodyProps, TrProps, ThProps, TdProps };
