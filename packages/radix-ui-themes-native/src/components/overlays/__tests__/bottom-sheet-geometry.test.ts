import { sheetTopPadding } from '../BottomSheet';

describe('sheetTopPadding', () => {
  const SCREEN = 800;
  const NOTCH = 59;

  it('is zero for a half-height sheet that never reaches the status bar', () => {
    expect(sheetTopPadding(NOTCH, SCREEN, SCREEN * 0.5)).toBe(0);
  });

  it('pads a full-height sheet by the full top inset', () => {
    expect(sheetTopPadding(NOTCH, SCREEN, SCREEN)).toBe(NOTCH);
  });

  it('pads only the overlapping part when the sheet edge crosses the inset', () => {
    // Top edge sits at y=40, inset ends at 59 -> 19px of overlap.
    expect(sheetTopPadding(NOTCH, SCREEN, SCREEN - 40)).toBe(19);
  });

  it('is exactly zero when the sheet edge touches the inset boundary', () => {
    expect(sheetTopPadding(NOTCH, SCREEN, SCREEN - NOTCH)).toBe(0);
  });

  it('is zero with no inset regardless of sheet height', () => {
    expect(sheetTopPadding(0, SCREEN, SCREEN)).toBe(0);
  });

  it('caps padding at the inset for sheets taller than the screen', () => {
    expect(sheetTopPadding(NOTCH, SCREEN, SCREEN + 100)).toBe(NOTCH);
  });
});
