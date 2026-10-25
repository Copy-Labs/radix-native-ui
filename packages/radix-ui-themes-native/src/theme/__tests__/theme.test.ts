/**
 * Tests for theme construction: defaults, scaling, radius multipliers,
 * gray color selection and accent configuration.
 */
import { createTheme, defaultTheme } from '../index';

describe('createTheme defaults', () => {
  it('applies documented defaults', () => {
    expect(defaultTheme.name).toBe('default');
    expect(defaultTheme.scaling).toBe(1);
    expect(defaultTheme.radius).toBe('medium');
    expect(defaultTheme.grayColor).toBe('mauve');
    expect(defaultTheme.accentColor).toBe('indigo');
  });

  it('defaultTheme equals a fresh createTheme()', () => {
    expect(defaultTheme).toEqual(createTheme());
  });

  it('builds a full space scale at base scaling', () => {
    expect(defaultTheme.space[1]).toBe(4);
    expect(defaultTheme.space[5]).toBe(24);
    expect(defaultTheme.space[9]).toBe(64);
  });
});

describe('scaling', () => {
  const large = createTheme({ name: 'large', scaling: 1.25 });

  it('scales the space ramp', () => {
    expect(large.space[1]).toBe(5);
    expect(large.space[5]).toBe(30);
  });

  it('scales typography sizes and line heights', () => {
    expect(large.typography.fontSizes[3].fontSize).toBe(20);
    expect(large.typography.fontSizes[3].lineHeight).toBe(30);
    expect(large.typography.lineHeights[1]).toBe(20);
  });

  it('leaves letter spacing and weights unscaled', () => {
    expect(large.typography.fontSizes[1].letterSpacing).toBe(
      defaultTheme.typography.fontSizes[1].letterSpacing
    );
    expect(large.typography.fontWeights).toBe(defaultTheme.typography.fontWeights);
  });
});

describe('radius multipliers', () => {
  it('maps named radius sizes onto multipliers of the 8px base', () => {
    expect(createTheme({ radius: 'none' }).radii.medium).toBe(0);
    expect(createTheme({ radius: 'small' }).radii.medium).toBe(4);
    expect(createTheme({ radius: 'medium' }).radii.medium).toBe(8);
    expect(createTheme({ radius: 'large' }).radii.medium).toBe(12);
  });

  it('full and thumb radii are always pill-sized', () => {
    for (const radius of ['none', 'small', 'medium', 'large', 'full'] as const) {
      expect(createTheme({ radius }).radii.full).toBe(9999);
      expect(createTheme({ radius }).radii.thumb).toBe(9999);
    }
  });
});

describe('color configuration', () => {
  it('grayColor swaps the gray ramp', () => {
    const grayTheme = createTheme({ grayColor: 'gray' });
    expect(grayTheme.colors.gray[9]).not.toBe(defaultTheme.colors.gray[9]);
    expect(grayTheme.grayColor).toBe('gray');
  });

  it('accentColor is stored and every accent remains available', () => {
    const tomatoTheme = createTheme({ accentColor: 'tomato' });
    expect(tomatoTheme.accentColor).toBe('tomato');
    // Helpers look colors up by name at render time, so the full palette
    // must exist regardless of the configured accent.
    expect(tomatoTheme.colors.indigo[9]).toBeDefined();
    expect(tomatoTheme.colors.tomato.alpha['4']).toBeDefined();
  });

  it('custom name is preserved', () => {
    expect(createTheme({ name: 'brand' }).name).toBe('brand');
  });
});
