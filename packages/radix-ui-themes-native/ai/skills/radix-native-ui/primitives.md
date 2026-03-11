# Available UI Components

This document lists all available components in radix-native-ui, organized by category.

## Importing Components

All components are imported from the main package:

```tsx
import { Button, Text, Box } from 'radix-native-ui';
```

---

## Layout

| Component | Description |
|-----------|-------------|
| `Box` | Core layout component with flexbox props, padding, margin, radius |
| `Center` | Centers content vertically and horizontally |
| `Container` | Max-width container for content |
| `Flex` | Flexbox layout component |
| `Grid` | CSS Grid-like layout |
| `Separator` | Visual divider line |

[//]: # (| `Spacer` | Adds vertical or horizontal space |)

[//]: # (| `Stack` | Stack children vertically or horizontally |)

---

## Typography

| Component | Description |
|-----------|-------------|
| `Text` | Text with variant support (titles, body, etc.) |
| `Heading` | Semantic heading component (h1-h6) |
| `Blockquote` | Styled quote block |
| `Code` | Inline code styling |
| `Em` | Emphasis (italic) |
| `Kbd` | Keyboard input styling |
| `Strong` | Strong emphasis (bold) |

---

## Forms & Inputs

| Component | Description |
|-----------|-------------|
| `Button` | Primary action button with variants (solid, outline, ghost, etc.) |
| `IconButton` | Square button for icons |
| `TextField` | Single-line text input |
| `TextArea` | Multi-line text input |
| `Checkbox` | Checkbox input |
| `CheckboxCards` | Checkbox presented as cards |
| `CheckboxGroup` | Group of checkboxes |
| `Radio` | Radio button input |
| `RadioCards` | Radio buttons presented as cards |
| `RadioGroup` | Group of radio buttons |
| `Switch` | Toggle switch |
| `Select` | Dropdown select |
| `Slider` | Range slider |

---

## Navigation

| Component | Description |
|-----------|-------------|
| `Tabs` | Tabbed navigation |
| `SegmentedControl` | Segmented button control |
| `BottomSheet` | Slide-up panel (NOT "Sheet") |
| `Dialog` | Modal dialog |
| `DropdownMenu` | Dropdown menu |
| `ContextMenu` | Right-click/long-press context menu |
| `Popover` | Floating popover |
| `Tooltip` | Hover/focus tooltip |

---

## Overlays

| Component | Description |
|-----------|-------------|
| `AlertDialog` | Alert confirmation dialog |
| `Toast` | Temporary notification message |
| `Portal` | Render content outside modal hierarchy |

---

## Data Display

| Component | Description |
|-----------|-------------|
| `Avatar` | User avatar image |
| `Badge` | Status or count badge |
| `Card` | Content container card |
| `Callout` | Callout message box |
| `DataList` | Key-value data list |
| `FancyList` | Styled list with icons |
| `Progress` | Progress indicator |
| `Spinner` | Loading spinner |

[//]: # (| `Table` | Data table |)

---

## Disclosure

| Component | Description |
|-----------|-------------|
| `Accordion` | Collapsible accordion sections |

---

## Primitives (Low-level)

| Component | Description |
|-----------|-------------|
| `View` | Base View wrapper |
| `Text` | Base Text wrapper |
| `Pressable` | Touchable wrapper |
| `TouchableOpacity` | Touchable with opacity feedback |
| `TouchableHighlight` | Touchable with highlight feedback |
| `AnimatedPressable` | Touchable with scale/opacity animations |
| `ScrollView` | Scrollable container |
| `FlatList` | Efficient scrolling list |
| `Image` | Image component |
| `ActivityIndicator` | Activity indicator |

---

## Utilities

| Component | Description |
|-----------|-------------|
| `AspectRatio` | Aspect ratio container |
| `ScrollArea` | Scrollable area with custom scrollbar |
| `Slot` | Polymorphic component wrapper |
| `VisuallyHidden` | Screen-reader-only content |

---

## Component Props

### Button Variants

```tsx
<Button variant="solid" size={2} color="blue">Submit</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Learn More</Button>
<Button variant="soft">Delete</Button>
```

- **variant**: `'classic' | 'solid' | 'soft' | 'outline' | 'surface' | 'ghost'`
- **size**: `1 | 2 | 3 | 4`
- **color**: Theme color name

### Box Layout Props

```tsx
<Box padding={4} marginTop={2} flexDirection="row" justifyContent="center">
```

- **padding/margin**: `0-9` (maps to theme space values)
- **flexDirection**: `'row' | 'column'`
- **justifyContent**: `'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'`
- **alignItems**: `'flex-start' | 'center' | 'flex-end' | 'stretch'`
- **radius**: `'none' | 'small' | 'medium' | 'large' | 'full'`
