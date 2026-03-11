# Installation

To install Radix Native UI in a project:

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

If using Expo:

```bash
npx expo install radix-native-ui
```

## Requirements

Ensure the project uses:

- **React Native** >= 0.70
- **Expo** >= 48
- **React** >= 18

## Quick Start

After installation, import components directly from the package:

```tsx
import { Button, Text, Box } from 'radix-native-ui';

export default function App() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Text>Hello Radix!</Text>
      <Button>Click me</Button>
    </Box>
  );
}
```
