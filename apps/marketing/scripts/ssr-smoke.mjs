#!/usr/bin/env node
/**
 * Proves the marketing page's central claim: the component panels are the real
 * `radix-native-ui` package rendering through `react-native-web`, not pictures
 * of components.
 *
 * It reads the prerendered `dist/index.html` and checks for artefacts that only
 * the library's own render path can produce — the theme's computed color ramps,
 * its type scale steps, react-native-web's atomic class names, and the strings
 * the demo panels pass in as children.
 *
 * Run after `pnpm build`. Reports every check, then exits non-zero if any of
 * them failed, so it is safe to wire into CI.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const file = path.join(root, 'dist', 'index.html');

let html;
try {
  html = readFileSync(file, 'utf8');
} catch {
  console.error(`✖ ${file} not found — run \`pnpm build\` first.`);
  process.exit(1);
}

/* The HTML is minified onto a handful of lines, so count occurrences rather
   than lines. */
const count = (needle) => html.split(needle).length - 1;

const checks = [
  {
    name: 'hydrated islands prerendered',
    // hero + comparison pair + gallery panels + steps + day/night pair + faq + theme lab
    test: () => count('<astro-island') >= 15,
    detail: `${count('<astro-island')} <astro-island> elements`,
  },
  {
    name: 'react-native-web stylesheet classes present',
    test: () => count('class="css-') > 50,
    detail: `${count('class="css-')} atomic RNW classes`,
  },
  {
    name: 'inline styles from the library layout engine',
    test: () => count('style="') > 300,
    detail: `${count('style="')} inline style attributes`,
  },
  {
    // indigo-11 / mauve-12 / the soft-accent fill are computed from the
    // theme's ramps; no hand-written CSS on the page uses this syntax.
    name: 'accent ramp color (indigo-11) in rendered output',
    test: () => count('rgba(58,91,199,1.00)') > 0,
    detail: `${count('rgba(58,91,199,1.00)')} occurrences`,
  },
  {
    name: 'gray ramp color (mauve-12) in rendered output',
    test: () => count('rgba(33,31,38,1.00)') > 0,
    detail: `${count('rgba(33,31,38,1.00)')} occurrences`,
  },
  {
    name: 'soft variant alpha fill (indigo + mauve mix)',
    test: () => count('rgba(0,72,240,0.07)') > 0,
    detail: `${count('rgba(0,72,240,0.07)')} occurrences`,
  },
  {
    // Heading size 5 => 20px / 28px line height from the typography scale.
    name: 'type scale step 5 (20px / 28px)',
    test: () => count('font-size:20px;line-height:28px') > 0,
    detail: `${count('font-size:20px;line-height:28px')} occurrences`,
  },
  {
    // Text size 1 => 12px / 16px with the scale's letter-spacing.
    name: 'type scale step 1 (12px + letter-spacing)',
    test: () => count('letter-spacing:0.0025px') > 0,
    detail: `${count('letter-spacing:0.0025px')} occurrences`,
  },
  {
    /*
      gray-12 in the *dark* ramp is #eeeef0. Only a ThemeProvider rendered with
      appearance="dark" can emit it, so this proves the day/night pair is really
      two schemes rather than a CSS filter over one.
    */
    name: 'pinned dark island prerendered against the dark ramp',
    test: () => count('rgba(238,238,240,1.00)') > 0,
    detail: `${count('rgba(238,238,240,1.00)')} dark-ramp occurrences`,
  },
];

const sentinels = [
  ['HeroScreen heading', 'Good evening'],
  ['Card child', 'Design review'],
  ['Checkbox label', 'Agree to terms'],
  ['Toast trigger', 'Fire toast'],
  ['Button.Icon label', 'New task'],
  /*
   * Select.Value has to sit inside a Button.Label to be rendered at all, so this
   * is the regression test for the trigger quietly coming out empty.
   */
  ['Select trigger value', 'Pick a fruit'],
  ['Comparison column tag', 'Without radix-native-ui'],
  ['Account card (library side)', 'Email me product updates'],
  ['Accordion FAQ question', 'Is this a port of Radix Themes?'],
  ['How-it-works step', 'Ship to both platforms'],
  ['Closing CTA', 'three components deep'],
];

for (const [label, text] of sentinels) {
  checks.push({
    name: `${label} rendered as real text`,
    test: () => count(text) > 0,
    detail: `${count(text)} occurrence(s) of "${text}"`,
  });
}

// A genuine React render respects state: content behind a closed overlay is not
// in the tree. If this ever appears, the prerender stopped being a real render.
for (const [label, text] of [
  ['Sidebar body (overlay closed)', 'Workspace'],
  ['BottomSheet body (sheet closed)', 'Snap points'],
  /*
    The self-running demo toasts this title two seconds after it mounts, so a
    prerendered copy would mean the sequence had been faked into the markup.
  */
  ['Auto-demo toast (mount-time sequence)', 'Upload complete'],
]) {
  checks.push({
    name: `${label} not prerendered`,
    test: () => count(text) === 0,
    detail: `found ${count(text)} occurrence(s) of "${text}", expected 0`,
  });
}

let failed = 0;
for (const check of checks) {
  const ok = check.test();
  if (!ok) failed += 1;
  console.log(`${ok ? '✔' : '✖'} ${check.name} — ${check.detail}`);
}

console.log(
  failed === 0
    ? `\n${checks.length}/${checks.length} checks passed: the gallery is a real render.`
    : `\n${failed}/${checks.length} checks failed.`,
);
process.exit(failed === 0 ? 0 : 1);
