// Metro config for the Expo monorepo (pnpm workspace).
// Two hazards make this necessary:
//  1. The library package's devDependencies (react-native, react) can diverge
//     from the app's versions; Metro follows the workspace symlink into
//     packages/radix-ui-themes-native and would happily bundle those older
//     nested copies (this caused the bridgeless "PlatformConstants" crash).
//  2. Even for the SAME react-native version, pnpm materializes one physical
//     copy PER distinct peer-dependency set. If two workspace packages resolve
//     different peer hashes (e.g. @types/react 19.1 vs 19.2), the app and the
//     linked library import two different RN instances -> double-initialized
//     runtime (Animated / ReactFabric TypeErrors). Root pnpm.overrides keep the
//     peers aligned; the resolveRequest guard below makes it structurally
//     impossible either way.
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

// Quarantine known-bad legacy copies in the pnpm store.
config.resolver.blockList = [
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react-native@0\\.73`),
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react@18`),
  new RegExp(`node_modules[/\\\\]\\.pnpm[/\\\\]react-test-renderer@18`),
];

// Singleton guard: every react / react-native import from ANY file in the
// workspace resolves to the app's copy.
const appReact = require.resolve('react', { paths: [projectRoot] });
const appReactNative = require.resolve('react-native', { paths: [projectRoot] });
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName === 'react-native') {
    return {
      type: 'sourceFile',
      filePath: moduleName === 'react' ? appReact : appReactNative,
    };
  }
  if (moduleName.startsWith('react-native/')) {
    // Deep import: resolve it from inside the app's react-native package so
    // the walk can only ever touch that copy.
    return context.resolveRequest(
      { ...context, originModulePath: appReactNative },
      moduleName,
      platform
    );
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
