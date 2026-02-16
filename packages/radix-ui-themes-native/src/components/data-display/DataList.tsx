import React, { createContext, useContext, type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import type { Color, SpaceScale } from '../../theme';

// ============================================================================
// Types
// ============================================================================

type DataListOrientation = 'horizontal' | 'vertical';
type DataListSize = 1 | 2 | 3;
type DataListTrim = 'normal' | 'start' | 'end' | 'both';
type DataListItemAlign = 'baseline' | 'start' | 'center' | 'end' | 'stretch';

// ============================================================================
// DataList Context
// ============================================================================

interface DataListContextValue {
  orientation: DataListOrientation;
  size: DataListSize;
  trim: DataListTrim;
}

const DataListContext = createContext<DataListContextValue>({
  orientation: 'horizontal',
  size: 2,
  trim: 'normal',
});

const useDataList = () => useContext(DataListContext);

// ============================================================================
// Size Configuration
// ============================================================================

const getSizeConfig = (size: DataListSize, space: SpaceScale) => {
  const configs = {
    1: {
      gap: space[3],
      labelMinWidth: 100,
    },
    2: {
      gap: space[4],
      labelMinWidth: 120,
    },
    3: {
      gap: Math.round(space[4] * 1.25),
      labelMinWidth: 140,
    },
  };
  return configs[size];
};

// ============================================================================
// DataList.Root
// ============================================================================

interface DataListRootProps {
  children: ReactNode;
  orientation?: DataListOrientation;
  size?: DataListSize;
  trim?: DataListTrim;
  style?: StyleProp<ViewStyle>;
}

const DataListRoot = ({
  children,
  orientation = 'horizontal',
  size = 2,
  trim = 'normal',
  style,
}: DataListRootProps) => {
  const theme = useTheme();
  const sizeConfig = getSizeConfig(size, theme.space);

  const rootStyle: ViewStyle = {
    gap: sizeConfig.gap,
  };

  // Apply trim styles
  const trimStyles: ViewStyle = {};
  if (trim === 'start' || trim === 'both') {
    trimStyles.marginTop = -theme.space[2];
  }
  if (trim === 'end' || trim === 'both') {
    trimStyles.marginBottom = -theme.space[2];
  }

  return (
    <DataListContext.Provider value={{ orientation, size, trim }}>
      <View style={[styles.root, rootStyle, trimStyles, style]}>
        {children}
      </View>
    </DataListContext.Provider>
  );
};

DataListRoot.displayName = 'DataList.Root';

// ============================================================================
// DataList.Item
// ============================================================================

interface DataListItemProps {
  children: ReactNode;
  align?: DataListItemAlign;
  style?: StyleProp<ViewStyle>;
}

const DataListItem = ({
  children,
  align = 'baseline',
  style,
}: DataListItemProps) => {
  const { orientation, size } = useDataList();
  const theme = useTheme();
  const sizeConfig = getSizeConfig(size, theme.space);

  const itemStyle: ViewStyle = orientation === 'horizontal'
    ? {
        flexDirection: 'row',
        alignItems: align === 'baseline' ? 'baseline' : align,
        gap: sizeConfig.gap,
      }
    : {
        flexDirection: 'column',
        gap: theme.space[1],
      };

  return (
    <View style={[styles.item, itemStyle, style]}>
      {children}
    </View>
  );
};

DataListItem.displayName = 'DataList.Item';

// ============================================================================
// DataList.Label
// ============================================================================

interface DataListLabelProps {
  children: ReactNode;
  color?: Color;
  highContrast?: boolean;
  width?: number | string;
  style?: StyleProp<TextStyle>;
}

const DataListLabel = ({
  children,
  color,
  highContrast = false,
  width,
  style,
}: DataListLabelProps) => {
  const { orientation, size } = useDataList();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Determine text color
  let textColor: string;
  if (color) {
    const colorScale = isDark ? theme.colors[color]?.dark : theme.colors[color];
    if (colorScale) {
      textColor = highContrast ? colorScale[12] : colorScale[11];
    } else {
      // Fallback to gray if color not found
      const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
      textColor = highContrast ? grayScale[12] : grayScale[11];
    }
  } else {
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    textColor = highContrast ? grayScale[12] : grayScale[11];
  }

  const sizeConfig = getSizeConfig(size, theme.space);

  const labelStyle: TextStyle = {
    color: textColor,
    fontWeight: '500',
    fontSize: theme.typography.fontSizes[2].fontSize,
    lineHeight: theme.typography.fontSizes[2].lineHeight,
  };

  // Apply width for horizontal orientation
  const containerStyle: ViewStyle = {};
  if (orientation === 'horizontal' && width !== undefined) {
    containerStyle.width = width as any;
    containerStyle.minWidth = width as any;
  } else if (orientation === 'horizontal') {
    containerStyle.minWidth = sizeConfig.labelMinWidth;
  }

  return (
    <View style={containerStyle}>
      <Text style={[labelStyle, style]}>
        {children}
      </Text>
    </View>
  );
};

DataListLabel.displayName = 'DataList.Label';

// ============================================================================
// DataList.Value
// ============================================================================

interface DataListValueProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DataListValue = ({
  children,
  style,
}: DataListValueProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const valueStyle: ViewStyle = {
    flex: 1,
    minWidth: 0, // Allow truncation
  };

  const textStyle: TextStyle = {
    color: isDark ? theme.colors.gray.dark[12] : theme.colors.gray[12],
    fontSize: theme.typography.fontSizes[2].fontSize,
    lineHeight: theme.typography.fontSizes[2].lineHeight,
  };

  // If children is a string or number, wrap in Text
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <View style={[valueStyle, style]}>
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  }

  // Otherwise, render children directly
  return (
    <View style={[valueStyle, style]}>
      {children}
    </View>
  );
};

DataListValue.displayName = 'DataList.Value';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  item: {
    width: '100%',
  },
});

// ============================================================================
// Compound Export
// ============================================================================

export const DataList = {
  Root: DataListRoot,
  Item: DataListItem,
  Label: DataListLabel,
  Value: DataListValue,
};

// ============================================================================
// Named Exports
// ============================================================================

export { DataListRoot, DataListItem, DataListLabel, DataListValue };

// ============================================================================
// Type Exports
// ============================================================================

export type {
  DataListRootProps,
  DataListItemProps,
  DataListLabelProps,
  DataListValueProps,
  DataListOrientation,
  DataListSize,
  DataListTrim,
  DataListItemAlign,
};
