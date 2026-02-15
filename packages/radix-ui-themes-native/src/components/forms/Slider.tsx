import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  type ViewStyle,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  View as RNView,
  LayoutChangeEvent,
} from 'react-native';
import { View } from '../primitives';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../../components';
import {
  getGrayAlpha,
  getVariantColors,
  getColorScale,
  getColorAlpha,
} from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';

// ============================================================================
// Types
// ============================================================================

/**
 * Slider value type - single value or range (two values)
 */
type SliderValue = number | [number, number];

interface SliderProps {
  /**
   * Current value of the slider (controlled mode)
   * Use array [min, max] for range slider
   */
  value?: SliderValue;
  /**
   * Default value (uncontrolled mode)
   * Use array [min, max] for range slider
   */
  defaultValue?: SliderValue;
  /**
   * Callback when value changes
   */
  onValueChange?: (value: SliderValue) => void;
  /**
   * Callback when value change ends (drag end)
   */
  onValueChangeEnd?: (value: SliderValue) => void;
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
   * @default '2'
   */
  size?: '1' | '2' | '3' | '4';
  /**
   * Visual style variant
   * @default 'surface'
   */
  variant?: 'surface' | 'solid' | 'soft' | 'outline';
  /**
   * Custom color for the slider
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
   * Minimum steps between thumbs (for range slider)
   * @default 0
   */
  minStepsBetweenThumbs?: number;
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
  /**
   * Style prop
   */
  style?: ViewStyle;
}

type StyleProp<T> = T | T[];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize value to array format for unified handling
 */
const normalizeValue = (value: SliderValue | undefined): number[] => {
  if (value === undefined) return [0];
  return Array.isArray(value) ? [...value].sort((a, b) => a - b) : [value];
};

/**
 * Check if value is a range (array)
 */
const isRangeValue = (value: SliderValue | undefined): value is [number, number] => {
  return Array.isArray(value);
};

// ============================================================================
// Slider Component
// ============================================================================

const Slider = React.forwardRef<React.ComponentRef<typeof RNView>, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      onValueChangeEnd,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      size = '2',
      variant = 'solid',
      color,
      radius = 'full',
      highContrast = false,
      minStepsBetweenThumbs = 0,
      label,
      showValueLabel = false,
      valueLabelFormatter = v => v.toString(),
      accessibilityLabel,
      accessibilityHint,
      style,
      ...rest
    },
    ref
  ) => {
    // Theme hooks
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const activeColor = color || theme.accentColor;
    const colorScale = getColorScale(theme, activeColor, mode);
    const colorAlpha = getColorAlpha(theme, activeColor);

    // Radius handling
    const radii = theme.radii[radius] ?? theme.radii.full;
    const borderRadius = radius === 'full' ? 9999 : radii;

    // Get variant colors for the slider
    const variantColors = useMemo(
      () => getVariantColors(theme, activeColor, mode, variant, highContrast),
      [theme, activeColor, mode, variant, highContrast]
    );

    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const initialValues = useMemo(
      () => normalizeValue(isControlled ? controlledValue : defaultValue),
      [isControlled, controlledValue, defaultValue]
    );

    // Internal state for uncontrolled mode
    const [internalValues, setInternalValues] = useState<number[]>(initialValues);

    // Current values (controlled or uncontrolled)
    const values = isControlled ? normalizeValue(controlledValue) : internalValues;
    const isRange = isRangeValue(isControlled ? controlledValue : defaultValue) || values.length > 1;

    // Track layout measurements
    const trackLayoutRef = useRef<React.ComponentRef<typeof RNView>>(null);
    const [trackLayout, setTrackLayout] = useState({ x: 0, y: 0, width: 0, pageX: 0, pageY: 0 });
    const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);

    // Refs for stale closure prevention
    const disabledRef = useRef(disabled);
    const valuesRef = useRef(values);
    const minRef = useRef(min);
    const maxRef = useRef(max);
    const stepRef = useRef(step);
    const minStepsRef = useRef(minStepsBetweenThumbs);

    // Update refs when props change
    useEffect(() => {
      disabledRef.current = disabled;
      valuesRef.current = values;
      minRef.current = min;
      maxRef.current = max;
      stepRef.current = step;
      minStepsRef.current = minStepsBetweenThumbs;
    }, [disabled, values, min, max, step, minStepsBetweenThumbs]);

    // Animated values for thumb positions (normalized 0-1)
    // Initialize with correct positions using a helper function
    const getInitialPosition = (val: number) => {
      const clampedValue = Math.min(Math.max(val, min), max);
      return (clampedValue - min) / (max - min);
    };

    const thumbAnimations = useRef<Animated.Value[]>(
      values.map(v => new Animated.Value(getInitialPosition(v)))
    ).current;

    // Get size values based on size prop
    const sizeValues = useMemo(() => {
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
        case '4':
          return {
            trackHeight: 10,
            thumbSize: 34,
            fontSize: theme.typography.fontSizes[4].fontSize,
          };
        case '2':
        default:
          return {
            trackHeight: 6,
            thumbSize: 22,
            fontSize: theme.typography.fontSizes[2].fontSize,
          };
      }
    }, [size, theme.typography.fontSizes]);

    // Convert value to normalized position (0-1)
    const valueToPosition = useCallback(
      (val: number) => {
        const clampedValue = Math.min(Math.max(val, minRef.current), maxRef.current);
        return (clampedValue - minRef.current) / (maxRef.current - minRef.current);
      },
      []
    );

    // Convert normalized position to value
    const positionToValue = useCallback(
      (position: number) => {
        const clampedPosition = Math.min(Math.max(position, 0), 1);
        const rawValue = minRef.current + clampedPosition * (maxRef.current - minRef.current);
        if (stepRef.current > 0) {
          return Math.round(rawValue / stepRef.current) * stepRef.current;
        }
        return rawValue;
      },
      []
    );

    // Update thumb animations when values change
    useEffect(() => {
      values.forEach((val, index) => {
        if (thumbAnimations[index]) {
          Animated.spring(thumbAnimations[index], {
            toValue: valueToPosition(val),
            useNativeDriver: false,
            tension: 300,
            friction: 30,
          }).start();
        } else {
          thumbAnimations[index] = new Animated.Value(valueToPosition(val));
        }
      });
    }, [values, valueToPosition]);

    // Handle track layout
    const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
      const { x, y, width } = event.nativeEvent.layout;
      trackLayoutRef.current?.measureInWindow((pageX, pageY) => {
        setTrackLayout({ x, y, width, pageX, pageY });
      });
    }, []);

    // Get the nearest thumb index for a given position
    const getNearestThumbIndex = useCallback(
      (position: number): number => {
        if (valuesRef.current.length === 1) return 0;

        const thumbPositions = valuesRef.current.map(v => valueToPosition(v));
        let nearestIndex = 0;
        let minDistance = Math.abs(position - thumbPositions[0]);

        thumbPositions.forEach((thumbPos, index) => {
          const distance = Math.abs(position - thumbPos);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });

        return nearestIndex;
      },
      [valueToPosition]
    );

    // Update value and notify
    const updateValue = useCallback(
      (newValues: number[]) => {
        if (disabledRef.current) return;

        // Sort values for range slider
        const sortedValues = isRange ? [...newValues].sort((a, b) => a - b) : newValues;

        if (!isControlled) {
          setInternalValues(sortedValues);
        }

        // Call callback with appropriate type
        if (onValueChange) {
          if (isRange) {
            onValueChange([sortedValues[0], sortedValues[1]] as [number, number]);
          } else {
            onValueChange(sortedValues[0]);
          }
        }
      },
      [isControlled, isRange, onValueChange]
    );

    // Handle value change end
    const handleValueChangeEnd = useCallback(
      (finalValues: number[]) => {
        if (onValueChangeEnd) {
          if (isRange) {
            onValueChangeEnd([finalValues[0], finalValues[1]] as [number, number]);
          } else {
            onValueChangeEnd(finalValues[0]);
          }
        }
      },
      [isRange, onValueChangeEnd]
    );

    // Handle track press
    const handleTrackPress = useCallback(
      (event: GestureResponderEvent) => {
        const currentTrackLayout = trackLayoutRef2.current;
        console.log('[Slider] handleTrackPress', { trackLayout: currentTrackLayout });
        if (disabledRef.current || currentTrackLayout.width === 0) return;

        const touchX = event.nativeEvent.locationX;
        const position = Math.max(0, Math.min(1, touchX / currentTrackLayout.width));
        const newValue = positionToValue(position);
        console.log('[Slider] handleTrackPress calculated', { touchX, position, newValue });

        if (valuesRef.current.length === 1) {
          updateValue([newValue]);
          handleValueChangeEnd([newValue]);
        } else {
          // For range, find nearest thumb
          const nearestIndex = getNearestThumbIndex(position);
          const newValues = [...valuesRef.current];
          newValues[nearestIndex] = newValue;

          // Ensure minimum gap between thumbs
          if (minStepsRef.current > 0 && newValues.length === 2) {
            const minGap = minStepsRef.current * stepRef.current;
            if (nearestIndex === 0) {
              newValues[0] = Math.min(newValues[0], newValues[1] - minGap);
            } else {
              newValues[1] = Math.max(newValues[1], newValues[0] + minGap);
            }
          }

          updateValue(newValues);
          handleValueChangeEnd(newValues);
        }
      },
      [positionToValue, getNearestThumbIndex, updateValue, handleValueChangeEnd]
    );

    // Handle drag
    const handleDrag = useCallback(
      (gestureState: PanResponderGestureState, thumbIndex: number) => {
        const currentTrackLayout = trackLayoutRef2.current;
        console.log('[Slider] handleDrag', {
          thumbIndex,
          trackLayout: currentTrackLayout,
          moveX: gestureState.moveX,
        });
        if (disabledRef.current || currentTrackLayout.width === 0) return;

        // Calculate relative position within track
        const relativeX = gestureState.moveX - currentTrackLayout.pageX;
        const position = Math.max(0, Math.min(1, relativeX / currentTrackLayout.width));
        const newValue = positionToValue(position);
        console.log('[Slider] handleDrag calculated', { relativeX, position, newValue });

        const newValues = [...valuesRef.current];
        newValues[thumbIndex] = newValue;

        // Ensure minimum gap between thumbs for range slider
        if (minStepsRef.current > 0 && newValues.length === 2) {
          const minGap = minStepsRef.current * stepRef.current;
          if (thumbIndex === 0) {
            newValues[0] = Math.min(newValues[0], newValues[1] - minGap);
          } else {
            newValues[1] = Math.max(newValues[1], newValues[0] + minGap);
          }
        }

        updateValue(newValues);
      },
      [positionToValue, updateValue]
    );

    // Refs for PanResponder callbacks to avoid stale closures
    const activeThumbIndexRef = useRef<number | null>(null);
    const trackLayoutRef2 = useRef(trackLayout);

    // Keep refs in sync with state
    useEffect(() => {
      trackLayoutRef2.current = trackLayout;
    }, [trackLayout]);

    useEffect(() => {
      activeThumbIndexRef.current = activeThumbIndex;
    }, [activeThumbIndex]);

    // Pan responder for drag gestures
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          console.log('[Slider] onStartShouldSetPanResponder', { disabled: disabledRef.current });
          return !disabledRef.current;
        },
        onMoveShouldSetPanResponder: () => {
          console.log('[Slider] onMoveShouldSetPanResponder', { disabled: disabledRef.current });
          return !disabledRef.current;
        },
        // Capture the gesture from the start to prevent ScrollView from taking it
        onStartShouldSetPanResponderCapture: () => {
          console.log('[Slider] onStartShouldSetPanResponderCapture', { disabled: disabledRef.current });
          return !disabledRef.current;
        },
        onMoveShouldSetPanResponderCapture: () => {
          console.log('[Slider] onMoveShouldSetPanResponderCapture', { disabled: disabledRef.current });
          return !disabledRef.current;
        },
        onPanResponderGrant: (event: GestureResponderEvent) => {
          console.log('[Slider] onPanResponderGrant', {
            trackLayout: trackLayoutRef2.current,
            locationX: event.nativeEvent.locationX,
          });
          if (disabledRef.current || trackLayoutRef2.current.width === 0) return;

          const touchX = event.nativeEvent.locationX;
          const position = Math.max(0, Math.min(1, touchX / trackLayoutRef2.current.width));
          const nearestIndex = getNearestThumbIndex(position);
          console.log('[Slider] Setting activeThumbIndex:', nearestIndex);

          setActiveThumbIndex(nearestIndex);
          activeThumbIndexRef.current = nearestIndex;
          // Don't call handleTrackPress here - just set the active thumb
          // The initial position will be set on move
        },
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          console.log('[Slider] onPanResponderMove', {
            activeThumbIndex: activeThumbIndexRef.current,
            moveX: gestureState.moveX,
            trackLayout: trackLayoutRef2.current,
          });
          if (activeThumbIndexRef.current !== null) {
            handleDrag(gestureState, activeThumbIndexRef.current);
          }
        },
        onPanResponderRelease: () => {
          console.log('[Slider] onPanResponderRelease');
          setActiveThumbIndex(null);
          activeThumbIndexRef.current = null;
          handleValueChangeEnd(valuesRef.current);
        },
        onPanResponderTerminate: () => {
          console.log('[Slider] onPanResponderTerminate');
          setActiveThumbIndex(null);
          activeThumbIndexRef.current = null;
          handleValueChangeEnd(valuesRef.current);
        },
        // Prevent parent ScrollView from taking over the gesture
        onPanResponderTerminationRequest: () => false,
      })
    ).current;

    // Calculate track colors based on variant
    const trackBackgroundColor = useMemo(() => {
      if (variant === 'solid') {
        return isDark ? grayAlpha['7'] : grayAlpha['6'];
      } else if (variant === 'outline') {
        return 'transparent';
      } else if (variant === 'surface' || 'soft') {
        return variantColors.backgroundColor
      }
      // surface variant
      return colorAlpha['3'];
    }, [variant, isDark, grayAlpha, colorAlpha]);

    const filledTrackColor = useMemo(() => {
      if (highContrast) {
        return colorScale[12];
      }
      return colorScale[9];
    }, [highContrast, colorScale]);

    const trackBorder = useMemo(() => {
      if (['outline', 'surface'].includes(variant)) {
        return {
          borderWidth: 0.4,
          borderColor: variantColors.borderColor, // colorScale[8]
        };
      }
      return {borderWidth: 0.5, borderColor: 'transparent'};
    }, [variant, colorAlpha]);

    // Interpolated thumb positions
    const getThumbTranslateX = useCallback(
      (animatedValue: Animated.Value) => {
        return animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, trackLayout.width - sizeValues.thumbSize],
        });
      },
      [trackLayout.width, sizeValues.thumbSize]
    );

    // Calculate filled track width for single or range
    const getFilledTrackStyle = useCallback(
      (animatedValue: Animated.Value, index: number) => {
        if (values.length === 1) {
          // Single thumb: fill from start to thumb
          return {
            position: 'absolute' as const,
            left: 0,
            height: sizeValues.trackHeight,
            borderRadius,
            backgroundColor: filledTrackColor,
            opacity: disabled ? 0.4 : 1,
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, trackLayout.width],
            }),
          };
        } else {
          // Range: fill between two thumbs
          if (index === 0) {
            // Left thumb - no fill on left side
            return null;
          }
          // Return the range fill style
          return {
            position: 'absolute' as const,
            left: thumbAnimations[0].interpolate({
              inputRange: [0, 1],
              outputRange: [0, trackLayout.width],
            }),
            right: thumbAnimations[1].interpolate({
              inputRange: [0, 1],
              outputRange: [trackLayout.width, 0],
            }),
            height: sizeValues.trackHeight,
            borderRadius,
            backgroundColor: filledTrackColor,
            opacity: disabled ? 0.5 : 1,
          };
        }
      },
      [values.length, sizeValues.trackHeight, borderRadius, filledTrackColor, trackLayout.width, thumbAnimations]
    );

    // Thumb style
    const getThumbStyle = useCallback(
      (animatedValue: Animated.Value) => {
        const thumbTranslateX = getThumbTranslateX(animatedValue);

        return {
          width: sizeValues.thumbSize,
          height: sizeValues.thumbSize,
          borderRadius: borderRadius, // sizeValues.thumbSize / 2,
          backgroundColor: grayScale[1],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 3,
          transform: [{ translateX: thumbTranslateX }],
          opacity: disabled ? 0.5 : 1,
          top: -sizeValues.trackHeight - 2,
        };
      },
      [getThumbTranslateX, sizeValues.thumbSize, grayScale, disabled]
    );

    // Thumb inner style
    const thumbInnerStyle = useMemo(
      () => ({
        width: sizeValues.thumbSize - 8,
        height: sizeValues.thumbSize - 8,
        borderRadius: borderRadius, // (sizeValues.thumbSize - 8) / 2,
        backgroundColor: filledTrackColor,
        opacity: disabled ? 0.5 : 1,
      }),
      [sizeValues.thumbSize, filledTrackColor, disabled]
    );

    // Label style
    const labelStyle = useMemo(
      () => ({
        color: grayScale[12],
        fontSize: sizeValues.fontSize,
      }),
      [grayScale, sizeValues.fontSize]
    );

    // Format value label for display
    const formatValueLabel = useCallback(() => {
      if (isRange && values.length === 2) {
        return `${valueLabelFormatter(values[0])} - ${valueLabelFormatter(values[1])}`;
      }
      return valueLabelFormatter(values[0]);
    }, [isRange, values, valueLabelFormatter]);

    // Accessibility value
    const accessibilityValue = useMemo(() => {
      if (isRange && values.length === 2) {
        return {
          min,
          max,
          now: values[0],
          text: `${values[0]} to ${values[1]}`,
        };
      }
      return {
        min,
        max,
        now: values[0],
        text: valueLabelFormatter(values[0]),
      };
    }, [isRange, values, min, max, valueLabelFormatter]);

    return (
      <View
        ref={ref}
        style={[styles.container, style]}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel || label || 'Slider'}
        accessibilityHint={
          accessibilityHint || `Value: ${formatValueLabel()}, range: ${min} to ${max}`
        }
        accessibilityValue={accessibilityValue}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {(label || showValueLabel) && (
          <View style={styles.labelContainer}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            {showValueLabel && (
              <Text style={[styles.valueLabel, labelStyle]}>{formatValueLabel()}</Text>
            )}
          </View>
        )}
        <View
          ref={trackLayoutRef}
          style={[
            styles.track,
            {
              height: sizeValues.trackHeight,
              borderRadius,
              backgroundColor: trackBackgroundColor,
              borderColor: trackBorder.borderColor,
              borderWidth: trackBorder.borderWidth,
            },
          ]}
          onLayout={handleTrackLayout}
          {...panResponder.panHandlers}
        >
          {/* Filled track for single thumb */}
          {values.length === 1 && thumbAnimations[0] && (
            <Animated.View style={getFilledTrackStyle(thumbAnimations[0], 0)} />
          )}

          {/* Filled track for range (between thumbs) */}
          {values.length === 2 && thumbAnimations[0] && thumbAnimations[1] && (
            <Animated.View style={getFilledTrackStyle(thumbAnimations[1], 1)} />
          )}

          {/* Thumbs */}
          {thumbAnimations.slice(0, values.length).map((animatedValue, index) => (
            <Animated.View
              key={index}
              style={[styles.thumb, getThumbStyle(animatedValue)]}
            >
              {!disabled && <View style={[styles.thumbInner, thumbInnerStyle]} />}
            </Animated.View>
          ))}
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
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    borderRadius: 999,
  },
});

export { Slider };
export type { SliderProps, SliderValue };
