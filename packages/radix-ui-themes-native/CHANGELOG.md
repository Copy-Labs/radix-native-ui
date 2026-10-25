# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- `BottomSheet.Scrollable` nested-scroll coordination (iOS sheet model): inside a scroll zone, a **downward** pull while the content is already at the top now hands the gesture over to the sheet mid-gesture — so drag-to-dismiss and lower-snap dragging work directly from a list, while all other in-zone drags keep scrolling normally. The handover is jump-free (the sheet treats the cumulative drag distance at takeover as its origin, not zero), and the at-top check uses instantaneous velocity plus a bounce tolerance, so mixed scroll-then-pull gestures and iOS rubber-band do the right thing.

## [0.1.8] - 2026-10-25

### Added
- `BottomSheet.Scrollable`: a scroll region for use inside `BottomSheet.Content`. The 0.1.7 drag-anywhere steal captured every vertical gesture on the sheet, which would have made a plain `ScrollView` in the content unscrollable — touches starting inside `Scrollable` are now exempt from the gesture steal (they scroll the content), while everything outside the zone keeps sheet-wide dragging. Extends all `ScrollView` props.

## [0.1.7] - 2026-10-25

### Fixed
- `BottomSheet`: drag now works from anywhere on the sheet, not just the handle and inert text areas. Interactive children (`Button`, `BottomSheet.Close`, `TextField`, pressable rows…) claimed the touch on press-down and the sheet never negotiated them off, so gestures starting over controls did nothing. The pan responder now also participates in the capture phase for vertical-dominant moves: a vertical drag steals the gesture from the pressed child (dismissing the press), while a tap without vertical movement still fires `onPress`. Note: avoid embedding a scrollable region directly inside `BottomSheet.Content` — the sheet captures all vertical gestures.

## [0.1.6] - 2026-10-25

### Added
- `BottomSheet`: **functional snap points**. `snapPoints` on `BottomSheet.Root` now actually works with multiple entries — the sheet drags up/down between resting heights, settles on the nearest snap on release (velocity-aware), haptic-feedbacks on snap change, and dismisses when dragged below the smallest snap or flicked down. New `onSnapPointChange?: (index: number) => void` fires whenever the sheet settles (including open). `BottomSheet.Content`'s `snapPoints` prop is a deprecated no-op (snap points are owned by `Root`).

### Fixed
- `BottomSheet`: flicker on re-open after closing via `Overlay` press, `BottomSheet.Close`, or `BottomSheet.Action`. Those paths set `open=false` instantly, leaving `translateY` at the open position, so the Modal's first frame on the next open painted the sheet fully visible before it jumped down and re-animated. Closing is now consistently animated (`requestClose` runs the dismiss spring before unmounting the Modal, matching the swipe path), and `translateY` is reset to the hidden offset whenever the sheet transitions to closed, so even controlled instant-closes re-open cleanly.

## [0.1.5] - 2026-10-25

### Fixed
- `Badge`: runtime crash `Text strings must be rendered within a <Text> component` when given non-string text children (numbers, or mixed arrays like `{count} messages`). Only pure-string children were previously wrapped in `Text`; numbers and arrays containing text primitives are now wrapped too. Element children (e.g. `<Badge><Text/></Badge>`, icon+label arrays) keep rendering as before.

## [0.1.4] - 2026-10-25

### Added
- `FancyList`: new `ListBackend` prop — a swappable virtualization engine (any FlatList-compatible component such as LegendList or FlashList v2) plus `backendProps` for backend-specific options like `estimatedItemSize`. Defaults to `FlatList`, so the library keeps its zero-dependency positioning while apps with very large lists opt into true cell recycling without losing FancyList's styling, dividers, or the `renderItem` contract.

### Fixed
- `Skeleton` pulse no longer interpolates background *colors* (which silently forced JS-thread animation and, with the native driver flag set, risked runtime warnings). It now pulses `opacity` over a static theme-gray fill — visually equivalent, fully native-driver, and it follows `grayColor`/dark mode like before.

### Internal
- Removed the 13 hand-written `React.memo` comparators (Button, Box, Flex, Grid, Inset, Container, and the typography family) in favor of the default shallow prop comparison. Enumerated comparators go stale whenever a prop is added (silent skipped re-renders); the default is equally fast and always correct.
- Package now declares `"sideEffects": false` so web bundlers can tree-shake unused components.
- Performance guide: honest bundle-size section and a new "Rendering Cost Model" section (memo/stability guidance, context semantics, known scale ceilings).

## [0.1.3] - 2026-10-25

### Changed
- **`size` prop unified around numeric canonical.** `TextField`, `TextArea`, `Checkbox`, `CheckboxGroup`, `CheckboxCards`, `Radio`, `RadioGroup`, `RadioCards`, `Switch`, `Slider`, `Accordion`, and `Table` previously accepted *only* string sizes (`size="2"`) while the rest of the library used numbers (`size={2}`). They now accept both (`SizeInput<1 | 2 | 3>`); numeric is the documented canonical form everywhere, and string support will be deprecated in a future release.
- **All `gap` and `padding` props on layout primitives now mean pixels.** `Stack` (incl. `VStack`/`HStack`) previously interpreted `gap`/`padding` as `theme.space` scale indices (so `<Stack gap={3}>` = 12px) while `Flex` and `Grid` treated the same numbers as pixels (`<Flex gap={3}>` = 3px) — identical props, identical types, quadrupled spacing. `Stack` now uses pixels like its siblings; pass pixel values directly (the old scale was 1→4, 2→8, 3→12, 4→16, 5→24, 6→32, 7→40, 8→48, 9→64). `Separator` margin, `Spacer` size, and `Inset` `paddingSize` intentionally remain scale-index APIs. `StackGap` is now an alias for `number`.
- Typography `color` props (`Text`, `Heading`, `Code`, `Em`, `Strong`, `Blockquote`, `Link`, icons) now accept the new `ColorValue` type: a theme color token with autocomplete, or any CSS color string — matching what the runtime already supported. `CheckboxGroup.color` was tightened from `string` to `Color` (it forwards to Checkbox accent tokens).
- `Tooltip` radius props now use the shared `RadiusSize` type instead of inline unions.

### Fixed
- `Skeleton` pulse colors were hardcoded hex values (`#E5E7EB`/`#D1D5DB`) that ignored the theme: it now interpolates between steps 3 and 5 of the active gray ramp, so it follows `grayColor` selection and dark mode like every other component.

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
