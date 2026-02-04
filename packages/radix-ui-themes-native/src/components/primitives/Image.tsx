import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ImageProps extends RNImageProps {
  /**
   * Alternative text for accessibility
   */
  alt?: string;
}

export const RnImage = React.memo(
  React.forwardRef<React.ElementRef<typeof RNImage>, ImageProps>(
    ({ style, alt, accessibilityLabel, accessibilityRole, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      return (
        <View style={[{ backgroundColor: colors[1] }]}>
          <RNImage
            ref={ref}
            style={style}
            accessibilityLabel={alt || accessibilityLabel}
            accessibilityRole={accessibilityRole || 'image'}
            {...rest}
          />
        </View>
      );
    }
  )
);

RnImage.displayName = 'RnImage';

export default RnImage;
