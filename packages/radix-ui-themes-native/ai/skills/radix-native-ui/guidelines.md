# UI Generation Guidelines

When generating UI with Radix Native UI, follow these guidelines:

## Importing

Always import components from `radix-native-ui`:

```tsx
import { Button, Text, Box, Input } from 'radix-native-ui';
```

DO NOT import from react-native when equivalents exist in the library.

---

## Styling

Radix Native UI uses **standard React Native styling** - there is NO className support.

### Using Style Props

Components accept a `style` prop for custom styling:

```tsx
<Box style={{ backgroundColor: 'white', padding: 16 }}>
  <Text style={{ color: 'black', fontSize: 16 }}>Hello</Text>
</Box>
```

### Using Semantic Props

Many components have built-in props for common styling needs:

```tsx
// Box has layout props built-in
<Box padding={4} marginTop={2} flexDirection="row" justifyContent="center">
  <Text>Centered</Text>
</Box>

// Button has variant props
<Button variant="solid" size={2} color="blue">Submit</Button>

// Text has variant props
<Text variant="title">Welcome</Text>
<Text variant="body">Content here</Text>
```

### Available Style Props

**Box/Layout:**
- `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight` (0-9)
- `margin`, `marginTop`, etc. (0-9)
- `flex`, `flexGrow`, `flexShrink`, `flexBasis`
- `flexDirection`: `'row' | 'column'`
- `justifyContent`: flex-start, center, flex-end, space-between, space-around
- `alignItems`: flex-start, center, flex-end, stretch
- `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- `radius`: 'none' | 'small' | 'medium' | 'large' | 'full'
- `backgroundColor`: Theme colors or custom hex values
- `opacity`

**Button:**
- `variant`: 'classic' | 'solid' | 'soft' | 'outline' | 'surface' | 'ghost'
- `size`: 1 | 2 | 3 | 4
- `color`: Theme color name
- `disabled`: boolean
- `loading`: boolean

---

## Component Composition

Prefer primitives over raw React Native components:

```tsx
// Preferred
<Box flex={1} justifyContent="center" padding={4}>
  <Text variant="title">Welcome</Text>
  <Input placeholder="Enter email" />
  <Button variant="solid">Submit</Button>
</Box>

// Avoid - mixing raw RN components unnecessarily
<View style={{ flex: 1 }}>
  <Text style={{ fontSize: 24 }}>Welcome</Text>
  <TextInput placeholder="Enter email" />
  <TouchableOpacity><Text>Submit</Text></TouchableOpacity>
</View>
```

---

## Mobile Layout Best Practices

1. **Use safe areas** - Wrap in `Inset` or use safe area styles
2. **Consistent padding** - Use theme space values (1-9)
3. **Touch targets** - Minimum 44x44 points
4. **Vertical stacking** - Use `Stack` or `Box` with flexDirection="column"

---

## Accessibility

1. **Include accessibilityLabel** for interactive elements without text
2. **Use semantic components** - Button, Switch, Checkbox have built-in accessibility
3. **Support dark mode** - Components adapt automatically with ThemeProvider

---

## DO

- ✅ Import from `radix-native-ui`
- ✅ Use semantic props (variant, size, color)
- ✅ Use Box/Stack for layout
- ✅ Use functional React components
- ✅ Keep components simple and readable

## DO NOT

- ❌ Mix multiple UI frameworks
- ❌ Use className (not supported)
- ❌ Create unnecessary wrappers
- ❌ Duplicate primitives that already exist
- ❌ Use web-only UI code
- ❌ Use "Sheet" - it's called "BottomSheet"

---

## Theme Integration

Wrap your app in ThemeProvider for consistent styling:

```tsx
import { ThemeProvider } from 'radix-native-ui';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```
