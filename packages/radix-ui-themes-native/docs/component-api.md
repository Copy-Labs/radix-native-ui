# Component API Reference

This document provides detailed API documentation for all components in radix-native-ui.

## ThemeProvider

The ThemeProvider component provides theme context to all child components.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `appearance` | `'light' \| 'dark' \| 'inherit'` | `'inherit'` | Color scheme preference (preferred; matches Radix UI Themes web API). `'inherit'` follows the parent provider or the device color scheme |
| `accentColor` | `Color` | `'indigo'` | Primary accent color for the theme |
| `grayColor` | `'mauve' \| 'olive' \| 'sage' \| 'sand' \| 'slate' \| 'gray'` | `'mauve'` | Gray scale color |
| `radius` | `'none' \| 'small' \| 'medium' \| 'large' \| 'full'` | `'medium'` | Border radius scale |
| `scaling` | `number` | `1` | Overall scaling factor (`1` = 100%, not a percentage string) |
| `panelBackground` | `'solid' \| 'translucent'` | `'solid'` | Panel background style |
| `mode` | `'light' \| 'dark'` | `undefined` | **Deprecated** — use `appearance` instead. Initial theme mode (follows device if undefined) |
| `forcedMode` | `'light' \| 'dark'` | `undefined` | Force specific mode (overrides device settings) |
| `hasBackground` | `boolean` | `true` | Whether to apply a background color to the container |
| `themeOptions` | `Partial<Theme>` | `{}` | Legacy theme configuration; flat props take precedence |
| `toastConfig` | `ToastConfig` | `undefined` | Toast configuration (`position`, `maxVisible`, `duration`, `defaultVariant`, `swipeToDismiss`, `gap`, `hapticFeedback`) |
| `haptics` | `boolean` | `true` | Global kill-switch for all haptic feedback |
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

### useHaptics

Returns the global haptics setting from `ThemeProvider`. Throws if called outside a provider.

```typescript
const hapticsEnabled = useHaptics();
// Returns: boolean (the `haptics` prop on ThemeProvider, default true)
```

### useToast

Returns the toast controller. Must be used inside a `ThemeProvider`.

```typescript
const { show, success, error, warning, info, accent, hide, hideAll, update } = useToast();

const id = show({ title: 'Saved', description: 'Your changes are saved.', variant: 'success' });
success({ title: 'Saved' }); // the variant is set for you
hide(id);
hideAll();
update(id, { title: 'Still saving…' });
```

`show` takes a `ToastOptions` object: `title` (required), plus optional `description`, `variant`, `color`, `duration`, `position`, `action`, `onDismiss`, `onAutoClose`, `accessibilityLabel`, `icon`, `showClose`, and `style`. The option field is `variant`, not `type`; it accepts `'default' | 'success' | 'error' | 'warning' | 'info' | 'accent'`. The `success`, `error`, `warning`, `info`, and `accent` helpers take the same options minus `variant`. Every show method returns the toast id used by `hide` and `update`. There is no `toast`, `dismiss`, or `dismissAll` method — use `show`, `hide`, and `hideAll`.

## Haptics

Haptic feedback is enabled by default. There are two layers of control: a global kill-switch on `ThemeProvider` and a local `hapticFeedback` prop on interactive components. A haptic fires only when **both** are enabled.

### Global control

```tsx
<ThemeProvider haptics={false}>
  <App />
</ThemeProvider>
```

`haptics` defaults to `true`; setting it to `false` disables all component haptics at once. `useHaptics()` reads the resolved global setting.

### Per-component control

Interactive components accept a local `hapticFeedback?: boolean` prop (default `true` unless noted), for example `Button`, `IconButton`, `Switch`, `Checkbox`, `Radio`, `Slider`, `Accordion.Trigger`, `SegmentedControl.Root`, `DropdownMenu.Item`, `ContextMenu.Item`, and the `AnimatedPressable` primitive. It is gated by the global `haptics` setting, so both must be enabled for a haptic to fire.

A few helpers default it to `false` and must opt in explicitly: `BottomSheet.Trigger`, `BottomSheet.Close`, and `Sidebar.Trigger`. Check the component source if unsure.

```tsx
<Button hapticFeedback={false}>Silent button</Button>
<BottomSheet.Trigger hapticFeedback>Opens with a haptic</BottomSheet.Trigger>
```

### Triggering a haptic manually

```typescript
import { triggerHaptic, type HapticFeedbackType } from 'radix-native-ui';

triggerHaptic('impactMedium');
```

`HapticFeedbackType` is one of:

| Type | Feel / typical use |
|------|--------------------|
| `'selection'` | Soft tick for scrollers, sliders, and drags |
| `'press'` | Light impact for taps |
| `'toggleOn'` | Confirmation for switching on |
| `'toggleOff'` | Confirmation for switching off |
| `'impactLight'` | Light impact |
| `'impactMedium'` | Medium impact |
| `'impactHeavy'` | Heavy impact |
| `'notificationSuccess'` | Success notification |
| `'notificationWarning'` | Warning notification |
| `'notificationError'` | Error notification |

`triggerHaptic` is fire-and-forget: it never blocks or throws into the calling interaction.

### Platform behavior

- **iOS:** uses the Taptic Engine through expo-haptics' `impactAsync`, `selectionAsync`, and `notificationAsync` APIs.
- **Android:** prefers expo-haptics' `performAndroidHapticsAsync` (system `HapticFeedbackConstants`): `context-click` for press, `segment-tick` for selection, `toggle-on` / `toggle-off` for toggles, and `confirm` / `reject` for notifications. It only falls back to a short `Vibration` when expo-haptics is unavailable or a call fails (Android only; silent on iOS).
- `expo-haptics` is optional and declared as a peer dependency.

Duplicate press-like haptics (`press`, `toggleOn`, `toggleOff`) fired by nested layers within 60 ms are collapsed into one, so a single tap produces a single confirmation. `selection` is not deduped, so sliders and drags keep their per-step ticks.

## Color Helper Functions

### getVariantColors

Get colors for a specific variant with highContrast support.

```typescript
import { getVariantColors } from 'radix-native-ui';

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
import { getHighContrastTextColor } from 'radix-native-ui';

const textColor = getHighContrastTextColor(theme);
// Returns: string (blackAlpha[12])
```

### getHighContrastBackground

Returns the high contrast background color (`color[11]`).

```typescript
import { getHighContrastBackground } from 'radix-native-ui';

const bgColor = getHighContrastBackground(theme, color, mode);
// Returns: string (color[11])
```

### getContrast

Returns the appropriate contrast color for a given color.

```typescript
import { getContrast } from 'radix-native-ui';

const textColor = getContrast(theme, color, mode, highContrast);
// Returns: appropriate contrast color based on color and mode
```

### getColorScale

Returns the color scale for any color name.

```typescript
import { getColorScale } from 'radix-native-ui';

const scale = getColorScale(theme, color, mode);
// Returns: ColorScale object with keys 1-12, dark, and alpha
```

### getColorAlpha

Returns the alpha color scale for any color name.

```typescript
import { getColorAlpha } from 'radix-native-ui';

const alpha = getColorAlpha(theme, color);
// Returns: AlphaColorScale object with keys 1-12
```

## Layout Components

### Box

Primitive container component with comprehensive styling props.

```tsx
import { Box } from 'radix-native-ui';

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
import { Flex } from 'radix-native-ui';

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
import { Grid } from 'radix-native-ui';

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
import { Container } from 'radix-native-ui';

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

Padding component for consistent spacing with overflow clipping support.

```tsx
import { Inset } from 'radix-native-ui';

<Inset
  asChild={false}
  children={undefined}
  style={undefined}
  side="all" | "x" | "y" | "top" | "bottom" | "left" | "right"
  p={1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
  clip="overflow" | "padding-box"
>
  Content
</Inset>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto immediate child |
| `side` | `'all' \| 'x' \| 'y' \| 'top' \| 'bottom' \| 'left' \| 'right'` | `'all'` | Side(s) to apply padding |
| `p` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9` | `4` | Padding size from theme spacing scale |
| `clip` | `'overflow' \| 'padding-box'` | `undefined` | Clip overflow content |

**Side Values:**
- `all` - All four sides
- `x` - Horizontal (left and right)
- `y` - Vertical (top and bottom)
- `top`, `bottom`, `left`, `right` - Individual sides

**Clip Behavior:**
- `overflow` - Sets `overflow: hidden` to clip content
- `padding-box` - Clips content to padding box boundary

**Example with Image:**
```tsx
<Card radius="large">
  <Inset clip="overflow">
    <Image source={{ uri: '...' }} style={{ width: '100%', height: 150 }} />
  </Inset>
  <Inset p={4}>
    <Text>Content below image</Text>
  </Inset>
</Card>
```

> **Note:** The `trim` prop is deprecated. Use `p` instead.

## Typography Components

### Text

Versatile text component with size, weight, and color props.

```tsx
import { Text } from 'radix-native-ui';

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
import { Heading } from 'radix-native-ui';

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
import { Strong } from 'radix-native-ui';

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
import { Em } from 'radix-native-ui';

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
import { Code } from 'radix-native-ui';

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
import { Kbd } from 'radix-native-ui';

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
import { Blockquote } from 'radix-native-ui';

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
import { Link } from 'radix-native-ui';

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
import { Button } from 'radix-native-ui';

<Button
  children={undefined}
  style={undefined}
  variant="classic" | "solid" | "soft" | "outline" | "surface" | "ghost"
  size={1 | 2 | 3 | 4}
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
import { IconButton } from 'radix-native-ui';

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
import { TextField } from 'radix-native-ui';

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
import { Switch } from 'radix-native-ui';

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
import { Radio } from 'radix-native-ui';

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
import { RadioGroup } from 'radix-native-ui';

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

Composable dropdown select component.

```tsx
import { Button, Select } from 'radix-native-ui';

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Button variant="soft">
      <Select.Value placeholder="Select a fruit" />
    </Button>
  </Select.Trigger>
  <Select.Portal>
    <Select.Overlay />
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

**Parts:**

- `Select.Root` — `value`, `defaultValue`, `onValueChange`, `disabled`, `color`, `variant` (also `open`, `defaultOpen`, `onOpenChange`).
- `Select.Trigger` — `asChild?` to merge the open handler and anchor ref onto its child.
- `Select.Content` — dropdown surface; accepts `size`, `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, and `style`.
- `Select.Item` — `value` (required), `disabled`, `style`.
- `Select.Value` — `placeholder?`, `color?`, `variant?` (defaults to the `Root` color and variant).

`Select.Portal`, `Select.Overlay`, `Select.Group`, `Select.Label`, and `Select.Separator` are also available. There is no single monolithic `<Select value items placeholder size />` component.

## Data Display Components

### Avatar

User avatar with image support.

```tsx
import { Avatar } from 'radix-native-ui';

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
import { Badge } from 'radix-native-ui';

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
import { Card } from 'radix-native-ui';

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
import { Table } from 'radix-native-ui';

<Table
  data={Array<Record<string, any>>}
  columns={Array<{ key: string; header: string; width?: number }>}
/>
```

### DataList

Key-value list component.

```tsx
import { DataList } from 'radix-native-ui';

<DataList
  data={Array<{ label: string; value: ReactNode }>}
  orientation="horizontal" | "vertical"
/>
```

### Spinner

Loading indicator.

```tsx
import { Spinner } from 'radix-native-ui';

<Spinner
  size="small" | "medium" | "large"
  color={string}
/>
```

### Progress

Progress bar component.

```tsx
import { Progress } from 'radix-native-ui';

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
import { Tabs } from 'radix-native-ui';

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
import { TabNav } from 'radix-native-ui';

<TabNav
  tabs={Array<{ name: string; label: string; icon: ReactNode; component: ReactNode }>}
  initialRouteName={string}
  activeColor={string}
  inactiveColor={string}
/>
```

### SegmentedControl

iOS-style segmented control built from composable parts.

```tsx
import { SegmentedControl } from 'radix-native-ui';

<SegmentedControl.Root value={value} onValueChange={setValue} size={2} color="blue" radius="medium">
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month" disabled>Month</SegmentedControl.Item>
</SegmentedControl.Root>
```

- `SegmentedControl.Root` — `value`, `defaultValue`, `onValueChange`, `disabled`, `size` (1–4), `color`, `radius` (also `highContrast`, `style`, `hapticFeedback`).
- `SegmentedControl.Item` — `value` (required), `disabled?`.

There is no `options` prop; render one `Item` per segment.

## Disclosure Components

### Accordion

A vertically stacked set of interactive headings that each reveal associated content sections.

```tsx
import { Accordion } from 'radix-native-ui';

// Single mode - only one item open at a time
<Accordion.Root type="single" defaultValue="item-1" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>First Item</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content for first item</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Second Item</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content for second item</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

// Multiple mode - multiple items can be open
<Accordion.Root type="multiple" defaultValue={['item-1', 'item-2']}>
  ...
</Accordion.Root>
```

#### Accordion.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | required | Whether one or multiple items can be open |
| `value` | `string \| string[]` | - | Controlled value(s) of open items |
| `defaultValue` | `string \| string[]` | - | Default uncontrolled value(s) |
| `onValueChange` | `(value: string \| string[]) => void` | - | Callback when value changes |
| `collapsible` | `boolean` | `false` | When type is single, allows closing the open item |
| `disabled` | `boolean` | `false` | Disable all items |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Direction for chevron rotation |
| `size` | `'1' \| '2' \| '3'` | `'2'` | Size variant |
| `children` | `ReactNode` | required | Accordion items |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles |

#### Accordion.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Unique value identifier for this item |
| `disabled` | `boolean` | `false` | Disable this specific item |
| `children` | `ReactNode` | required | Header and Content components |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles |

#### Accordion.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | AccordionTrigger element |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles |

#### Accordion.Trigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Trigger text/content |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles |
| `icon` | `ReactNode` | - | Custom chevron icon |

#### Accordion.Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to show/hide |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles |

#### Accordion Sizes

| Size | Description |
|------|-------------|
| `1` | Small - compact size for tight spaces |
| `2` | Medium - default size for most use cases |
| `3` | Large - larger size for prominent sections |

## Overlay Components

### Portal

Render content outside component hierarchy.

```tsx
import { Portal } from 'radix-native-ui';

<Portal>
  <Overlay />
</Portal>
```

### Dialog

Modal dialog component.

```tsx
import { Dialog } from 'radix-native-ui';

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
import { AlertDialog } from 'radix-native-ui';

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
import { Popover } from 'radix-native-ui';

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
import { Tooltip } from 'radix-native-ui';

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
import { DropdownMenu } from 'radix-native-ui';

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
import { ContextMenu } from 'radix-native-ui';

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
import { View, Text, Pressable, TouchableOpacity, TextInput, Image, ScrollView, FlatList, ActivityIndicator } from 'radix-native-ui';
```

## Theme Colors Reference

### Color Scale Structure

Each color in the theme is an `ExtendedColorScale`: numeric keys 1–12 for light mode, a `.dark` object with the same keys for dark mode, and an `.alpha` object for transparent variants:

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
    dark: { /* ... same 1-12 keys for dark mode */ },
  }
};
```

### Gray Scale

The selected gray color is exposed as `theme.colors.gray` using the same object shape — not a `light` array. Its numeric keys cover light mode, `.dark` holds the dark-mode ramp, and `.alpha` holds transparent variants:

```typescript
theme.colors.gray = {
  1: '#fcfcfc',  // lightest shade
  2: '#f9f9f9',
  // ... 3-11
  12: '#202020', // high contrast text
  dark: {
    1: '#111111',
    2: '#191919',
    // ... 3-11 (same keys as light mode)
    12: '#eeeeee',
  },
  alpha: {       // transparent variants, also with a `.dark` object
    1: 'hsla(0, 0%, 0%, 0.01)',
    // ... 2-11
    12: 'hsla(0, 0%, 0%, 0.87)',
    dark: { /* ... 1-12 */ },
  },
};

// Dark mode: theme.colors.gray.dark[1], theme.colors.gray.alpha.dark[3], etc.
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
