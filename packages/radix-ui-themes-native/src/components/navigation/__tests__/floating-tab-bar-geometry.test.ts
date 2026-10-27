import {
  detectTabZone,
  clampPillCenter,
  pillTranslateFor,
  type FloatingTabBarZone,
} from '../FloatingTabBar';

// The shared pill's math: which item a finger sits over, where the pill may
// travel, and how a center maps to a translateX. Pure functions, no React.

const zones = (widths: number[], start = 0): FloatingTabBarZone[] => {
  let x = start;
  return widths.map((width, i) => {
    const z = { value: `tab${i}`, x, width };
    x += width;
    return z;
  });
};

describe('detectTabZone', () => {
  const layouts = zones([80, 80, 80]);

  it('finds the zone containing the finger', () => {
    expect(detectTabZone(layouts, 40)).toBe(0);
    expect(detectTabZone(layouts, 120)).toBe(1);
    expect(detectTabZone(layouts, 200)).toBe(2);
  });

  it('treats shared boundaries as belonging to the earlier zone', () => {
    // 80 is both the end of zone 0 (inclusive) and the start of zone 1 —
    // first match wins so a crossing fires exactly one hover change.
    expect(detectTabZone(layouts, 80)).toBe(0);
    expect(detectTabZone(layouts, 159.9)).toBe(1);
  });

  it('returns -1 outside the bar', () => {
    expect(detectTabZone(layouts, -5)).toBe(-1);
    expect(detectTabZone(layouts, 241)).toBe(-1);
  });

  it('returns -1 for an empty layout list', () => {
    expect(detectTabZone([], 10)).toBe(-1);
  });

  it('handles offset bars (inset margins) fine', () => {
    const offset = zones([60, 60], 100);
    expect(detectTabZone(offset, 130)).toBe(0);
    expect(detectTabZone(offset, 99)).toBe(-1);
  });
});

describe('clampPillCenter', () => {
  it('keeps a position between the first and last centers', () => {
    expect(clampPillCenter(120, 40, 200)).toBe(120);
    expect(clampPillCenter(10, 40, 200)).toBe(40);
    expect(clampPillCenter(999, 40, 200)).toBe(200);
  });

  it('collapses a degenerate/inverted range to the last center', () => {
    expect(clampPillCenter(100, 200, 40)).toBe(40);
    expect(clampPillCenter(100, 40, 40)).toBe(40);
  });
});

describe('pillTranslateFor', () => {
  it('centers the pill on a tab center', () => {
    expect(pillTranslateFor(100, 40)).toBe(80);
    expect(pillTranslateFor(40, 30)).toBe(25);
  });

  it('handles a pill wider than the travel (negative translate is fine)', () => {
    expect(pillTranslateFor(10, 40)).toBe(-10);
  });
});
