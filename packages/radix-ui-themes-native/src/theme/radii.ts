import type { RadiusScale } from './types';

/**
 * Radius scale for React Native
 * Matches web Radix Themes radius tokens with medium factor (1)
 */
export const radii: RadiusScale = {
  1: 3,
  2: 5,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 9999,
  full: 0,
  thumb: 9999,
};

/**
 * Apply radius factor to get different radius sizes
 */
export const getRadii = (factor: number = 1): RadiusScale => {
  return {
    1: 3 * factor,
    2: 5 * factor,
    3: 6 * factor,
    4: 8 * factor,
    5: 10 * factor,
    6: 12 * factor,
    7: 14 * factor,
    8: 16 * factor,
    9: 9999,
    full: 0,
    thumb: 9999,
  };
};

/**
 * Radius factors for different radius sizes
 */
export const radiusFactors = {
  none: 0,
  small: 0.75,
  medium: 1,
  large: 1.5,
  full: 1.5,
};
