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
import { Button, Text, Box, Input } from 'radix-native-ui';
```

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
| Using className | Use style prop and semantic props |
| Wrong version numbers | RN >= 0.70, Expo >= 48 |

## Additional Resources
- See `install.md` for installation instructions
- See `primitives.md` for complete component list
- See `guidelines.md` for styling and best practices
- See `examples/` folder for screen examples
