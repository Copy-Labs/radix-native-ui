# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`FloatingTabBar`** — new navigation component: a floating, elevated bottom tab bar (iOS floater / Material 3 style) with the usual compound + controlled API (`Root` + `Item`, `defaultValue` for uncontrolled bars). One **shared accent pill** owned by the Root slides between item centers — on taps and under the finger: `dragToSelect` (default true) captures horizontal-dominant drags (the Sidebar responder model, so taps and page scrolls are untouched), the pill tracks the finger with a velocity-based liquid stretch, haptic-ticks through item zones, and the release commits the hovered tab (Apple's "linear" tab-bar gesture) — all opacity/transform on the native driver, zero new dependencies (no Reanimated). Themed icons are cloned with state-aware size/color, numeric or custom `badge` bubbles, `size` 1-4, `elevation` shadows, `radius`/`inset` control over the floating surface, haptics, and full tab-role accessibility. Pure geometry helpers (`detectTabZone`, `clampPillCenter`, `pillTranslateFor`) with tests. Playground demo (incl. a drag-to-select section), docs page, and navigation entry included.
- Playground: **AI Agent example is now a full app shell built on `Sidebar`** (`app/examples`) — the drawer carries the agent identity header, a New-conversation action, conversation history and workspace navigation; three nested pages (Chats / Agents / Settings) render inside the sidebar layout. The mock agent runtime lives above the pages so a streamed answer keeps flowing across navigation, and the Settings page switches the drawer **variant live** (overlay / push / under / reveal) so one example demonstrates all four. The pages make use of Card, Avatar, Badge, Spinner, Switch, Select, Slider, SegmentedControl, TextArea, TextField, DataList, Progress and Callout; all responses remain mocked on-device.
- `Sidebar`: the `under` variant's drawer now has its own animation — it **scales up** (0.9 → 1) as the page slides aside to unmask it, so it reads as rising toward the viewer from beneath the page instead of being a passive background. Progress-derived like every other channel, so drags scrub it and the native driver stays on. New `contentScaleFor` geometry helper with tests.
- `Sidebar`: fourth variant, `reveal` (Material style) — the drawer stays statically anchored beneath the page while the page slides aside **and recedes**: scaling down to 0.92 under a 32%-opacity scrim, all scrubbed by the same gesture progress as the drawer (transforms only, native driver intact). The scrim is a child of `Sidebar.Main`, so it never covers the exposed drawer and taps on it close the sidebar. Full-page and inline demos, docs, and `pageScaleFor` geometry tests included.

### Fixed
- `DropdownMenu`: **nested submenus actually work** — `SubContent` used to render unconditionally (every submenu was permanently visible at once) and every `Sub` shared a hardcoded `'submenu'` id, so triggers could not tell their own flyout apart. Each `Sub` now mints a unique id via `useId` through a nested context, its `SubContent` mounts only while that id is the open submenu, the `SubTrigger` highlights (and brightens its chevron) while open, opening one submenu collapses the others, and closing the menu resets submenu state. `SubTrigger`/`SubContent` now throw a helpful error outside a `Sub`, and the trigger fires a single haptic instead of two. Docs Sub section rewritten with a working example, plus a "Menu with Submenus" playground demo.
- `BottomSheet`: the sheet now respects the safe area and no longer flickers on open — its `Modal` is `statusBarTranslucent` (previously iOS animated the status-bar region when the sheet appeared, reading as a flicker), and a new `safeAreaInsets` prop on `BottomSheet.Root` pads the content away from the home indicator / gesture bar (bottom, always) and the status bar / notch (top, only when the sheet is tall enough to reach them, so a half-height sheet gets no gap above its handle). Bottom-sheet footer buttons on a near-full-height sheet no longer hide behind the home indicator. Dependency-free default (`StatusBar.currentHeight` on Android, else 0); apps pass `useSafeAreaInsets()`. Pure `sheetTopPadding` helper with tests, docs Safe Area section, and the demo wiring included.
- `Toast`: **stack gaps are now accurate and uniform.** The per-toast offset was `marginBottom: index * (gap + 8)` — compounding the configured `gap` with a hardcoded `+ 8` per stack position, so the spacing grew (and shrank on dismiss) instead of staying equal. It's now a plain `marginTop: index === 0 ? 0 : gap` on each toast, matching the `gap` config exactly.
- `Toast`: the **top stack is no longer inverted** — the newest toast now sits nearest the edge it expands from (`bottom` newest at the bottom, `top` newest at the top) instead of the oldest hogging the edge slot.
- `Toast`: **nothing pops out of existence any more** — auto-dismiss, the close button, `toast.hide()`, `toast.hideAll()`, and `maxVisible` eviction all play the exit animation. Previously `hide`/`hideAll`/overflow removed the toast from state instantly (overflow even `slice`d the oldest off with no animation). A new `leaving` flag drives an animated removal, and a pure `markEvictionOnOverflow` helper (with tests) only counts active toasts toward the limit.
- `Toast`: **safe dismissal races** — if the auto timer, close button, and a swipe collide, the exit animation now plays exactly once and each callback fires at most once (previously a manual dismiss racing the timer double-fired `onDismiss`/`onAutoClose` and stacked two exit animations). A dismissal that starts during the enter spring stops it first instead of fighting it for the same animated values.
- `Toast`: **countdown pauses while held** — pressing and holding a toast freezes its timer and releasing resumes with the remaining time (a toast that expired while held dismisses on release). Previously the timer ran out under the finger mid-swipe and the toast vanished from under the gesture.
- `Toast`: **swipe no longer captures vertical drags** — the responder grants on horizontal-dominant moves only and snaps back on gesture termination, so page scrolls pass through and a stolen swipe can’t leave a toast dragged aside.
- `Toast`: the swipe responder and timers now read the latest `toast`/`onDismiss` through a ref, so an in-flight swipe is no longer cancelled by a stale-render closure when a sibling toast enters or leaves the stack.
- `Sidebar`: the `overlay` drawer now respects the safe area and no longer flickers when opened — the Modal is `statusBarTranslucent` (previously iOS animated the status-bar region when the Modal appeared, which read as a flicker on every trigger), and a new `safeAreaInsets` prop on `Sidebar.Root` pads the overlay drawer away from the status bar / home indicator while its background still bleeds edge-to-edge. Without the prop the default is `StatusBar.currentHeight` on Android (Expo edge-to-edge) and 0 on iOS, keeping the library dependency-free; apps pass `useSafeAreaInsets()` for exact notch/Dynamic Island insets. Docs Safe Area section and the AI Agent example wiring included.

## [0.1.10] - 2026-10-25

### Added
- `Sidebar`: a **unified three-variant model** via `variant?: 'overlay' | 'push' | 'under'` (default `overlay`).
  - `overlay`: the drawer slides in **on top** of a still page through a `Modal` behind a fading dim.
  - `push`: the page slides aside while the drawer rides **on top** of it, with a fading `Sidebar.Backdrop` over the shifted page (Android DrawerLayout style).
  - `under` (new): the drawer is statically anchored beneath the page while the page — rendered on top — slides aside to unmask it, so it genuinely emerges from underneath. No scrim.
  - A fourth variant, `reveal` (Material-style page scale-down), is deferred behind a `TODO(next)` until these three are device-verified.
- `Sidebar`: single-source-of-truth animation (`slide`) with every other channel — page shift and all dims — derived through `Animated.interpolate`, so drags, timings and springs move the whole composition in lockstep on the native driver. Shared momentum-swipe responder (`createSidebarResponderHandlers`) gives all variants drag-to-open/close with velocity projection, and horizontal-dominant capture so swiping across a scrollable page drives the drawer instead of fighting it.
- `Sidebar`: exported pure geometry helpers (`sidebarSlideRange`, `slideProgress`, `progressInterpolation`, `mainShiftFor`, `sidebarBaseLeft`, `projectSwipeSettle`) with a unit test suite.

### Fixed
- `Sidebar`: **runtime crash** (`ReferenceError: Cannot access 'globalHaptics' before initialization`) — a `useMemo` dependency array referenced `globalHaptics` several lines above its `const` declaration, a temporal-dead-zone hit on every render. The hooks are now hoisted above all memo/effect closures that use them.
- `Sidebar`: `push` variant no longer shoves the page off-screen or freezes it — the three previously-competing state machines (a Root swipe-close that never committed state, a `skipAnimationRef` that was never cleared, and two overlapping `PanResponder`s) are collapsed into the one model above, and the page now shifts by exactly the drawer width.
- `Sidebar`: right-anchored drawers no longer animate backwards — the `slide`→progress interpolation now keeps an ascending `inputRange` on both sides so the page shift and dim track the drawer correctly.
- `Sidebar`: the open drawer now rests flush with the screen edge (a stray 40px "peek" offset was clipping the overlay drawer and leaving a gap beside the page).
- `Sidebar`: the `under` drawer is actually visible — the page now slides aside to reveal it instead of staying put and hiding it underneath.
- `Sidebar`: overlay Modal no longer collapses on iOS — `Sidebar.Overlay` is in-flow (`flex: 1`) again instead of absolutely positioned, so the transparent Modal gets a full-screen content area and the dim/drawer anchor correctly (same pattern as `BottomSheet.Overlay`).
- `Sidebar`: overlay swipe-to-open works — while closed the Modal (and with it the only responder) was unmounted, so a page swipe had nowhere to land. `Sidebar.Root` now wraps the page in an invisible gesture layer for the overlay variant, and granting a swipe mounts the Modal mid-drag so the drawer follows the finger.
- `Sidebar`: trigger open → close → re-open no longer dead-ends — native-driver animations never write back to the JS `Animated.Value`, so the second cycle animated from a stale value (zero-length close pop, re-open stuck off-screen). Every button-driven transition now re-anchors the value to its visual start position first and the overlay open waits for the Modal's native tree to mount (the `BottomSheet` 50 ms pattern). A drag that settles back to the same state no longer strands the in-flight flag that makes the next toggle skip its animation.
- `Sidebar`: `Sidebar.Backdrop` disables pointer events while closed, so an invisible full-screen dim can no longer intercept taps meant for the page.
- `Sidebar`: moved the conditional hook out of `Sidebar.Container` (its `PanResponder` was created after an early return for the overlay variant), and dropped two dead required context fields (`slideClosed`/`slideOpen`) that were never provided.
- Demo pages: the sidebar variant demos' header no longer renders the title on top of the back arrow (a nested `row-reverse` + `space-between` row inside `PageHeader` misanchored the title).

### Docs
- Added `docs/components/overlays/sidebar.mdx` (variants, anatomy, API reference, gestures, controlled state) and registered it in the Overlays navigation.

## [0.1.9] - 2026-10-25

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
