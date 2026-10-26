import React, {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type StyleProp,
  ViewStyle,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getVariantColors } from '../../theme/color-helpers';
import type { Color, RadiusSize } from '../../theme/types';
import AnimatedPressable from '../primitives/AnimatedPressable';
import { triggerHaptic } from '../../utils';

// ============================================================================
// FloatingTabBar
// ----------------------------------------------------------------------------
// A floating, elevated bottom tab bar (iOS "floater" / Material 3 style):
// a rounded pill surface hovering above the page, with icon+label items. The
// active item gets a soft-accent pill behind its icon that fades/scales in and
// an icon scale-up — transforms and opacity only, so every animation runs on
// the native driver.
//
// Compound + controlled pattern (matches Tabs / SegmentedControl / Sidebar):
//
//   <FloatingTabBar.Root value={tab} onValueChange={setTab}>
//     <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
//     <FloatingTabBar.Item value="inbox" label="Inbox" icon={...} badge={3} />
//   </FloatingTabBar.Root>
//
// Omit value/onValueChange for an uncontrolled bar that manages its own state
// (first item active).
// ============================================================================

type FloatingTabBarSize = 1 | 2 | 3 | 4;

interface FloatingTabBarContextValue {
  activeValue: string;
  select: (value: string) => void;
  disabled: boolean;
  hapticFeedback: boolean;
  size: FloatingTabBarSize;
  /** Icon edge, label font size and item vertical padding for the bar size. */
  metrics: { iconSize: number; fontSize: number; paddingVertical: number; pillSize: number };
  /** Soft-accent colors for the active pill + active icon/label tint. */
  activePillColor: string;
  activeTintColor: string;
  inactiveTintColor: string;
  disabledTintColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
  surfaceColor: string;
  radii: number;
}

const FloatingTabBarContext = createContext<FloatingTabBarContextValue | null>(null);

function useFloatingTabBarContext(component: string) {
  const context = useContext(FloatingTabBarContext);
  if (!context) {
    throw new Error(`FloatingTabBar.${component} must be used within FloatingTabBar.Root`);
  }
  return context;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

interface FloatingTabBarRootProps {
  children: ReactNode;
  /**
   * Currently active item value. Omit (with no onValueChange) for an
   * uncontrolled bar.
   */
  value?: string;
  /** Controlled-state callback. */
  onValueChange?: (value: string) => void;
  /**
   * Initial value for an uncontrolled bar (omit `value`/`onValueChange`).
   * @default undefined (nothing active until first press)
   */
  defaultValue?: string;
  /**
   * Accent used by the active pill, tint and badge.
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Bar size: drives icon, label and pill dimensions.
   * @default 3
   */
  size?: FloatingTabBarSize;
  /**
   * Corner rounding of the floating surface.
   * @default 'full'
   */
  radius?: RadiusSize;
  /**
   * Shadow strength underneath the bar (0 disables).
   * @default 2
   */
  elevation?: 0 | 1 | 2 | 3;
  /**
   * Horizontal margin on each side of the floating bar.
   * @default 16
   */
  inset?: number;
  /** Disable all items. */
  disabled?: boolean;
  /** Fire a light haptic on item selection. @default true */
  hapticFeedback?: boolean;
  /** Merge into the floating surface style. */
  style?: StyleProp<ViewStyle>;
}

const SIZE_METRICS: Record<FloatingTabBarSize, FloatingTabBarContextValue['metrics']> = {
  1: { iconSize: 16, fontSize: 10, paddingVertical: 6, pillSize: 30 },
  2: { iconSize: 18, fontSize: 11, paddingVertical: 7, pillSize: 34 },
  3: { iconSize: 21, fontSize: 12, paddingVertical: 8, pillSize: 40 },
  4: { iconSize: 24, fontSize: 13, paddingVertical: 10, pillSize: 46 },
};

const ELEVATION_SHADOWS: Record<number, ViewStyle> = {
  0: {},
  1: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  2: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  3: { shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
};

const FloatingTabBarRoot = ({
  children,
  value,
  onValueChange,
  defaultValue,
  color,
  size = 3,
  radius = 'full',
  elevation = 2,
  inset = 16,
  disabled = false,
  hapticFeedback = true,
  style,
}: FloatingTabBarRootProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;

  const activeColor: Color = color || theme.accentColor;
  const softColors = useMemo(
    () => getVariantColors(theme, activeColor, mode, 'soft', false),
    [theme, activeColor, mode]
  );
  const solidColors = useMemo(
    () => getVariantColors(theme, activeColor, mode, 'solid', false),
    [theme, activeColor, mode]
  );

  // Controlled vs uncontrolled: without an explicit `value` the bar keeps its
  // own state, seeded from `defaultValue`.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const activeValue = isControlled ? (value as string) : (internalValue ?? '');

  const select = useCallback(
    (next: string) => {
      if (disabled) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
      if (hapticFeedback) triggerHaptic('press');
    },
    [disabled, isControlled, onValueChange, hapticFeedback]
  );

  const radii = theme.radii[radius] ?? theme.radii.medium;
  const surfaceColor = isDark ? grayScale['2'] : '#FFFFFF';

  const contextValue = useMemo<FloatingTabBarContextValue>(
    () => ({
      activeValue,
      select,
      disabled,
      hapticFeedback,
      size,
      metrics: SIZE_METRICS[size],
      activePillColor: softColors.backgroundColor ?? grayScale['4'],
      // Soft-accent text color reads as the accent in light mode and stays
      // legible on the dark surface too.
      activeTintColor: softColors.textColor,
      inactiveTintColor: grayScale[10],
      disabledTintColor: grayScale['7'],
      // Solid accent for the count bubble; gray bars get a dark neutral dot.
      badgeBackgroundColor: activeColor === 'gray' ? grayScale['11'] : solidColors.backgroundColor,
      badgeTextColor: '#FFFFFF',
      surfaceColor,
      radii: radius === 'full' ? 9999 : radii,
    }),
    [
      activeValue,
      select,
      disabled,
      hapticFeedback,
      size,
      softColors,
      solidColors,
      grayScale,
      activeColor,
      surfaceColor,
      radius,
      radii,
    ]
  );

  const surfaceStyle: ViewStyle = {
    backgroundColor: surfaceColor,
    borderRadius: radius === 'full' ? 9999 : radii,
    marginHorizontal: inset,
    flexDirection: 'row',
    ...ELEVATION_SHADOWS[elevation],
  };

  return (
    <FloatingTabBarContext.Provider value={contextValue}>
      <View style={[surfaceStyle, style]}>{children}</View>
    </FloatingTabBarContext.Provider>
  );
};

FloatingTabBarRoot.displayName = 'FloatingTabBarRoot';

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface FloatingTabBarItemProps {
  /** Unique value identified by the bar. */
  value: string;
  /** Label under the icon. */
  label: ReactNode;
  /** Icon element (cloned with themed size + color). */
  icon: ReactElement;
  /**
   * Count bubble on the icon's top-right. Numbers render a themed bubble;
   * any element renders as-is (e.g. a plain dot).
   */
  badge?: number | ReactNode;
  /** Disable this item. */
  disabled?: boolean;
  /** Merge into the item container style. */
  style?: StyleProp<ViewStyle>;
}

const FloatingTabBarItem = ({ value, label, icon, badge, disabled, style }: FloatingTabBarItemProps) => {
  const {
    activeValue,
    select,
    disabled: rootDisabled,
    metrics,
    activePillColor,
    activeTintColor,
    inactiveTintColor,
    disabledTintColor,
    badgeBackgroundColor,
    badgeTextColor,
    surfaceColor,
  } = useFloatingTabBarContext('Item');

  const isDisabled = rootDisabled || !!disabled;
  const isActive = activeValue === value;

  // 0 -> 1 activation progress drives the pill fade/scale and icon bounce.
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isActive ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isActive, progress]);

  const pillOpacity = progress;
  const pillScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  const tintColor = isDisabled ? disabledTintColor : isActive ? activeTintColor : inactiveTintColor;
  const iconOwnProps = (icon.props ?? {}) as { size?: number; color?: string };
  const iconElement = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        size: iconOwnProps.size ?? metrics.iconSize,
        color: iconOwnProps.color ?? tintColor,
      })
    : icon;

  const badgeNode =
    badge === undefined || badge === null ? null : typeof badge === 'number' ? (
      // The ring is the bar surface color so the bubble reads as punched
      // through the icon instead of a stray outline.
      <View style={[styles.badge, { backgroundColor: badgeBackgroundColor, borderColor: surfaceColor }]}>
        <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badge > 99 ? '99+' : badge}</Text>
      </View>
    ) : (
      <View style={styles.badgeAnchor}>{badge}</View>
    );

  return (
    <AnimatedPressable
      style={[styles.item, style]}
      onPress={() => select(value)}
      disabled={isDisabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: isDisabled }}
      accessibilityLabel={typeof label === 'string' ? label : value}
      pressedScale={0.95}
      animationDuration={100}
    >
      <View style={[styles.iconWrap, { width: metrics.pillSize, height: metrics.pillSize }]}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill as ViewStyle,
            styles.pill,
            { backgroundColor: activePillColor, opacity: pillOpacity, transform: [{ scale: pillScale }] },
          ]}
        />
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>{iconElement}</Animated.View>
        {badgeNode ? <View style={styles.badgeWrap} pointerEvents="none">{badgeNode}</View> : null}
      </View>
      <Text
        size={1}
        style={{
          color: tintColor,
          fontSize: metrics.fontSize,
          marginTop: 4,
          fontWeight: isActive ? '600' : '400',
          opacity: isDisabled ? 0.5 : 1,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

FloatingTabBarItem.displayName = 'FloatingTabBarItem';

// ---------------------------------------------------------------------------
// Compound attachment
// ---------------------------------------------------------------------------

interface FloatingTabBarCompound {
  Root: typeof FloatingTabBarRoot;
  Item: typeof FloatingTabBarItem;
}

export const FloatingTabBar: FloatingTabBarCompound = {
  Root: FloatingTabBarRoot,
  Item: FloatingTabBarItem,
};

export type {
  FloatingTabBarRootProps,
  FloatingTabBarItemProps,
  FloatingTabBarSize,
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    borderRadius: 9999,
  },
  badgeWrap: {
    position: 'absolute',
    top: -3,
    right: -3,
  },
  badge: {
    minWidth: 17,
    height: 17,
    borderRadius: 9999,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
  badgeAnchor: {},
});
