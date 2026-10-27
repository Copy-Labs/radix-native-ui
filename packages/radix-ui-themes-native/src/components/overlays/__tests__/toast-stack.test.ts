import { markEvictionOnOverflow } from '../Toast';

interface StackItem {
  id: string;
  leaving?: boolean;
}

const item = (id: string, leaving?: boolean): StackItem =>
  leaving === undefined ? { id } : { id, leaving };

describe('markEvictionOnOverflow', () => {
  it('returns the stack untouched when below the limit', () => {
    const stack = [item('a'), item('b')];
    const result = markEvictionOnOverflow(stack, 3);
    expect(result).toBe(stack);
  });

  it('marks the oldest active toast leaving when at the limit', () => {
    const stack = [item('a'), item('b'), item('c')];
    const result = markEvictionOnOverflow(stack, 3);
    expect(result.map((t) => !!t.leaving)).toEqual([true, false, false]);
    // Immutability: the input array is not mutated.
    expect(stack[0].leaving).toBeUndefined();
  });

  it('does not count already-leaving toasts towards the limit', () => {
    // 'a' is animating out, so only b/c are active — no second eviction.
    const stack = [item('a', true), item('b'), item('c')];
    const result = markEvictionOnOverflow(stack, 3);
    expect(result).toBe(stack);
  });

  it('evicts the next-oldest when a leaving toast is already in the stack', () => {
    const stack = [item('a', true), item('b'), item('c'), item('d')];
    const result = markEvictionOnOverflow(stack, 3);
    expect(result.map((t) => !!t.leaving)).toEqual([true, true, false, false]);
  });

  it('returns the stack untouched when every toast is already leaving', () => {
    const stack = [item('a', true), item('b', true)];
    const result = markEvictionOnOverflow(stack, 1);
    expect(result).toBe(stack);
  });

  it('evicts from an empty-ish stack gracefully', () => {
    expect(markEvictionOnOverflow([], 3)).toEqual([]);
  });
});
