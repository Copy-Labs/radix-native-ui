import React, { useRef, useCallback } from 'react';
import { Animated, GestureResponderEvent } from 'react-native';
import RnPressable, { PressableProps } from './Pressable';
import { triggerHaptic } from '../../utils/haptics';
import { useHaptics } from '../../hooks/useTheme';

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
        onPress,
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
      // Get global haptics setting
      const globalHaptics = useHaptics();
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

      // Handle press in with animation only. The haptic belongs on `onPress`
      // (below) so it fires once, when the action is actually committed.
      // Firing it on press-in made buttons buzz on touch-down and again on
      // click whenever a wrapper component also provided haptic feedback.
      const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
          animatePressIn();
          onPressIn?.(event);
        },
        [animatePressIn, onPressIn]
      );

      // Single home for press haptics: one haptic per committed tap.
      const handlePress = useCallback(
        (event: GestureResponderEvent) => {
          if (globalHaptics && hapticFeedback && !disabled) {
            triggerHaptic('press');
          }
          onPress?.(event);
        },
        [onPress, globalHaptics, hapticFeedback, disabled]
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
        backgroundColor: 'transparent',
      };

      return (
        <AnimatedPressableComponent
          ref={ref}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[animatedStyle, style]}
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
