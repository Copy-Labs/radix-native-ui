# Radix Native UI – AI Agent Guide

This repository contains **radix-native-ui**, a composable UI primitive library
for building mobile interfaces in **React Native** and **Expo**.

AI coding agents should use this guide when generating UI code.

---

# Overview

Radix Native UI provides reusable mobile UI primitives inspired by Radix UI.

The framework focuses on:

- composable UI primitives
- accessible components
- mobile-first design
- Expo compatibility
- developer-friendly code generation

Agents generating UI code should prefer these primitives instead of raw
React Native components.

---

# Installation

Install the library:

```bash
npm install radix-native-ui
```

or

```bash
yarn add radix-native-ui
```

or

```bash
bun add radix-native-ui
```

For Expo projects:

```bash
npx expo install radix-native-ui
```

---

# Supported Platforms

Radix Native UI supports:

- React Native
- Expo

Ensure the environment includes:

- **React Native** >= 0.70
- **Expo** >= 48

---

# Importing Components

Components must always be imported from the package:

```tsx
import { Button, Text, Box } from 'radix-native-ui';
```

Do NOT import primitives from react-native when equivalents exist in the library.

---

# Core Design Philosophy

Agents should follow these principles when generating UI.

### 1. Use Composable Primitives

Build interfaces using primitives instead of complex monolithic components.

**Preferred:**

```tsx
<Box>
  <Text>Title</Text>
  <Button>Submit</Button>
</Box>
```

Avoid deeply nested custom components unless necessary.

---

### 2. Prefer Framework Components

If a component exists in the library, use it instead of React Native equivalents.

**Preferred:**

- Button, TextField, Avatar, Tabs
- Box, Stack, Center, Flex
- Switch, Checkbox, Radio

**Avoid:**

- TouchableOpacity (use Button or IconButton)
- TextInput (use TextField or TextArea)
- Custom navigation wrappers

---

### 3. Follow Mobile Layout Patterns

Generated layouts should be mobile-friendly.

Common patterns:

- centered login forms
- stacked vertical layouts
- consistent padding using theme space values
- accessible spacing

---

### 4. Keep Components Simple

Generated UI should be clean and readable.

Avoid:

- unnecessary abstraction
- deeply nested wrappers
- complex logic inside UI components

---

# Styling

⚠️ **IMPORTANT**: Radix Native UI does NOT support className or Tailwind-style classes.

Use these approaches instead:

### 1. Style Prop

```tsx
<Box style={{ backgroundColor: 'white', padding: 16 }}>
  <Text style={{ color: 'black', fontSize: 16 }}>Hello</Text>
</Box>
```

### 2. Semantic Props

Most components have built-in props for common styling:

```tsx
// Box has layout props
<Box padding={4} marginTop={2} flexDirection="row" justifyContent="center">

// Button has variant props
<Button variant="solid" size={2} color="blue">Submit</Button>

// Text has variant props
<Text variant="title">Welcome</Text>
```

### Available Semantic Props

**Box/Layout:**
- `padding`, `margin` (0-9 maps to theme space)
- `flexDirection`: 'row' | 'column'
- `justifyContent`: 'flex-start' | 'center' | 'flex-end' | 'space-between'
- `alignItems`: 'flex-start' | 'center' | 'flex-end'
- `radius`: 'none' | 'small' | 'medium' | 'large' | 'full'

**Button:**
- `variant`: 'classic' | 'solid' | 'soft' | 'outline' | 'surface' | 'ghost'
- `size`: 1 | 2 | 3 | 4

**Text:**
- `variant`: 'title' | 'body' | 'caption' | etc.
- `weight`: 'normal' | 'bold'
- `align`: 'left' | 'center' | 'right'

---

# Available Components

## Layout

Box, Center, Container, Flex, Grid, Inset, Separator, Spacer, Stack

## Typography

Text, Heading, Blockquote, Code, Em, Kbd, Link, Strong

## Forms & Inputs

Button, IconButton, TextField, TextArea, Checkbox, CheckboxCards, Radio, RadioCards, Switch, Select, Slider

## Navigation

Tabs, TabNav, SegmentedControl, BottomSheet (NOT Sheet), Dialog, DropdownMenu, ContextMenu, Popover, Tooltip

## Overlays

AlertDialog, Toast, Portal

## Data Display

Avatar, Badge, Card, Callout, DataList, FancyList, Progress, Spinner, Table

## Disclosure

Accordion

---

# Example: Login Screen

Agents should generate screens using primitives.

**Example:**

```tsx
import { Box, Text, TextField, Button, Stack, Center } from 'radix-native-ui';

export default function LoginScreen() {
  return (
    <Flex align={'center'} direction={'column'} flex={1} gap={8} justify={'center'} maxWidth={400} padding={4}>
        <Text variant="title">Welcome Back</Text>
        
        <TextField placeholder="Email" />
        
        <TextField placeholder="Password" secureTextEntry />
        
        <Button variant="solid" size={3}>
          Sign In
        </Button>
    </Flex>
  );
}
```

---

# Example: Profile Screen

```tsx
import { Box, Text, Avatar, Button, Stack, Center } from 'radix-native-ui';

export default function ProfileScreen() {
  return (
    <Flex align={'center'} direction={'column'} gap={12} justify={'center'} padding={4}>
        <Avatar 
          src="https://example.com/avatar.png" 
          size={4} 
          radius="full" 
        />
        
        <Text variant="title">John Doe</Text>
        
        <Button variant="outline">
          Edit Profile
        </Button>
    </Flex>
  );
}
```

---

# Code Generation Rules

When generating UI code:

1. Use functional React components
2. Import components from radix-native-ui
3. Prefer composable primitives
4. Avoid unnecessary dependencies
5. Maintain mobile-friendly layouts
6. DO NOT use className (not supported)

---

# Accessibility

Generated components should:

- include readable text labels
- support touch targets (minimum 44x44 points)
- avoid overly dense UI

---

# Anti-Patterns

Agents should NOT:

- mix multiple UI frameworks
- recreate primitives that already exist
- rely heavily on raw React Native components
- generate web-only UI code
- use className or Tailwind-style classes

---

# Recommended Screen Patterns

Common screens agents may generate:

- login screens
- onboarding flows
- settings pages
- profile pages
- dashboards
- chat interfaces

All should use Radix Native UI primitives.

---

# Documentation

Full documentation is available at:

[https://copylabs.mintlify.app](https://copylabs.mintlify.app)

Agents should refer to this documentation when generating components.

---

# Summary

Radix Native UI is a composable mobile UI framework designed for React Native
and Expo applications.

When generating UI code:

- use primitives from radix-native-ui
- use style props and semantic props (NOT className)
- follow mobile layout patterns
- keep components simple and readable
