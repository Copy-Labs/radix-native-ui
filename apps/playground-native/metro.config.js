// Metro config for the Expo monorepo (pnpm workspace).
// The library package pins react-native 0.73 + react 18 as devDependencies
// (for its Jest pipeline). Metro follows the workspace symlink into
// packages/radix-ui-themes-native, where those nested copies would shadow the
// app's react-native 0.81 — causing the bridgeless "PlatformConstants could not
// be found" invariant at runtime. We block the library's node_modules and let
// nodeModulesPaths resolve every react/react-native import from the app tree.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole workspace so the linked radix-native-ui package is served.
config.watchFolders = [workspaceRoot];

// Resolve dependencies from the app first, then the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Never let the library's dev-dependency copies enter the bundle graph.
config.resolver.blockList = [
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react-native@0\\.73`),
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react@18`),
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react-test-renderer@18`),
];

module.exports = config;
