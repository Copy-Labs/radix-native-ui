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
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
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
// a rounded pill surface hovering above the page, with icon+label items.
//
// One shared accent pill is owned by the Root and slides between item centers
// — on tap AND under the finger. Press a tab and drag sideways: the pill
// tracks the finger with a subtle liquid stretch, haptic-ticking as it crosses
// each item; releasing commits the hovered tab (Apple's "linear" tab-bar
// gesture). Everything is transform/opacity driven, so it all runs on the
// native driver — same gesture architecture as Sidebar, zero new dependencies
// (core Animated + PanResponder, no Reanimated).
//
// Compound + controlled pattern (matches Tabs / SegmentedControl / Sidebar):
//
//   <FloatingTabBar.Root value={tab} onValueChange={setTab}>
//     <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
//     <FloatingTabBar.Item value="inbox" label="Inbox" icon={...} badge={3} />
//   </FloatingTabBar.Root>
//
// Omit value/onValueChange for an uncontrolled bar that manages its own state.
// ============================================================================

type FloatingTabBarSize = 1 | 2 | 3 | 4;

// ---------------------------------------------------------------------------
// Pure layout helpers (extracted so they are unit-testable without React).
// The pill's single source of truth is `pillX`: its translateX in surface
// coordinates, i.e. the tracked tab center minus half the pill size.
// ---------------------------------------------------------------------------

/** Surface-space horizontal box of a measured, ready item. */
export interface FloatingTabBarZone {
  value: string;
  x: number;
  width: number;
}

/**
 * Index of the zone containing `x`, or -1 when the finger sits in a gap or
 * outside the bar (the caller then shows no hover preview and a release
 * snaps back to the active tab).
 */
export function detectTabZone(layouts: FloatingTabBarZone[], x: number): number {
  for (let i = 0; i < layouts.length; i++) {
    const l = layouts[i];
    if (x >= l.x && x <= l.x + l.width) return i;
  }
  return -1;
}

/** Keep a finger position inside the first/last centers so the pill never peeks past the bar. */
export function clampPillCenter(x: number, firstCenter: number, lastCenter: number): number {
  if (firstCenter > lastCenter) return lastCenter;
  return Math.min(lastCenter, Math.max(firstCenter, x));
}

/** translateX that centers a pill of `pillSize` on `center`. */
export function pillTranslateFor(center: number, pillSize: number): number {
  return center - pillSize / 2;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/** Merged layout report for one item; `ready` once both onLayouts have fired. */
interface ItemLayout {
  x?: number;
  width?: number;
  iconY?: number;
}

interface FloatingTabBarContextValue {
  activeValue: string;
  /** Item under the finger mid-drag (the pill hover preview), or null. */
  hoverValue: string | null;
  select: (value: string) => void;
  reportLayout: (value: string, patch: ItemLayout) => void;
  forgetLayout: (value: string) => void;
  disabled: boolean;
  hapticFeedback: boolean;
  size: FloatingTabBarSize;
  /** Icon edge, label font size and item vertical padding for the bar size. */
  metrics: { iconSize: number; fontSize: number; paddingVertical: number; pillSize: number };
  /** Soft-accent colors for the shared pill + active icon/label tint. */
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
   * Accent used by the shared pill, tint and badge.
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
  /**
   * Press-and-drag horizontally across the bar: the pill tracks the finger,
   * ticks through items with haptics, and the release commits the hovered
   * tab. Needs at least two measured items; taps always work regardless.
   * @default true
   */
  dragToSelect?: boolean;
  /** Disable all items (and dragging). */
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

// Liquid stretch: a fast finger step stretches the pill along the drag axis
// (volume-compensating squash on the other), decaying back on release.
const STRETCH_STEP_DIVISOR = 30;
const STRETCH_SCALE_X = 0.22;
const STRETCH_SCALE_Y = 0.15;

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
  dragToSelect = true,
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

  const metrics = SIZE_METRICS[size];
  const radii = theme.radii[radius] ?? theme.radii.medium;
  const surfaceColor = isDark ? grayScale['2'] : '#FFFFFF';

  // -------------------------------------------------------------------------
  // Shared pill state. `pillX` is the pill's translateX (surface coords);
  // `pillY` places it over the measured icon row; `pillStretch` is the liquid
  // magnitude; `pillOpacity` fades the pill in once its tab has been measured
  // (the pill has no meaningful resting position before the first layout).
  // -------------------------------------------------------------------------
  const pillX = useRef(new Animated.Value(0)).current;
  const pillY = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const pillStretch = useRef(new Animated.Value(0)).current;

  const layoutsRef = useRef(new Map<string, ItemLayout>());
  const [layoutTick, setLayoutTick] = useState(0);
  const [hoverValue, setHoverValue] = useState<string | null>(null);

  // Latest values for the memoized responder without re-creating it.
  const activeRef = useRef(activeValue);
  activeRef.current = activeValue;
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const hoverRef = useRef<string | null>(null);
  const pillMountedRef = useRef(false);
  // Native-driver runs never write back to the JS value, so the pill keeps
  // its own authoritative record of where it visually rests (the Sidebar
  // lesson): every animation re-anchors from it and updates it on finish.
  const pillVisualRef = useRef(0);
  const pillAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const stretchAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const stretchValRef = useRef(0);

  const layoutsVersionRef = useRef(0);

  const reportLayoutImpl = useCallback((itemValue: string, patch: ItemLayout) => {
    const prev = layoutsRef.current.get(itemValue) ?? {};
    const next = { ...prev, ...patch };
    layoutsRef.current.set(itemValue, next);
    // Bump only when a measurement actually changed — onLayout can refire
    // with identical values (e.g. sibling resizes), and the pill effect
    // keyed on the tick would replay its animation.
    const changed =
      (patch.x !== undefined && patch.x !== prev.x) ||
      (patch.width !== undefined && patch.width !== prev.width) ||
      (patch.iconY !== undefined && patch.iconY !== prev.iconY);
    if (changed) {
      layoutsVersionRef.current += 1;
      setLayoutTick(layoutsVersionRef.current);
    }
  }, []);

  const forgetLayout = useCallback((itemValue: string) => {
    layoutsRef.current.delete(itemValue);
    layoutsVersionRef.current += 1;
    setLayoutTick(layoutsVersionRef.current);
  }, []);

  /** Sorted-by-x boxes of every fully measured item. */
  const readyLayouts = useCallback((): FloatingTabBarZone[] => {
    const out: FloatingTabBarZone[] = [];
    layoutsRef.current.forEach((l, v) => {
      if (l.x !== undefined && l.width !== undefined) out.push({ value: v, x: l.x, width: l.width });
    });
    return out.sort((a, b) => a.x - b.x);
  }, []);

  const centerOf = useCallback(
    (itemValue: string): number | null => {
      const entry = layoutsRef.current.get(itemValue);
      if (!entry || entry.x === undefined || entry.width === undefined) return null;
      return entry.x + entry.width / 2;
    },
    []
  );

  /** Snap or slide the pill onto `anchor`'s center. */
  const positionPill = useCallback(
    (anchor: string, opts: { animate: boolean; spring?: boolean }) => {
      const entry = layoutsRef.current.get(anchor);
      const center = centerOf(anchor);
      if (center === null || !entry || entry.iconY === undefined) {
        Animated.timing(pillOpacity, { toValue: 0, duration: 120, useNativeDriver: true }).start();
        return;
      }
      const translate = pillTranslateFor(center, metrics.pillSize);
      pillY.setValue(entry.iconY);
      if (!opts.animate) {
        pillX.setValue(translate);
        pillVisualRef.current = translate;
      } else {
        // Stop any in-flight run, re-anchor the JS value to the last known
        // resting spot, then animate — stale native-driver values must never
        // seed the next transition.
        pillAnimRef.current?.stop();
        pillX.setValue(pillVisualRef.current);
        const anim = opts.spring
          ? Animated.spring(pillX, {
              toValue: translate,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            })
          : Animated.timing(pillX, { toValue: translate, duration: 220, useNativeDriver: true });
        pillAnimRef.current = anim;
        anim.start(({ finished }) => {
          if (finished) pillVisualRef.current = translate;
        });
      }
      Animated.timing(pillOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    },
    [centerOf, metrics.pillSize, pillX, pillY, pillOpacity]
  );

  // The pill follows the active tab whenever the finger is not driving it.
  // Drag commits call positionPill directly (the state effect may replay the
  // same spring harmlessly, which is cheap and self-correcting).
  useEffect(() => {
    if (draggingRef.current) return;
    if (!activeValue) {
      Animated.timing(pillOpacity, { toValue: 0, duration: 120, useNativeDriver: true }).start();
      return;
    }
    positionPill(activeValue, { animate: pillMountedRef.current });
    pillMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeValue, layoutTick, metrics.pillSize]);

  // -------------------------------------------------------------------------
  // Drag-to-select responder. Same model as Sidebar: horizontal-dominant
  // capture (so vertical page scrolls and plain taps are untouched), zone
  // detection while dragging, haptic on each crossing, commit on release.
  // -------------------------------------------------------------------------
  const panResponder = useMemo(() => {
    const canDrag = () =>
      dragToSelect && !disabled && readyLayouts().length >= 2;
    const isHorizontal = (_: any, g: any) =>
      canDrag() && Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2;

    const trackFinger = (x: number) => {
      const layouts = readyLayouts();
      if (layouts.length === 0) return;
      const firstCenter = centerOf(layouts[0].value) ?? layouts[0].x + layouts[0].width / 2;
      const lastCenter =
        centerOf(layouts[layouts.length - 1].value) ??
        layouts[layouts.length - 1].x + layouts[layouts.length - 1].width / 2;
      const clamped = clampPillCenter(x, firstCenter, lastCenter);

      const step = Math.abs(x - lastXRef.current);
      lastXRef.current = x;
      // The finger owns the pill now: cancel any resting animation and keep
      // the authoritative JS record in sync with every setValue.
      pillAnimRef.current?.stop();
      const translate = pillTranslateFor(clamped, metrics.pillSize);
      pillX.setValue(translate);
      pillVisualRef.current = translate;
      // Smoothed velocity stretch: each event decays the previous magnitude
      // toward the new one, so sustained fast drags pulse instead of pinning.
      stretchAnimRef.current?.stop();
      const target = Math.min(1, step / STRETCH_STEP_DIVISOR);
      stretchValRef.current = stretchValRef.current * 0.55 + target * 0.45;
      pillStretch.setValue(stretchValRef.current);

      const idx = detectTabZone(layouts, x);
      const zoneValue = idx >= 0 ? layouts[idx].value : null;
      if (zoneValue !== hoverRef.current) {
        hoverRef.current = zoneValue;
        if (zoneValue && zoneValue !== activeRef.current && hapticFeedback) {
          triggerHaptic('selection');
        }
        setHoverValue(zoneValue);
      }
    };

    const endDrag = (x: number) => {
      draggingRef.current = false;
      const layouts = readyLayouts();
      const idx = detectTabZone(layouts, x);
      const zoneValue = idx >= 0 ? layouts[idx].value : null;
      hoverRef.current = null;
      setHoverValue(null);
      stretchAnimRef.current?.stop();
      stretchValRef.current = 0;
      const decay = Animated.timing(pillStretch, { toValue: 0, duration: 150, useNativeDriver: true });
      stretchAnimRef.current = decay;
      decay.start();
      if (zoneValue && zoneValue !== activeRef.current) {
        const prevActive = activeRef.current;
        select(zoneValue);
        // A commit lands through state (the [activeValue] effect then springs
        // the pill). Only if the value did NOT change — a controlled parent
        // rejecting the drag — does this timer need to snap the pill back.
        setTimeout(() => {
          if (!draggingRef.current && activeRef.current === prevActive) {
            positionPill(activeRef.current, { animate: true, spring: true });
          }
        }, 32);
      } else {
        positionPill(activeRef.current, { animate: true, spring: true });
      }
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      // Capture variants so the bar takes over a touch a child pressable
      // already claimed — the Sidebar/BottomSheet responder lesson.
      onMoveShouldSetPanResponder: isHorizontal,
      onMoveShouldSetPanResponderCapture: isHorizontal,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_: any, g: any) => {
        draggingRef.current = true;
        lastXRef.current = g.locationX;
        // Hand the pill to the finger from its current spot (no jump): the
        // first move already places it under the finger, clamped to range.
        pillStretch.setValue(0);
      },
      onPanResponderMove: (_: any, g: any) => {
        if (!draggingRef.current) return;
        trackFinger(g.locationX);
      },
      onPanResponderRelease: (_: any, g: any) => endDrag(g.locationX),
      onPanResponderTerminate: (_: any, g: any) => endDrag(g.locationX),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragToSelect, disabled, hapticFeedback, select, readyLayouts, centerOf, positionPill, metrics.pillSize]);

  const contextValue = useMemo<FloatingTabBarContextValue>(
    () => ({
      activeValue,
      hoverValue,
      select,
      reportLayout: reportLayoutImpl,
      forgetLayout,
      disabled,
      hapticFeedback,
      size,
      metrics,
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
      hoverValue,
      select,
      reportLayoutImpl,
      forgetLayout,
      disabled,
      hapticFeedback,
      size,
      metrics,
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

  // Transform-derived pill scales, all native-driven. The stretch stretches
  // along the drag axis and squashes across it (volume-compensating feel).
  const pillScaleX = pillStretch.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1 + STRETCH_SCALE_X],
  });
  const pillScaleY = pillStretch.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1 - STRETCH_SCALE_Y],
  });

  return (
    <FloatingTabBarContext.Provider value={contextValue}>
      <View style={[surfaceStyle, style]} {...panResponder.panHandlers}>
        {/* One shared pill, painted beneath every item (iOS paints in DOM
            order); pointer Events are off so touches reach the items. */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              width: metrics.pillSize,
              height: metrics.pillSize,
              borderRadius: metrics.pillSize / 2,
              backgroundColor: contextValue.activePillColor,
              opacity: pillOpacity,
              transform: [
                { translateX: pillX },
                { translateY: pillY },
                { scaleX: pillScaleX },
                { scaleY: pillScaleY },
              ],
            },
          ]}
        />
        {children}
      </View>
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
    hoverValue,
    select,
    reportLayout,
    forgetLayout,
    disabled: rootDisabled,
    metrics,
    activeTintColor,
    inactiveTintColor,
    disabledTintColor,
    badgeBackgroundColor,
    badgeTextColor,
    surfaceColor,
  } = useFloatingTabBarContext('Item');

  const isDisabled = rootDisabled || !!disabled;
  const isActive = activeValue === value;
  // The finger hovering this item mid-drag previews the active look.
  const isHot = isActive || hoverValue === value;

  // 0 -> 1 activation progress drives the icon bounce.
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isHot ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isHot, progress]);

  const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  // Report geometry so the Root can position the shared pill and detect drag
  // zones: the item box (surface coords) and the icon block's vertical offset.
  useEffect(() => () => forgetLayout(value), [value, forgetLayout]);

  const tintColor = isDisabled ? disabledTintColor : isHot ? activeTintColor : inactiveTintColor;
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
      hapticFeedback={false}
      onLayout={(e) =>
        // The item box in surface coords: x/width drive drag zones and the
        // pill's horizontal center (the pressable stretches to full height at
        // y 0 inside the row, so x is already bar-relative).
        reportLayout(value, { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width })
      }
    >
      <View style={styles.itemInner}>
        <View
          style={[styles.iconWrap, { width: metrics.pillSize, height: metrics.pillSize }]}
          onLayout={(e) =>
            // Vertical resting spot for the shared pill: the icon block's
            // offset inside the (centered) item content.
            reportLayout(value, { iconY: e.nativeEvent.layout.y })
          }
        >
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
      </View>
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
  },
  itemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
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
