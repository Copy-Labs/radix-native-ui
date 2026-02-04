import type { TypographyTokens } from './types';

/**
 * Typography tokens for React Native
 * Matches web Radix Themes typography tokens
 */
export const typography: TypographyTokens = {
  fontSizes: {
    1: { fontSize: 12, lineHeight: 16, letterSpacing: 0.0025 },
    2: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
    3: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
    4: { fontSize: 18, lineHeight: 26, letterSpacing: -0.0025 },
    5: { fontSize: 20, lineHeight: 28, letterSpacing: -0.005 },
    6: { fontSize: 24, lineHeight: 30, letterSpacing: -0.00625 },
    7: { fontSize: 28, lineHeight: 36, letterSpacing: -0.0075 },
    8: { fontSize: 35, lineHeight: 40, letterSpacing: -0.01 },
    9: { fontSize: 60, lineHeight: 60, letterSpacing: -0.025 },
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  lineHeights: {
    1: 16,
    2: 20,
    3: 24,
    4: 26,
    5: 28,
    6: 30,
    7: 36,
    8: 40,
    9: 60,
  },
  letterSpacings: {
    1: 0.0025,
    2: 0,
    3: 0,
    4: -0.0025,
    5: -0.005,
    6: -0.00625,
    7: -0.0075,
    8: -0.01,
    9: -0.025,
  },
  fonts: {
    body: {
      fontFamily: 'System',
      fontWeight: '400',
      fontStyle: 'normal',
    },
    heading: {
      fontFamily: 'System',
      fontWeight: '700',
      fontStyle: 'normal',
    },
    code: {
      fontFamily: 'Menlo',
      fontWeight: '400',
      fontStyle: 'normal',
    },
    strong: {
      fontFamily: 'System',
      fontWeight: '700',
      fontStyle: 'normal',
    },
    em: {
      fontFamily: 'Times New Roman',
      fontWeight: '400',
      fontStyle: 'italic',
    },
    quote: {
      fontFamily: 'Times New Roman',
      fontWeight: '400',
      fontStyle: 'italic',
    },
  },
};

/**
 * Apply scaling to typography values
 */
export const getTypography = (scaling: number = 1): TypographyTokens => {
  return {
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
};

/**
 * Font families available in the theme
 */
export const fontFamilies = {
  default: 'System',
  body: 'System',
  heading: 'System',
  code: 'Menlo',
  mono: 'Menlo',
  serif: 'Times New Roman',
};

/**
 * Scaling options for typography
 */
export const scalingOptions = {
  '90%': 0.9,
  '95%': 0.95,
  '100%': 1,
  '105%': 1.05,
  '110%': 1.1,
};
