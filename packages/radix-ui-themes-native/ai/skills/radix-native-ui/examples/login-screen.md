# Login Screen Example

This example demonstrates a login screen built with radix-native-ui components.

## Screen Composition

The login screen uses:
- `Box` for main container and layout
- `Text` for headings and labels
- `TextField` for email and password inputs
- `Button` for primary actions
- `Link` for navigation links

## Code Example

```tsx
import React, { useState } from 'react';
import { Box, Text, TextField, Button, Link, Center, Stack } from 'radix-native-ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Handle login logic
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Flex align={'center'} direction={'column'} flex={1} gap={4} justify={'center'} maxWidth={400} padding={4}>
        {/* Header */}
        <Box alignItems="center" marginBottom={4}>
          <Text variant="title" align="center">
            Welcome Back
          </Text>
          <Text variant="body" color="gray" align="center">
            Sign in to continue
          </Text>
        </Box>

        {/* Email Input */}
        <Box>
          <Text variant="body" marginBottom={1}>
            Email
          </Text>
          <TextField
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Box>

        {/* Password Input */}
        <Box>
          <Text variant="body" marginBottom={1}>
            Password
          </Text>
          <TextField
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Box>

        {/* Forgot Password */}
        <Box alignItems="flex-end">
          <Link href="/forgot-password">
            <Text variant="body" color="blue">
              Forgot password?
            </Text>
          </Link>
        </Box>

        {/* Login Button */}
        <Button 
          variant="solid" 
          size={3} 
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 4 }}
        >
          Sign In
        </Button>

        {/* Sign Up Link */}
        <Box flexDirection="row" justifyContent="center" gap={1}>
          <Text variant="body">Don't have an account?</Text>
          <Link href="/signup">
            <Text variant="body" color="blue" weight="bold">
              Sign up
            </Text>
          </Link>
        </Box>
    </Flex>
  );
}
```

## Key Patterns

1. **Center the content** - Use `Flex` for vertically/horizontally centered layouts
2. **Semantic inputs** - Use `TextField` instead of raw `TextInput`
3. **Loading states** - Use `loading` prop on Button for async actions
4. **Form layout** - Label inputs with `Text` above the field
