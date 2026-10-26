import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
  type StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import AnimatedPressable from '../primitives/AnimatedPressable';
import { useTheme, useThemeMode, useHaptics } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import { triggerHaptic } from '../../utils/haptics';

// ============================================================================
// Types
// ============================================================================

export type SidePosition = 'left' | 'right';
/**
 * How the sidebar is presented relative to the page:
 * - 'overlay' (default): the sidebar slides in ON TOP of the page behind a
 *   fading dim, rendered through a Modal (native-level layer).
 * - 'push': the sidebar is revealed at the edge while the page translates
 *   with it (Android DrawerLayout style), with a fading backdrop.
 * - 'under': the sidebar emerges from UNDERNEATH the page — the drawer sits
 *   statically at the edge while the page (on top) slides aside to reveal it,
 *   and the drawer scales up as it is unmasked (its own rise-toward-you motion).
 * - 'reveal': 'under' plus depth (Material style) — the drawer is statically
 *   anchored beneath the page while the page slides aside AND scales down and
 *   dims, receding to expose the drawer underneath it.
 */
export type SidebarVariant = 'overlay' | 'push' | 'under' | 'reveal';

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextValue {
  open: boolean;
  onOpenChange: (open: boolean, skipAnimation?: boolean) => void;
  side: SidePosition;
  variant: SidebarVariant;
  width: number;
  animationDuration: number;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
  globalHaptics: boolean;
  // Animation state. `slide` is the sidebar's own translateX (closed = ∓width,
  // open = 0); `mainTranslateX` shifts the page for the shifting variants;
  // `opacity` drives every dim/backdrop so all fades follow the finger and
  // the spring. `mainScale`/`revealDimOpacity` are the reveal variant's page
  // recession (scale down + in-page scrim), also progress-derived.
  slide: Animated.Value;
  mainTranslateX: Animated.Value;
  opacity: Animated.Value;
  mainScale: Animated.Value;
  revealDimOpacity: Animated.Value;
  contentScale: Animated.Value;
  // Authoritative JS-side positions — native-driver animations do not write
  // values back to JS, so gestures must never read slide.__getValue().
  slideRef: { current: number };
  modalVisible?: boolean;
  safeAreaInsets?: SidebarSafeAreaInsets;
  updateDragPosition: (slideValue: number) => void;
  animateToState: (targetOpen: boolean) => void;
  settleFromDrag: (projectedSlide: number, vx: number) => void;
  commitOpenState: (newOpen: boolean) => void;
  // Swipe responder, only meaningful for the overlay variant (its Content
  // lives in a Modal outside the subtree, so it carries its own responder).
  panHandlers: any;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar components must be used within a Sidebar.Root');
  }
  return context;
};

// ============================================================================
// Helpers
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_ANIMATION_DURATION = 300;
const SPRING_TENSION = 65;
const SPRING_FRICTION = 11;
const SWIPE_OPEN_FRACTION = 0.25;
// Restrained Material numbers for the reveal variant's page recession.
const REVEAL_PAGE_SCALE = 0.92;
const REVEAL_DIM_OPACITY = 0.32;
// The under variant's drawer rises toward the viewer as the page unmasks it.
const UNDER_DRAWER_SCALE = 0.9;

// ---------------------------------------------------------------------------
// Pure geometry helpers (extracted so they are unit-testable without React).
// The single source of truth is `slide`: the sidebar's own translateX between
// fully off-screen (closed) and flush at the edge (open). `progress`
// (0→1) derives from it; the page shift and every dim derive from progress,
// so all channels move in lockstep during drags, timings and springs alike —
// transforms only, so the native driver stays on.
// Variants differ only in:
// - push:    the page translates away with the drawer, drawer on top
//            (DrawerLayout style).
// - under:   the page stays ON TOP and slides aside, revealing the drawer
//            anchored statically beneath it, which scales up as it's unmasked.
// - reveal:  like under, but the receding page also scales down and dims.
// - overlay: Modal; the page stays still under a fading dim.
// ---------------------------------------------------------------------------

/** translateX resting values of the drawer's transform for a side. */
export function sidebarSlideRange(side: SidePosition, width: number): { closed: number; open: number } {
  // The drawer rests flush with its edge when open (translateX 0) and fully
  // off-screen when closed. An earlier PEEK sliver was dropped: it clipped
  // the overlay drawer 40px off-screen and left a gap beside the page.
  return side === 'left' ? { closed: -width, open: 0 } : { closed: width, open: 0 };
}

/**
 * 0 → fully closed, 1 → fully open. Signed travel handles both sides and
 * clamps overdrag on either end of the range.
 */
export function slideProgress(slide: number, side: SidePosition, width: number): number {
  const { closed, open } = sidebarSlideRange(side, width);
  const travel = open - closed;
  if (travel === 0) return 1;
  return Math.min(1, Math.max(0, (slide - closed) / travel));
}

/**
 * slide→progress mapping for Animated.interpolate, always [closed→0,
 * open→1]. Kept ascending on both sides: the JS thread consumes the result
 * (native interpolate is not guaranteed to accept descending inputRanges).
 */
export function progressInterpolation(
  side: SidePosition,
  width: number
): { inputRange: [number, number]; outputRange: [number, number] } {
  const { closed, open } = sidebarSlideRange(side, width);
  return side === 'left'
    ? { inputRange: [closed, open], outputRange: [0, 1] }
    : { inputRange: [open, closed], outputRange: [1, 0] };
}

/**
 * translateX the page reaches when fully open (Sidebar.Main). push, under and
 * reveal all slide the page aside by the full drawer width to make room for
 * the drawer — push rides it on top, under/reveal reveal it from beneath.
 * Overlay dims a static page. A left drawer pushes the page right (+); a
 * right drawer left (−).
 */
export function mainShiftFor(variant: SidebarVariant, side: SidePosition, width: number): number {
  if (variant === 'overlay') return 0;
  return side === 'left' ? width : -width;
}

/**
 * Scale the page shrinks to when fully open. Only the reveal variant recedes
 * its page; every other variant (and the closed state) stays at 1.
 */
export function pageScaleFor(variant: SidebarVariant): number {
  return variant === 'reveal' ? REVEAL_PAGE_SCALE : 1;
}

/**
 * Closed-state scale of the drawer itself. Only `under` gives its statically
 * anchored drawer its own animation — rising from UNDER_DRAWER_SCALE to 1 as
 * the page unmasks it; every other variant sits at 1 (their motion is the
 * slide transform or the Modal layer).
 */
export function contentScaleFor(variant: SidebarVariant): number {
  return variant === 'under' ? UNDER_DRAWER_SCALE : 1;
}

/**
 * Static left anchor of the drawer (layout position before transforms): flush
 * with its edge — the slide transform carries it fully in view when open.
 */
export function sidebarBaseLeft(
  _variant: SidebarVariant,
  side: SidePosition,
  width: number
): number {
  return side === 'left' ? 0 : SCREEN_WIDTH - width;
}

/** Open-drawer resting offset: flush with the edge (translateX 0) on both sides. */
function openOffset(_side: SidePosition): number {
  return 0;
}

/**
 * Where a swipe settles: project momentum in progress space (0 closed → 1
 * open, direction-independent), then open when the projection crosses the
 * threshold. Returns the target open state and its resting slide value.
 */
export function projectSwipeSettle(args: {
  slide: number;
  vx: number;
  side: SidePosition;
  width: number;
}): { targetOpen: boolean; targetSlide: number } {
  const { slide, vx, side, width } = args;
  const { closed, open } = sidebarSlideRange(side, width);
  // vx is in units/ms; ~120ms of projection, same model as BottomSheet.
  const projectedSlide = slide + vx * 120 * (width / 280);
  const progress = slideProgress(projectedSlide, side, width);
  const targetOpen = progress >= SWIPE_OPEN_FRACTION;
  return { targetOpen, targetSlide: targetOpen ? open : closed };
}

/**
 * Shared swipe responder for all variants. The same handler object drives the
 * overlay Modal content (drag-to-close) and the overlay page wrapper / inline
 * Container (drag to open/close) — one gesture model, one settle rule.
 */
function createSidebarResponderHandlers(opts: {
  side: SidePosition;
  width: number;
  slideRef: { current: number };
  updateDragPosition: (v: number) => void;
  settleFromDrag: (projected: number, vx: number) => void;
  /**
   * Fired on grant. The overlay uses this to mount its Modal mid-drag so the
   * drawer exists (and follows the finger) during a swipe-to-open.
   */
  onDragStart?: () => void;
}) {
  const { side, width, slideRef, updateDragPosition, settleFromDrag, onDragStart } = opts;
  const { closed } = sidebarSlideRange(side, width);
  // Signed travel from closed to open (-width → 0 left, +width → 0 right);
  // progress-relative math keeps directions honest for both sides.
  const travel = (openOffset(side) - closed) || 1;
  const dragBaseProgressRef = { current: 0 };
  const isHorizontalSwipe = (_: any, g: any) =>
    Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy);
  const settle = (_: any, g: any) =>
    settleFromDrag(slideRef.current + g.vx * 120 * (width / 280), g.vx);
  return {
    onStartShouldSetPanResponder: () => false,
    // Capture variants let the container win against nested ScrollViews, the
    // same responder-phase lesson that made BottomSheet drag-anywhere work.
    onMoveShouldSetPanResponder: isHorizontalSwipe,
    onMoveShouldSetPanResponderCapture: isHorizontalSwipe,
    onPanResponderGrant: () => {
      onDragStart?.();
      dragBaseProgressRef.current = slideProgress(slideRef.current, side, width);
    },
    onPanResponderMove: (_: any, g: any) => {
      const deltaProgress = (side === 'left' ? g.dx : -g.dx) / travel;
      const p = Math.min(1, Math.max(0, dragBaseProgressRef.current + deltaProgress));
      updateDragPosition(closed + p * travel);
    },
    onPanResponderRelease: settle,
    onPanResponderTerminate: settle,
  };
}

// ============================================================================
// Sidebar.Root - Main component that manages state
// ============================================================================

interface SidebarRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SidePosition;
  variant?: SidebarVariant;
  width?: number;
  animationDuration?: number;
  /**
   * Edge insets for the overlay drawer. The overlay lives in a Modal, which
   * spans the full screen (statusBarTranslucent) and escapes the app's own
   * safe-area layout, so the drawer must carry its own top/bottom padding.
   * Pass insets from react-native-safe-area-context (`useSafeAreaInsets()`);
   * without them a sensible default is used (StatusBar.currentHeight on
   * Android, 0 on iOS). Ignored by the inline variants, which sit inside the
   * app's layout.
   */
  safeAreaInsets?: SidebarSafeAreaInsets;
}

interface SidebarSafeAreaInsets {
  top?: number;
  bottom?: number;
}

export const SidebarRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  side = 'left',
  variant = 'overlay',
  width = 280,
  animationDuration = 300,
  safeAreaInsets,
}: SidebarRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Theme/haptics hooks must run BEFORE any useMemo/useEffect closure that
  // references their values in a dependency array — declaring them lower is a
  // temporal-dead-zone crash (the deps array is evaluated eagerly each render).
  const globalHaptics = useHaptics();

  // Keep the Modal mounted through the closing animation so the exit slides
  // out instead of popping.
  const [modalVisible, setModalVisible] = useState(open);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Single source of truth: the sidebar's translateX, off-screen (closed) to
  // flush at the edge (open).
  const restSlides = sidebarSlideRange(side, width);
  const closedSlide = open ? restSlides.open : restSlides.closed;
  const slide = useRef(new Animated.Value(closedSlide)).current;
  const slideRef = useRef(closedSlide);

  // Derived animated channels so drags, timings and springs move the page and
  // every dim in lockstep with the sidebar — all native-driven transforms.
  const progress = useMemo(() => {
    const { inputRange, outputRange } = progressInterpolation(side, width);
    return slide.interpolate({ inputRange, outputRange });
  }, [slide, side, width]);
  const mainShift = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, mainShiftFor(variant, side, width)],
      }),
    [progress, variant, side, width]
  );
  const backdropOpacity = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    [progress]
  );
  // Reveal's page recession: shrink toward pageScaleFor and fade an in-page
  // scrim — both chained off progress, so drags scrub them with the shift.
  const mainScale = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, pageScaleFor(variant)],
      }),
    [progress, variant]
  );
  const revealDimOpacity = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, variant === 'reveal' ? REVEAL_DIM_OPACITY : 0],
      }),
    [progress, variant]
  );
  // The under drawer's own rise: 0.9 → 1 with the unmasking, so it feels like
  // it comes toward the viewer from beneath the page. A no-op 1 → 1 elsewhere.
  const contentScale = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [contentScaleFor(variant), 1],
      }),
    [progress, variant]
  );
  // Backward-compatible aliases used by the animated style props.
  const mainTranslateX = mainShift;
  const opacity = backdropOpacity;

  // The responder that drives a drag/flick owns the animation for that
  // transition; the open-state effect then only syncs state, never re-animates.
  const settleInFlightRef = useRef(false);

  const handleOpenChange = useCallback(
    (newOpen: boolean, _skipAnimation = false) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  /** Set every animated value from a drag position (JS thread by definition). */
  const updateDragPosition = useCallback(
    (slideValue: number) => {
      slideRef.current = slideValue;
      slide.setValue(slideValue);
    },
    [slide]
  );

  /** Run the open/close animation and keep slideRef authoritative. */
  const animateToState = useCallback(
    (targetOpen: boolean) => {
      const rest = sidebarSlideRange(side, width);
      const fromValue = targetOpen ? rest.closed : rest.open;
      const toValue = targetOpen ? rest.open : rest.closed;
      slideRef.current = toValue;
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      // Native-driver animations never write back to the JS Animated.Value,
      // so `slide` is stale after every previous timing/spring. Re-anchor it
      // to the visual start position first — otherwise a close animates from
      // the ancient closed value (zero-length pop) and the next open starts
      // from the wrong place (the failed re-open).
      slide.setValue(fromValue);
      const run = () => {
        Animated.timing(slide, {
          toValue,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && !targetOpen && variant === 'overlay') {
            // Unmount the Modal only once the exit animation is done.
            exitTimerRef.current = setTimeout(() => setModalVisible(false), 0);
          }
        });
      };
      if (variant === 'overlay' && targetOpen) {
        setModalVisible(true);
        // Let the Modal's native tree mount before animating it (BottomSheet's
        // 50 ms pattern) — an animation started in the mount frame can be
        // dropped, leaving the drawer stuck off-screen while open.
        openTimerRef.current = setTimeout(run, 50);
        return;
      }
      run();
    },
    [side, width, variant, animationDuration, slide]
  );

  /** Responder convenience: animate now, sync state, tell the effect to skip. */
  const settleFromDrag = useCallback(
    (projectedSlide: number, vx: number) => {
      const { targetOpen, targetSlide } = projectSwipeSettle({
        slide: projectedSlide,
        vx,
        side,
        width,
      });
      if (targetOpen !== open && globalHaptics) {
        triggerHaptic('selection');
      }
      // Only mark in-flight when the state actually flips: the [open] effect
      // runs (and consumes the flag) only on real changes, so a settle that
      // keeps the state would strand the flag and make the next button-driven
      // toggle skip its animation entirely.
      if (targetOpen !== open) {
        settleInFlightRef.current = true;
      }
      slideRef.current = targetSlide;
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (targetOpen && variant === 'overlay') {
        setModalVisible(true);
      }
      // JS `slide` is in sync here — the drag itself kept it pinned via
      // updateDragPosition's setValue on every move.
      Animated.spring(slide, {
        toValue: targetSlide,
        tension: SPRING_TENSION,
        friction: SPRING_FRICTION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && !targetOpen && variant === 'overlay') {
          exitTimerRef.current = setTimeout(() => setModalVisible(false), 0);
        }
      });
      handleOpenChange(targetOpen);
    },
    [side, width, variant, open, globalHaptics, slide, handleOpenChange]
  );

  // Mark transitions that were already animated by a gesture release, so the
  // state effect below syncs without replaying the animation.
  useEffect(() => {
    if (settleInFlightRef.current) {
      settleInFlightRef.current = false;
      return;
    }
    animateToState(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Overlay-variant responder: the Content lives inside a Modal (a separate
  // native surface outside this subtree), so it carries its own drag-to-close.
  // While closed the Modal is unmounted, so the same responder also rides a
  // wrapper around the page (below) to catch swipe-to-open. push/under are
  // driven by Sidebar.Container's unified responder instead.
  const ensureModalMounted = useCallback(() => {
    if (variant !== 'overlay') return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    setModalVisible(true);
  }, [variant]);

  const panResponder = useMemo(
    () =>
      PanResponder.create(
        createSidebarResponderHandlers({
          side,
          width,
          slideRef,
          updateDragPosition,
          settleFromDrag,
          onDragStart: ensureModalMounted,
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [side, width, updateDragPosition, settleFromDrag, ensureModalMounted]
  );

  // Clear pending mount/unmount timers if the Root goes away mid-animation.
  useEffect(
    () => () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    []
  );

  const theme = useTheme();
  const mode = useThemeMode();
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  // The Modal is unmounted while the overlay is closed, so the page itself
  // must carry the responder — otherwise swipe-to-open has nowhere to land.
  // Granting a swipe mounts the Modal (ensureModalMounted) so the drawer
  // follows the finger; while open, touches land on the Modal surface and
  // this wrapper is bypassed entirely.
  const body =
    variant === 'overlay' ? (
      <View style={styles.gestureRoot} {...panResponder.panHandlers}>
        {children}
      </View>
    ) : (
      children
    );

  return (
    <SidebarContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        side,
        variant,
        width,
        animationDuration,
        colors,
        grayAlpha,
        radii,
        globalHaptics,
        slide,
        mainTranslateX,
        opacity,
        mainScale,
        revealDimOpacity,
        contentScale,
        slideRef,
        safeAreaInsets,
        updateDragPosition,
        animateToState,
        settleFromDrag,
        commitOpenState: handleOpenChange,
        // Only the overlay variant's Modal content uses this; inline variants
        // get their responder from Container.
        panHandlers: panResponder.panHandlers,
      }}
    >
      {body}
    </SidebarContext.Provider>
  );
};

// ============================================================================
// Sidebar.Trigger - The button that opens the sidebar
// ============================================================================

interface SidebarTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  hapticFeedback?: boolean;
}

export const SidebarTrigger = ({
  children,
  asChild = true,
  hapticFeedback = false,
}: SidebarTriggerProps) => {
  const { onOpenChange, globalHaptics } = useSidebar();

  const handlePress = () => {
    onOpenChange(true);
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      pressedScale={0.98}
      pressedOpacity={0.95}
      animationDuration={100}
      hapticFeedback={false}
    >
      {children}
    </AnimatedPressable>
  );
};

// ============================================================================
// Sidebar.Portal - Renders content at root level using Modal
// ============================================================================

interface SidebarPortalProps {
  children: ReactNode;
  hostId?: string;
}

export const SidebarPortal = ({ children }: SidebarPortalProps) => {
  const { variant, open, modalVisible } = useSidebar();

  // Inline variants (push/under) render inside Sidebar.Container, never in a
  // Modal. The overlay Modal stays mounted through the closing animation
  // (modalVisible lags open) so the exit slides out instead of popping.
  if (variant !== 'overlay') {
    return null;
  }

  return (
    <Modal
      transparent
      visible={modalVisible ?? open}
      animationType="none"
      statusBarTranslucent
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {}}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// Sidebar.Overlay - The backdrop that dims the background
// ============================================================================

interface SidebarOverlayProps {
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarOverlay = ({ style, hapticFeedback = true }: SidebarOverlayProps) => {
  const { onOpenChange, variant, globalHaptics, opacity } = useSidebar();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // The dim belongs to the overlay variant; push/under use Sidebar.Backdrop.
  if (variant !== 'overlay') {
    return null;
  }

  // Use alpha black for overlay based on theme - matches radix-ui styling
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(10, 10, 10, 0.6)';

  const handlePress = () => {
    onOpenChange(false);
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('press');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: overlayColor,
            // Fades in/out with the drawer, following drags and springs alike.
            opacity,
          },
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Sidebar.Content - The actual sidebar content
// ============================================================================

interface SidebarContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarContent = ({ children, style }: SidebarContentProps) => {
  const { side, variant, width, slide, contentScale, panHandlers, radii, safeAreaInsets } =
    useSidebar();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // The overlay Modal spans the full screen (statusBarTranslucent), so the
  // drawer must pad itself away from the status bar / home indicator; its
  // background still bleeds edge-to-edge. Inline variants sit inside the
  // app's own layout, which already handles safe areas.
  const overlayInsets =
    variant === 'overlay'
      ? {
          paddingTop:
            safeAreaInsets?.top ?? (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0),
          paddingBottom: safeAreaInsets?.bottom ?? 0,
        }
      : undefined;

  // Background color
  const backgroundColor = isDark ? theme.colors.gray.dark[2] : '#ffffff';

  // Get shadow for current theme mode
  const shadow = getShadow(6, isDark);

  // Border radius based on side
  const borderRadius =
    side === 'left'
      ? { borderTopRightRadius: radii.large, borderBottomRightRadius: radii.large }
      : { borderTopLeftRadius: radii.large, borderBottomLeftRadius: radii.large };

  // One geometry for all variants: anchored flush with the edge, positioned
  // purely through the shared `slide` transform. The overlay Modal content
  // carries the swipe responder itself; inline variants are driven by
  // Sidebar.Container's responder (no double handlers on the subtree).
  return (
    <Animated.View
      style={[
        styles.content,
        {
          backgroundColor,
          width,
          left: sidebarBaseLeft(variant, side, width),
          // Inline push rides above the shifting page; under/reveal render
          // below it so the drawer emerges from beneath (iOS paints in DOM
          // order — Container sequences that; Android mirrors via elevation).
          zIndex: variant === 'under' || variant === 'reveal' ? 1 : 3,
          elevation: variant === 'under' || variant === 'reveal' ? 1 : 3,
          ...borderRadius,
          ...(overlayInsets || {}),
          // `under`/`reveal` anchor the drawer statically at its edge — the
          // page slides aside over it, so the drawer appears to emerge from
          // underneath the page rather than off the screen edge. `under`
          // adds its own scale-up (0.9 → 1) as it is unmasked.
          transform: [
            { translateX: variant === 'under' || variant === 'reveal' ? 0 : slide },
            { scale: contentScale },
          ],
          ...(shadow || {}),
        },
        style,
      ]}
      {...(variant === 'overlay' ? panHandlers : {})}
    >
      {children}
    </Animated.View>
  );
};

// ============================================================================
// Sidebar.Header - Header section
// ============================================================================

interface SidebarHeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarHeader = ({ children, style }: SidebarHeaderProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// Sidebar.Item - Menu item
// ============================================================================

interface SidebarItemProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarItem = ({
  children,
  onPress,
  style,
  hapticFeedback = true,
}: SidebarItemProps) => {
  const { onOpenChange, globalHaptics } = useSidebar();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const handlePress = () => {
    onPress?.();
    onOpenChange(false);
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [
        styles.item,
        {
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[3],
          backgroundColor: pressed
            ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
            : 'transparent',
        },
        style,
      ]}
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
};

// ============================================================================
// Sidebar.Separator - Divider
// ============================================================================

interface SidebarSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const SidebarSeparator = ({ style }: SidebarSeparatorProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <View
      style={[
        styles.separator,
        {
          marginHorizontal: theme.space[4],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// Sidebar.Backdrop - Optional backdrop for push variant (to close when tapping outside)
// ============================================================================

interface SidebarBackdropProps {
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
}

export const SidebarBackdrop = ({ style, hapticFeedback = true }: SidebarBackdropProps) => {
  const { open, onOpenChange, variant, globalHaptics, opacity } = useSidebar();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // The dim belongs to push only. Overlay dims via Sidebar.Overlay inside the
  // Modal; under reveals a static drawer by sliding the page aside, so the
  // page stays fully visible and interactive (no scrim).
  if (variant !== 'push') {
    return null;
  }

  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)';

  const handlePress = () => {
    onOpenChange(false);
    if (globalHaptics && hapticFeedback) {
      triggerHaptic('selection');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        // When closed the dim is transparent but still full-screen; disable
        // pointer events so it never intercepts taps meant for the page.
        pointerEvents={open ? 'auto' : 'none'}
        style={[
          styles.backdrop,
          {
            backgroundColor: overlayColor,
            // Fade with the drawer. Renders above Main in the stack (dimming
            // the page) and below the drawer, which sequences last.
            opacity,
            zIndex: 2,
          },
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Sidebar.Container - Container for push variant that renders sidebar and main side by side
// Also handles swipe gestures for the entire container area
// ============================================================================

interface SidebarContainerProps {
  children: ReactNode;
}

export const SidebarContainer = ({ children }: SidebarContainerProps) => {
  const { variant, side, width, slideRef, updateDragPosition, settleFromDrag } =
    useSidebar();

  // Hooks must run before any conditional return: a push/under Container
  // nested inside an overlay Root used to trip exactly that rule. The unified
  // responder owns open AND close drags for both inline variants — Root's
  // own responder only drives the overlay Modal, so the two never compete.
  const containerResponder = useMemo(
    () =>
      PanResponder.create(
        createSidebarResponderHandlers({
          side,
          width,
          slideRef,
          updateDragPosition,
          settleFromDrag,
        })
      ),
    [side, width, slideRef, updateDragPosition, settleFromDrag]
  );

  // Overlay needs no wrapper: its Portal/Modal already layers the drawer
  // above the page.
  if (variant === 'overlay') {
    return <>{children}</>;
  }

  // iOS paints siblings in DOM order (zIndex is ignored there), so the
  // drawer renders BEFORE Main for under/reveal (it emerges from beneath the
  // page) and AFTER Main for `push` (it rides on top of the shifting page).
  // The backdrop always sits directly below the drawer: over the page/dim
  // stack, never blocking the drawer's own taps.
  const childArray = React.Children.toArray(children);
  let contentChild: React.ReactNode | null = null;
  let mainChild: React.ReactNode | null = null;
  let backdropChild: React.ReactNode | null = null;
  const others: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (React.isValidElement(child) && child.type === SidebarContent) {
      contentChild = child;
    } else if (React.isValidElement(child) && child.type === SidebarMain) {
      mainChild = child;
    } else if (React.isValidElement(child) && child.type === SidebarBackdrop) {
      backdropChild = child;
    } else {
      others.push(child);
    }
  });

  const drawerBeneath = variant === 'under' || variant === 'reveal';

  return (
    <View style={styles.container} {...containerResponder.panHandlers}>
      {others}
      {drawerBeneath && contentChild}
      {mainChild}
      {backdropChild}
      {!drawerBeneath && contentChild}
    </View>
  );
};

interface SidebarMainProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SidebarMain = ({ children, style }: SidebarMainProps) => {
  const {
    variant,
    open,
    onOpenChange,
    mainTranslateX,
    mainScale,
    revealDimOpacity,
    globalHaptics,
  } = useSidebar();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  if (variant === 'overlay') {
    // Inside the Modal there is nothing to shift or cover — render as-is.
    return <>{children}</>;
  }

  // The page must be opaque for all inline variants: under/reveal hide the
  // closed drawer beneath it, and the dim backdrop fades over it. All three
  // translate it — via the progress-derived channel, in lockstep with the
  // drawer, transforms only, native driver intact.
  const backgroundColor = isDark ? theme.colors.gray.dark[1] : theme.colors.gray[1];

  const handleDimPress = () => {
    onOpenChange(false);
    if (globalHaptics) {
      triggerHaptic('press');
    }
  };

  return (
    <Animated.View
      style={[
        styles.mainInline,
        {
          backgroundColor,
          // Above the under/reveal drawer (which hides beneath it until the
          // page slides aside); the backdrop and push drawer paint over it.
          zIndex: variant === 'under' || variant === 'reveal' ? 2 : 0,
          elevation: variant === 'under' || variant === 'reveal' ? 2 : 0,
          // Reveal adds the recession scale on top of the shift (scale in
          // place, then translate — the composed matrix applies them right
          // to left).
          transform: [{ translateX: mainTranslateX }, { scale: mainScale }],
        },
        style,
      ]}
    >
      {children}
      {/* Reveal's scrim is a CHILD of the page, not a sibling layer: it then
          covers exactly the page's bounds (never the exposed drawer), scales
          with the recession for a physical read, and taps on it close. */}
      {variant === 'reveal' && (
        <TouchableWithoutFeedback onPress={handleDimPress}>
          <Animated.View
            pointerEvents={open ? 'auto' : 'none'}
            style={[
              StyleSheet.absoluteFillObject as ViewStyle,
              { backgroundColor: '#000000', opacity: revealDimOpacity },
            ]}
          />
        </TouchableWithoutFeedback>
      )}
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    // Clip the drawer/page at the viewport edges for the inline variants.
    overflow: 'hidden',
  },
  gestureRoot: {
    // Invisible swipe-to-open surface for the overlay variant: a plain in-flow
    // wrapper so the page keeps laying out exactly as before.
    flex: 1,
  },
  overlay: {
    // Must stay in-flow (flex: 1), NOT absolute: a transparent Modal sizes
    // its content host from its children, so absolute-only children collapse
    // the host on iOS and the dim/drawer misanchor. Same pattern as
    // BottomSheet.Overlay, which makes the Modal fill the screen.
    flex: 1,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  header: {
    // Styles defined inline
  },
  item: {
    // Styles defined inline
  },
  separator: {
    height: 1,
  },
  mainInline: {
    // Full-bleed page layer for the inline push/under variants. Absolute so
    // it shares the container with the absolutely-anchored drawer; its own
    // content scrolls inside.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// ============================================================================
// Export all Sidebar components
// ============================================================================

export const Sidebar = {
  Root: SidebarRoot,
  Trigger: SidebarTrigger,
  Portal: SidebarPortal,
  Overlay: SidebarOverlay,
  Content: SidebarContent,
  Header: SidebarHeader,
  Item: SidebarItem,
  Separator: SidebarSeparator,
  Main: SidebarMain,
  Backdrop: SidebarBackdrop,
  Container: SidebarContainer,
};

export type {
  SidebarRootProps,
  SidebarSafeAreaInsets,
  SidebarTriggerProps,
  SidebarPortalProps,
  SidebarOverlayProps,
  SidebarContentProps,
  SidebarHeaderProps,
  SidebarItemProps,
  SidebarSeparatorProps,
  SidebarMainProps,
  SidebarBackdropProps,
  SidebarContainerProps,
};
