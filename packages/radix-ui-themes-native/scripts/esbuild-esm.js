const esbuild = require('esbuild');
const path = require('path');

esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../src/index.ts')],
  bundle: true,
  outfile: path.resolve(__dirname, '../dist/esm/index.js'),
  platform: 'neutral',
  target: ['es2020'],
  format: 'esm',
  sourcemap: true,
  minify: true,
  treeShaking: true,
  external: ['react', 'react-native', 'expo'],
});
