import {
  sidebarSlideRange,
  slideProgress,
  progressInterpolation,
  mainShiftFor,
  pageScaleFor,
  contentScaleFor,
  projectSwipeSettle,
} from '../Sidebar';

// The sidebar gesture/geometry math is pure and side-effect-free, so it is
// testable without rendering (the suite convention: pure-logic modules).
//
// The single source of truth is `slide`: the drawer's own translateX, running
// between fully off-screen when closed (∓width) and flush at the edge when
// open (0). `progress` derives from it (0 closed → 1 open); the page shift and
// every dim derive from progress. These invariants are what the interpolate
// wiring in Root depends on, so they are pinned here.

describe('sidebarSlideRange', () => {
  it('left drawers travel between -width (closed) and flush 0 (open)', () => {
    expect(sidebarSlideRange('left', 280)).toEqual({ closed: -280, open: 0 });
  });

  it('right drawers mirror the left range', () => {
    expect(sidebarSlideRange('right', 280)).toEqual({ closed: 280, open: 0 });
  });
});

describe('slideProgress', () => {
  it('is 0 fully closed and 1 fully open for both sides', () => {
    expect(slideProgress(-280, 'left', 280)).toBe(0);
    expect(slideProgress(0, 'left', 280)).toBe(1);
    expect(slideProgress(280, 'right', 280)).toBe(0);
    expect(slideProgress(0, 'right', 280)).toBe(1);
  });

  it('is monotonic mid-travel', () => {
    expect(slideProgress(-140, 'left', 280)).toBeCloseTo(0.5);
  });

  it('clamps outside the travel range', () => {
    expect(slideProgress(-500, 'left', 280)).toBe(0);
    expect(slideProgress(10, 'left', 280)).toBe(1);
  });

  it('stays bounded for degenerate widths', () => {
    const p = slideProgress(0, 'left', 0);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });
});

describe('progressInterpolation', () => {
  it('always produces an ascending inputRange that maps closed→0, open→1', () => {
    const left = progressInterpolation('left', 280);
    const right = progressInterpolation('right', 280);
    // Ascending inputRange on both sides (native interpolate requirement).
    expect(left.inputRange[0]).toBeLessThan(left.inputRange[1]);
    expect(right.inputRange[0]).toBeLessThan(right.inputRange[1]);
    // Left: closed -280 → 0, flush 0 → 1.
    expect(left).toEqual({ inputRange: [-280, 0], outputRange: [0, 1] });
    // Right: closed 280 sits at inputRange end with progress 0; flush 0 → 1.
    expect(right).toEqual({ inputRange: [0, 280], outputRange: [1, 0] });
  });
});

describe('mainShiftFor', () => {
  it('overlay never moves the page', () => {
    expect(mainShiftFor('overlay', 'left', 280)).toBe(0);
    expect(mainShiftFor('overlay', 'right', 280)).toBe(0);
  });

  it('push, under and reveal all slide the page aside by the full drawer width', () => {
    // Left drawer pushes the page right (+); a right drawer pulls it left (−).
    expect(mainShiftFor('push', 'left', 280)).toBe(280);
    expect(mainShiftFor('push', 'right', 280)).toBe(-280);
    expect(mainShiftFor('under', 'left', 280)).toBe(280);
    expect(mainShiftFor('under', 'right', 280)).toBe(-280);
    expect(mainShiftFor('reveal', 'left', 280)).toBe(280);
    expect(mainShiftFor('reveal', 'right', 280)).toBe(-280);
  });
});

describe('pageScaleFor', () => {
  it('only the reveal variant recedes (scales down) its page', () => {
    expect(pageScaleFor('reveal')).toBeCloseTo(0.92);
    expect(pageScaleFor('overlay')).toBe(1);
    expect(pageScaleFor('push')).toBe(1);
    expect(pageScaleFor('under')).toBe(1);
  });
});

describe('contentScaleFor', () => {
  it('only the under variant gives its drawer a scale-up entrance', () => {
    expect(contentScaleFor('under')).toBeCloseTo(0.9);
    expect(contentScaleFor('overlay')).toBe(1);
    expect(contentScaleFor('push')).toBe(1);
    expect(contentScaleFor('reveal')).toBe(1);
  });
});

describe('projectSwipeSettle', () => {
  it('opens when the drag passes the quarter-travel threshold', () => {
    // Left drawer at -100 → progress (180/280) = 0.64 ≥ 0.25 → open, flush.
    const result = projectSwipeSettle({ slide: -100, vx: 0, side: 'left', width: 280 });
    expect(result.targetOpen).toBe(true);
    expect(result.targetSlide).toBe(0);
  });

  it('stays closed for a tiny drag with no momentum', () => {
    const result = projectSwipeSettle({ slide: -270, vx: 0, side: 'left', width: 280 });
    expect(result.targetOpen).toBe(false);
    expect(result.targetSlide).toBe(-280);
  });

  it('a flick completes the gesture even from a small drag', () => {
    const result = projectSwipeSettle({ slide: -280, vx: 1.2, side: 'left', width: 280 });
    expect(result.targetOpen).toBe(true);
    expect(result.targetSlide).toBe(0);
  });

  it('respects direction for right drawers', () => {
    const opened = projectSwipeSettle({ slide: 100, vx: 0, side: 'right', width: 280 });
    expect(opened.targetOpen).toBe(true);
    expect(opened.targetSlide).toBe(0);
    const closed = projectSwipeSettle({ slide: 275, vx: 0, side: 'right', width: 280 });
    expect(closed.targetOpen).toBe(false);
    expect(closed.targetSlide).toBe(280);
  });

  it('never settles beyond the travel range', () => {
    const result = projectSwipeSettle({ slide: -40, vx: -5, side: 'left', width: 280 });
    expect([-280, 0]).toContain(result.targetSlide);
  });
});
