import React, { forwardRef, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  type StyleProp,
  ViewStyle,
  Animated,
  View as RNView,
} from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getGrayAlpha,
  getAccentColor,
  getColorScale,
  getColorAlpha,
  getVariantColors,
} from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';

// ============================================================================
// Types
// ============================================================================

interface ProgressProps {
  /**
   * Current value of the progress
   */
  value: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Progress bar size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * Visual style variant
   * @default 'surface'
   */
  variant?: 'surface' | 'solid' | 'soft' | 'outline';
  /**
   * Custom color for the progress indicator (uses theme color name)
   */
  color?: Color;
  /**
   * Radius variant
   * @default 'full'
   */
  radius?: RadiusSize;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Duration of the animation in milliseconds
   * @default 300
   */
  duration?: number;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility label
   * @default 'Progress'
   */
  accessibilityLabel?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
}

// ============================================================================
// Progress Component
// ============================================================================

const Progress = forwardRef<React.ComponentRef<typeof RNView>, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 2,
      variant = 'solid',
      color,
      radius = 'full',
      highContrast = false,
      duration = 300,
      style,
      accessibilityLabel = 'Progress',
      testID,
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayAlpha = getGrayAlpha(theme);
    const activeColor = color || theme.accentColor;
    const colorScale = getColorScale(theme, activeColor, mode);
    const colorAlpha = getColorAlpha(theme, activeColor);

    // Radius handling
    const radii = theme.radii[radius] ?? theme.radii.full;
    const selectedRadius = radius === 'full' ? 9999 : radii;

    // Get variant colors for the slider
    const variantColors = useMemo(
      () => getVariantColors(theme, activeColor, mode, variant, highContrast),
      [theme, activeColor, mode, variant, highContrast]
    );

    // Calculate progress percentage (clamped between 0 and 1)
    const progress = useMemo(() => Math.min(Math.max(value / max, 0), 1), [value, max]);

    // Animated value for smooth transitions
    const animatedProgress = useRef(new Animated.Value(0)).current;

    // Animate when progress changes
    useEffect(() => {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: duration,
        useNativeDriver: false, // width cannot use native driver
        isInteraction: false,
      }).start();
    }, [progress, animatedProgress, duration]);

    // Get size values
    const sizeValues = useMemo(() => {
      switch (size) {
        case 1:
          return { height: 4, borderRadius: 2 };
        case 3:
          return { height: 12, borderRadius: 6 };
        case 2:
        default:
          return { height: 8, borderRadius: 4 };
      }
    }, [size]);

    // Get border radius from theme or size defaults
    const borderRadius = useMemo(() => {
      if (radius === 'full') return 9999;
      const themeRadius = theme.radii[radius];
      return themeRadius ?? sizeValues.borderRadius;
    }, [radius, theme.radii, sizeValues.borderRadius]);

    // Get indicator color based on variant and highContrast
    const indicatorColor = useMemo(() => {
      if (highContrast) {
        return colorScale[12];
      }
      return colorScale[9];
    }, [colorScale, highContrast]);

    // Get track background color based on variant
    const trackBackgroundColor = useMemo(() => {
      switch (variant) {
        case 'outline':
          return 'transparent';
        case 'surface':
        case 'soft':
          return variantColors.backgroundColor; // colorAlpha['3'];
        case 'solid':
        default:
          return isDark ? theme.colors['gray'].dark['4'] : grayAlpha['6'];
      }
    }, [variant, isDark, grayAlpha, colorAlpha]);

    const trackBorder = useMemo(() => {
      switch (variant) {
        case 'surface':
        case 'outline':
          return {
            borderWidth: 0.4,
            borderColor: variantColors.borderColor, // colorScale[8]
          };
        default:
          return { borderWidth: 0.5, borderColor: 'transparent' };
      }
    }, [variant, colorAlpha]);

    // Interpolate animated width
    const animatedWidth = animatedProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View
        ref={ref}
        style={[
          styles.track,
          {
            backgroundColor: trackBackgroundColor,
            borderColor: trackBorder.borderColor,
            borderWidth: trackBorder.borderWidth,
            height: sizeValues.height,
            borderRadius: selectedRadius,
            overflow: 'hidden',
          },
          style,
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          now: value,
          min: 0,
          max: max,
        }}
        accessibilityRole="progressbar"
        testID={testID}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              width: animatedWidth,
              backgroundColor: indicatorColor,
              borderRadius: selectedRadius,
            },
          ]}
        />
      </View>
    );
  }
);

Progress.displayName = 'Progress';

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
  },
});

export { Progress };
export type { ProgressProps };
