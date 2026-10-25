/**
 * Shared size prop normalization.
 *
 * The canonical size API is NUMERIC (`size={2}`). String sizes (`size="2"`,
 * the web Radix Themes convention) are still accepted for compatibility and
 * will be deprecated in a future release. Components should switch on the
 * normalized numeric value via `toNumericSize` at their resolution boundaries.
 */

/**
 * A size value expressed either as a number or its string literal form.
 * Example: `SizeInput<1 | 2 | 3>` = `1 | 2 | 3 | '1' | '2' | '3'`
 */
export type SizeInput<N extends number> = N | `${N}`;

/**
 * Normalize a SizeInput to its canonical numeric form.
 * Returns the value unchanged when already numeric, the parsed number for
 * legacy string inputs, or `undefined` when absent.
 */
export const toNumericSize = <N extends number>(size?: SizeInput<N>): N | undefined =>
  size === undefined ? undefined : (Number(size) as N);
