# apps/marketing

The promotional site for [`radix-native-ui`](../../packages/radix-ui-themes-native).
Static Astro page whose component panels are **the real library rendering in the
browser**, not screenshots or CSS look-alikes.

## How the components render on the web

`radix-native-ui` targets React Native, so every one of its ~70 modules says
`import ... from 'react-native'`. The site aliases that specifier to
`react-native-web` at build time, which means the library's own component tree,
style math and theme context run unchanged in a browser:

```
react-native  ──alias──▶  react-native-web
expo-haptics  ──alias──▶  shims/expo-haptics.js   (no-op stub)
```

`astro.config.mjs` carries the three non-obvious settings, each commented with
the failure it prevents:

| Setting                                                                               | Failure it avoids                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Array/regex `resolve.alias` (not the string form)                                     | Astro merges its own aliases, and the string form silently stops applying to the client bundle                                                                                                          |
| `ssr.noExternal: ['radix-native-ui']`                                                 | the alias never reaches the workspace-linked package, so prerender dies on `Cannot find package 'react-native'`                                                                                         |
| `ssr.optimizeDeps: { include: ['react-native-web'], exclude: ['react','react-dom'] }` | RNW's CommonJS-only deps (`fbjs/lib/invariant`, `inline-style-prefixer`) break dev SSR on `require is not defined`; and if React is pulled into the optimized chunk, render throws `useContext of null` |

`define: { global: 'globalThis' }` is also required, but for the client rather
than the server: RNW's vendored React Native list code calls
`global.performance`, and browsers have no `global`.

The `@babel/runtime/helpers/*` → `helpers/esm/*` and
`inline-style-prefixer/lib/*` → `es/*` aliases point inlined imports at the ESM
twins those packages ship.

## The theme button is real

The nav's light/dark toggle re-themes *every* component on the page, because
every island reads the site's scheme rather than a hard-coded one:

- `src/components/react/use-site-appearance.ts` subscribes to a
  `MutationObserver` on `<html data-theme>` through `useSyncExternalStore`, so a
  theme flip propagates without any React context crossing the island boundary.
  `getServerSnapshot()` returns `'light'` — a prerender has no visitor
  preference — which costs a dark-mode visitor one painted frame inside the
  islands.
- An island that pins its own `appearance` wins over the site (that is how the
  day/night pair shows both schemes at once), and the phone's in-app Dark switch
  writes an override, the way a settings toggle would.
- The pinned dark island is wrapped in `ThemedSurface`, which paints the panel
  from `useThemeColors().background`. Light-gray text on a white CSS panel is not
  a dark mode; it is a bug.

Scroll reveals are CSS gated behind a `.js` class that an inline script adds
before first paint, so a visitor without JavaScript still reads the whole page.

## Staging notes

The demos are composed the way the library expects, which is not always the way
that looks most obvious in a browser:

- `Select.Value` must sit inside `Button.Label`. `Button` sorts its children into
  icon / label / text slots, and an arbitrary element is treated as an icon slot
  whose *children* are rendered — a bare `Select.Value` has none, so the trigger
  comes out empty. `pnpm smoke` asserts the placeholder text to keep that honest.
- The Without/With comparison stages the library card at `size={1}` and the
  hand-rolled column at matching literal sizes, so the two read at one scale and
  the difference is the code rather than the typography ramp.

## Commands

Run from this directory (install and build the package from the repo root):

```sh
pnpm dev:site    # http://localhost:4321 with HMR
pnpm build:site  # static output in dist/
pnpm preview     # serve the built dist/
pnpm smoke       # assert the build contains real renders
pnpm shots       # regenerate public/og.png + public/shots/*.png
```

Before the first run: `pnpm i && pnpm build:pkg` at the repo root, since the site
consumes `packages/radix-ui-themes-native/dist`.

`smoke` reads `dist/index.html` and checks for artefacts only a genuine render
can produce: the theme's computed ramp colors (`rgba(58,91,199,1.00)` is
indigo-11), type-scale steps (`font-size:20px;line-height:28px`), RNW atomic
class names, and panel text. It also asserts that overlay bodies are **absent**,
which is what a real React render with closed overlays does.

## Images

`pnpm shots` serves `dist/` through `astro preview`, drives headless Chromium
over it, and writes real screenshots of the rendered components — `public/og.png`
for social cards plus one PNG per gallery panel, the phone screen (light and
dark), the ThemeLab, the Without/With comparison, the pinned day/night pair, the
FAQ and the closing band. Run `build:site` first. It needs the browser once:

```sh
pnpm --filter marketing exec playwright install chromium
```

The script fails if the page logs any error while hydrating, so a regenerated
image set also re-proves the client bundle works. Gallery panels are widened to
one per row before capture, and the og image measures the hero and zooms by
exactly the factor that fits 1200x630 — both apply only to the capture page.

## What is real and what is not

- **Real components:** every panel in the gallery, the ThemeLab controls and
  samples, and the app screen inside the phone frame — all from the published
  package via `react-native-web`.
- **Not components:** the page chrome (nav, hero copy, section headings, footer),
  the phone bezel and the "Without radix-native-ui" column of the comparison —
  the last one is hand-rolled React Native on purpose. `src/styles/global.css`
  reproduces the library's tokens verbatim for the chrome, so it matches the
  rendered output; the bezel is the one purely decorative element.
- **Browser deviations,** stated on the page itself: gestures use pointer events
  instead of native responders, and haptic calls fall silent (the stub alias).
  The library's `fontFamily: 'System'` is not a valid CSS value, so the browser
  discards it and text inherits the page's body stack — which is why the rendered
  headings match the chrome around them.
- **Pre-hydration:** the library styles itself with inline objects, so the
  prerendered HTML is already correct. `StyleSheet.create` is different: it
  compiles to atomic class names whose stylesheet `react-native-web` injects only
  at hydration. That is why the hand-rolled comparison column — the only place on
  the page that uses it — is mounted with `client:load` instead of
  `client:visible`, and why the smoke test counts inline styles rather than
  trusting the CSS.

## Root-workspace side effects

`pnpm-workspace.yaml` already globs `apps/*`, so this package joins the
workspace graph:

- `pnpm publish -r` **skips it** — it is `private: true`.
- Its scripts are named `dev:site` / `build:site` **on purpose**. Turbo drives
  root `pnpm dev` and `pnpm build` off plain `dev` / `build` script names, so a
  plain name here would start an Astro server inside `pnpm dev` and build the
  site inside `pnpm build`. The suffix keeps the root commands doing exactly what
  they did before; `playground-native` stays out the same way (it has `start`,
  not `dev`).

## Deploy

Nothing is wired up. The output is plain static files (`dist/`), so any static
host works. It is intentionally not part of the published package or the
Mintlify docs.
