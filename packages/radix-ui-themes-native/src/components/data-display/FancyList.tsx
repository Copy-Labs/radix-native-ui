import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { FlatList, View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';

interface FancyListItem<T = any> {
  /**
   * Unique key for the item
   */
  key?: string;
  /**
   * Item data
   */
  item: T;
  /**
   * Item index
   */
  index: number;
}

interface FancyListProps<T = any> {
  /**
   * Array of data items
   */
  data: T[];
  /**
   * Function to render each item
   */
  renderItem: (info: FancyListItem<T>) => ReactNode;
  /**
   * Function to extract unique key for each item
   */
  keyExtractor?: (item: T, index: number) => string;
  /**
   * Custom style for the list container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether to show dividers between items
   */
  showDividers?: boolean;
  /**
   * Whether the list is scrollable
   */
  scrollable?: boolean;
  /**
   * List item padding
   */
  itemPadding?: number;
  /**
   * Empty list component
   */
  ListEmptyComponent?: any;
  /**
   * Header component
   */
  ListHeaderComponent?: any;
  /**
   * Footer component
   */
  ListFooterComponent?: any;
}

const FancyList = <T extends object>({
  data,
  renderItem,
  keyExtractor,
  style,
  showDividers = true,
  scrollable = true,
  itemPadding,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
}: FancyListProps<T>) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  // Use alpha colors for subtle dividers
  const dividerColor = isDark ? grayAlpha['6'] : grayAlpha['5'];
  const backgroundColor = isDark ? grayAlpha['2'] : grayAlpha['1'];

  const defaultKeyExtractor = (item: T, index: number): string => {
    if (keyExtractor) return keyExtractor(item, index);
    if ('id' in item) return String((item as any).id);
    return String(index);
  };

  const renderListItem = (info: { item: T; index: number }) => {
    const itemStyle: ViewStyle = {
      paddingVertical: itemPadding ?? theme.space[3],
      paddingHorizontal: theme.space[4],
      // borderBottomWidth: showDividers ? 1 : 0, // Use this if you want to use border separator instead of height separator
      borderBottomColor: dividerColor,
    };

    return (
      <View style={[styles.item, itemStyle]}>
        {renderItem({ item: info.item, index: info.index, key: defaultKeyExtractor(info.item, info.index) })}
      </View>
    );
  };

  const listContainerStyle: ViewStyle = {
    backgroundColor: backgroundColor,
    borderRadius: theme.radii.medium,
    overflow: 'hidden',
  };

  if (!scrollable) {
    return (
      <View style={[styles.container, listContainerStyle, style]}>
        {ListHeaderComponent}
        {data.map((item, index) => (
          <View key={defaultKeyExtractor(item, index)} style={styles.nonScrollableItem}>
            {renderItem({ item, index, key: defaultKeyExtractor(item, index) })}
          </View>
        ))}
        {ListFooterComponent}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data as any}
        renderItem={renderListItem as any}
        keyExtractor={defaultKeyExtractor as any}
        style={[styles.flatList, listContainerStyle]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={() =>
          showDividers ? (
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: dividerColor,
                  marginHorizontal: theme.space[4],
                },
              ]}
            />
          ) : null
        }
        ListHeaderComponentStyle={styles.listHeaderFooter}
        ListFooterComponentStyle={styles.listHeaderFooter}
      />
    </View>
  );
};

FancyList.displayName = 'FancyList';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  item: {
    width: '100%',
  },
  nonScrollableItem: {
    width: '100%',
  },
  divider: {
    height: 1,
  },
  listHeaderFooter: {
    padding: 12,
  },
});

export { FancyList };
export type { FancyListProps, FancyListItem };
