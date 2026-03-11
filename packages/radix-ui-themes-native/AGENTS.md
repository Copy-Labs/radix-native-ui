# Radix Native UI – AI Agent Guide

This repository contains **radix-native-ui**, a composable UI primitive library
for building mobile interfaces in **React Native** and **Expo**.

AI coding agents should use this guide when generating UI code.

---

# Overview

Radix Native UI provides reusable mobile UI primitives inspired by Radix UI
and shadcn-style component registries.

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

npm install radix-native-ui

or

yarn add radix-native-ui

or

bun add radix-native-ui

For Expo projects:

npx expo install radix-native-ui

---

# Supported Platforms

Radix Native UI supports:

- React Native
- Expo

Ensure the environment includes:

React Native >= 0.72  
Expo >= 49

---

# Importing Components

Components must always be imported from the package:

import { Button, Text, View } from "radix-native-ui"

Do NOT import primitives from react-native when equivalents exist in the library.

---

# Core Design Philosophy

Agents should follow these principles when generating UI.

### 1. Use Composable Primitives

Build interfaces using primitives instead of complex monolithic components.

Preferred:

```

<View>
  <Text>Title</Text>
  <Button>Submit</Button>
</View>
```

Avoid deeply nested custom components unless necessary.

---

### 2. Prefer Framework Components

If a component exists in the library, use it instead of React Native equivalents.

Preferred:

Button
Input
Avatar
Tabs

Avoid:

TouchableOpacity
TextInput
Custom navigation wrappers

---

### 3. Follow Mobile Layout Patterns

Generated layouts should be mobile-friendly.

Common patterns:

* centered login forms
* stacked vertical layouts
* consistent padding
* accessible spacing

---

### 4. Keep Components Simple

Generated UI should be clean and readable.

Avoid:

* unnecessary abstraction
* deeply nested wrappers
* complex logic inside UI components

---

# Available Primitives

Agents should prefer these components.

## Layout

View
Container
Stack
Spacer
Divider

## Typography

Text

## Input

Input
Textarea
Checkbox
Radio
Switch

## Buttons

Button
IconButton

## Navigation

Tabs
Sheet
Dialog

## Display

Avatar
Badge
Card

## Feedback

Alert
Toast
Progress

---

# Example: Login Screen

Agents should generate screens using primitives.

Example:

```
import { View, Text, Input, Button } from "radix-native-ui"

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center px-6">

      <Text variant="title">
        Login
      </Text>

      <Input placeholder="Email" />

      <Input
        placeholder="Password"
        secureTextEntry
      />

      <Button>
        Sign In
      </Button>

    </View>
  )
}
```

---

# Example: Profile Screen

```
import { View, Text, Avatar, Button } from "radix-native-ui"

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center">

      <Avatar src="https://example.com/avatar.png" />

      <Text variant="title">
        John Doe
      </Text>

      <Button>
        Edit Profile
      </Button>

    </View>
  )
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

---

# Styling

Agents may use:

* Tailwind-style class names
* inline styles
* style props

Prefer consistent spacing and mobile layout conventions.

Example:

```
<View className="flex-1 px-6 py-8">
```

---

# Accessibility

Generated components should:

* include readable text labels
* support touch targets
* avoid overly dense UI

---

# Anti-Patterns

Agents should NOT:

* mix multiple UI frameworks
* recreate primitives that already exist
* rely heavily on raw React Native components
* generate web-only UI code

---

# Recommended Screen Patterns

Common screens agents may generate:

* login screens
* onboarding flows
* settings pages
* profile pages
* dashboards
* chat interfaces

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

* use primitives from radix-native-ui
* follow mobile layout patterns
* keep components simple and readable
