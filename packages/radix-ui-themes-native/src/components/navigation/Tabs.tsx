import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity, View } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';
import {
  getAccentColor,
  getGrayAlpha,
} from '../../theme/color-helpers';

// ============================================================================
// Tabs Context
// ============================================================================

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  accentColor: string;
  radii: RadiusScale | Record<number, number>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs.Root');
  }
  return context;
};

// ============================================================================
// Tabs.Root - Main component that manages state
// ============================================================================

interface TabsRootProps {
  children: ReactNode;
  /**
   * Default value of the active tab
   */
  defaultValue?: string;
  /**
   * Controlled value of the active tab
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void;
}

export const TabsRoot = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
}: TabsRootProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [controlledValue, onValueChange]);

  const theme = useTheme();
  const mode = useThemeMode();
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const accentColor = getAccentColor(theme, mode)[9];
  const radii = theme.radii;

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, colors, grayAlpha, accentColor, radii }}>
      <View style={styles.root}>{children}</View>
    </TabsContext.Provider>
  );
};

// ============================================================================
// Tabs.List - Container for tab triggers
// ============================================================================

interface TabsListProps {
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Show underline indicator
   */
  showUnderline?: boolean;
}

export const TabsList = ({ children, style, showUnderline = true }: TabsListProps) => {
  const { grayAlpha } = useTabs();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: grayAlpha['2'],
          borderBottomWidth: showUnderline ? 1 : 0,
          borderBottomColor: grayAlpha['6'],
        },
        style,
      ]}
    >
      <View style={styles.listInner}>{children}</View>
    </View>
  );
};

// ============================================================================
// Tabs.Trigger - Individual tab button
// ============================================================================

interface TabsTriggerProps {
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

export const TabsTrigger = ({
  children,
  value,
  disabled = false,
  icon,
}: TabsTriggerProps) => {
  const { value: activeValue, onValueChange, colors, grayAlpha, accentColor } = useTabs();
  const theme = useTheme();
  const isActive = activeValue === value;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[3],
    borderBottomWidth: 2,
    borderBottomColor: isActive ? accentColor : 'transparent',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={triggerStyle}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
    >
      {icon && <View style={{ marginRight: theme.space[2] }}>{icon}</View>}
      {typeof children === 'string' ? (
        <Text
          style={{
            color: isActive ? colors[12] : grayAlpha['10'],
            fontWeight: isActive ? '600' : '400',
            fontSize: theme.typography.fontSizes[2].fontSize,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// Tabs.Content - Content panel for a tab
// ============================================================================

interface TabsContentProps {
  children: ReactNode;
  /**
   * Value associated with this content
   */
  value: string;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

export const TabsContent = ({ children, value, style }: TabsContentProps) => {
  const { value: activeValue } = useTabs();
  const theme = useTheme();

  if (activeValue !== value) {
    return null;
  }

  return (
    <View
      style={[
        styles.content,
        {
          padding: theme.space[4],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// Tabs.Icon - Icon sub-component
// ============================================================================

interface TabsIconProps {
  children: ReactNode;
}

export const TabsIcon = ({ children }: TabsIconProps) => {
  return <>{children}</>;
};

// ============================================================================
// Export
// ============================================================================

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Icon: TabsIcon,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  listInner: {
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    width: '100%',
  },
});

export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsIconProps,
};
