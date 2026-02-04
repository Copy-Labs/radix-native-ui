import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';

interface TabNavProps {
  children: ReactNode;
  /**
   * Currently active tab value
   */
  active?: string;
  /**
   * Callback when active tab changes
   */
  onActiveChange?: (value: string) => void;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

interface TabNavItemProps {
  children: ReactNode;
  /**
   * Value associated with this tab
   */
  value: string;
  /**
   * Disable this tab
   */
  disabled?: boolean;
  /**
   * Icon to show before text
   */
  icon?: ReactNode;
}

const TabNav = ({
  children,
  active,
  onActiveChange,
  style,
}: TabNavProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  // Handle child items
  const items = React.Children.toArray(children);

  // Use alpha colors for subtle backgrounds
  const backgroundColor = isDark ? grayAlpha['2'] : grayAlpha['1'];
  const borderColor = isDark ? grayAlpha['6'] : grayAlpha['4'];
  const activeColor = grayScale[9];
  const activeTextColor = grayScale[12];
  const inactiveTextColor = grayScale[10];

  return (
    <View
      style={[
        styles.tabNav,
        {
          backgroundColor: backgroundColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    >
      <View style={styles.itemsContainer}>
        {items.map((item: any, index) => {
          const isActive = item?.props?.value === active;
          const itemStyle: ViewStyle = {
            paddingVertical: theme.space[2],
            paddingHorizontal: theme.space[3],
            borderBottomWidth: 2,
            borderBottomColor: isActive ? activeColor : 'transparent',
            opacity: item?.props?.disabled ? 0.5 : 1,
          };

          const handlePress = () => {
            if (!item?.props?.disabled && onActiveChange) {
              onActiveChange(item?.props?.value);
            }
          };

          return (
            <TouchableOpacity
              key={item?.props?.value || index}
              style={itemStyle}
              onPress={handlePress}
              disabled={item?.props?.disabled}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive, disabled: item?.props?.disabled }}
            >
              {item?.props?.icon && (
                <View style={{ marginRight: theme.space[2] }}>
                  {item?.props?.icon}
                </View>
              )}
              <Text
                style={{
                  color: isActive ? activeTextColor : inactiveTextColor,
                  fontWeight: isActive ? '600' : '400',
                  fontSize: theme.typography.fontSizes[2].fontSize,
                }}
              >
                {item?.props?.children}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

TabNav.displayName = 'TabNav';

// TabNavItem sub-component
const TabNavItem = ({ children, value, disabled, icon }: TabNavItemProps) => {
  return null;
};

TabNav.Item = TabNavItem;

const styles = StyleSheet.create({
  tabNav: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  itemsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});

export { TabNav };
export type { TabNavProps, TabNavItemProps };
