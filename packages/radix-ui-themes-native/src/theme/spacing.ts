import type { SpaceScale } from './types';

/**
 * Space scale for React Native
 * Matches web Radix Themes space tokens with scaling factor of 1
 */
export const space: SpaceScale = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  9: 64,
};

/**
 * Apply scaling factor to space values
 */
export const getSpace = (scaling: number = 1): SpaceScale => {
  return {
    1: 4 * scaling,
    2: 8 * scaling,
    3: 12 * scaling,
    4: 16 * scaling,
    5: 24 * scaling,
    6: 32 * scaling,
    7: 40 * scaling,
    8: 48 * scaling,
    9: 64 * scaling,
  };
};
