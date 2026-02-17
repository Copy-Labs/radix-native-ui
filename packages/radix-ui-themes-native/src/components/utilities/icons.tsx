import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';

interface IconProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

/**
 * ChevronDownIcon - A chevron pointing down using React Native View
 * Can be rotated to point in different directions
 */
const ChevronDownIcon = React.forwardRef<View, IconProps>(
  ({ width = 9, height = 9, style, color = 'currentColor' }, _forwardedRef) => {
    // Calculate the size of the chevron arms
    const armWidth = width * 0.55;
    const armHeight = 2;
    const armOffset = width * 0.22;

    return (
      <View
        style={[
          styles.chevronContainer,
          {
            width,
            height,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.chevronArm,
            {
              width: armWidth,
              height: armHeight,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }, { translateX: -armOffset }],
            },
          ]}
        />
        <View
          style={[
            styles.chevronArm,
            {
              width: armWidth,
              height: armHeight,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }, { translateX: armOffset }],
            },
          ]}
        />
      </View>
    );
  }
);

ChevronDownIcon.displayName = 'ChevronDownIcon';

/**
 * ThickChevronRightIcon - A thick chevron pointing right using React Native View
 */
const ThickChevronRightIcon = React.forwardRef<View, IconProps>(
  ({ width = 9, height = 9, style, color = 'currentColor' }, _forwardedRef) => {
    const armWidth = height * 0.35;
    const armHeight = 2.5;

    return (
      <View
        style={[
          styles.chevronContainer,
          {
            width,
            height,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.chevronArm,
            {
              width: armWidth,
              height: armHeight,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }, { translateY: -1 }],
            },
          ]}
        />
        <View
          style={[
            styles.chevronArm,
            {
              width: armWidth,
              height: armHeight,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }, { translateY: 1 }],
            },
          ]}
        />
      </View>
    );
  }
);

ThickChevronRightIcon.displayName = 'ThickChevronRightIcon';

/**
 * ThickCheckIcon - A checkmark icon using React Native View
 */
const ThickCheckIcon = React.forwardRef<View, IconProps>(
  ({ width = 9, height = 9, style, color = 'currentColor' }, _forwardedRef) => {
    return (
      <View
        style={[
          styles.checkContainer,
          {
            width,
            height,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.checkShortArm,
            {
              backgroundColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.checkLongArm,
            {
              backgroundColor: color,
            },
          ]}
        />
      </View>
    );
  }
);

ThickCheckIcon.displayName = 'ThickCheckIcon';

/**
 * ThickDividerHorizontalIcon - A horizontal divider/minus icon
 */
const ThickDividerHorizontalIcon = React.forwardRef<View, IconProps>(
  ({ width = 9, height = 9, style, color = 'currentColor' }, _forwardedRef) => {
    return (
      <View
        style={[
          styles.dividerContainer,
          {
            width,
            height,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.dividerLine,
            {
              width: width * 0.9,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    );
  }
);

ThickDividerHorizontalIcon.displayName = 'ThickDividerHorizontalIcon';

const styles = StyleSheet.create({
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronArm: {
    position: 'absolute',
    borderRadius: 1,
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkShortArm: {
    position: 'absolute',
    width: 3,
    height: 3,
    left: 1,
    bottom: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  checkLongArm: {
    position: 'absolute',
    width: 6,
    height: 3,
    right: 0,
    top: 2,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  dividerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    height: 2,
    borderRadius: 1,
  },
});

export { ChevronDownIcon, ThickCheckIcon, ThickChevronRightIcon, ThickDividerHorizontalIcon };

export type { IconProps };
