import React from 'react';
import { StyleSheet, type StyleProp, ViewStyle, Animated } from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getAccentColor } from '../../theme/color-helpers';

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
   * Custom color for the progress indicator
   */
  color?: string;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

const Progress = ({
  value,
  max = 100,
  size = 2,
  color,
  style,
  accessibilityLabel = 'Progress',
}: ProgressProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayAlpha = getGrayAlpha(theme);
  const accentScale = getAccentColor(theme, mode);

  // Calculate progress percentage
  const progress = Math.min(Math.max(value / max, 0), 1);

  // Get size values
  const getSizeValues = () => {
    switch (size) {
      case 1:
        return { height: 4, borderRadius: 2 };
      case 3:
        return { height: 12, borderRadius: 6 };
      case 2:
      default:
        return { height: 8, borderRadius: 4 };
    }
  };

  const sizeValues = getSizeValues();

  // Get indicator color - use solid accent color
  const getIndicatorColor = () => {
    if (color) return color;
    return accentScale[9];
  };

  // Track uses alpha color for subtle background
  const trackColor = isDark ? grayAlpha['7'] : grayAlpha['6'];
  const indicatorColor = getIndicatorColor();

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: trackColor,
          height: sizeValues.height,
          borderRadius: sizeValues.borderRadius,
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
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            width: `${progress * 100}%`,
            backgroundColor: indicatorColor,
            height: sizeValues.height,
            borderRadius: sizeValues.borderRadius,
          },
        ]}
      />
    </View>
  );
};

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
