import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { View, TouchableOpacity } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';

interface SegmentedControlOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface SegmentedControlProps {
  /**
   * Current selected value
   */
  value: string;
  /**
   * Callback when value changes
   */
  onValueChange: (value: string) => void;
  /**
   * Array of options
   */
  options: SegmentedControlOption[];
  /**
   * Segmented control size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether the control is disabled
   */
  disabled?: boolean;
}

const SegmentedControl = ({
  value,
  onValueChange,
  options,
  size = 2,
  style,
  disabled = false,
}: SegmentedControlProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  // Get size values
  const getSizeValues = () => {
    switch (size) {
      case 1:
        return {
          height: 28,
          fontSize: theme.typography.fontSizes[1].fontSize,
          paddingHorizontal: theme.space[2],
        };
      case 3:
        return {
          height: 48,
          fontSize: theme.typography.fontSizes[3].fontSize,
          paddingHorizontal: theme.space[4],
        };
      case 2:
      default:
        return {
          height: 36,
          fontSize: theme.typography.fontSizes[2].fontSize,
          paddingHorizontal: theme.space[3],
        };
    }
  };

  const sizeValues = getSizeValues();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: grayAlpha['3'],
          borderRadius: radii[2],
          height: sizeValues.height,
        },
        style,
      ]}
      accessibilityRole="radiogroup"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        const optionStyle: ViewStyle = {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          paddingHorizontal: sizeValues.paddingHorizontal,
          backgroundColor: isSelected
            ? (isDark ? grayAlpha['5'] : grayAlpha['4'])
            : 'transparent',
          borderRadius: isFirst
            ? radii[2]
            : isLast
            ? radii[2]
            : 0,
          marginLeft: isFirst ? 0 : -radii[2] / 2,
          marginRight: isLast ? 0 : -radii[2] / 2,
        };

        const handlePress = () => {
          if (!disabled) {
            onValueChange(option.value);
          }
        };

        return (
          <TouchableOpacity
            key={option.value}
            style={optionStyle}
            onPress={handlePress}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled }}
          >
            {option.icon && (
              <View style={{ marginRight: theme.space[2] }}>{option.icon}</View>
            )}
            <Text
              style={{
                color: isSelected
                  ? grayScale[12]
                  : grayAlpha['10'],
                fontWeight: isSelected ? '600' : '400',
                fontSize: sizeValues.fontSize,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

SegmentedControl.displayName = 'SegmentedControl';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
});

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedControlOption };
