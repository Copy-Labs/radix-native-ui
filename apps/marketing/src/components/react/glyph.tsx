import { Text } from 'react-native';
import React from 'react';

/**
 * A dependency-free stand-in for `@expo/vector-icons`.
 *
 * The library clones icon elements with `size` and `color` props (that is how a
 * `Button.Icon` / `FloatingTabBar.Item` icon gets themed), so any glyph we hand
 * to it has to accept those two props and paint with them. Unicode symbols keep
 * the site free of a font dependency.
 *
 * U+FE0E (variation selector-15) follows the glyph so symbols that also have an
 * emoji presentation — ☺, ☑, ✓, ↻ — stay monochrome and take the theme color
 * instead of arriving pre-tinted from the emoji font.
 */
export interface GlyphProps {
  name: string;
  size?: number;
  color?: string;
}

export const Glyph = ({ name, size = 16, color = 'currentColor' }: GlyphProps) => (
  <Text style={{ fontSize: size, color, lineHeight: Math.round(size * 1.25) }}>
    {name}
    {'\uFE0E'}
  </Text>
);
