// Types
import {
  Color,
  ColorScale,
  ShadowTokens,
  Theme,
  ThemeMode,
  ExtendedColorScale,
  AlphaColorScale,
} from '../theme/types';

// Re-export types
export type { ExtendedColorScale };

export * from './types';

// Color scales
export * from './colors';

// Spacing
export * from './spacing';

// Radii
export * from './radii';

// Typography
export * from './typography';

// Shadows
export * from './shadows';

// ThemeProvider
export { ThemeProvider, useTheme, useThemeMode, useThemeActions, useThemeContext } from './ThemeProvider';

// Color helpers
export * from './color-helpers';

import {
  gray,
  grayAlpha,
  blackAlpha,
  whiteAlpha,
  blue,
  blueAlpha,
  red,
  redAlpha,
  green,
  greenAlpha,
  amber,
  amberAlpha,
  bronze,
  bronzeAlpha,
  brown,
  brownAlpha,
  crimson,
  crimsonAlpha,
  cyan,
  cyanAlpha,
  gold,
  goldAlpha,
  grass,
  grassAlpha,
  indigo,
  indigoAlpha,
  iris,
  irisAlpha,
  jade,
  jadeAlpha,
  lime,
  limeAlpha,
  mint,
  mintAlpha,
  orange,
  orangeAlpha,
  pink,
  pinkAlpha,
  plum,
  plumAlpha,
  purple,
  purpleAlpha,
  ruby,
  rubyAlpha,
  sky,
  skyAlpha,
  teal,
  tealAlpha,
  tomato,
  tomatoAlpha,
  violet,
  violetAlpha,
  yellow,
  yellowAlpha,
  mauve,
  olive,
  sage,
  sand,
  slate,
} from './colors';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Re-export color helpers for convenience
// These functions provide easy access to accent color scales
// for use in soft/ghost/outline variants

/**
 * Get the accent color scale based on accentColor setting
 * Returns solid colors (1-12, dark mode)
 */
export const getAccentScale = (accentColor: Color): ColorScale | null => {
  const accentMap: Record<string, ColorScale> = {
    amber,
    blue,
    bronze,
    brown,
    crimson,
    cyan,
    gold,
    grass,
    green,
    indigo,
    iris,
    jade,
    lime,
    mint,
    orange,
    pink,
    plum,
    purple,
    ruby,
    sky,
    teal,
    tomato,
    violet,
    yellow,
  };
  return accentMap[accentColor] || null;
};

/**
 * Get the accent alpha color scale based on accentColor setting
 * Returns transparent colors (a1-a12) for soft/outline/ghost variants
 */
export const getAccentAlphaScale = (accentColor: Color): AlphaColorScale | null => {
  const accentAlphaMap: Record<string, AlphaColorScale> = {
    amber: amberAlpha,
    blue: blueAlpha,
    bronze: bronzeAlpha,
    brown: brownAlpha,
    crimson: crimsonAlpha,
    cyan: cyanAlpha,
    gold: goldAlpha,
    grass: grassAlpha,
    green: greenAlpha,
    indigo: indigoAlpha,
    iris: irisAlpha,
    jade: jadeAlpha,
    lime: limeAlpha,
    mint: mintAlpha,
    orange: orangeAlpha,
    pink: pinkAlpha,
    plum: plumAlpha,
    purple: purpleAlpha,
    ruby: rubyAlpha,
    sky: skyAlpha,
    teal: tealAlpha,
    tomato: tomatoAlpha,
    violet: violetAlpha,
    yellow: yellowAlpha,
  };
  return accentAlphaMap[accentColor] || null;
};

/**
 * Get the accent contrast color (text color on solid accent background)
 * Returns white for most colors, dark for Sky, Mint, Lime, Yellow, Amber
 */
export const getAccentContrast = (accentColor: Color): string => {
  const darkTextColors: Record<string, string> = {
    sky: '#0c0a09',
    mint: '#0c0a09',
    lime: '#0c0a09',
    yellow: '#0c0a09',
    amber: '#0c0a09',
  };
  return darkTextColors[accentColor] || '#ffffff';
};

/**
 * Get the gray color scale based on grayColor setting
 */
export const getGrayScale = (grayColor: Theme['grayColor'] = 'mauve'): ColorScale => {
  switch (grayColor) {
    case 'mauve':
      return mauve;
    case 'olive':
      return olive;
    case 'sage':
      return sage;
    case 'sand':
      return sand;
    case 'slate':
      return slate;
    default:
      return gray;
  }
};

/**
 * Helper to create an extended color scale with alpha support
 */
const createExtendedColorScale = (
  scale: ColorScale,
  alphaScale: AlphaColorScale
): ExtendedColorScale => {
  return {
    ...scale,
    alpha: alphaScale,
  };
};

/**
 * Create theme with given options
 */
export const createTheme = (options: Partial<Theme> = {}): Theme => {
  const {
    name = 'default',
    scaling = 1,
    radiusFactor = 1,
    grayColor = 'mauve',
    accentColor = 'indigo',
  } = options;

  const scaledSpace = {
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

  const scaledRadii = {
    1: 3 * radiusFactor,
    2: 5 * radiusFactor,
    3: 6 * radiusFactor,
    4: 8 * radiusFactor,
    5: 10 * radiusFactor,
    6: 12 * radiusFactor,
    7: 14 * radiusFactor,
    8: 16 * radiusFactor,
    9: 9999,
    full: 0,
    thumb: 9999,
  };

  const scaledTypography = {
    fontSizes: {
      1: { fontSize: 12 * scaling, lineHeight: 16 * scaling, letterSpacing: 0.0025 },
      2: { fontSize: 14 * scaling, lineHeight: 20 * scaling, letterSpacing: 0 },
      3: { fontSize: 16 * scaling, lineHeight: 24 * scaling, letterSpacing: 0 },
      4: { fontSize: 18 * scaling, lineHeight: 26 * scaling, letterSpacing: -0.0025 },
      5: { fontSize: 20 * scaling, lineHeight: 28 * scaling, letterSpacing: -0.005 },
      6: { fontSize: 24 * scaling, lineHeight: 30 * scaling, letterSpacing: -0.00625 },
      7: { fontSize: 28 * scaling, lineHeight: 36 * scaling, letterSpacing: -0.0075 },
      8: { fontSize: 35 * scaling, lineHeight: 40 * scaling, letterSpacing: -0.01 },
      9: { fontSize: 60 * scaling, lineHeight: 60 * scaling, letterSpacing: -0.025 },
    },
    fontWeights: typography.fontWeights,
    lineHeights: {
      1: 16 * scaling,
      2: 20 * scaling,
      3: 24 * scaling,
      4: 26 * scaling,
      5: 28 * scaling,
      6: 30 * scaling,
      7: 36 * scaling,
      8: 40 * scaling,
      9: 60 * scaling,
    },
    letterSpacings: typography.letterSpacings,
    fonts: typography.fonts,
  };

  const grayScale = getGrayScale(grayColor);

  return {
    name,
    scaling,
    radiusFactor,
    grayColor,
    accentColor,
    colors: {
      // Gray scale with alpha support
      gray: {
        ...grayScale,
        alpha: grayAlpha,
      },
      grayAlpha,
      blackAlpha,
      whiteAlpha,
      // Accent colors with alpha support
      amber: createExtendedColorScale(amber, amberAlpha),
      amberAlpha,
      blue: createExtendedColorScale(blue, blueAlpha),
      blueAlpha,
      bronze: createExtendedColorScale(bronze, bronzeAlpha),
      bronzeAlpha,
      brown: createExtendedColorScale(brown, brownAlpha),
      brownAlpha,
      crimson: createExtendedColorScale(crimson, crimsonAlpha),
      crimsonAlpha,
      cyan: createExtendedColorScale(cyan, cyanAlpha),
      cyanAlpha,
      gold: createExtendedColorScale(gold, goldAlpha),
      goldAlpha,
      grass: createExtendedColorScale(grass, grassAlpha),
      grassAlpha,
      green: createExtendedColorScale(green, greenAlpha),
      greenAlpha,
      indigo: createExtendedColorScale(indigo, indigoAlpha),
      indigoAlpha,
      iris: createExtendedColorScale(iris, irisAlpha),
      irisAlpha,
      jade: createExtendedColorScale(jade, jadeAlpha),
      jadeAlpha,
      lime: createExtendedColorScale(lime, limeAlpha),
      limeAlpha,
      mint: createExtendedColorScale(mint, mintAlpha),
      mintAlpha,
      orange: createExtendedColorScale(orange, orangeAlpha),
      orangeAlpha,
      pink: createExtendedColorScale(pink, pinkAlpha),
      pinkAlpha,
      plum: createExtendedColorScale(plum, plumAlpha),
      plumAlpha,
      purple: createExtendedColorScale(purple, purpleAlpha),
      purpleAlpha,
      red: createExtendedColorScale(red, redAlpha),
      redAlpha,
      ruby: createExtendedColorScale(ruby, rubyAlpha),
      rubyAlpha,
      sky: createExtendedColorScale(sky, skyAlpha),
      skyAlpha,
      teal: createExtendedColorScale(teal, tealAlpha),
      tealAlpha,
      tomato: createExtendedColorScale(tomato, tomatoAlpha),
      tomatoAlpha,
      violet: createExtendedColorScale(violet, violetAlpha),
      violetAlpha,
      yellow: createExtendedColorScale(yellow, yellowAlpha),
      yellowAlpha,
    },
    space: scaledSpace,
    radii: scaledRadii,
    typography: scaledTypography,
    shadows,
  };
};

/**
 * Default theme instance
 */
export const defaultTheme = createTheme();

/**
 * Get current theme colors for the specified mode (light/dark)
 */
export const getThemeColors = (theme: Theme, mode: ThemeMode = 'light') => {
  const isDark = mode === 'dark';
  return {
    gray: isDark ? theme.colors.gray.dark : theme.colors.gray,
    accent: isDark
      ? getAccentScale(theme.accentColor)?.dark || getAccentScale('indigo')?.dark
      : getAccentScale(theme.accentColor) || getAccentScale('indigo'),
    background: isDark ? theme.colors.gray.dark[1] : '#ffffff',
    surface: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.85)',
    panel: isDark ? theme.colors.gray.dark[2] : '#ffffff',
  };
};

/**
 * Get shadow style for a specific shadow level
 */
export const getThemeShadow = (
  theme: Theme,
  level: keyof ShadowTokens,
  mode: ThemeMode = 'light'
) => {
  const isDark = mode === 'dark';
  return isDark ? theme.shadows.dark[level] : theme.shadows.light[level];
};
