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
dark) and the ThemeLab. Run `build:site` first. It needs the browser once:

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
- **Not components:** the page chrome (nav, hero copy, section headings, footer)
  and the phone bezel. `src/styles/global.css` reproduces the library's tokens
  verbatim for that chrome, so it matches the rendered output; the bezel is the
  one purely decorative element.
- **Browser deviations,** stated on the page itself: gestures use pointer events
  instead of native responders, and haptic calls fall silent (the stub alias).
  The library's `fontFamily: 'System'` is not a valid CSS value, so the browser
  discards it and text inherits the page's body stack — which is why the rendered
  headings match the chrome around them.
- **Pre-hydration:** RNW injects its base stylesheet on the client, so the
  prerendered HTML is styled by inline styles only; a couple of details (the
  `Select.Value` label) appear once hydration runs.

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
