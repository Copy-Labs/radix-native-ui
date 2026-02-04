# Radix Themes React Native Conversion Plan

## Executive Summary

This document outlines the comprehensive plan to convert **Radix Themes** from a web-only React component library to support **React Native** and **Expo** for mobile application development.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Component Mapping](#component-mapping)
4. [Implementation Phases](#implementation-phases)
5. [Technical Specifications](#technical-specifications)
6. [Risks and Mitigation](#risks-and-mitigation)
7. [Success Criteria](#success-criteria)

---

## Project Overview

### Current State
- **Package**: `@radix-ui/themes` v3.2.1
- **Platform**: Web-only (React DOM)
- **Architecture**: CSS-based styling with PostCSS
- **Components**: 60+ components
- **Dependencies**: Radix UI primitives, classnames, react-remove-scroll-bar

### Target State
- **Package**: `@radix-ui/themes-native` (or similar)
- **Platform**: React Native + Expo
- **Architecture**: JavaScript StyleSheet-based styling
- **Components**: Feature parity with web version
- **Dependencies**: React Native primitives, cross-platform compatible utilities

---

## Architecture Decisions

### 1. Styling Strategy

#### Option A: Native StyleSheet (Recommended)
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '$gray900',
  },
});
```

**Pros**:
- Native performance
- No additional dependencies
- Full TypeScript support
- Easy debugging with React Native debugger

**Cons**:
- No CSS class name compatibility
- Different syntax than web version

#### Option B: Tamagui
- Pros: Excellent RN support, compiler optimization, shared code
- Cons: Learning curve, additional dependency

#### Option C: NativeWind (Tailwind)
- Pros: Familiar syntax for web developers
- Cons: Runtime overhead, limited theme customization

**Decision**: **Option A - Native StyleSheet** for maximum control and performance

---

### 2. Component Primitive Strategy

#### Web Components → Native Components Mapping

| Web Element | React Native Component | Usage |
|-------------|------------------------|-------|
| `div` | `View` | Container layout |
| `span` | `Text` | Inline text |
| `button` | `TouchableOpacity` | Interactive button |
| `input` | `TextInput` | Text input field |
| `img` | `Image` | Image display |
| `a` | `Pressable` | Link-like interaction |
| `ul/ol` | `View` + FlatList | Lists |
| `table` | `View` + ScrollView | Tabular data |
| `select` | `Picker` or custom | Dropdown selection |

---

### 3. Theming System

#### Current Web Theming
- CSS custom properties (`:root { --color-gray-900: #161616; }`)
- CSS classes for semantic styling
- Responsive breakpoints via media queries

#### Native Theming Strategy
```tsx
// theme.ts
export const theme = {
  colors: {
    gray: {
      900: '#161616',
      100: '#f4f4f5',
      // ...
    },
    // ...
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    // ...
  },
  radii: {
    1: 3,
    2: 5,
    // ...
  },
  fonts: {
    body: {
      fontFamily: 'System',
      fontWeight: '400',
      // ...
    },
    // ...
  },
};
```

---

### 4. Radix Primitives Replacement

| Web Package | Native Alternative | Notes |
|-------------|-------------------|-------|
| `@radix-ui/react-slot` | `@radix-ui/react-slot` (RN compatible) | Use community port |
| `@radix-ui/react-dialog` | `@radix-ui/react-dialog` (RN port) | Modal dialogs |
| `@radix-ui/react-dropdown-menu` | Custom implementation | Native menus differ |
| `@radix-ui/react-tabs` | `@radix-ui/react-tabs` (RN port) | Tab navigation |
| `@radix-ui/react-tooltip` | Custom implementation | Tooltips need positioning |
| `@radix-ui/react-popover` | Custom implementation | Popovers need anchor positioning |
| `@radix-ui/react-select` | Custom or `@react-native-picker/picker` | Native picker integration |
| `@radix-ui/react-slider` | Custom implementation | Range sliders |

---

### 5. Directory Structure

```
packages/
└── radix-ui-themes-native/
    ├── src/
    │   ├── components/
    │   │   ├── primitives/
    │   │   │   ├── View.tsx
    │   │   │   ├── Text.tsx
    │   │   │   ├── Pressable.tsx
    │   │   │   └── TouchableOpacity.tsx
    │   │   ├── layout/
    │   │   │   ├── Box.tsx
    │   │   │   ├── Flex.tsx
    │   │   │   ├── Grid.tsx
    │   │   │   ├── Container.tsx
    │   │   │   └── Inset.tsx
    │   │   ├── typography/
    │   │   │   ├── Text.tsx
    │   │   │   ├── Heading.tsx
    │   │   │   ├── Strong.tsx
    │   │   │   ├── Em.tsx
    │   │   │   ├── Code.tsx
    │   │   │   └── Kbd.tsx
    │   │   ├── forms/
    │   │   │   ├── Button.tsx
    │   │   │   ├── TextField.tsx
    │   │   │   ├── Checkbox.tsx
    │   │   │   ├── Radio.tsx
    │   │   │   ├── Switch.tsx
    │   │   │   ├── Select.tsx
    │   │   │   └── Slider.tsx
    │   │   ├── overlays/
    │   │   │   ├── Dialog.tsx
    │   │   │   ├── Popover.tsx
    │   │   │   ├── Tooltip.tsx
    │   │   │   ├── DropdownMenu.tsx
    │   │   │   └── ContextMenu.tsx
    │   │   ├── data-display/
    │   │   │   ├── Avatar.tsx
    │   │   │   ├── Badge.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Table.tsx
    │   │   │   └── DataList.tsx
    │   │   ├── feedback/
    │   │   │   ├── AlertDialog.tsx
    │   │   │   ├── Progress.tsx
    │   │   │   └── Spinner.tsx
    │   │   ├── navigation/
    │   │   │   ├── Tabs.tsx
    │   │   │   ├── TabNav.tsx
    │   │   │   └── SegmentedControl.tsx
    │   │   └── utilities/
    │   │       ├── VisuallyHidden.tsx
    │   │       ├── AspectRatio.tsx
    │   │       │   └── ScrollArea.tsx
    │   ├── theme/
    │   │   ├── tokens.ts
    │   │   ├── colors.ts
    │   │   ├── typography.ts
    │   │   └── spacing.ts
    │   ├── hooks/
    │   │   ├── useColorScheme.ts
    │   │   ├── useResponsive.ts
    │   │   └── useTheme.ts
    │   ├── utils/
    │   │   ├── mapProps.ts
    │   │   ├── extractProps.ts
    │   │   └── classNames.ts
    │   ├── index.ts
    │   └── types.ts
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

---

## Component Mapping

### Layout Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Box | View wrapper | Low | P1 |
| Flex | Flex wrapper | Low | P1 |
| Grid | View with flex wrap | Medium | P2 |
| Container | View with maxWidth | Low | P2 |
| Inset | Padding wrapper | Low | P2 |
| Section | View with semantic meaning | Low | P3 |

### Typography Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Text | Text wrapper | Low | P1 |
| Heading | Text with styles | Low | P1 |
| Strong | Bold Text | Low | P1 |
| Em | Italic Text | Low | P2 |
| Code | Monospace Text | Low | P2 |
| Kbd | Keyboard style | Low | P3 |
| Blockquote | Styled Text | Low | P3 |
| Link | Styled Pressable | Low | P2 |

### Form Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Button | TouchableOpacity | Medium | P1 |
| TextField | TextInput | Medium | P1 |
| Checkbox | Custom (checked state) | High | P1 |
| Radio | Custom (selected state) | High | P1 |
| Switch | Custom toggle | Medium | P1 |
| Select | Picker/Custom | High | P2 |
| Slider | Custom range input | High | P2 |
| TextArea | TextInput multiline | Medium | P2 |

### Overlay Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Dialog | Modal/Portal | High | P1 |
| Popover | Popover overlay | Very High | P2 |
| Tooltip | Tooltip overlay | Very High | P2 |
| DropdownMenu | ActionSheet/Picker | High | P2 |
| ContextMenu | ContextMenu overlay | High | P2 |

### Data Display Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Avatar | Image with fallback | Medium | P1 |
| Badge | Text/badge style | Low | P1 |
| Card | View with styles | Medium | P1 |
| Table | ScrollView with rows | Medium | P2 |
| DataList | FlatList/ScrollView | Medium | P2 |

### Navigation Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| Tabs | TabView/TabBar | High | P1 |
| TabNav | Tab navigation | Medium | P2 |
| SegmentedControl | SegmentedControlIOS | Medium | P2 |

### Feedback Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| AlertDialog | Alert/Prompt + Modal | High | P1 |
| Progress | ProgressViewIOS | Medium | P2 |
| Spinner | ActivityIndicator | Low | P1 |

### Utility Components

| Web Component | Native Component | Complexity | Priority |
|--------------|------------------|------------|----------|
| VisuallyHidden | Accessible View | Low | P1 |
| AspectRatio | View with aspectRatio | Low | P2 |
| ScrollArea | ScrollView wrapper | Medium | P2 |
| HoverCard | Tooltip-like card | Medium | P3 |

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

#### 1.1 Project Setup
- [ ] Create new `packages/radix-ui-themes-native` directory
- [ ] Set up package.json with React Native dependencies
- [ ] Configure TypeScript for React Native
- [ ] Set up ESLint and Prettier for RN
- [ ] Create Expo demo app in `apps/playground-native`

#### 1.2 Theming System
- [ ] Migrate CSS tokens to TypeScript objects
- [ ] Create theme configuration (colors, spacing, typography)
- [ ] Implement light/dark mode support
- [ ] Create theme context provider
- [ ] Build responsive utilities

#### 1.3 Primitives Layer
- [ ] Create View primitive wrapper
- [ ] Create Text primitive wrapper
- [ ] Create Pressable/Touchable wrappers
- [ ] Implement Slot component (RN-compatible)
- [ ] Build Portal component for modals

**Deliverables**:
- Working Expo playground app
- Complete theming system
- Base primitive components

---

### Phase 2: Core Components (Weeks 5-10)

#### 2.1 Layout Components
- [ ] Box
- [ ] Flex
- [ ] Grid (simplified)
- [ ] Container
- [ ] Inset

#### 2.2 Typography Components
- [ ] Text
- [ ] Heading
- [ ] Strong
- [ ] Em
- [ ] Code
- [ ] Kbd

#### 2.3 Button & Interactive
- [ ] Button
- [ ] IconButton

**Deliverables**:
- 15+ core components implemented
- Playground demo pages for each component
- Unit tests for all components

---

### Phase 3: Form Components (Weeks 11-16)

#### 3.1 Input Components
- [ ] TextField
- [ ] TextArea

#### 3.2 Selection Components
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Select (custom implementation)

#### 3.3 Range Components
- [ ] Slider

**Deliverables**:
- 7 form components with full accessibility
- Form validation examples
- Input accessibility documentation

---

### Phase 4: Overlay Components (Weeks 17-22)

#### 4.1 Modal Components
- [ ] Dialog (with Portal)
- [ ] AlertDialog

#### 4.2 Popover Components
- [ ] Popover
- [ ] Tooltip

#### 4.3 Menu Components
- [ ] DropdownMenu
- [ ] ContextMenu

**Deliverables**:
- 5 overlay components
- Proper accessibility for modals
- Animation support for overlays

---

### Phase 5: Data Display & Navigation (Weeks 23-28)

#### 5.1 Data Display
- [ ] Avatar
- [ ] Badge
- [ ] Card
- [ ] Table
- [ ] DataList
- [ ] Spinner
- [ ] Progress

#### 5.2 Navigation
- [ ] Tabs
- [ ] TabNav
- [ ] SegmentedControl

**Deliverables**:
- 10+ data display components
- Navigation components
- Accessibility documentation

---

### Phase 6: Polish & Testing (Weeks 29-32)

#### 6.1 Performance Optimization
- [ ] Memoize components with React.memo
- [ ] Optimize re-renders with proper key props
- [ ] Implement VirtualizedList for large lists
- [ ] Add performance benchmarks

#### 6.2 Testing
- [ ] Unit tests for all components (Jest + React Testing Library)
- [ ] Type checking verification
- [ ] Accessibility testing (A11y)
- [ ] E2E testing with Detox

#### 6.3 Documentation
- [ ] Component API documentation
- [ ] Theming guide
- [ ] Migration guide from web
- [ ] Example apps

**Deliverables**:
- Full test coverage (>80%)
- Complete documentation
- Performance benchmarks

---

## Technical Specifications

### Package.json Configuration

```json
{
  "name": "@radix-ui/themes-native",
  "version": "0.1.0",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/cjs/index.d.ts",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.70.0",
    "expo": ">=48.0.0"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "react-native-modal": "^13.0.1"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-native",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Theme Configuration Interface

```typescript
interface ThemeTokens {
  colors: ColorTokens;
  space: SpaceTokens;
  radii: RadiusTokens;
  fonts: FontTokens;
  fontSizes: FontSizeTokens;
  fontWeights: FontWeightTokens;
  lineHeights: LineHeightTokens;
  shadows: ShadowTokens;
}

interface ColorScale {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  dark: {
    1: string;
    // ...
  };
}

interface Theme {
  light: ThemeTokens;
  dark: ThemeTokens;
  accentColor: ColorScale;
}
```

### Component Props Pattern

```typescript
import type { MarginProps, LayoutProps, SpacingProps } from './props';

interface ButtonProps extends MarginProps, LayoutProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: '1' | '2' | '3';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

---

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Radix primitives not available for RN | High | Medium | Build custom implementations for critical primitives |
| Performance issues with many components | Medium | Medium | Use React.memo, optimize re-renders, use VirtualizedList |
| Theme system complexity | Low | Low | Use TypeScript, create clear patterns, document thoroughly |
| Accessibility gaps in custom components | Medium | Medium | Follow WAI-ARIA guidelines, test with accessibility tools |
| Breaking changes in React Native updates | Low | Low | Use stable APIs, write integration tests |
| Testing complexity for native components | Medium | High | Use Detox for E2E, Jest for unit tests, prioritize critical paths |

---

## Success Criteria

### Phase Completion Criteria

| Phase | Criteria |
|-------|----------|
| Phase 1 | Theming system complete, primitives working, playground running |
| Phase 2 | 15+ core components with 100% TypeScript, unit tests passing |
| Phase 3 | All form components with keyboard/accessibility support |
| Phase 4 | Modal and overlay components with proper animation |
| Phase 5 | Data display and navigation components with documentation |
| Phase 6 | >80% test coverage, performance benchmarks established |

### Overall Success Metrics

- [ ] 100% feature parity with web Radix Themes
- [ ] All components pass TypeScript strict mode
- [ ] Performance: 60fps animations, <100ms initial render
- [ ] Accessibility: WCAG 2.1 AA compliance
- [ ] Documentation: Complete API reference and migration guide
- [ ] Tests: >80% coverage, all E2E tests passing

---

## Next Steps

1. **Immediate Actions**
   - [ ] Review and approve this plan
   - [ ] Create the new package structure
   - [ ] Set up CI/CD pipeline for the new package
   - [ ] Create initial commit with foundation components

2. **Short-term (Week 1-2)**
   - [ ] Complete project setup
   - [ ] Implement theming system
   - [ ] Create first demo components

3. **Medium-term (Month 2-3)**
   - [ ] Complete Phase 2 (Core Components)
   - [ ] Begin Phase 3 (Form Components)
   - [ ] Establish testing patterns

---

## Appendix

### A. Component Priority Matrix

```
P1 (High Priority) = Core functionality, used frequently
P2 (Medium Priority) = Important but not blocking
P3 (Low Priority) = Nice to have, can be deferred
```

### B. Dependencies to Add

```json
{
  "dependencies": {
    "react-native": "^0.73.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-modal": "^13.0.1",
    "@react-native-picker/picker": "^2.6.0"
  },
  "devDependencies": {
    "@types/react-native": "^0.73.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0",
    "detox": "^20.13.0"
  }
}
```

### C. File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Types: `PascalCASE.types.ts` (e.g., `Button.types.ts`)
- Hooks: `camelCase.hooks.ts` (e.g., `useTheme.ts`)
- Utils: `camelCase.utils.ts` (e.g., `extractProps.ts`)
- Styles: `camelCase.styles.ts` (e.g., `button.styles.ts`)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-28 | Architect | Initial plan creation |

---

**Plan Approved By**: ___________________

**Approval Date**: ___________________

**Target Completion**: 32 weeks from kickoff
