import React from 'react';
import { StyleSheet, type StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getAccentColor } from '../../theme/color-helpers';

interface SpinnerProps {
  /**
   * Spinner size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Custom color for the spinner
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

const Spinner = ({
  size = 'medium',
  color,
  style,
  accessibilityLabel = 'Loading',
}: SpinnerProps) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const accentScale = getAccentColor(theme, mode);

  // Map size to ActivityIndicator size
  const getActivityIndicatorSize = (): 'small' | 'large' => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'small';
    }
  };

  // Get spinner color - use accent color scale for consistency
  const getSpinnerColor = () => {
    if (color) return color;
    // Use accent 9 for good visibility
    return accentScale[9];
  };

  return (
    <ActivityIndicator
      size={getActivityIndicatorSize()}
      color={getSpinnerColor()}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

Spinner.displayName = 'Spinner';

const styles = StyleSheet.create({
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Spinner };
export type { SpinnerProps };
