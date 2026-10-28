#!/usr/bin/env node
/**
 * Captures real PNGs of the components from the built site, so the repo can have
 * shareable images (og:image, README, docs) that are literally screenshots of
 * the library rather than mockups.
 *
 * It serves `dist/` with `astro preview`, drives headless Chromium over it, and
 * writes:
 *   public/og.png            1200x630 social preview (hero)
 *   public/shots/hero.png    the phone screen, light mode
 *   public/shots/hero-dark.png   the same after toggling the in-app switch
 *   public/shots/theme-lab.png   the live theme controls
 *   public/shots/compare.png     the Without / With pair
 *   public/shots/day-night.png   the pinned light + dark islands
 *   public/shots/faq.png         the accordion FAQ
 *   public/shots/cta.png         the closing band
 *   public/shots/<panel>.png     one per gallery panel
 *
 * Requires the browser once: `pnpm --filter marketing exec playwright install chromium`
 * Run after `pnpm build:site`.
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'shots');
const port = 4399;
const base = `http://localhost:${port}`;

const server = spawn('npx', ['astro', 'preview', '--port', String(port)], {
  cwd: root,
  stdio: 'ignore',
});

const stop = () => {
  server.kill('SIGTERM');
};

// `astro preview` gives no usable readiness signal, so poll until it answers.
async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`astro preview did not answer on ${base} within ${timeoutMs}ms`);
}

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

try {
  await waitForServer();
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  /*
   * Retina-scale output, and a fixed light scheme so re-runs are reproducible:
   * the shell reads localStorage before first paint. Reduced motion is emulated
   * deliberately — it makes every `.reveal` element visible without waiting on
   * the IntersectionObserver, freezes the ambient glows, and lets the self-running
   * demo settle on its end state instead of being caught mid-sequence.
   */
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await context.addInitScript(() => localStorage.setItem('theme', 'light'));
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') pageErrors.push(`console: ${msg.text()}`);
  });

  await page.goto(base, { waitUntil: 'networkidle' });

  // The gallery islands are `client:visible`, so they only mount once scrolled
  // into view. Walk the page to trigger every one of them.
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  // Give hydration and RNW's stylesheet injection a moment to settle.
  await page.waitForTimeout(1500);

  const written = [];
  const shot = async (target, file) => {
    await target.scrollIntoViewIfNeeded();
    await target.screenshot({ path: path.join(outDir, file) });
    written.push(file);
  };

  // Shoot panels one per row: in the responsive multi-column grid each panel is
  // narrow and stretched to its tallest sibling, which makes for a badly
  // proportioned image. This only affects the capture page, never the build.
  await page.addStyleTag({
    content: `
      #components .gallery, #theming .theming {
        grid-template-columns: minmax(0, 760px) !important;
        justify-content: center;
      }
    `,
  });
  await page.waitForTimeout(400);

  // Hero: the phone screen as the library renders it, then with dark mode
  // switched from inside the component tree.
  const device = page.locator('.device');
  await shot(device, 'hero.png');
  await page.locator('.device [role="switch"]').first().click();
  await page.waitForTimeout(600);
  await shot(device, 'hero-dark.png');
  await page.locator('.device [role="switch"]').first().click();
  await page.waitForTimeout(400);

  await shot(page.locator('#theming .panel').first(), 'theme-lab.png');
  await shot(page.locator('#compare .compare'), 'compare.png');
  await shot(page.locator('#theming .pair'), 'day-night.png');
  await shot(page.locator('#faq .faq'), 'faq.png');
  await shot(page.locator('.cta'), 'cta.png');

  for (const panel of await page.locator('#components .panel').all()) {
    const heading = (await panel.locator('h3').first().textContent()) || 'panel';
    await shot(panel, `${slug(heading.trim())}.png`);
  }

  // Social preview: 1200x630, the 1.91:1 ratio Open Graph wants. The nav is
  // noise in a share card, and the hero is taller than 630px, so measure it and
  // zoom by exactly the factor needed to fit — a hard-coded constant would drift
  // the moment the copy changes length.
  await page.setViewportSize({ width: 1200, height: 1200 });
  await page.addStyleTag({
    content: 'header.nav { display: none !important; }',
  });
  await page.waitForTimeout(300);
  const heroHeight = await page
    .locator('.hero')
    .evaluate((el) => el.getBoundingClientRect().height);
  const zoom = Math.min(1, Number((630 / heroHeight).toFixed(3)));
  await page.addStyleTag({ content: `html { zoom: ${zoom}; }` });
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(root, 'public', 'og.png') });
  written.push(`../og.png (zoom ${zoom} to fit ${Math.round(heroHeight)}px hero)`);

  await browser.close();

  console.log(`captured ${written.length} image(s):`);
  for (const file of written) console.log(`  ✔ ${file}`);

  if (pageErrors.length > 0) {
    console.error(`\n✖ the page reported ${pageErrors.length} error(s) while rendering:`);
    for (const err of pageErrors.slice(0, 5)) console.error(`  ${err}`);
    process.exit(1);
  }
  console.log('\n✔ hydrated with no page errors.');
} catch (err) {
  if (String(err.message).includes('Executable doesn')) {
    console.error(
      '✖ Chromium is missing — run: pnpm --filter marketing exec playwright install chromium',
    );
  } else {
    console.error(`✖ ${err.message}`);
  }
  process.exitCode = 1;
} finally {
  stop();
}
