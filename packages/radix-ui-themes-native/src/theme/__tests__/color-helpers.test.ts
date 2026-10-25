/**
 * Tests for the color helper logic: mode routing, dark-text detection,
 * variant/high-contrast resolution and state colors.
 * These functions drive every component's palette, so their routing rules
 * are pinned here against the default theme.
 */
import { defaultTheme, createTheme } from '../index';
import {
  getAccentColor,
  getColorScale,
  getColorAlpha,
  getAccentAlpha,
  getGrayAlpha,
  getFocusColor,
  getSelectionColor,
  needsDarkText,
  getForegroundColor,
  getContrast,
  getHighContrastTextColor,
  getHighContrastBackground,
  getAccentTextColor,
  getExtendedAccentScale,
  getVariantColors,
  getDisabledColors,
  getHoverColors,
  getActiveColors,
} from '../color-helpers';

const theme = defaultTheme;

describe('scale accessors', () => {
  it('getAccentColor routes by mode', () => {
    expect(getAccentColor(theme, 'light')).toBe(theme.colors.indigo);
    expect(getAccentColor(theme, 'dark')).toBe(theme.colors.indigo.dark);
  });

  it('getAccentColor follows the theme accent setting', () => {
    const tomatoTheme = createTheme({ accentColor: 'tomato' });
    expect(getAccentColor(tomatoTheme, 'light')).toBe(tomatoTheme.colors.tomato);
  });

  it('getColorScale returns dark scale in dark mode', () => {
    expect(getColorScale(theme, 'blue', 'light')).toBe(theme.colors.blue);
    expect(getColorScale(theme, 'blue', 'dark')).toBe(theme.colors.blue.dark);
  });

  it('getColorAlpha returns alpha ramps, defaulting to light', () => {
    expect(getColorAlpha(theme, 'indigo')).toBe(theme.colors.indigo.alpha);
    expect(getColorAlpha(theme, 'indigo', 'dark')).toBe(theme.colors.indigo.alpha.dark);
  });

  it('getAccentAlpha uses the configured accent color', () => {
    const jadeTheme = createTheme({ accentColor: 'jade' });
    expect(getAccentAlpha(jadeTheme)).toBe(jadeTheme.colors.jade.alpha);
  });

  it('getGrayAlpha routes by mode', () => {
    expect(getGrayAlpha(theme)).toBe(theme.colors.gray.alpha);
    expect(getGrayAlpha(theme, 'dark')).toBe(theme.colors.gray.alpha.dark);
  });

  it('getFocusColor is accent step 8', () => {
    expect(getFocusColor(theme, 'light')).toBe(theme.colors.indigo[8]);
    expect(getFocusColor(theme, 'dark')).toBe(theme.colors.indigo.dark[8]);
  });

  it('getSelectionColor is accent-alpha step 5', () => {
    expect(getSelectionColor(theme)).toBe(theme.colors.indigo.alpha['5']);
  });
});

describe('text color selection', () => {
  it.each(['sky', 'mint', 'lime', 'yellow', 'amber', 'white'] as const)(
    '%s requires dark text',
    (color) => {
      expect(needsDarkText(color)).toBe(true);
    }
  );

  it.each(['indigo', 'tomato', 'gray', 'crimson'] as const)(
    '%s does not require dark text',
    (color) => {
      expect(needsDarkText(color)).toBe(false);
    }
  );

  it('getForegroundColor picks dark vs white text from the color name', () => {
    expect(getForegroundColor(theme, 'yellow', 'light')).toBe('#0c0a09');
    expect(getForegroundColor(theme, 'indigo', 'light')).toBe(theme.colors.white['12']);
  });

  it('getContrast prefers the scale contrast token when present', () => {
    const scale = getColorScale(theme, 'indigo', 'light');
    const expected = 'contrast' in scale ? (scale as any).contrast : '#18181b';
    expect(getContrast(theme, 'indigo', 'light')).toBe(expected);
  });

  it('getContrast returns hard black/white in high contrast mode', () => {
    expect(getContrast(theme, 'yellow', 'light', true)).toBe('#0c0a09');
    expect(getContrast(theme, 'indigo', 'light', true)).toBe('#ffffff');
  });

  it('getAccentTextColor delegates to the accent contrast', () => {
    expect(getAccentTextColor(theme, 'light')).toBe(getContrast(theme, 'indigo', 'light'));
  });

  it('high contrast helpers use step 12 background and blackAlpha text', () => {
    expect(getHighContrastTextColor(theme)).toBe(theme.colors.blackAlpha[12]);
    expect(getHighContrastBackground(theme, 'blue', 'light')).toBe(theme.colors.blue[11]);
  });

  it('getExtendedAccentScale merges dark alpha in dark mode', () => {
    const extended = getExtendedAccentScale(theme, 'dark');
    expect(extended.alpha).toBe(theme.colors.indigo.alpha.dark);
    const light = getExtendedAccentScale(theme, 'light');
    expect(light).toBe(theme.colors.indigo);
  });
});

describe('getVariantColors', () => {
  const indigo = theme.colors.indigo;
  const indigoAlpha = theme.colors.indigo.alpha;

  it('solid uses step 9 background and foreground text', () => {
    const c = getVariantColors(theme, 'indigo', 'light', 'solid');
    expect(c).toEqual({
      backgroundColor: indigo[9],
      textColor: theme.colors.white['12'],
      borderColor: 'transparent',
    });
  });

  it('solid with a light accent gets dark text', () => {
    const c = getVariantColors(theme, 'yellow', 'light', 'solid');
    expect(c.textColor).toBe('#0c0a09');
  });

  it('soft/outline/surface/ghost map to the documented steps', () => {
    expect(getVariantColors(theme, 'indigo', 'light', 'soft')).toEqual({
      backgroundColor: indigoAlpha['3'],
      textColor: indigo['11'],
      borderColor: 'transparent',
    });
    expect(getVariantColors(theme, 'indigo', 'light', 'outline')).toEqual({
      backgroundColor: 'transparent',
      textColor: indigo['11'],
      borderColor: indigoAlpha['8'],
    });
    expect(getVariantColors(theme, 'indigo', 'light', 'surface')).toEqual({
      backgroundColor: indigoAlpha['2'],
      textColor: indigo['11'],
      borderColor: indigoAlpha['8'],
    });
    expect(getVariantColors(theme, 'indigo', 'light', 'ghost')).toEqual({
      backgroundColor: 'transparent',
      textColor: indigo['11'],
      borderColor: 'transparent',
    });
  });

  it('dark mode reads from the dark scale', () => {
    const c = getVariantColors(theme, 'indigo', 'dark', 'solid');
    expect(c.backgroundColor).toBe(theme.colors.indigo.dark[9]);
  });

  it('high contrast flips solid to step 12 with step 1 text', () => {
    const c = getVariantColors(theme, 'indigo', 'light', 'solid', true);
    expect(c).toEqual({
      backgroundColor: indigo[12],
      textColor: indigo['1'],
      borderColor: 'transparent',
    });
  });

  it('high contrast outline uses step 12 border and transparent background', () => {
    const c = getVariantColors(theme, 'indigo', 'light', 'outline', true);
    expect(c).toEqual({
      backgroundColor: 'transparent',
      textColor: indigo[12],
      borderColor: indigo[12],
    });
  });
});

describe('interaction states', () => {
  it('disabled uses grayAlpha 3/8', () => {
    const grayAlpha = theme.colors.gray.alpha;
    expect(getDisabledColors(theme, 'light')).toEqual({
      backgroundColor: grayAlpha['3'],
      textColor: grayAlpha['8'],
    });
  });

  it('hover steps up one alpha level per variant', () => {
    const accentAlpha = theme.colors.indigo.alpha;
    expect(getHoverColors(theme, 'light', 'solid')).toEqual({
      backgroundColor: theme.colors.indigo[10],
    });
    expect(getHoverColors(theme, 'light', 'soft')?.backgroundColor).toBe(accentAlpha['4']);
    expect(getHoverColors(theme, 'light', 'ghost')?.backgroundColor).toBe(accentAlpha['3']);
    expect(getHoverColors(theme, 'light', 'outline')?.backgroundColor).toBe(accentAlpha['2']);
  });

  it('active is one step stronger than hover for alpha variants', () => {
    const accentAlpha = theme.colors.indigo.alpha;
    expect(getActiveColors(theme, 'light', 'soft')?.backgroundColor).toBe(accentAlpha['5']);
    expect(getActiveColors(theme, 'light', 'ghost')?.backgroundColor).toBe(accentAlpha['4']);
    expect(getActiveColors(theme, 'light', 'outline')?.backgroundColor).toBe(accentAlpha['3']);
  });

  it('surface has no hover/active styling (returns null)', () => {
    expect(getHoverColors(theme, 'light', 'surface' as any)).toBeNull();
    expect(getActiveColors(theme, 'light', 'surface' as any)).toBeNull();
  });
});
