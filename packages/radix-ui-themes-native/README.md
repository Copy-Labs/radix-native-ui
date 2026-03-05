# radix-native-ui

Radix Themes for React Native and Expo. A port of the popular Radix Themes component library to support mobile development with React Native.

> **Documentation**: https://copylabs.mintlify.app

## Installation

```bash
npm install radix-native-ui
# or
yarn add radix-native-ui
# or
pnpm add radix-native-ui
```

## Peer Dependencies

This package requires the following peer dependencies:

- `expo` >= 48
- `react` >= 18
- `react-native` >= 0.70

## Usage

### Basic Setup

Wrap your app with the ThemeProvider to enable theming:

```tsx
import { ThemeProvider, useTheme, useThemeMode, useThemeActions } from 'radix-native-ui';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Theme Provider Options

```tsx
<ThemeProvider
  mode="light"           // 'light' | 'dark' | undefined (follows device)
  forcedMode="dark"      // Force specific mode (overrides device settings)
  themeOptions={{}}      // Customize theme colors, typography, etc.
  onModeChange={(mode) => console.log('Theme mode changed:', mode)}
>
  {children}
</ThemeProvider>
```

### Using Theme in Components

Access theme values using the `useTheme` hook:

```tsx
import { useTheme, useThemeMode, useThemeActions } from 'radix-native-ui';

function MyComponent() {
  const theme = useTheme();
  const mode = useThemeMode();
  const { setMode, toggleMode } = useThemeActions();

  // Access theme values
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
  const spacing = theme.space[4];
  const radii = theme.radii[2];

  return (
    <View style={{ backgroundColor: colors[1], padding: spacing }}>
      <Text style={{ color: colors[12] }}>Current mode: {mode}</Text>
      <Button onPress={toggleMode}>Toggle Theme</Button>
    </View>
  );
}
```

## Available Components

### Layout Components

- **Box** - Primitive container component with styling props
- **Flex** - Flexbox layout component
- **Grid** - CSS Grid layout component
- **Container** - Responsive container with max-width
- **Inset** - Padding component for consistent spacing

### Typography Components

- **Text** - Versatile text component with size, weight, color props
- **Heading** - Semantic heading component (h1-h6)
- **Strong** - Bold text
- **Em** - Italic text
- **Code** - Inline code styling
- **Kbd** - Keyboard shortcut styling with size support (1-9)
- **Blockquote** - Quote block styling
- **Link** - Pressable link component

### Form Components

- **Button** - Interactive button with variants (classic, solid, soft, outline, ghost) and haptic feedback
- **IconButton** - Button with icon support and haptic feedback
- **TextField** - Text input component
- **TextArea** - Multi-line text input
- **Switch** - Toggle switch component with haptic feedback
- **Radio** - Radio button component with haptic feedback
- **RadioGroup** - Compound component pattern (RadioGroup.Root, RadioGroup.Item)
- **RadioCards** - Card-style radio selection with haptic feedback and press animations
- **Checkbox** - Checkbox component with haptic feedback
- **CheckboxCards** - Card-style checkbox selection with haptic feedback and press animations
- **Select** - Dropdown select component with haptic feedback
- **Slider** - Slider component

### Data Display Components

- **Avatar** - User avatar with image support
- **Badge** - Status badge component
- **Card** - Card container component
- **Table** - Data table component
- **DataList** - Key-value list component
- **Spinner** - Loading indicator
- **Progress** - Progress bar component

### Navigation Components

- **Tabs** - Tab navigation component
- **TabNav** - Tab navigation with router support
- **SegmentedControl** - iOS-style segmented control

### Overlay Components

- **Dialog** - Modal dialog component
- **AlertDialog** - Confirmation dialog
- **Popover** - Popover tooltip component
- **Tooltip** - Tooltip component
- **DropdownMenu** - Dropdown menu component
- **ContextMenu** - Context menu component
- **Portal** - Render content outside component hierarchy

## Example: Button Component

```tsx
import { Button } from 'radix-native-ui';

// Variants
<Button>Default (Classic)</Button>
<Button variant="solid">Solid</Button>
<Button variant="soft">Soft</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size={1}>Small</Button>
<Button size={2}>Medium (Default)</Button>
<Button size={3}>Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

// With onPress
<Button onPress={() => console.log('Pressed!')}>Click Me</Button>

// High contrast for accessibility
<Button highContrast>High Contrast</Button>
```

## Example: Text and Typography

```tsx
import { Text, Heading, Code, Kbd } from 'radix-native-ui';

// Text with size
<Text size={1}>Small text</Text>
<Text size={3}>Regular text (default)</Text>
<Text size={5}>Large text</Text>

// Text with weight
<Text weight="light">Light</Text>
<Text weight="regular">Regular</Text>
<Text weight="medium">Medium</Text>
<Text weight="bold">Bold</Text>

// Heading
<Heading size={1}>H1 Heading</Heading>
<Heading size={3}>H3 Heading</Heading>
<Heading size={5}>H5 Heading</Heading>

// Code and Kbd
<Code>const value = 42;</Code>
<Kbd>Cmd + C</Kbd>

// Kbd with sizes
<Kbd size={1}>Small</Kbd>
<Kbd size={3}>Medium</Kbd>
<Kbd size={5}>Large</Kbd>
```

## Example: Layout with Box and Flex

```tsx
import { Box, Flex, Grid, Container } from 'radix-native-ui';

// Box with styling
<Box backgroundColor="gray.2" padding={4} borderRadius={2}>
  <Text>Content</Text>
</Box>

// Flex layout
<Flex direction="row" align="center" justify="between" gap={2}>
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>

// Grid layout
<Grid columns={3} gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Grid>
```

## Theming Guide

### Custom Theme Options

```tsx
<ThemeProvider
  themeOptions={{
    accentColor: '#6366f1',      // Custom accent color
    grayColor: '#78716c',        // Custom gray scale
    fonts: {
      heading: {                 // Custom heading font
        fontFamily: 'YourFont-Bold',
        fontWeight: '700',
      },
      body: {                    // Custom body font
        fontFamily: 'YourFont-Regular',
        fontWeight: '400',
      },
    },
  }}
>
  {children}
</ThemeProvider>
```

### Theme Colors

The theme provides a comprehensive color palette:

```tsx
const colors = {
  gray: {
    light: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
    dark: ['#0a0a0a', '#171717', '#262626', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5f5', '#f5f5f5', '#fafafa'],
  },
  // ... more colors
};
```

### Theme Spacing

```tsx
const spacing = theme.space; // [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128]
```

### Theme Typography

```tsx
const typography = {
  fontSizes: {
    1: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
    2: { fontSize: 12, lineHeight: 18, letterSpacing: 0.5 },
    3: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
    // ... more sizes
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
};
```

## Documentation

For full documentation, examples, and API references, visit:

**https://copylabs.mintlify.app**

## Migration from Web Radix Themes

If you're familiar with Radix Themes for web, here are the key differences for React Native:

### Key Differences

1. **No CSS-in-JS** - React Native uses StyleSheet instead of CSS
2. **Box Model** - Use `padding` and `margin` props with theme scale values
3. **Colors** - Color scales are arrays (e.g., `gray[5]`), not CSS variables
4. **Event Handlers** - Use `onPress` instead of `onClick`

### API Differences

| Web Radix Themes | React Native (radix-native-ui) |
|------------------|-------------------------------|
| `css={{ p: '$4' }}` | `padding={4}` |
| `variant="solid"` | `variant="solid"` (same) |
| `size="2"` | `size={2}` (number, not string) |
| `onClick` | `onPress` |
| `color="red"` | `color="red"` (same) |

### Usage Example

```tsx
// Web Radix Themes
<Button variant="solid" size="2" onClick={handleClick}>
  Click me
</Button>

// React Native (radix-native-ui)
<Button variant="solid" size={2} onPress={handlePress}>
  Click me
</Button>
```

## Testing

This package includes Jest configuration for testing:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Box.test.tsx
```

## Haptics & Animations

Many interactive components include built-in haptic feedback and press animations for a native feel:

### Components with Haptic Feedback

- **Button** - Haptic feedback on press (configurable via `hapticFeedback` prop)
- **IconButton** - Haptic feedback on press
- **Switch** - Haptic feedback when toggled
- **Radio** - Haptic feedback when selected
- **RadioCards** - Haptic feedback when selection changes
- **Checkbox** - Haptic feedback when toggled
- **CheckboxCards** - Haptic feedback when selection changes
- **Select** - Haptic feedback on item selection

### Press Animations

Interactive components use `AnimatedPressable` for consistent press animations:
- Scale down to 0.97x on press
- Opacity change to 0.9 on press
- 100ms animation duration
- Native driver for 60fps performance

```tsx
// Disable haptic feedback if needed
<Button hapticFeedback={false}>No Haptic</Button>

// RadioCards with haptics
<RadioCards.Root value={value} onValueChange={setValue}>
  <RadioCards.Item value="1">Option 1</RadioCards.Item>
  <RadioCards.Item value="2" hapticFeedback={false}>No Haptic</RadioCards.Item>
</RadioCards.Root>
```

## Performance

All components are optimized to minimize unnecessary re-renders.

## Contributing

Contributions are welcome! Please read our contributing guidelines in the main repository.

## License

MIT

---

**[View Documentation](https://copylabs.mintlify.app)** | **[GitHub](https://github.com/Copy-Labs/radix-native-ui)**
