import { toNumericSize } from '../size';

describe('toNumericSize', () => {
  it('passes numbers through unchanged', () => {
    expect(toNumericSize(2)).toBe(2);
  });

  it('normalizes legacy string sizes', () => {
    expect(toNumericSize('2')).toBe(2);
    expect(toNumericSize('4')).toBe(4);
  });

  it('returns undefined for absent sizes', () => {
    expect(toNumericSize(undefined)).toBeUndefined();
  });
});
