/**
 * Shared color utility helpers for Radix Themes Native
 *
 * These helpers provide consistent access to theme colors across all components.
 * All colors are sourced from the pre-defined color scales in colors.ts.
 */

import type { Theme, Color } from './types';

/**
 * Get the accent color scale based on theme and mode
 * Returns the full color scale (1-12, dark mode, semantic tokens)
 */
export const getAccentColor = (theme: Theme, mode: 'light' | 'dark') => {
  return mode === 'dark'
    ? theme.colors[theme.accentColor].dark
    : theme.colors[theme.accentColor];
};

/**
 * Get the color scale for any color name
 * Returns the full color scale (1-12, dark mode, alpha) for the specified color
 */
export const getColorScale = (theme: Theme, color: Color, mode: 'light' | 'dark') => {
  return mode === 'dark'
    ? theme.colors[color].dark
    : theme.colors[color];
};

/**
 * Get the alpha color scale for any color name
 * Returns the alpha color scale (1-12) for the specified color
 */
export const getColorAlpha = (theme: Theme, color: Color) => {
  console.log("getColorAlpha", color);
  return theme.colors[color].alpha;
};

/**
 * Get the accent alpha scale
 * Returns the alpha color scale (1-12) for the accent color
 */
export const getAccentAlpha = (theme: Theme) => {
  return theme.colors[theme.accentColor].alpha;
};

/**
 * Get the gray alpha scale
 * Returns the alpha color scale (1-12) for the gray color
 */
export const getGrayAlpha = (theme: Theme) => {
  return theme.colors.gray.alpha;
};

/**
 * Get focus color (dynamic - mirrors accent color)
 * Focus color uses accent-8, which changes based on the selected accent color
 */
export const getFocusColor = (theme: Theme, mode: 'light' | 'dark'): string => {
  const accentScale = getAccentColor(theme, mode);
  return accentScale[8];
};

/**
 * Get selection color (accent-alpha-5)
 * Used for text selection highlighting
 */
export const getSelectionColor = (theme: Theme): string => {
  return theme.colors[theme.accentColor].alpha['5'];
};

/**
 * Check if accent color needs dark text
 * Sky, Mint, Lime, Yellow, Amber require dark text on solid backgrounds
 */
export const needsDarkText = (accentColor: Color): boolean => {
  return ['sky', 'mint', 'lime', 'yellow', 'amber'].includes(accentColor);
};

/**
 * Get contrast color for a given color name
 * Returns the contrast value if available, otherwise falls back to dark/light text
 */
export const getContrast = (theme: Theme, color: Color, mode: 'light' | 'dark', highContrast: boolean = false): string => {
  const colorScale = getColorScale(theme, color, mode);

  // Check if contrast exists on the color scale
  if ('contrast' in colorScale) {
    if (highContrast) {
      return needsDarkText(color) ? '#0c0a09' : '#ffffff';
    }
    return colorScale.contrast as unknown as string;
  }

  // Fallback for colors without contrast property
  if (highContrast) {
    return needsDarkText(color) ? '#0c0a09' : '#ffffff';
  }

  // Use the appropriate text color based on the color name
  return needsDarkText(color) ? '#0c0a09' : '#18181b';
};

/**
 * Get high contrast text color
 * Returns blackAlpha[12] for maximum contrast on colored backgrounds
 */
export const getHighContrastTextColor = (theme: Theme): string => {
  return theme.colors.blackAlpha[12];
};

/**
 * Get high contrast background color
 * Returns color[11] for solid/classic variants in high contrast mode
 */
export const getHighContrastBackground = (theme: Theme, color: Color, mode: 'light' | 'dark'): string => {
  const colorScale = getColorScale(theme, color, mode);
  return colorScale[11];
};

/**
 * Get appropriate text color for solid accent background
 */
export const getAccentTextColor = (theme: Theme, mode: 'light' | 'dark', highContrast: boolean = false): string => {
  return getContrast(theme, theme.accentColor, mode, highContrast);
};

/**
 * Get the current accent scale object with alpha support
 * This provides access to both solid colors (1-12) and alpha colors (1-12)
 */
export const getExtendedAccentScale = (theme: Theme, mode: 'light' | 'dark') => {
  // Get the appropriate color name based on the accentColor setting
  const accentColorName = theme.accentColor;
  const colors = theme.colors;

  // Get the extended color scale (includes alpha property)
  const colorScale = colors[accentColorName as keyof typeof colors];

  if (!colorScale || !('alpha' in colorScale)) {
    // Fallback to indigo if not found
    return mode === 'dark' ? colors.indigo.dark : colors.indigo;
  }

  return mode === 'dark'
    ? { ...colorScale.dark, alpha: colorScale.alpha.dark }
    : colorScale;
};

/**
 * Get colors for a specific variant (solid, soft, outline, ghost)
 * Supports highContrast mode for improved accessibility
 *
 * High Contrast Rules:
 * - solid/classic: bg = color[11], text = blackAlpha[12]
 * - soft: bg = colorAlpha['3'], text = color[12]
 * - outline: bg = transparent, text = color[11], border = color[11]
 * - ghost: bg = transparent, text = color[11]
 */
export const getVariantColors = (
  theme: Theme,
  color: Color,
  mode: 'light' | 'dark',
  variant: 'solid' | 'soft' | 'outline' | 'surface' | 'ghost' | 'classic',
  highContrast: boolean = false
): { backgroundColor: string; textColor: string; borderColor: string } => {
  const colorScale = getColorScale(theme, color, mode);
  const colorAlpha = getColorAlpha(theme, color);
  const whiteAlpha = theme.colors.whiteAlpha;

  if (highContrast) {
    switch (variant) {
      case 'solid':
      case 'classic':
        return {
          backgroundColor: colorScale[12],
          textColor: colorScale['1'],
          borderColor: 'transparent',
        };
      case 'soft':
        return {
          backgroundColor: colorAlpha['3'],
          textColor: colorScale[12],
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colorScale[11],
          borderColor: colorScale[11],
        };
      case 'surface':
        return {
          backgroundColor: colorAlpha['2'],
          textColor: colorScale[11],
          borderColor: colorScale[11],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: colorScale[11],
          borderColor: 'transparent',
        };
    }
  }

  // Normal (non-highContrast) mode
  const textColor = getContrast(theme, color, mode, false);

  switch (variant) {
    case 'solid':
    case 'classic':
      return {
        backgroundColor: colorScale[9],
        textColor: textColor, // whiteAlpha['12'], // textColor,
        borderColor: 'transparent',
      };
    case 'soft':
      return {
        backgroundColor: colorAlpha['3'],
        textColor: colorAlpha['11'],
        borderColor: 'transparent',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        textColor: colorAlpha['11'],
        borderColor: colorAlpha['8'],
      };
    case 'surface':
      return {
        backgroundColor: colorAlpha['2'],
        textColor: colorAlpha['11'],
        borderColor: colorAlpha['8'],
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        textColor: colorAlpha['11'],
        borderColor: 'transparent',
      };
    default:
      return {
        backgroundColor: colorScale[9],
        textColor: textColor,
        borderColor: 'transparent',
      };
  }
};

/**
 * Get disabled state colors
 */
export const getDisabledColors = (
  theme: Theme,
  mode: 'light' | 'dark'
): { backgroundColor: string; textColor: string } => {
  const grayAlpha = getGrayAlpha(theme);

  return {
    backgroundColor: grayAlpha['3'],
    textColor: grayAlpha['8'],
  };
};

/**
 * Get hover state colors for a variant
 */
export const getHoverColors = (
  theme: Theme,
  mode: 'light' | 'dark',
  variant: 'solid' | 'soft' | 'outline' | 'ghost' | 'classic'
): { backgroundColor: string } | null => {
  const accentAlpha = getAccentAlpha(theme);

  switch (variant) {
    case 'solid':
    case 'classic':
      return { backgroundColor: getAccentColor(theme, mode)[10] };

    case 'soft':
      return { backgroundColor: accentAlpha['4'] };

    case 'ghost':
      return { backgroundColor: accentAlpha['3'] };

    case 'outline':
      return { backgroundColor: accentAlpha['2'] };

    default:
      return null;
  }
};

/**
 * Get active/pressed state colors for a variant
 */
export const getActiveColors = (
  theme: Theme,
  mode: 'light' | 'dark',
  variant: 'solid' | 'soft' | 'outline' | 'ghost' | 'classic'
): { backgroundColor: string } | null => {
  const accentAlpha = getAccentAlpha(theme);

  switch (variant) {
    case 'solid':
    case 'classic':
      return { backgroundColor: getAccentColor(theme, mode)[10] };

    case 'soft':
      return { backgroundColor: accentAlpha['5'] };

    case 'ghost':
      return { backgroundColor: accentAlpha['4'] };

    case 'outline':
      return { backgroundColor: accentAlpha['3'] };

    default:
      return null;
  }
};
