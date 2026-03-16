import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, type StyleProp, ViewStyle, type TextStyle, type AnimatedSyntheticEvent } from 'react-native';

interface SkeletonProps {
  /**
   * The content to display inside the skeleton.
   * Can be a string (text) or a React element (component).
   */
  children?: React.ReactNode;
  /**
   * When true, shows the skeleton placeholder.
   * When false, shows the actual content.
   * @default true
   */
  loading?: boolean;
  /**
   * Custom style applied to the skeleton container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom style for text content (used for inline skeletons)
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Custom width
   */
  width?: number | string;
  /**
   * Custom height
   */
  height?: number | string;
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

// Animation configuration matching the web version's pulse timing
const PULSE_ANIMATION = {
  duration: 1000,
  useNativeDriver: true,
};

// Interpolate between gray-200 (#E5E7EB) and gray-300 (#D1D5DB)
const SKELEON_COLORS = {
  light: '#E5E7EB',
  dark: '#D1D5DB',
};

const Skeleton = React.forwardRef<any, SkeletonProps>(
  (
    {
      children,
      loading = true,
      style,
      textStyle,
      width,
      height,
      accessibilityLabel = 'Loading',
      testID,
    },
    ref
  ) => {
    // Animated value for pulse effect
    const pulseAnim = useRef(new Animated.Value(0)).current;

    // Set up the pulsing animation
    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            ...PULSE_ANIMATION,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            ...PULSE_ANIMATION,
          }),
        ])
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }, [pulseAnim]);

    // Interpolate background color for the pulse effect
    const pulseStyle = {
      backgroundColor: pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SKELEON_COLORS.light, SKELEON_COLORS.dark],
      }),
    };

    // If NOT loading, render children directly (just like @radix-ui/themes)
    if (!loading) {
      return <>{children}</>;
    }

    // Detect if children is plain text/string or a React element
    // This is the key to making inline skeletons work in React Native!
    const isInline = !React.isValidElement(children);

    // For inline text skeletons - return Animated.Text directly
    // This allows <Text><Skeleton>text</Skeleton></Text> to work!
    if (isInline && typeof children === 'string') {
      return (
        <Animated.Text
          ref={ref}
          style={[
            // styles.inlineText,
            textStyle,
            pulseStyle,
            width !== undefined ? { width } : undefined,
            height !== undefined ? { height } : undefined,
          ]}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="progressbar"
          testID={testID}
        >
          {children}
        </Animated.Text>
      );
    }

    // For block/component skeletons - wrap children with hidden content
    return (
      <Animated.View
        ref={ref}
        style={[
          styles.blockContainer,
          pulseStyle,
          width !== undefined ? { width } : undefined,
          height !== undefined ? { height } : undefined,
          style,
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="progressbar"
        testID={testID}
      >
        {children && (
          <View style={styles.hiddenChildren} pointerEvents="none">
            {children}
          </View>
        )}
      </Animated.View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  // Inline text - transparent text with skeleton background
  inlineText: {
    color: 'transparent',
    // borderRadius: 4,
    fontSize: 14,
    lineHeight: 20,
    overflow: 'hidden',
  },
  // Block container for components - full component dimensions
  blockContainer: {
    // borderRadius: 4,
    minHeight: 20,
    overflow: 'hidden',
  },
  // Hidden children wrapper - maintains layout dimensions
  hiddenChildren: {
    opacity: 0,
  },
});

export { Skeleton };
export type { SkeletonProps };
