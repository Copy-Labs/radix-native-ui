const esbuild = require('esbuild');
const path = require('path');

esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../src/index.ts')],
  bundle: true,
  outfile: path.resolve(__dirname, '../dist/cjs/index.js'),
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: true,
  minify: true,
  treeShaking: true,
  external: ['react', 'react-native', 'expo'],
});
