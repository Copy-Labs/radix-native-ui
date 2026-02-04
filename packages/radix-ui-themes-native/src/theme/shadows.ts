import type { ShadowTokens, ShadowToken } from './types';

/**
 * Shadow tokens for React Native
 * Converted from web Radix Themes CSS box-shadow tokens
 */
export const shadows: { light: ShadowTokens; dark: ShadowTokens } = {
  light: {
    1: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
      },
    ],
    2: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1,
      },
    ],
    3: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
      },
    ],
    4: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
    5: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
    6: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
  },
  dark: {
    1: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
      },
    ],
    2: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1,
      },
    ],
    3: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
      },
    ],
    4: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
    5: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
    6: [
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      },
    ],
  },
};

export const getShadow = (
  shadowLevel: keyof ShadowTokens,
  isDark: boolean = false
): ShadowToken | null => {
  const shadowSet = isDark ? shadows.dark : shadows.light;
  const shadowArray = shadowSet[shadowLevel];
  if (!shadowArray || shadowArray.length === 0) return null;
  return shadowArray[0];
};

export const getShadows = (
  shadowLevel: keyof ShadowTokens,
  isDark: boolean = false
): ShadowToken | null => {
  return getShadow(shadowLevel, isDark);
};
