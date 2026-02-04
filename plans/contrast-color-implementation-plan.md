# Contrast Color Implementation Plan

## Overview

Implement a comprehensive contrast color system for Radix Themes Native that properly handles `highContrast` mode across all component variants.

## Requirements Summary

### Core Rule for High Contrast
- **solid** and **classic** variants with `highContrast`:
  - `backgroundColor` → `color[11]` (more saturated color)
  - `textColor` → `blackAlpha[12]` (not automatic detection)

## Updated Color Scale Reference

| Scale Value | Purpose |
|------------|---------|
| `color[9]` | Standard solid background |
| `color[10]` | Hover/active state |
| `color[11]` | High contrast background |
| `color[12]` | High contrast text |
| `blackAlpha[12]` | High contrast text color (dark) |
| `colorAlpha['3']` | Soft background |
| `colorAlpha['8']` | Border/outline |
| `colorAlpha['11']` | Text on soft backgrounds |

## Implementation Details

### Helper Functions to Add

```typescript
/**
 * Get high contrast text color
 * Returns blackAlpha[12] for maximum contrast on colored backgrounds
 */
export const getHighContrastTextColor = (theme: Theme): string => {
  return theme.colors.blackAlpha[12];
};

/**
 * Get high contrast background color
 * Returns color[11] for solid/classic variants
 */
export const getHighContrastBackground = (theme: Theme, color: Color, mode: 'light' | 'dark'): string => {
  const colorScale = getColorScale(theme, color, mode);
  return colorScale[11];
};
```

### Updated `getVariantColors` Function

```typescript
export const getVariantColors = (
  theme: Theme,
  color: Color,
  mode: 'light' | 'dark',
  variant: 'solid' | 'soft' | 'outline' | 'ghost' | 'classic',
  highContrast: boolean = false
): { backgroundColor: string; textColor: string; borderColor: string } => {
  const colorScale = getColorScale(theme, color, mode);
  const colorAlpha = getColorAlpha(theme, color);
  
  if (highContrast) {
    switch (variant) {
      case 'solid':
      case 'classic':
        return {
          backgroundColor: colorScale[11],
          textColor: getHighContrastTextColor(theme),
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
        textColor: textColor,
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
```

## Files to Modify

1. `packages/radix-ui-themes-native/src/theme/color-helpers.ts`
   - Add `getHighContrastTextColor` helper
   - Add `getHighContrastBackground` helper
   - Update `getVariantColors` function
   - Add JSDoc documentation

2. Component files (as needed)
   - Update to use new `getVariantColors` function with color parameter

## Key Differences from Before

| Variant | Old Behavior | New Behavior (highContrast) |
|---------|--------------|---------------------------|
| solid/classic bg | `color[9]` | `color[11]` |
| solid/classic text | `contrast` or auto-detect | `blackAlpha[12]` |
| soft text | `accentAlpha['11']` | `color[12]` |
| outline text | `accentAlpha['11']` | `color[11]` |
| outline border | `accentAlpha['8']` | `color[11]` |
| ghost text | `accentAlpha['11']` | `color[11]` |
