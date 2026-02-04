import React, { useState, type ReactNode, ReactElement } from 'react';
import { Image, StyleSheet, type StyleProp, ViewStyle, Platform } from 'react-native';
import { Text } from '../typography/Text';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha } from '../../theme/color-helpers';
import RnView from '../../components/primitives/View';

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
   * Avatar size
   * @default 2
   */
  size?: 1 | 2 | 3 | 4 | 5;
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
    const [imageError, setImageError] = useState(false);

    // Size values based on theme
    const getSizeValues = () => {
      switch (size) {
        case 1:
          return { size: 24, fontSize: 10, borderWidth: 2 };
        case 2:
          return { size: 32, fontSize: 12, borderWidth: 2 };
        case 3:
          return { size: 48, fontSize: 18, borderWidth: 3 };
        case 4:
          return { size: 64, fontSize: 24, borderWidth: 4 };
        case 5:
          return { size: 80, fontSize: 32, borderWidth: 4 };
        default:
          return { size: 32, fontSize: 12, borderWidth: 2 };
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
            borderRadius: sizeValues.size / 2,
            borderColor,
            borderWidth: sizeValues.borderWidth,
            backgroundColor,
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
              borderRadius: sizeValues.size / 2,
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
                backgroundColor: fallbackBackgroundColor,
              },
            ]}
          >
            {typeof fallbackContent === 'string' ? (
              <Text
                style={{
                  fontSize: sizeValues.fontSize,
                  fontWeight: '600',
                  color: grayScale[11],
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
