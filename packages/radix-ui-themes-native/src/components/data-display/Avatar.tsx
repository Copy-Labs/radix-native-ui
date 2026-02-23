import React, { useState, type ReactNode, ReactElement, useMemo } from 'react';
import { Image, StyleSheet, type StyleProp, ViewStyle, Platform } from 'react-native';
import { Text } from '../typography/Text';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import RnView from '../../components/primitives/View';
import { Color, RadiusSize } from '../../theme';

export interface AvatarProps {
  /**
   * Image source URI
   */
  src?: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Button variant
   * @default 'solid'
   */
  variant?: 'solid' | 'soft';
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Avatar size
   * @default 2
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * Fallback content when image fails to load
   */
  fallback?: ReactNode;
  /**
   * Fallback behavior - 'icon' shows initials, 'character' shows as text
   * @default 'character'
   */
  fallbackBehavior?: 'icon' | 'character';
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility label (defaults to alt or 'Avatar')
   */
  accessibilityLabel?: string;
}

export interface AvatarFallbackProps {
  children: ReactElement;
}

type AvatarComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.PropsWithChildren<AvatarProps>> & React.RefAttributes<unknown>
> & {
  Fallback: React.FC<AvatarFallbackProps>;
};

const Avatar = React.forwardRef<unknown, React.PropsWithChildren<AvatarProps>>(
  (
    {
      src,
      alt = 'Avatar',
      color,
      variant = 'solid',
      highContrast,
      radius,
      size = 2,
      fallback,
      fallbackBehavior = 'character',
      style,
      accessibilityLabel,
      children,
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';
    const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
    const grayAlpha = getGrayAlpha(theme);
    const activeColor = color || theme.accentColor;
    const radii = theme.radii[radius!] ?? theme.radii.medium;
    const selectedRadius = radius || theme.radius;
    const [imageError, setImageError] = useState(false);
    const variantColors = useMemo(() => getVariantColors(theme, activeColor, mode, variant, highContrast), [getVariantColors, color, variant, highContrast, isDark, theme]);

    // Size values based on theme
    const getSizeValues = () => {
      switch (size) {
        case 1:
          return { size: 24, fontSize: 10, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 2:
          return { size: 32, fontSize: 12, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 3:
          return { size: 48, fontSize: 18, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 4:
          return { size: 64, fontSize: 24, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 5:
          return { size: 80, fontSize: 32, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 6:
          return { size: 96, fontSize: 48, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 7:
          return { size: 128, fontSize: 60, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 8:
          return { size: 144, fontSize: 72, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        case 9:
          return { size: 160, fontSize: 88, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
        default:
          return { size: 32, fontSize: 12, borderWidth: 0, borderRadius: selectedRadius === 'full' ? 9999 : radii, };
      }
    };

    const sizeValues = getSizeValues();
    // Use alpha colors for border and background
    const borderColor = grayAlpha['6'];
    const backgroundColor = grayAlpha['3'];
    const fallbackBackgroundColor = grayAlpha['4'];

    const fallbackContent = (() => {
      if (fallback) {
        return fallback;
      }
      if (fallbackBehavior !== 'character') {
        return null;
      }
      const trimmed = alt?.trim();
      if (!trimmed) {
        return null;
      }
      const initials = trimmed
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      return initials || null;
    })();

    return (
      <RnView
        ref={ref as any}
        style={[
          styles.avatar,
          {
            width: sizeValues.size,
            height: sizeValues.size,
            borderRadius: sizeValues.borderRadius, // sizeValues.size / 2,
            borderColor: variantColors.borderColor,
            borderWidth: sizeValues.borderWidth,
            backgroundColor: 'transparent',
            overflow: Platform.OS === 'ios' ? 'hidden' : undefined,
          },
          style,
        ]}
        accessibilityLabel={accessibilityLabel || alt}
        accessibilityRole="image"
      >
        {src && !imageError ? (
          <Image
            source={{ uri: src }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: sizeValues.borderRadius, // sizeValues.size / 2,
            }}
            resizeMode="cover"
            onError={() => setImageError(true)}
            accessibilityLabel={alt}
            testID="avatar-image"
          />
        ) : (
          <RnView
            style={[
              styles.fallback,
              {
                backgroundColor: variantColors.backgroundColor,
                flex: 1,
                width: '100%',
                height: '100%',
                borderRadius: sizeValues.borderRadius,
              },
            ]}
          >
            {typeof fallbackContent === 'string' ? (
              <Text
                style={{
                  fontSize: sizeValues.fontSize,
                  fontWeight: '600',
                  lineHeight: sizeValues.fontSize * 1.4,
                  color: variantColors.textColor || grayScale[11],
                }}
              >
                {fallbackContent}
              </Text>
            ) : (
              fallbackContent
            )}
          </RnView>
        )}
        {children}
      </RnView>
    );
  }
) as AvatarComponent;

Avatar.displayName = 'Avatar';

// AvatarFallback sub-component
const AvatarFallback = ({ children }: AvatarFallbackProps) => {
  return <>{children}</>;
};

Avatar.Fallback = AvatarFallback;

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Avatar };
