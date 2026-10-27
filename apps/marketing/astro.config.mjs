import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

/**
 * The marketing site renders the *actual* library components in the browser, so
 * every `import ... from 'react-native'` inside `radix-native-ui` has to resolve
 * to `react-native-web` instead. Two things are required for that to work in
 * both the prerender (Node SSR) and client bundles:
 *
 *  1. An exact-match alias for the bare `react-native` specifier.
 *  2. `ssr.noExternal` — without it Node resolves the workspace-linked package
 *     itself and the alias is never applied, so the build dies on
 *     `Cannot find package 'react-native'`.
 */
export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    // `react-native-web` vendors React Native list/profiling code that calls
    // `global.performance` and `global.cancelAnimationFrame`. Browsers have no
    // `global`, so the client bundle throws `global is not defined` without this
    // mapping. (Harmless on the Node side, where `global === globalThis`.)
    define: { global: 'globalThis' },
    resolve: {
      // Regex matchers rather than the `'react-native$'` string form: Astro
      // merges its own aliases into this list, and the array form survives that
      // merge for the client bundle as well as the server prerender.
      alias: [
        { find: /^react-native$/, replacement: 'react-native-web' },
        // Only reachable through a guarded dynamic import in the library; the
        // web build gets an inert stub so the bundler never has to resolve it.
        {
          find: /^expo-haptics$/,
          replacement: fileURLToPath(new URL('./shims/expo-haptics.js', import.meta.url)),
        },
        // `react-native-web`'s ESM build imports `@babel/runtime` helpers, whose
        // `node` export condition points at CommonJS files. Inlined into the dev
        // SSR graph those run as ESM and die on `require is not defined`, so
        // rewrite the specifiers to the ESM copies the package also ships.
        {
          find: /^@babel\/runtime\/helpers\/([^/]+)$/,
          replacement: '@babel/runtime/helpers/esm/$1',
        },
        // Same story for `inline-style-prefixer`, which RNW imports by deep CJS
        // path (`lib/createPrefixer`); the package ships an ESM twin (`es/`).
        // Without this the prerender fails on `createPrefixer is not a function`.
        {
          find: /^inline-style-prefixer\/lib\/(.+)$/,
          replacement: 'inline-style-prefixer/es/$1',
        },
      ],
      // One React, one ReactDOM, even though `react-native-web` also resolves
      // its peers through pnpm's nested symlinks.
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      // The library must be inlined so the aliases above are applied to its
      // `react-native` imports.
      noExternal: ['radix-native-ui'],
      // `react-native-web` depends on CommonJS packages that have no ESM twin
      // (`fbjs/lib/invariant`), so aliasing can only take dev so far. Hand the
      // tree to esbuild's dep optimizer, which performs the same CJS-to-ESM
      // interop that Rollup's commonjs plugin does during the prerender. React
      // and React DOM must stay outside that chunk, otherwise the optimizer
      // bakes in a second copy and server render throws `useContext of null`.
      optimizeDeps: {
        include: ['react-native-web'],
        exclude: ['react', 'react-dom'],
      },
    },
  },
});
