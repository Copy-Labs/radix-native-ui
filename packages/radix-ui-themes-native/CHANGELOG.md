# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-10-25

### Fixed
- `exports` map now points `types` at the real emitted declaration files (`index.d.mts`/`index.d.cts`) instead of the non-existent `index.d.ts`. Consumers using `moduleResolution: node16`/`nodenext` previously resolved no types.
- `FancyList`: relaxed the `T extends object` data constraint (primitives like `string[]` are valid) and guarded the default key extractor so `'id' in item` can no longer throw on primitive items.

### Added
- `Box`: new `flex` prop (maps to React Native's style `flex`), previously silently ignored.

### Internal
- Test toolchain aligned with the versions consumers actually run: `react-native`, `react`, `react-test-renderer`, `@react-native/babel-preset` and `@testing-library/react-native` bumped to match the playground (RN 0.81.5 / React 19.1). This removes the duplicate-React-Native hazard Metro had to work around in 0.1.1.
- New test suites for theme construction (`createTheme`: defaults, scaling, radius multipliers, color config) and color helpers (mode routing, contrast/dark-text rules, variant and high-contrast palettes, hover/active/disabled states). Suite count: 10 → 55 tests.

## [0.1.1] - 2026-10-22

### Changed
- Repositioned the library as "inspired by Radix Themes" rather than a port, clarifying that component APIs are native-first while the theme system and design tokens remain compatible with web Radix Themes.
- Unified all documentation and package references to the canonical package name `radix-native-ui`. The previously documented `@radix-ui/themes-native` was never published to npm and broke installation for new users.
- Fixed root `build:pkg` / `build:radix-native` scripts which filtered on a non-existent package name; they now target `packages/radix-ui-themes-native` directly.
- Migrated the repo to a real pnpm workspace (adds `pnpm-workspace.yaml` and `turbo.json`); the playground app now consumes this package via `workspace:*` instead of yalc. The `build` script now produces the publishable tsdown bundle (CJS + ESM + types).

### Fixed
- Restored the Jest test pipeline, which had been unable to run: renamed `jest.config.js` to `jest.config.cjs` (package is ESM), fixed `transformIgnorePatterns` for the pnpm `.pnpm/` store layout, added `babel.config.cjs` with `@react-native/babel-preset` (pinned to match RN 0.73), removed stale module mocks, and corrected the `useTheme` suite's filename (`.tsx`), imports, and assertions. All 10 tests now pass.

### Added
- `BottomSheet` and `Toast` documented in the overlays component lists (READMEs).
- Migration note clarifying the inspired-by positioning and native-only components.

## [0.1.0-alpha.0] - 2026-02-25

### Added
- Initial alpha release for testing
- Radix Themes components for React Native and Expo
- Full theming system with light/dark mode support
- 30+ UI components including:
  - Layout: Box, Flex, Grid, Container, Inset
  - Typography: Text, Heading, Strong, Em, Code, Kbd, Link
  - Forms: Button, IconButton, TextField, TextArea, Checkbox, Radio, Switch, Select, Slider
  - Data Display: Avatar, Badge, Callout, Card, DataList, Progress, Spinner, Table
  - Navigation: Tabs, TabNav, SegmentedControl
  - Overlays: Dialog, AlertDialog, Popover, Tooltip, DropdownMenu, ContextMenu, Toast, Portal
  - Disclosure: Accordion

### Known Issues
- This is an alpha release for early testing
- Some components may have bugs or missing features
- API may change before stable release
