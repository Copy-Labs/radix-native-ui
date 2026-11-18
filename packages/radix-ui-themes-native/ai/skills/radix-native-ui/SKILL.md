# Radix Native UI Skill

## Skill Name
radix-native-ui

## Purpose
Enable AI agents to generate React Native and Expo user interfaces using Radix Native UI.

## Framework
radix-native-ui

## Author
Copy Labs

## Capabilities
- Install Radix Native UI
- Generate components using available primitives
- Compose UI with proper component composition
- Scaffold mobile screens following best practices
- Apply correct styling (style props, NOT className)
- Implement accessible mobile-first UI patterns

## Platforms Supported
- Expo
- React Native

## Requirements
- React Native >= 0.70
- Expo >= 48
- React >= 18

## Component Philosophy
Radix Native UI follows a composable primitive architecture inspired by Radix UI. The library provides:
- Layout components (Box, Stack, Flex, Center, Grid)
- Typography (Text, Heading, Code, Link)
- Form inputs (TextField, TextArea, Select, Checkbox, Radio, Switch, Slider)
- Navigation (Tabs, BottomSheet, Dialog, Popover, Tooltip)
- Data display (Avatar, Badge, Card, Progress, Table)

## Styling
⚠️ **IMPORTANT**: Radix Native UI does NOT support className. Use:
- **style prop** for custom styles
- **Semantic props** for common patterns (variant, size, color)
- **Layout props** on Box (padding, margin, flexDirection, etc.)

```tsx
// Correct
<Box padding={4} style={{ backgroundColor: 'white' }}>
  <Button variant="solid" size={2}>Click</Button>
</Box>

// Incorrect - className NOT supported
<Box className="container">...</Box>
```

## Importing Components

```tsx
import { Button, Text, Box, TextField } from 'radix-native-ui';
```

`TextField` is the single-line input. Use it directly (`<TextField placeholder="Email" />`) or compose
it with `<TextField.Root>` / `<TextField.Slot>` when you need slots. There is no `Input` component.

## Haptics

Haptics are enabled by default and are controlled at two levels:

- `<ThemeProvider haptics={false}>` disables haptics globally (the default is `true`).
- `useHaptics()` returns that global boolean and throws outside a `ThemeProvider`.
- Interactive components (Button, IconButton, Switch, Checkbox, Radio, Slider, SegmentedControl,
  menus, etc.) accept a local `hapticFeedback?: boolean` prop (default `true`). Feedback fires only
  when **both** the global setting and the local prop are enabled.

For custom interactions, fire a haptic directly:

```tsx
import React, { useState } from 'react';
import {
  Button,
  Switch,
  triggerHaptic,
  type HapticFeedbackType,
} from 'radix-native-ui';

function NotificationForm() {
  const [enabled, setEnabled] = useState(false);

  const notify = (type: HapticFeedbackType) => triggerHaptic(type);

  const handleSave = () => {
    // ... save the form ...
    notify('notificationSuccess');
  };

  return (
    <>
      <Switch checked={enabled} onCheckedChange={setEnabled} hapticFeedback />
      <Button onPress={handleSave}>Save</Button>
    </>
  );
}
```

`HapticFeedbackType` is one of: `'selection'`, `'press'`, `'toggleOn'`, `'toggleOff'`, `'impactLight'`,
`'impactMedium'`, `'impactHeavy'`, `'notificationSuccess'`, `'notificationWarning'`, `'notificationError'`.

`expo-haptics` is an optional peer dependency. On iOS the Taptic Engine is used; on Android the library
prefers expo-haptics' `performAndroidHapticsAsync` (system haptics) and only falls back to a short
vibration when expo-haptics is unavailable.

## Usage Examples

### Generate a login screen
```
Use skill: radix-native-ui

Generate a login screen using Radix Native UI with email/password fields and a submit button.
```

### Generate a profile screen
```
Use skill: radix-native-ui

Generate a profile screen using Radix Native UI components showing user avatar, name, and stats.
```

### Generate a settings screen
```
Use skill: radix-native-ui

Generate a settings screen using Radix Native UI with toggle switches and navigation items.
```

## Common Mistakes to Avoid

| Mistake | Correction |
|---------|------------|
| Using "Sheet" | Use "BottomSheet" instead |
| Using "Input" | Use "TextField" instead |
| Using className | Use style prop and semantic props |
| Wrong version numbers | RN >= 0.70, Expo >= 48 |

## Additional Resources
- See `install.md` for installation instructions
- See `primitives.md` for complete component list
- See `guidelines.md` for styling and best practices
- See `examples/` folder for screen examples
