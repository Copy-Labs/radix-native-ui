# Component API Reference

This document provides detailed API documentation for all components in @radix-ui/themes-native.

## ThemeProvider

The ThemeProvider component provides theme context to all child components.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `mode` | `'light' \| 'dark'` | `undefined` | Initial theme mode (follows device if undefined) |
| `forcedMode` | `'light' \| 'dark'` | `undefined` | Force specific mode (overrides device settings) |
| `themeOptions` | `Partial<Theme>` | `{}` | Custom theme configuration |
| `onModeChange` | `(mode: ThemeMode) => void` | `undefined` | Callback when mode changes |

### Theme Options

```typescript
interface Theme {
  accentColor: string;
  grayColor: string;
  radius: Record<string, number>;
  fonts: {
    heading: { fontFamily: string; fontWeight: string; fontStyle: string };
    body: { fontFamily: string; fontWeight: string; fontStyle: string };
    strong: { fontFamily: string; fontWeight: string; fontStyle: string };
    em: { fontFamily: string; fontWeight: string; fontStyle: string };
    code: { fontFamily: string; fontWeight: string; fontStyle: string };
    quote: { fontFamily: string; fontWeight: string; fontStyle: string };
  };
  fontSizes: Record<number, { fontSize: number; lineHeight: number; letterSpacing: number }>;
  fontWeights: Record<string, string>;
  space: number[];
  radii: Record<number, number>;
  shadows: Record<string, ViewStyle>;
}
```

## Hooks

### useTheme

Returns the current theme object.

```typescript
const theme = useTheme();
// Returns: Theme object with colors, typography, spacing, etc.
```

### useThemeMode

Returns the current theme mode.

```typescript
const mode = useThemeMode();
// Returns: 'light' | 'dark'
```

### useThemeActions

Returns theme actions and current mode.

```typescript
const { setMode, toggleMode, mode } = useThemeActions();
// setMode: (mode: ThemeMode) => void
// toggleMode: () => void
// mode: ThemeMode
```

### useThemeColors

Returns convenience colors for the current mode.

```typescript
const { gray, background, surface, panel } = useThemeColors();
```

## Color Helper Functions

### getVariantColors

Get colors for a specific variant with highContrast support.

```typescript
import { getVariantColors } from '@radix-ui/themes-native';

const colors = getVariantColors(
  theme,           // Theme object
  color,           // Color name (e.g., 'blue', 'green', 'tomato')
  mode,            // 'light' | 'dark'
  variant,         // 'solid' | 'soft' | 'outline' | 'ghost' | 'classic'
  highContrast     // boolean
);
// Returns: { backgroundColor: string; textColor: string; borderColor: string }
```

**High Contrast Mode:**
| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| solid/classic | `color[11]` | `blackAlpha[12]` | transparent |
| soft | `colorAlpha['3']` | `color[12]` | transparent |
| outline | transparent | `color[11]` | `color[11]` |
| ghost | transparent | `color[11]` | transparent |

### getHighContrastTextColor

Returns the high contrast text color (`blackAlpha[12]`).

```typescript
import { getHighContrastTextColor } from '@radix-ui/themes-native';

const textColor = getHighContrastTextColor(theme);
// Returns: string (blackAlpha[12])
```

### getHighContrastBackground

Returns the high contrast background color (`color[11]`).

```typescript
import { getHighContrastBackground } from '@radix-ui/themes-native';

const bgColor = getHighContrastBackground(theme, color, mode);
// Returns: string (color[11])
```

### getContrast

Returns the appropriate contrast color for a given color.

```typescript
import { getContrast } from '@radix-ui/themes-native';

const textColor = getContrast(theme, color, mode, highContrast);
// Returns: appropriate contrast color based on color and mode
```

### getColorScale

Returns the color scale for any color name.

```typescript
import { getColorScale } from '@radix-ui/themes-native';

const scale = getColorScale(theme, color, mode);
// Returns: ColorScale object with keys 1-12, dark, and alpha
```

### getColorAlpha

Returns the alpha color scale for any color name.

```typescript
import { getColorAlpha } from '@radix-ui/themes-native';

const alpha = getColorAlpha(theme, color);
// Returns: AlphaColorScale object with keys 1-12
```

## Layout Components

### Box

Primitive container component with comprehensive styling props.

```tsx
import { Box } from '@radix-ui/themes-native';

<Box
  asChild={false}
  children={undefined}
  style={undefined}
  backgroundColor="gray.1"
  radius={1 | 2 | 3 | 4 | 'none' | 'full'}
  display="flex" | "none"
  flexDirection="row" | "column" | "row-reverse" | "column-reverse"
  justifyContent="flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  alignItems="flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  flexWrap="wrap" | "nowrap" | "wrap-reverse"
  flex={number}
  gap={number}
  padding={number}
  paddingTop={number}
  paddingBottom={number}
  paddingLeft={number}
  paddingRight={number}
  paddingHorizontal={number}
  paddingVertical={number}
  margin={number}
  marginTop={number}
  marginBottom={number}
  marginLeft={number}
  marginRight={number}
  marginHorizontal={number}
  marginVertical={number}
  borderWidth={number}
  borderRadius={number}
  borderColor={string}
  opacity={number}
  elevation={number}
  {...rest}
>
  Content
</Box>
```

### Flex

Flexbox layout component.

```tsx
import { Flex } from '@radix-ui/themes-native';

<Flex
  asChild={false}
  children={undefined}
  style={undefined}
  direction="row" | "column" | "row-reverse" | "column-reverse"
  align="flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  alignContent="flex-start" | "center" | "flex-end" | "stretch" | "space-between" | "space-around"
  justify="flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  wrap="wrap" | "nowrap" | "wrap-reverse"
  gap={number}
  columnGap={number}
  rowGap={number}
  flexGrow={number}
  flexShrink={number}
  flexBasis={number | string}
  flex={number}
  alignSelf="auto" | "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  width={number | string}
  height={number | string}
  backgroundColor={string}
  borderRadius={number}
  opacity={number}
>
  Content
</Flex>
```

### Grid

CSS Grid layout component.

```tsx
import { Grid } from '@radix-ui/themes-native';

<Grid
  children={undefined}
  style={undefined}
  columns={number}
  gap={number}
  rowGap={number}
  columnGap={number}
  align="flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  justify="flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  columnWidth={string | number}
>
  Content
</Grid>
```

### Container

Responsive container with max-width.

```tsx
import { Container } from '@radix-ui/themes-native';

<Container
  children={undefined}
  style={undefined}
  size={1 | 2 | 3 | 4}
  responsive={boolean}
>
  Content
</Container>
```

### Inset

Padding component for consistent spacing.

```tsx
import { Inset } from '@radix-ui/themes-native';

<Inset
  children={undefined}
  style={undefined}
  side="all" | "horizontal" | "vertical" | "top" | "bottom" | "left" | "right"
  trim={1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
>
  Content
</Inset>
```

## Typography Components

### Text

Versatile text component with size, weight, and color props.

```tsx
import { Text } from '@radix-ui/themes-native';

<Text
  asChild={false}
  children={undefined}
  style={undefined}
  size={1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
  weight="light" | "regular" | "medium" | "bold"
  align="left" | "center" | "right"
  color={string}
  truncate={boolean | "character" | "token"}
  numberOfLines={number}
  fontFamily={string}
  fontStyle="normal" | "italic"
  lineHeight={number}
  letterSpacing={number}
  textDecorationLine="none" | "underline" | "line-through" | "underline line-through"
  opacity={number}
>
  Text content
</Text>
```

### Heading

Semantic heading component (h1-h5).

```tsx
import { Heading } from '@radix-ui/themes-native';

<Heading
  asChild={false}
  children={undefined}
  style={undefined}
  size={1 | 2 | 3 | 4 | 5}
  weight="light" | "regular" | "medium" | "bold"
  align="left" | "center" | "right"
  color={string}
  truncate={boolean}
  numberOfLines={number}
  fontFamily={string}
  opacity={number}
>
  Heading text
</Heading>
```

### Strong

Bold text for emphasis.

```tsx
import { Strong } from '@radix-ui/themes-native';

<Strong
  children={undefined}
  style={undefined}
  color={string}
>
  Bold text
</Strong>
```

### Em

Italic text for emphasis.

```tsx
import { Em } from '@radix-ui/themes-native';

<Em
  children={undefined}
  style={undefined}
  color={string}
>
  Italic text
</Em>
```

### Code

Inline code styling.

```tsx
import { Code } from '@radix-ui/themes-native';

<Code
  children={undefined}
  style={undefined}
  size={1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
  color={string}
  backgroundColor={string}
>
  code here
</Code>
```

### Kbd

Keyboard shortcut styling.

```tsx
import { Kbd } from '@radix-ui/themes-native';

<Kbd
  children={undefined}
  style={undefined}
  color={string}
  backgroundColor={string}
>
  Cmd + C
</Kbd>
```

### Blockquote

Quote block styling.

```tsx
import { Blockquote } from '@radix-ui/themes-native';

<Blockquote
  children={undefined}
  style={undefined}
  textStyle={StyleProp<TextStyle>}
  color={string}
  borderColor={string}
  quoteColor={string}
>
  Quote content
</Blockquote>
```

### Link

Pressable link component.

```tsx
import { Link } from '@radix-ui/themes-native';

<Link
  children={undefined}
  style={undefined}
  href={string}
  onPress={(event: GestureResponderEvent) => void}
  color={string}
  disabled={boolean}
  accessibilityLabel={string}
>
  Link text
</Link>
```

## Form Components

### Button

Interactive button with multiple variants.

```tsx
import { Button } from '@radix-ui/themes-native';

<Button
  children={undefined}
  style={undefined}
  variant="classic" | "solid" | "soft" | "outline" | "ghost"
  size={1 | 2 | 3}
  disabled={boolean}
  loading={boolean}
  onPress={(event: GestureResponderEvent) => void}
  accessibilityLabel={string}
  width={number | string}
  highContrast={boolean}
>
  Button text
</Button>
```

### IconButton

Button with icon support.

```tsx
import { IconButton } from '@radix-ui/themes-native';

<IconButton
  icon={ReactNode}
  variant="classic" | "solid" | "soft" | "outline" | "ghost"
  size={1 | 2 | 3}
  disabled={boolean}
  loading={boolean}
  onPress={() => void}
  accessibilityLabel={string}
  highContrast={boolean}
>
</IconButton>
```

### TextField

Text input component.

```tsx
import { TextField } from '@radix-ui/themes-native';

<TextField
  value={string}
  onChangeText={(text: string) => void}
  placeholder={string}
  variant="classic" | "surface" | "soft"
  size={1 | 2 | 3}
  disabled={boolean}
  error={string}
  multiline={boolean}
  numberOfLines={number}
  accessibilityLabel={string}
  secureTextEntry={boolean}
  highContrast={boolean}
/>
```

### Switch

Toggle switch component.

```tsx
import { Switch } from '@radix-ui/themes-native';

<Switch
  checked={boolean}
  onCheckedChange={(checked: boolean) => void}
  disabled={boolean}
  size="small" | "medium" | "large"
  highContrast={boolean}
/>
```

### Radio

Radio button component.

```tsx
import { Radio } from '@radix-ui/themes-native';

<Radio
  checked={boolean}
  onCheckedChange={(checked: boolean) => void}
  disabled={boolean}
  highContrast={boolean}
/>
```

### RadioGroup

Group of radio buttons.

```tsx
import { RadioGroup } from '@radix-ui/themes-native';

<RadioGroup
  value={string}
  onValueChange={(value: string) => void}
  disabled={boolean}
  highContrast={boolean}
>
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
</RadioGroup>
```

### Select

Dropdown select component.

```tsx
import { Select } from '@radix-ui/themes-native';

<Select
  value={string}
  onValueChange={(value: string) => void}
  items={Array<{ label: string; value: string }>}
  placeholder={string}
  disabled={boolean}
  size={1 | 2 | 3}
/>
```

## Data Display Components

### Avatar

User avatar with image support.

```tsx
import { Avatar } from '@radix-ui/themes-native';

<Avatar
  src={string}
  alt={string}
  fallback={ReactNode}
  size={1 | 2 | 3 | 4 | 5 | 6 | 7}
  variant="solid" | "soft"
/>
```

### Badge

Status badge component with color and highContrast support.

```tsx
import { Badge } from '@radix-ui/themes-native';

<Badge
  children={undefined}
  variant="solid" | "soft" | "outline"
  size={1 | 2 | 3}
  color={string}  // Color name (e.g., 'blue', 'green', 'tomato', 'gray')
  highContrast={boolean}
>
  Badge text
</Badge>
```

**Badge Color Options:**
Available colors include: `gray`, `gold`, `bronze`, `brown`, `orange`, `tomato`, `red`, `ruby`, `crimson`, `pink`, `plum`, `purple`, `violet`, `iris`, `indigo`, `blue`, `cyan`, `sky`, `mint`, `seafoam`, `teal`, `green`, `grass`, `lime`, `yellow`, `amber`.

**Badge highContrast Behavior:**
- `solid` / `classic`: Background uses `color[11]`, text uses `blackAlpha[12]`
- `soft`: Background uses `colorAlpha['3']`, text uses `color[12]`
- `outline`: Text and border use `color[11]`

### Card

Card container component.

```tsx
import { Card } from '@radix-ui/themes-native';

<Card
  children={undefined}
  style={undefined}
  size={1 | 2 | 3}
  variant="elevated" | "outlined" | "flat"
>
  Card content
</Card>
```

### Table

Data table component.

```tsx
import { Table } from '@radix-ui/themes-native';

<Table
  data={Array<Record<string, any>>}
  columns={Array<{ key: string; header: string; width?: number }>}
/>
```

### DataList

Key-value list component.

```tsx
import { DataList } from '@radix-ui/themes-native';

<DataList
  data={Array<{ label: string; value: ReactNode }>}
  orientation="horizontal" | "vertical"
/>
```

### Spinner

Loading indicator.

```tsx
import { Spinner } from '@radix-ui/themes-native';

<Spinner
  size="small" | "medium" | "large"
  color={string}
/>
```

### Progress

Progress bar component.

```tsx
import { Progress } from '@radix-ui/themes-native';

<Progress
  value={number} // 0-100
  max={number}
  size="small" | "medium" | "large"
  variant="determinate" | "indeterminate"
  highContrast={boolean}
/>
```

## Navigation Components

### Tabs

Tab navigation component.

```tsx
import { Tabs } from '@radix-ui/themes-native';

<Tabs
  value={string}
  onValueChange={(value: string) => void}
  variant="line" | "enclosed" | "soft"
>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

### TabNav

Tab navigation with router support.

```tsx
import { TabNav } from '@radix-ui/themes-native';

<TabNav
  tabs={Array<{ name: string; label: string; icon: ReactNode; component: ReactNode }>}
  initialRouteName={string}
  activeColor={string}
  inactiveColor={string}
/>
```

### SegmentedControl

iOS-style segmented control.

```tsx
import { SegmentedControl } from '@radix-ui/themes-native';

<SegmentedControl
  value={string}
  onValueChange={(value: string) => void}
  options={Array<{ label: string; value: string }>}
  disabled={boolean}
  highContrast={boolean}
/>
```

## Overlay Components

### Portal

Render content outside component hierarchy.

```tsx
import { Portal } from '@radix-ui/themes-native';

<Portal>
  <Overlay />
</Portal>
```

### Dialog

Modal dialog component.

```tsx
import { Dialog } from '@radix-ui/themes-native';

<Dialog.Root open={boolean} onOpenChange={(open: boolean) => void}>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### AlertDialog

Confirmation dialog.

```tsx
import { AlertDialog } from '@radix-ui/themes-native';

<AlertDialog.Root open={boolean} onOpenChange={(open: boolean) => void}>
  <AlertDialog.Trigger>Show Alert</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

### Popover

Popover tooltip component.

```tsx
import { Popover } from '@radix-ui/themes-native';

<Popover.Root open={boolean} onOpenChange={(open: boolean) => void}>
  <Popover.Trigger>Open Popover</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      Popover content
      <Popover.Close>Close</Popover.Close>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### Tooltip

Tooltip component.

```tsx
import { Tooltip } from '@radix-ui/themes-native';

<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      Tooltip text
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
```

### DropdownMenu

Dropdown menu component.

```tsx
import { DropdownMenu } from '@radix-ui/themes-native';

<DropdownMenu.Root open={boolean} onOpenChange={(open: boolean) => void}>
  <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item onSelect={() => {}}>Item 1</DropdownMenu.Item>
      <DropdownMenu.Item onSelect={() => {}}>Item 2</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item onSelect={() => {}}>Item 3</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### ContextMenu

Context menu component.

```tsx
import { ContextMenu } from '@radix-ui/themes-native';

<ContextMenu.Root>
  <ContextMenu.Trigger>Long press me</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item onSelect={() => {}}>Item 1</ContextMenu.Item>
      <ContextMenu.Item onSelect={() => {}}>Item 2</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

## Utility Components

### Primitives

Direct access to React Native primitives:

- `View` - Base View component
- `Text` - Base Text component
- `Pressable` - Base Pressable component
- `TouchableOpacity` - Base TouchableOpacity component
- `TouchableHighlight` - Base TouchableHighlight component
- `TextInput` - Base TextInput component
- `Image` - Base Image component
- `ScrollView` - Base ScrollView component
- `FlatList` - Base FlatList component
- `ActivityIndicator` - Base ActivityIndicator component

```tsx
import { View, Text, Pressable, TouchableOpacity, TextInput, Image, ScrollView, FlatList, ActivityIndicator } from '@radix-ui/themes-native/primitives';
```

## Theme Colors Reference

### Color Scale Structure

Each color in the theme has the following structure:

```typescript
theme.colors[colorName] = {
  1: string,   // Lightest shade
  2: string,
  3: string,
  4: string,
  5: string,
  6: string,
  7: string,
  8: string,
  9: string,  // Standard solid background
  10: string,
  11: string, // High contrast background
  12: string, // High contrast text
  dark: {     // Dark mode colors
    1: string,
    2: string,
    // ... same as above
    12: string,
  },
  alpha: {    // Transparent variants
    1: string,
    2: string,
    3: string, // Soft background
    4: string,
    5: string,
    6: string,
    7: string,
    8: string, // Border/outline
    9: string,
    10: string,
    11: string, // Text on soft backgrounds
    12: string,
  }
};
```

### Gray Scale

```typescript
theme.colors.gray.light = [
  '#fafafa', // 0
  '#f5f5f5', // 1
  '#e5e5e5', // 2
  '#d4d4d4', // 3
  '#a3a3a3', // 4
  '#737373', // 5
  '#525252', // 6
  '#404040', // 7
  '#262626', // 8
  '#171717', // 9
  '#0a0a0a', // 10
];

theme.colors.gray.dark = [
  '#0a0a0a', // 0
  '#171717', // 1
  '#262626', // 2
  '#404040', // 3
  '#525252', // 4
  '#737373', // 5
  '#a3a3a3', // 6
  '#d4d4d5', // 7
  '#e5e5e5', // 8
  '#f5f5f5', // 9
  '#fafafa', // 10
];
```

### Black & White Alpha Scales

```typescript
// blackAlpha - Black with varying opacity
theme.colors.blackAlpha = {
  1: 'rgba(0, 0, 0, 0.04)',
  2: 'rgba(0, 0, 0, 0.06)',
  3: 'rgba(0, 0, 0, 0.08)',
  4: 'rgba(0, 0, 0, 0.12)',
  5: 'rgba(0, 0, 0, 0.16)',
  6: 'rgba(0, 0, 0, 0.24)',
  7: 'rgba(0, 0, 0, 0.36)',
  8: 'rgba(0, 0, 0, 0.48)',
  9: 'rgba(0, 0, 0, 0.64)',
  10: 'rgba(0, 0, 0, 0.80)',
  11: 'rgba(0, 0, 0, 0.92)',
  12: '#000000', // High contrast text
};

// whiteAlpha - White with varying opacity
theme.colors.whiteAlpha = {
  1: 'rgba(255, 255, 255, 0.04)',
  2: 'rgba(255, 255, 255, 0.06)',
  3: 'rgba(255, 255, 255, 0.08)',
  4: 'rgba(255, 255, 255, 0.12)',
  5: 'rgba(255, 255, 255, 0.16)',
  6: 'rgba(255, 255, 255, 0.24)',
  7: 'rgba(255, 255, 255, 0.36)',
  8: 'rgba(255, 255, 255, 0.48)',
  9: 'rgba(255, 255, 255, 0.64)',
  10: 'rgba(255, 255, 255, 0.80)',
  11: 'rgba(255, 255, 255, 0.92)',
  12: '#ffffff', // High contrast text
};
```

### Available Colors

| Category | Colors |
|----------|--------|
| Neutrals | `gray` |
| Accents | `gold`, `bronze`, `brown`, `orange`, `tomato`, `red`, `ruby`, `crimson`, `pink`, `plum`, `purple`, `violet`, `iris`, `indigo`, `blue`, `cyan`, `sky`, `mint`, `seafoam`, `teal`, `green`, `grass`, `lime`, `yellow`, `amber` |
| Special | `blackAlpha`, `whiteAlpha` |

### Spacing Scale

```typescript
theme.space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];
// theme.space[1] = 4, theme.space[2] = 8, etc.
```

### Radius Scale

```typescript
theme.radii = [0, 4, 6, 8, 12, 16, 24, 9999];
// theme.radii[1] = 4, theme.radii[2] = 6, etc.
```

### Typography Scale

```typescript
theme.typography.fontSizes = {
  1: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
  2: { fontSize: 12, lineHeight: 18, letterSpacing: 0.5 },
  3: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  4: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  5: { fontSize: 18, lineHeight: 26, letterSpacing: -0.25 },
  6: { fontSize: 20, lineHeight: 28, letterSpacing: -0.25 },
  7: { fontSize: 24, lineHeight: 32, letterSpacing: -0.5 },
  8: { fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  9: { fontSize: 36, lineHeight: 40, letterSpacing: -0.75 },
};
```
