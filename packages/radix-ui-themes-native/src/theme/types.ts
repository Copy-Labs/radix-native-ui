export interface BaseColorScale {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
}

export interface ColorScale {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  dark: BaseColorScale;
  contrast: string;
  surface: string;
  indicator: string;
  track: string;
}

export interface AlphaColorScale {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  dark: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
  };
}

// Extended color scale with alpha support
export interface ExtendedColorScale extends ColorScale {
  alpha: AlphaColorScale;
}

// Gray scale with alpha support
export interface GrayScaleWithAlpha {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  alpha: AlphaColorScale;
  dark: BaseColorScale;
}

export interface ColorTokens {
  gray: ExtendedColorScale;
  grayAlpha: AlphaColorScale;
  blackAlpha: AlphaColorScale;
  whiteAlpha: AlphaColorScale;
  // Accent colors - extended with alpha support
  amber: ExtendedColorScale;
  amberAlpha: AlphaColorScale;
  blue: ExtendedColorScale;
  blueAlpha: AlphaColorScale;
  bronze: ExtendedColorScale;
  bronzeAlpha: AlphaColorScale;
  brown: ExtendedColorScale;
  brownAlpha: AlphaColorScale;
  crimson: ExtendedColorScale;
  crimsonAlpha: AlphaColorScale;
  cyan: ExtendedColorScale;
  cyanAlpha: AlphaColorScale;
  gold: ExtendedColorScale;
  goldAlpha: AlphaColorScale;
  grass: ExtendedColorScale;
  grassAlpha: AlphaColorScale;
  green: ExtendedColorScale;
  greenAlpha: AlphaColorScale;
  indigo: ExtendedColorScale;
  indigoAlpha: AlphaColorScale;
  iris: ExtendedColorScale;
  irisAlpha: AlphaColorScale;
  jade: ExtendedColorScale;
  jadeAlpha: AlphaColorScale;
  lime: ExtendedColorScale;
  limeAlpha: AlphaColorScale;
  mint: ExtendedColorScale;
  mintAlpha: AlphaColorScale;
  orange: ExtendedColorScale;
  orangeAlpha: AlphaColorScale;
  pink: ExtendedColorScale;
  pinkAlpha: AlphaColorScale;
  plum: ExtendedColorScale;
  plumAlpha: AlphaColorScale;
  purple: ExtendedColorScale;
  purpleAlpha: AlphaColorScale;
  red: ExtendedColorScale;
  redAlpha: AlphaColorScale;
  ruby: ExtendedColorScale;
  rubyAlpha: AlphaColorScale;
  sky: ExtendedColorScale;
  skyAlpha: AlphaColorScale;
  teal: ExtendedColorScale;
  tealAlpha: AlphaColorScale;
  tomato: ExtendedColorScale;
  tomatoAlpha: AlphaColorScale;
  violet: ExtendedColorScale;
  violetAlpha: AlphaColorScale;
  yellow: ExtendedColorScale;
  yellowAlpha: AlphaColorScale;
}

export interface SpaceScale {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
}

export interface RadiusScale {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  full: number;
  thumb: number;
}

export interface FontSize {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface FontToken {
  fontFamily: string;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
}

export interface TypographyTokens {
  fontSizes: {
    1: FontSize;
    2: FontSize;
    3: FontSize;
    4: FontSize;
    5: FontSize;
    6: FontSize;
    7: FontSize;
    8: FontScale;
    9: FontSize;
  };
  fontWeights: {
    light: '300';
    regular: '400';
    medium: '500';
    bold: '700';
  };
  lineHeights: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
  };
  letterSpacings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
  };
  fonts: {
    body: FontToken;
    heading: FontToken;
    code: FontToken;
    strong: FontToken;
    em: FontToken;
    quote: FontToken;
  };
}

export interface FontSizeSpec {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface FontScale {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
}

export interface ShadowTokens {
  1: ShadowToken[];
  2: ShadowToken[];
  3: ShadowToken[];
  4: ShadowToken[];
  5: ShadowToken[];
  6: ShadowToken[];
}

export interface ThemeTokens {
  colors: ColorTokens;
  space: SpaceScale;
  radii: RadiusScale;
  typography: TypographyTokens;
  shadows: {
    light: ShadowTokens;
    dark: ShadowTokens;
  };
}

export interface Theme extends ThemeTokens {
  name: string;
  scaling: number;
  radiusFactor: number;
  grayColor: 'gray' | 'mauve' | 'olive' | 'sage' | 'sand' | 'slate';
  accentColor: Color;
}

export type ThemeMode = 'light' | 'dark';

export type Color =
  | 'gray'
  | 'gold'
  | 'bronze'
  | 'brown'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'tomato'
  | 'red'
  | 'ruby'
  | 'crimson'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'violet'
  | 'iris'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'jade'
  | 'green'
  | 'grass'
  | 'lime'
  | 'mint'
  | 'sky';
