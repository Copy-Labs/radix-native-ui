import { useEffect, useState } from 'react';
import { Dimensions, type ScaledSize } from 'react-native';

export interface ResponsiveBreakpoints {
  small: number;
  medium: number;
  large: number;
}

export interface ResponsiveInfo {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

const defaultBreakpoints: ResponsiveBreakpoints = {
  small: 640,
  medium: 768,
  large: 1024,
};

const getResponsiveInfo = (window: ScaledSize, breakpoints: ResponsiveBreakpoints): ResponsiveInfo => {
  const isPortrait = window.height >= window.width;
  const isSmall = window.width < breakpoints.small;
  const isMedium = window.width >= breakpoints.small && window.width < breakpoints.large;
  const isLarge = window.width >= breakpoints.large;

  return {
    width: window.width,
    height: window.height,
    scale: window.scale,
    fontScale: window.fontScale,
    isPortrait,
    isLandscape: !isPortrait,
    isSmall,
    isMedium,
    isLarge,
  };
};

/**
 * Hook to track responsive layout info based on window dimensions.
 */
export const useResponsive = (breakpoints: ResponsiveBreakpoints = defaultBreakpoints): ResponsiveInfo => {
  const [window, setWindow] = useState<ScaledSize>(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: nextWindow }) => {
      setWindow(nextWindow);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return getResponsiveInfo(window, breakpoints);
};

export default useResponsive;
