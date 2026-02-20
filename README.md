# Radix Themes Native

[![npm version](https://img.shields.io/npm/v/@radix-ui/themes-native.svg)](https://www.npmjs.com/package/@radix-ui/themes-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A React Native port of [Radix Themes](https://www.radix-ui.com/themes) - An open-source component library optimized for fast development, easy maintenance, and accessibility.**

This library brings the beautiful design system and developer experience of Radix Themes to React Native and Expo applications.

---

## Demo

📺 [Watch the demo on YouTube](https://youtube.com/shorts/sIvz3d_pAoo?feature=share)

---

## Installation

```bash
npm install @radix-ui/themes-native
# or
yarn add @radix-ui/themes-native
# or
pnpm add @radix-ui/themes-native
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-native expo
```

- `react` >= 18
- `react-native` >= 0.70
- `expo` >= 48

---

## Quick Start

Wrap your app with the `ThemeProvider` to enable theming:

```tsx
import { ThemeProvider } from '@radix-ui/themes-native';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

Now you can use any of the components:

```tsx
import { Button, Text, Flex, Card } from '@radix-ui/themes-native';

function Example() {
  return (
    <Card>
      <Flex direction="column" gap={3}>
        <Heading size={4}>Welcome</Heading>
        <Text>Build beautiful mobile apps with Radix Themes Native.</Text>
        <Button onPress={() => console.log('Pressed!')}>Get Started</Button>
      </Flex>
    </Card>
  );
}
```

---

## Available Components

### Layout

| Component | Description |
|-----------|-------------|
| `Box` | Primitive container with styling props |
| `Flex` | Flexbox layout component |
| `Grid` | Grid layout component |
| `Container` | Responsive container with max-width |
| `Inset` | Consistent padding component |

### Typography

| Component | Description |
|-----------|-------------|
| `Text` | Versatile text with size, weight, color props |
| `Heading` | Semantic heading component |
| `Strong` | Bold text styling |
| `Em` | Italic text styling |
| `Code` | Inline code styling |
| `Kbd` | Keyboard shortcut styling |
| `Link` | Pressable link component |
| `Blockquote` | Quote block styling |

### Forms

| Component | Description |
|-----------|-------------|
| `Button` | Interactive button with variants (classic, solid, soft, outline, ghost) |
| `IconButton` | Button optimized for icons |
| `TextField` | Text input component |
| `TextArea` | Multi-line text input |
| `Checkbox` | Checkbox component |
| `CheckboxGroup` | Group of checkboxes |
| `CheckboxCards` | Card-style checkbox selection |
| `Radio` | Radio button component |
| `RadioGroup` | Group of radio buttons |
| `RadioCards` | Card-style radio selection |
| `Switch` | Toggle switch component |
| `Select` | Dropdown select component |
| `Slider` | Range slider component |

### Data Display

| Component | Description |
|-----------|-------------|
| `Avatar` | User avatar with image and fallback |
| `Badge` | Status badge component |
| `Callout` | Highlighted message block |
| `Card` | Card container component |
| `DataList` | Key-value list component |
| `FancyList` | Enhanced list with styling |
| `Progress` | Progress bar component |
| `Spinner` | Loading indicator |
| `Table` | Data table component |

### Navigation

| Component | Description |
|-----------|-------------|
| `Tabs` | Tab navigation component |
| `TabNav` | Tab navigation with router support |
| `SegmentedControl` | iOS-style segmented control |

### Overlays

| Component | Description |
|-----------|-------------|
| `Dialog` | Modal dialog component |
| `AlertDialog` | Confirmation dialog |
| `Popover` | Anchored overlay with arrow |
| `Tooltip` | Tooltip component |
| `DropdownMenu` | Dropdown menu with keyboard navigation |
| `ContextMenu` | Long-press context menu |
| `Toast` | Brief notification messages |
| `Portal` | Render content at root level |

### Disclosure

| Component | Description |
|-----------|-------------|
| `Accordion` | Expandable content sections |

### Utilities

| Component | Description |
|-----------|-------------|
| `AspectRatio` | Maintain aspect ratio container |
| `ScrollArea` | Custom scrollable area |
| `VisuallyHidden` | Accessible hidden content |
| `Slot` | Merge props onto child element |

---

## Theming

### Theme Provider Options

```tsx
<ThemeProvider
  mode="light"           // 'light' | 'dark' | undefined (follows device)
  forcedMode="dark"      // Force specific mode (overrides device settings)
  accentColor="indigo"   // Accent color for components
  grayColor="mauve"      // Gray scale variant
  radius="medium"        // Border radius scale
  scaling={1}            // Scale factor for all sizes
>
  {children}
</ThemeProvider>
```

### Using Theme Hooks

```tsx
import { useTheme, useThemeMode, useThemeActions } from '@radix-ui/themes-native';

function MyComponent() {
  const theme = useTheme();
  const mode = useThemeMode();
  const { setMode, toggleMode } = useThemeActions();

  return (
    <Button onPress={toggleMode}>
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </Button>
  );
}
```

### Available Accent Colors

`amber`, `blue`, `bronze`, `brown`, `crimson`, `cyan`, `gold`, `grass`, `green`, `indigo`, `iris`, `jade`, `lime`, `mint`, `orange`, `pink`, `plum`, `purple`, `red`, `ruby`, `sky`, `teal`, `tomato`, `violet`, `yellow`

### Gray Scale Variants

`gray`, `mauve`, `olive`, `sage`, `sand`, `slate`

---

## Component Examples

### Button Variants

```tsx
<Button variant="classic">Classic</Button>
<Button variant="solid">Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Form Controls

```tsx
<Checkbox checked={checked} onCheckedChange={setChecked} />

<Switch checked={enabled} onCheckedChange={setEnabled} />

<RadioGroup value={value} onValueChange={setValue}>
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
</RadioGroup>

<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger />
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

### Layout with Flex

```tsx
<Flex direction="row" align="center" justify="between" gap={3}>
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>
```

---

## Migration from Web Radix Themes

### Key Differences

| Web | React Native |
|-----|--------------|
| `onClick` | `onPress` |
| CSS properties | StyleSheet props |
| CSS variables | Theme context values |
| `css` prop | Direct style props |

### Example Migration

```tsx
// Web Radix Themes
<Box css={{ p: '$4', bg: '$gray2' }}>
  <Button onClick={handleClick}>Click</Button>
</Box>

// Radix Themes Native
<Box padding={4} backgroundColor="gray.2">
  <Button onPress={handlePress}>Click</Button>
</Box>
```

---

## Monorepo Structure

```
radix-ui-native-kilo/
├── packages/
│   └── radix-ui-themes-native/    # Main component library
│       ├── src/
│       │   ├── components/        # All UI components
│       │   ├── theme/             # Theme system and provider
│       │   └── hooks/             # Custom hooks
│       └── package.json
├── apps/
│   └── playground-native/         # Demo/Playground app (Expo)
└── package.json                   # Monorepo root
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build:radix-native

# Run the playground app
cd apps/playground-native && pnpm start
```

---

## Documentation

For detailed component API documentation, see [`packages/radix-ui-themes-native/docs/component-api.md`](./packages/radix-ui-themes-native/docs/component-api.md).

For the original Radix Themes documentation, visit [radix-ui.com/themes/docs](https://radix-ui.com/themes/docs).

---

## Acknowledgments

This project is a React Native port of the amazing [Radix Themes](https://www.radix-ui.com/themes) library by the [WorkOS](https://workos.com) team. 

Special thanks to the original Radix UI team:
- Benoît Grélard ([@benoitgrelard](https://twitter.com/benoitgrelard))
- Vlad Moroz ([@vladyslavmoroz](https://twitter.com/vladyslavmoroz))
- Andy Hook ([@Andy_Hook](https://twitter.com/Andy_Hook))
- Lucas Motta ([@elmotta](https://twitter.com/elmotta))

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

Licensed under the MIT License, Copyright [Copy-Labs](https://github.com/Copy-Labs) &copy; 2026-present.

See [LICENSE](./LICENSE) for more information.
