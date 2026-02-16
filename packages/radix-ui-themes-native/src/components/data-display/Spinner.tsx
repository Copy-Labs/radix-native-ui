import React from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getAccentColor, getVariantColors } from '../../theme/color-helpers';
import { Color } from '../../theme';

// Size configuration map
const SIZE_CONFIG = {
  small: { dimension: 20, indicatorSize: 'small' as const },
  medium: { dimension: 36, indicatorSize: 'small' as const },
  large: { dimension: 48, indicatorSize: 'large' as const },
};

interface SpinnerProps {
  /**
   * Spinner size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Custom color for the spinner (uses theme color name)
   */
  color?: Color;
  /**
   * Custom style applied to the container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility label
   * @default 'Loading'
   */
  accessibilityLabel?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const Spinner = React.forwardRef<React.ElementRef<typeof View>, SpinnerProps>(
  ({ size = 'medium', color, highContrast = false, style, accessibilityLabel = 'Loading', testID }, ref) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const accentScale = getAccentColor(theme, mode);
    const sizeConfig = SIZE_CONFIG[size];
    const activeColor = color || theme.accentColor;
    // Get colors based on variant and mode using the helper function
    const solidVariant = 'solid';
    const variantColors = getVariantColors(theme, activeColor, mode, solidVariant, highContrast);

    // Get spinner color - use accent color scale for consistency
    const getSpinnerColor = (): string | undefined => {
      if (color) {
        // If color is a theme color name, get its scale
        const colorScale = mode === 'dark' ? theme.colors[color]?.dark : theme.colors[color];
        return colorScale?.[9] || accentScale[9];
      }
      // Use accent 9 for good visibility
      return accentScale[9];
    };

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            width: sizeConfig.dimension,
            height: sizeConfig.dimension,
          },
          style,
        ]}
        testID={testID}
      >
        <ActivityIndicator
          size={sizeConfig.indicatorSize}
          color={variantColors.backgroundColor}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="progressbar"
        />
      </View>
    );
  }
);

Spinner.displayName = 'Spinner';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Spinner };
export type { SpinnerProps };
