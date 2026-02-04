# Systematic Color Fix Plan for Radix Themes Native

**Last Updated:** 2024-02-02
**Status:** Planning Complete - Implementation Pending

---

## Executive Summary

This document outlines the systematic approach to fix color usage in `packages/radix-ui-themes-native` to match the visual appearance of the original `packages/radix-ui-themes` web library.

**Root Cause:** Components are using **solid color steps** (`accent[3]`, `accent[6]`, `accent[11]`) instead of **alpha color steps** (`accentAlpha.a3`, `accentAlpha.a8`, `accentAlpha.a11`) for soft, ghost, and outline variants.

---

## Understanding the Color Scale

### The 12-Step Radix Color Scale

| Steps | Purpose | Use Case |
|-------|---------|----------|
| **1-2** | App/component backgrounds | Main backgrounds, canvas, card backgrounds |
| **3-5** | Component backgrounds | Interactive states: 3=normal, 4=hover, 5=pressed/selected |
| **6-8** | Borders | 6=subtle (non-interactive), 7=subtle (interactive), 8=strong (focus rings) |
| **9-10** | Solid backgrounds | Primary backgrounds: 9=normal, 10=hover states |
| **11-12** | Text | 11=low-contrast text, 12=high-contrast/headings |

### Alpha Colors (a1-a12)

Alpha colors are used for **transparent/semi-transparent** backgrounds and overlays:
- Soft variants: `accentAlpha.a3` (normal), `accentAlpha.a4` (hover), `accentAlpha.a5` (pressed)
- Ghost hover: `accentAlpha.a3`
- Outline borders: `accentAlpha.a8`
- Text on alpha backgrounds: `accentAlpha.a11`, `accentAlpha.a12`
- Disabled states: `grayAlpha.a8` (text)

### Critical Color Mapping

| Variant | Property | Original CSS | Native Should Be |
|---------|----------|--------------|------------------|
| classic | bg | `var(--accent-9)` | `accent[9]` |
| classic | text | `var(--accent-contrast)` | `accent.contrast` |
| solid | bg | `var(--accent-9)` | `accent[9]` |
| solid | text | `var(--accent-contrast)` | `accent.contrast` |
| soft | bg | `var(--accent-a3)` | `accent.alpha.a3` |
| soft | text | `var(--accent-a11)` | `accent.alpha.a11` |
| ghost | text | `var(--accent-a11)` | `accent.alpha.a11` |
| outline | border | `var(--accent-a8)` | `accent.alpha.a8` |
| outline | text | `var(--accent-a11)` | `accent.alpha.a11` |
| disabled | text | `var(--gray-a8)` | `gray.alpha.a8` |
| focus | ring | `var(--focus-8)` → `var(--accent-8)` | `accent[8]` |

### Special Cases

1. **Sky, Mint, Lime, Yellow, Amber** - Steps 9-10 require **dark text**, not white
2. **Focus colors are dynamic** - They mirror the accent color (`focus-8` = `accent-8`)
3. **Selection color** - Uses `focus-a5` (same as accent-alpha-a5)

---

## Implementation Plan

### Phase 1: Fix Theme Structure

**Status:** Not Started

#### 1.1 Add Helper Functions for Alpha Scales

**File:** `packages/radix-ui-themes-native/src/theme/index.ts`

```typescript
// Add helper to get accent alpha scale
export const getAccentAlphaScale = (accentColor: Color): AlphaColorScale | null => {
  const map: Record<string, AlphaColorScale> = {
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
  return map[accentColor] || null;
};

// Add helper to get accent contrast (semantic token)
export const getAccentContrast = (accentColor: Color): string => {
  const map: Record<string, string> = {
    amber: '#fff', blue: '#fff', bronze: '#fff', brown: '#fff',
    crimson: '#fff', cyan: '#fff', gold: '#fff', grass: '#fff',
    green: '#fff', indigo: '#fff', iris: '#fff', jade: '#fff',
    lime: '#0c0a09', mint: '#fff', orange: '#fff', pink: '#fff',
    plum: '#fff', purple: '#fff', ruby: '#fff', sky: '#0c0a09',
    teal: '#fff', tomato: '#fff', violet: '#fff', yellow: '#0c0a09',
  };
  return map[accentColor] || '#fff';
};
```

#### 1.2 Restructure Theme.colors

**Current Structure (WRONG):**
```typescript
colors: {
  gray: grayScale,
  grayAlpha,
  blue: blueScale,
  blueAlpha,
  // ... all flat
}
```

**Correct Structure:**
```typescript
colors: {
  gray: {
    ...grayScale,           // 1-12 solid steps
    alpha: grayAlpha,       // a1-a12 alpha steps
    dark: grayScale.dark,   // dark mode steps
  },
  accent: {
    ...accentScale,         // 1-12 solid steps
    alpha: accentAlphaScale,// a1-a12 alpha steps
    contrast: accentContrast, // semantic token (white or dark)
    surface: accentSurface,  // semantic token
    dark: accentScale.dark, // dark mode steps
  },
}
```

**Note:** Focus colors are **dynamic** - they mirror the accent color. Use `accent[8]` for focus rings.

#### 1.3 Update createTheme Function

```typescript
export const createTheme = (options: Partial<Theme> = {}): Theme => {
  // ... existing code ...

  const grayScale = getGrayScale(grayColor);
  const accentScale = getAccentScale(accentColor);
  const accentAlphaScale = getAccentAlphaScale(accentColor);
  const accentContrast = getAccentContrast(accentColor);

  return {
    name,
    scaling,
    radiusFactor,
    grayColor,
    accentColor,
    colors: {
      gray: {
        ...grayScale,
        alpha: grayAlpha,
        dark: grayScale.dark,
      },
      accent: {
        ...accentScale,
        alpha: accentAlphaScale,
        contrast: accentContrast,
        surface: accentScale.surface,
        dark: accentScale.dark,
      },
    },
    space: scaledSpace,
    radii: scaledRadii,
    typography: scaledTypography,
    shadows,
  };
};
```

---

### Phase 2: Fix Button Component

**Status:** Not Started

**File:** `packages/radix-ui-themes-native/src/components/forms/Button.tsx`

#### Current Issues

| Line | Property | Current (Wrong) | Correct |
|------|----------|-----------------|---------|
| 119 | soft bg | `accentColor[3]` | `accentColor.alpha.a3` |
| 120 | soft text | `accentColor[11]` | `accentColor.alpha.a11` |
| 127 | outline border | `accentColor[6]` | `accentColor.alpha.a8` |
| 199 | disabled text | `colors[8]` / `colors[7]` | `grayAlpha.a8` |

#### Corrected Implementation

```typescript
const Button = React.memo(
  React.forwardRef<React.ElementRef<typeof RnTouchableOpacity>, ButtonProps>(
    ({ variant = 'classic', highContrast, disabled, ... }, ref) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';

      // Get accent scale based on mode
      const accentScale = isDark 
        ? theme.colors.accent.dark 
        : theme.colors.accent;
      const accentAlpha = theme.colors.accent.alpha;
      const grayAlpha = theme.colors.gray.alpha;
      const focusColor = accentScale[8]; // Dynamic focus (mirrors accent)

      const getVariantColors = useCallback(() => {
        switch (variant) {
          case 'solid':
            return {
              backgroundColor: accentScale[9],
              textColor: highContrast ? '#ffffff' : accentScale.contrast,
              borderColor: 'transparent',
            };
          case 'soft':
            return {
              backgroundColor: accentAlpha.a3,
              textColor: highContrast ? accentScale[12] : accentAlpha.a11,
              borderColor: 'transparent',
            };
          case 'outline':
            return {
              backgroundColor: 'transparent',
              textColor: highContrast ? accentScale[12] : accentAlpha.a11,
              borderColor: accentAlpha.a8,
            };
          case 'ghost':
            return {
              backgroundColor: 'transparent',
              textColor: highContrast ? accentScale[12] : accentAlpha.a11,
              borderColor: 'transparent',
            };
          case 'classic':
          default:
            return {
              backgroundColor: accentScale[9],
              textColor: highContrast ? '#ffffff' : accentScale.contrast,
              borderColor: 'transparent',
            };
        }
      }, [variant, isDark, highContrast, accentScale, accentAlpha]);

      // ... rest of component
    }
  )
);
```

---

### Phase 3: Fix Forms Components

**Status:** Not Started

| Component | File | Primary Issues |
|-----------|------|----------------|
| IconButton | `forms/IconButton.tsx` | Same as Button |
| Checkbox | `forms/Checkbox.tsx` | Indicator uses solid instead of alpha |
| CheckboxGroup | `forms/CheckboxGroup.tsx` | Same as Checkbox |
| Radio | `forms/Radio.tsx` | Indicator uses solid instead of alpha |
| RadioGroup | `forms/RadioGroup.tsx` | Same as Radio |
| Switch | `forms/Switch.tsx` | Track/thumb use solid instead of alpha |
| TextField | `forms/TextField.tsx` | Focus ring uses wrong color |
| TextArea | `forms/TextArea.tsx` | Focus ring uses wrong color |
| Slider | `forms/Slider.tsx` | Track uses solid instead of alpha |
| Select | `forms/Select.tsx` | Trigger uses solid for variants |

### Forms Color Reference

| Component | Property | Correct Token |
|-----------|----------|---------------|
| Checkbox | unchecked bg | `grayAlpha.a3` |
| Checkbox | checked bg | `accent[9]` |
| Checkbox | indicator | `accent.contrast` |
| Radio | unchecked bg | `grayAlpha.a3` |
| Radio | checked bg | `accent[9]` |
| Switch | track bg | `accentAlpha.a5` |
| Switch | thumb bg | `accent[9]` |
| Slider | track bg | `grayAlpha.a6` |
| Slider | range bg | `accent[9]` |
| TextField | focus ring | `accent[8]` |

---

### Phase 4: Fix Data Display Components

**Status:** In Progress

| Component | File | Primary Issues |
|-----------|------|----------------|
| Badge | `data-display/Badge.tsx` | Uses non-existent `getColorScale`/`getColorAlpha` functions |
| Card | `data-display/Card.tsx` | Uses solid for variants |
| Avatar | `data-display/Avatar.tsx` | Fallback uses solid |
| Spinner | `data-display/Spinner.tsx` | Missing accent color usage |
| Progress | `data-display/Progress.tsx` | Track uses solid instead of alpha |
| DataList | `data-display/DataList.tsx` | Borders use solid |
| Table | `data-display/Table.tsx` | Borders use solid |

### Badge Color Support

Badge supports both the theme's accent color (default) and individual colors via the `color` prop:

```typescript
// Helper functions for arbitrary color support
/**
 * Get the color scale for any color name
 */
export const getColorScale = (theme: Theme, color: Color, mode: 'light' | 'dark') => {
  return mode === 'dark'
    ? theme.colors[color].dark
    : theme.colors[color];
};

/**
 * Get the alpha color scale for any color name
 */
export const getColorAlpha = (theme: Theme, color: Color) => {
  return theme.colors[color].alpha;
};
```

**Badge implementation:**
```typescript
// Use accent color by default, but support individual colors
const accentScale = color ? getColorScale(theme, color, mode) : getAccentColor(theme, mode);
const accentAlpha = color ? getColorAlpha(theme, color) : getAccentAlpha(theme);
```

### Data Display Color Reference

| Component | Variant | Correct Token |
|-----------|---------|---------------|
| Badge | soft bg | `accentAlpha.a3` |
| Badge | solid bg | `accent[9]` |
| Card | classic bg | `accent[9]` with shadow |
| Card | surface bg | `accentSurface` |
| Progress | track bg | `grayAlpha.a6` |
| Progress | fill bg | `accent[9]` |

---

### Phase 5: Fix Navigation Components

**Status:** Not Started

| Component | File | Primary Issues |
|-----------|------|----------------|
| Tabs | `navigation/Tabs.tsx` | Active trigger uses solid |
| TabNav | `navigation/TabNav.tsx` | Active link uses solid |
| SegmentedControl | `navigation/SegmentedControl.tsx` | Indicator uses solid |

### Navigation Color Reference

| Component | State | Correct Token |
|-----------|-------|---------------|
| Tabs | active bg | `accentAlpha.a3` |
| Tabs | active text | `accentAlpha.a11` |
| Tabs | focus ring | `accent[8]` |
| SegmentedControl | active bg | `accent[9]` |
| SegmentedControl | active text | `accent.contrast` |

---

### Phase 6: Fix Overlay Components

**Status:** Not Started

| Component | File | Primary Issues |
|-----------|------|----------------|
| Dialog | `overlays/Dialog.tsx` | Overlay uses solid |
| Popover | `overlays/Popover.tsx` | Content uses solid |
| Tooltip | `overlays/Tooltip.tsx` | Content uses solid |
| DropdownMenu | `overlays/DropdownMenu.tsx` | Item backgrounds use solid |
| ContextMenu | `overlays/ContextMenu.tsx` | Item backgrounds use solid |

### Overlay Color Reference

| Component | Property | Correct Token |
|-----------|----------|---------------|
| Dialog | overlay bg | `blackAlpha.a6` |
| Popover | content bg | `grayAlpha.a3` |
| Tooltip | content bg | `gray[12]` with opacity |
| DropdownMenu | item hover bg | `accentAlpha.a3` |
| DropdownMenu | item text | `accentAlpha.a11` |

---

## Shared Color Utilities

Create shared helpers in `packages/radix-ui-themes-native/src/theme/color-helpers.ts`:

```typescript
import { Theme } from './types';

/**
 * Get the accent color scale based on theme and mode
 */
export const getAccentColor = (theme: Theme, mode: 'light' | 'dark') => {
  return mode === 'dark' 
    ? theme.colors.accent.dark 
    : theme.colors.accent;
};

/**
 * Get the accent alpha scale
 */
export const getAccentAlpha = (theme: Theme) => {
  return theme.colors.accent.alpha;
};

/**
 * Get the gray alpha scale
 */
export const getGrayAlpha = (theme: Theme) => {
  return theme.colors.gray.alpha;
};

/**
 * Get focus color (dynamic - mirrors accent)
 */
export const getFocusColor = (theme: Theme, mode: 'light' | 'dark') => {
  return getAccentColor(theme, mode)[8];
};

/**
 * Get selection color (focus-a5 = accent-alpha-a5)
 */
export const getSelectionColor = (theme: Theme) => {
  return theme.colors.accent.alpha.a5;
};

/**
 * Check if accent color needs dark text (Sky, Mint, Lime, Yellow, Amber)
 */
export const needsDarkText = (accentColor: string): boolean => {
  return ['sky', 'mint', 'lime', 'yellow', 'amber'].includes(accentColor);
};
```

---

## Component Checklist

### Phase 1: Theme Structure
- [ ] Add `getAccentAlphaScale` helper
- [ ] Add `getAccentContrast` helper
- [ ] Restructure `theme.colors` to include alpha scales
- [ ] Update `createTheme` function

### Phase 2: Button
- [ ] Update `getVariantColors` to use alpha tokens
- [ ] Update disabled text color
- [ ] Update focus ring color (use accent[8])

### Phase 3: Forms Components
- [ ] IconButton
- [ ] Checkbox / CheckboxGroup
- [ ] Radio / RadioGroup
- [ ] Switch
- [ ] TextField
- [ ] TextArea
- [ ] Slider
- [ ] Select

### Phase 4: Data Display Components
- [ ] Badge
- [ ] Card
- [ ] Avatar
- [ ] Spinner
- [ ] Progress
- [ ] DataList
- [ ] Table

### Phase 5: Navigation Components
- [ ] Tabs
- [ ] TabNav
- [ ] SegmentedControl

### Phase 6: Overlay Components
- [ ] Dialog
- [ ] Popover
- [ ] Tooltip
- [ ] DropdownMenu
- [ ] ContextMenu

---

## Visual Testing Checklist

After each phase, verify:

- [ ] Colors match original Radix Themes web library
- [ ] Soft variants have subtle alpha backgrounds
- [ ] Focus rings match accent color
- [ ] Disabled states use gray alpha colors
- [ ] Dark mode colors are correct
- [ ] High contrast variants work correctly
- [ ] Special colors (Sky, Mint, Lime, Yellow, Amber) have dark text

---

## References

- [Understanding the Scale](packages/radix-ui-themes-native/docs/understanding-the-scale.mdx)
- [Original Button CSS](packages/radix-ui-themes/src/components/_internal/base-button.css)
- [Original Color Tokens](packages/radix-ui-themes/src/styles/tokens/color.css)
- [Conversion Plan](plans/radix-themes-rn-conversion-plan.md)
