import React, { useRef, useCallback } from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Vibration,
} from 'react-native';
import RnPressable, { PressableProps } from './Pressable';

// Create an animated version of Pressable
const AnimatedPressableComponent = Animated.createAnimatedComponent(RnPressable);

export interface AnimatedPressableProps extends PressableProps {
  /**
   * Scale value when pressed (default: 0.97)
   */
  pressedScale?: number;
  /**
   * Opacity value when pressed (default: 0.9)
   */
  pressedOpacity?: number;
  /**
   * Animation duration in milliseconds (default: 100)
   */
  animationDuration?: number;
  /**
   * Enable haptic feedback on press (default: true)
   */
  hapticFeedback?: boolean;
}

export const AnimatedPressable = React.memo(
  React.forwardRef<React.ComponentRef<typeof AnimatedPressableComponent>, AnimatedPressableProps>(
    (
      {
        children,
        onPressIn,
        onPressOut,
        disabled,
        pressedScale = 0.97,
        pressedOpacity = 0.9,
        animationDuration = 100,
        hapticFeedback = true,
        style,
        ...rest
      },
      ref
    ) => {
      // Animated values for press feedback
      const scaleAnim = useRef(new Animated.Value(1)).current;
      const opacityAnim = useRef(new Animated.Value(1)).current;

      // Animation function for press in
      const animatePressIn = useCallback(() => {
        if (disabled) return;

        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: pressedScale,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: pressedOpacity,
            duration: animationDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }, [disabled, pressedScale, pressedOpacity, animationDuration, scaleAnim, opacityAnim]);

      // Animation function for press out
      const animatePressOut = useCallback(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }, [animationDuration, scaleAnim, opacityAnim]);

      // Handle press in with animation and haptic feedback
      const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
          // Trigger haptic feedback if enabled and not disabled
          if (hapticFeedback && !disabled) {
            Vibration.vibrate(10);
          }
          animatePressIn();
          onPressIn?.(event);
        },
        [animatePressIn, onPressIn, hapticFeedback, disabled]
      );

      // Handle press out with animation
      const handlePressOut = useCallback(
        (event: GestureResponderEvent) => {
          animatePressOut();
          onPressOut?.(event);
        },
        [animatePressOut, onPressOut]
      );

      // Animated style applied to the entire Pressable
      const animatedStyle = {
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      };

      return (
        <AnimatedPressableComponent
          ref={ref}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[style, animatedStyle]}
          {...rest}
        >
          {children}
        </AnimatedPressableComponent>
      );
    }
  )
);

AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;
