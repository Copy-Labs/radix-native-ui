import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  type ViewStyle,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  View as RNView,
} from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import { getGrayAlpha, getAccentColor } from '../../theme/color-helpers';

interface SliderThumb {
  /**
   * Value for this thumb (for multi-thumb sliders)
   */
  value: number;
}

interface SliderProps {
  /**
   * Current value of the slider
   */
  value: number;
  /**
   * Callback when value changes
   */
  onValueChange: (value: number) => void;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Custom color for the slider
   */
  color?: string;
  /**
   * Label to display above the slider
   */
  label?: string;
  /**
   * Whether to show value label
   */
  showValueLabel?: boolean;
  /**
   * Custom formatter for value label
   */
  valueLabelFormatter?: (value: number) => string;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
}

type StyleProp<T> = T | T[];

const Slider = React.forwardRef<React.ComponentRef<typeof RNView>, SliderProps>(
  (
    {
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      size = '2',
      color,
      label,
      showValueLabel = false,
      valueLabelFormatter = v => v.toString(),
      accessibilityLabel,
      accessibilityHint,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const accentScale = getAccentColor(theme, mode);
    const defaultColor = accentScale[9];
    const sliderColor = color || defaultColor;
    // Use alpha colors for track
    const trackColor = isDark ? grayAlpha['7'] : grayAlpha['6'];
    const backgroundColor = isDark ? grayAlpha['3'] : grayAlpha['3'];

    // Track layout measurements
    const trackLayoutRef = useRef<React.ComponentRef<typeof RNView>>(null);
    const [trackLayout, setTrackLayout] = useState({ x: 0, width: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Animated value for thumb position
    const thumbPosition = useRef(new Animated.Value(value));

    // Calculate size values based on size prop
    const getSizeValues = () => {
      switch (size) {
        case '1':
          return {
            trackHeight: 4,
            thumbSize: 16,
            fontSize: theme.typography.fontSizes[1].fontSize,
          };
        case '3':
          return {
            trackHeight: 8,
            thumbSize: 28,
            fontSize: theme.typography.fontSizes[3].fontSize,
          };
        case '2':
        default:
          return {
            trackHeight: 6,
            thumbSize: 22,
            fontSize: theme.typography.fontSizes[2].fontSize,
          };
      }
    };

    const sizeValues = getSizeValues();

    // Convert value to position
    const valueToPosition = useCallback(
      (val: number) => {
        const clampedValue = Math.min(Math.max(val, min), max);
        return (clampedValue - min) / (max - min);
      },
      [min, max]
    );

    // Convert position to value
    const positionToValue = useCallback(
      (position: number) => {
        const clampedPosition = Math.min(Math.max(position, 0), 1);
        const rawValue = min + clampedPosition * (max - min);
        if (step > 0) {
          return Math.round(rawValue / step) * step;
        }
        return rawValue;
      },
      [min, max, step]
    );

    // Update thumb position when value changes externally
    useEffect(() => {
      if (!isDragging) {
        Animated.spring(thumbPosition.current, {
          toValue: valueToPosition(value),
          useNativeDriver: false,
        }).start();
      }
    }, [value, valueToPosition, isDragging]);

    // Pan responder for drag gestures
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (event: GestureResponderEvent) => {
          setIsDragging(true);
          handleTrackPress(event);
        },
        onPanResponderMove: (
          event: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          handleDrag(gestureState);
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
        },
      })
    ).current;

    const handleTrackPress = (event: GestureResponderEvent) => {
      if (disabled) return;

      trackLayoutRef.current?.measure((x: number, y: number, width: number) => {
        const locationX = event.nativeEvent.locationX;
        const position = locationX / width;
        const newValue = positionToValue(position);
        onValueChange(newValue);
      });
    };

    const handleDrag = (gestureState: PanResponderGestureState) => {
      if (disabled || trackLayout.width === 0) return;

      const position = Math.max(0, Math.min(1, gestureState.moveX / trackLayout.width));
      const newValue = positionToValue(position);
      onValueChange(newValue);
    };

    // Get interpolated thumb position
    const thumbTranslateX = thumbPosition.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, trackLayout.width - sizeValues.thumbSize],
    });

    // Track styles
    const trackStyle: ViewStyle = {
      height: sizeValues.trackHeight,
      borderRadius: sizeValues.trackHeight / 2,
      backgroundColor: trackColor,
    };

    const filledTrackStyle: ViewStyle = {
      position: 'absolute',
      left: 0,
      height: sizeValues.trackHeight,
      borderRadius: sizeValues.trackHeight / 2,
      backgroundColor: sliderColor,
      width: thumbPosition.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, trackLayout.width],
      }),
    };

    const thumbStyle: ViewStyle = {
      width: sizeValues.thumbSize,
      height: sizeValues.thumbSize,
      borderRadius: sizeValues.thumbSize / 2,
      backgroundColor: grayScale[1],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 3,
      transform: [{ translateX: thumbTranslateX }],
    };

    const thumbInnerStyle: ViewStyle = {
      width: sizeValues.thumbSize - 8,
      height: sizeValues.thumbSize - 8,
      borderRadius: (sizeValues.thumbSize - 8) / 2,
      backgroundColor: sliderColor,
      opacity: disabled ? 0.5 : 1,
    };

    const labelStyle = {
      color: grayScale[12],
      fontSize: sizeValues.fontSize,
    };

    return (
      <View
        ref={ref}
        style={styles.container}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel || label || 'Slider'}
        accessibilityHint={
          accessibilityHint || `Value: ${valueLabelFormatter(value)}, range: ${min} to ${max}`
        }
        accessibilityValue={{
          now: value,
          min,
          max,
          text: valueLabelFormatter(value),
        }}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {(label || showValueLabel) && (
          <View style={styles.labelContainer}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            {showValueLabel && (
              <Text style={[styles.valueLabel, labelStyle]}>{valueLabelFormatter(value)}</Text>
            )}
          </View>
        )}
        <View
          ref={trackLayoutRef}
          style={[styles.track, trackStyle]}
          onLayout={event => {
            const { x, width } = event.nativeEvent.layout;
            setTrackLayout({ x, width });
          }}
          {...panResponder.panHandlers}
        >
          <View style={[styles.filledTrack, filledTrackStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]}>
            {!disabled && <View style={[styles.thumbInner, thumbInnerStyle]} />}
          </Animated.View>
        </View>
      </View>
    );
  }
);

Slider.displayName = 'Slider';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
  },
  valueLabel: {
    fontWeight: '500',
  },
  track: {
    position: 'relative',
    justifyContent: 'center',
  },
  filledTrack: {
    top: 0,
  },
  thumb: {
    position: 'absolute',
    top: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    borderRadius: 999,
  },
});

export { Slider };
export type { SliderProps, SliderThumb };
