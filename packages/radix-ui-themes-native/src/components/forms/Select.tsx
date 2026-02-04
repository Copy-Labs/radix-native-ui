import React, { useState, useCallback } from 'react';
import { StyleSheet, type ViewStyle, Modal, View as RNView, type ListRenderItem } from 'react-native';
import { View, PrimitiveText, TouchableOpacity } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';

interface SelectItem {
  /**
   * Value for this select item
   */
  value: string;
  /**
   * Label text displayed in the picker
   */
  label: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
}

interface SelectProps {
  /**
   * Currently selected value
   */
  value: string;
  /**
   * Callback when selection changes
   */
  onValueChange: (value: string) => void;
  /**
   * Array of select items
   */
  items: SelectItem[];
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Label text displayed above the select
   */
  label?: string;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Style prop for the container
   */
  style?: ViewStyle;
}

const Select = React.forwardRef<React.ComponentRef<typeof RNView>, SelectProps>(
  (
    {
      value,
      onValueChange,
      items,
      placeholder = 'Select an option',
      disabled = false,
      size = '2',
      label,
      accessibilityLabel,
      style,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const accentColor = theme.accentColor;
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Get size values
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            fontSize: theme.typography.fontSizes[1].fontSize,
            paddingVertical: theme.space[2],
            paddingHorizontal: theme.space[3],
            borderRadius: theme.radii[1],
            height: 36,
            itemHeight: 40,
          };
        case '3':
          return {
            fontSize: theme.typography.fontSizes[3].fontSize,
            paddingVertical: theme.space[4],
            paddingHorizontal: theme.space[4],
            borderRadius: theme.radii[2],
            height: 52,
            itemHeight: 56,
          };
        case '2':
        default:
          return {
            fontSize: theme.typography.fontSizes[2].fontSize,
            paddingVertical: theme.space[3],
            paddingHorizontal: theme.space[3],
            borderRadius: theme.radii[2],
            height: 44,
            itemHeight: 48,
          };
      }
    };

    const sizeValues = getSizeValues();
    const selectedItem = items.find(item => item.value === value);

    const containerStyle: ViewStyle = {
      gap: theme.space[1],
    };

    const selectContainerStyle: ViewStyle = {
      borderWidth: 1,
      borderColor: isDark ? colors[6] : colors[7],
      backgroundColor: disabled ? (isDark ? colors[3] : colors[2]) : isDark ? colors[4] : colors[1],
      borderRadius: sizeValues.borderRadius,
      opacity: disabled ? 0.6 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: sizeValues.paddingHorizontal,
      height: sizeValues.height,
    };

    const textStyle = {
      fontSize: sizeValues.fontSize,
      color: selectedItem ? colors[12] : colors[8],
    };

    const labelStyle = {
      color: isDark ? colors[11] : colors[10],
      fontSize: theme.typography.fontSizes[1].fontSize,
      fontWeight: '500' as const,
    };

    const handleSelect = useCallback((itemValue: string) => {
      onValueChange(itemValue);
      setIsModalVisible(false);
    }, [onValueChange]);

    const handleClose = useCallback(() => {
      setIsModalVisible(false);
    }, []);

    const renderItem: ListRenderItem<SelectItem> = useCallback(({ item }) => {
      const isSelected = item.value === value;
      const isDisabled = item.disabled || false;

      const itemContainerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.space[4],
        height: sizeValues.itemHeight,
        opacity: isDisabled ? 0.5 : 1,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? colors[5] : colors[4],
      };

      const itemTextStyle = {
        fontSize: sizeValues.fontSize,
        color: isSelected ? accentColor : colors[12],
        fontWeight: isSelected ? ('600' as const) : ('400' as const),
      };

      const checkmarkStyle = {
        fontSize: sizeValues.fontSize,
        color: accentColor,
        fontWeight: '600' as const,
      };

      return (
        <TouchableOpacity
          style={itemContainerStyle}
          onPress={() => !isDisabled && handleSelect(item.value)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: isSelected, disabled: isDisabled }}
        >
          <PrimitiveText style={itemTextStyle}>{item.label}</PrimitiveText>
          {isSelected && <PrimitiveText style={checkmarkStyle}>✓</PrimitiveText>}
        </TouchableOpacity>
      );
    }, [value, colors, theme, accentColor, sizeValues, handleSelect, isDark]);

    const keyExtractor = useCallback((item: SelectItem) => item.value, []);

    // Theme-aware modal styles
    const modalOverlayStyle: ViewStyle = {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    };

    const modalContentStyle: ViewStyle = {
      backgroundColor: colors[1],
      borderTopLeftRadius: theme.radii[4],
      borderTopRightRadius: theme.radii[4],
      maxHeight: '70%',
    };

    const modalHeaderStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.space[4],
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors[5] : colors[4],
    };

    const modalTitleStyle = {
      fontSize: theme.typography.fontSizes[3].fontSize,
      fontWeight: '600' as const,
      color: colors[12],
    };

    const modalCloseStyle = {
      fontSize: theme.typography.fontSizes[4].fontSize,
      color: colors[9],
      padding: theme.space[1],
    };

    return (
      <View ref={ref} style={[styles.container, containerStyle, style]} {...rest}>
        {label && (
          <PrimitiveText style={labelStyle} accessibilityLabel={accessibilityLabel}>
            {label}
          </PrimitiveText>
        )}
        <TouchableOpacity
          style={selectContainerStyle}
          onPress={() => !disabled && setIsModalVisible(true)}
          disabled={disabled}
          accessibilityRole="combobox"
          accessibilityLabel={accessibilityLabel || label || placeholder}
          accessibilityState={{ expanded: isModalVisible, disabled }}
        >
          <PrimitiveText style={textStyle}>{selectedItem?.label || placeholder}</PrimitiveText>
          <PrimitiveText style={styles.chevron}>▼</PrimitiveText>
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleClose}
        >
          <TouchableOpacity
            style={modalOverlayStyle}
            activeOpacity={1}
            onPress={handleClose}
          >
            <View style={modalContentStyle}>
              <View style={modalHeaderStyle}>
                <PrimitiveText style={modalTitleStyle}>{placeholder}</PrimitiveText>
                <TouchableOpacity onPress={handleClose}>
                  <PrimitiveText style={modalCloseStyle}>✕</PrimitiveText>
                </TouchableOpacity>
              </View>
              <View style={styles.listContainer}>
                {items.map((item) => {
                  const isSelected = item.value === value;
                  const isItemDisabled = item.disabled || false;

                  const itemContainerStyle: ViewStyle = {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: theme.space[4],
                    height: sizeValues.itemHeight,
                    opacity: isItemDisabled ? 0.5 : 1,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? colors[5] : colors[4],
                  };

                  const itemTextStyle = {
                    fontSize: sizeValues.fontSize,
                    color: isSelected ? accentColor : colors[12],
                    fontWeight: isSelected ? ('600' as const) : ('400' as const),
                  };

                  const checkmarkStyle = {
                    fontSize: sizeValues.fontSize,
                    color: accentColor,
                    fontWeight: '600' as const,
                  };

                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={itemContainerStyle}
                      onPress={() => !isItemDisabled && handleSelect(item.value)}
                      disabled={isItemDisabled}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                      accessibilityState={{ selected: isSelected, disabled: isItemDisabled }}
                    >
                      <PrimitiveText style={itemTextStyle}>{item.label}</PrimitiveText>
                      {isSelected && <PrimitiveText style={checkmarkStyle}>✓</PrimitiveText>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
);

Select.displayName = 'Select';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chevron: {
    fontSize: 12,
    color: 'gray',
  },
  listContainer: {
    maxHeight: 400,
  },
});

export { Select };
export type { SelectProps, SelectItem };
