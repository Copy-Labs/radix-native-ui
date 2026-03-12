# Settings Screen Example

This example demonstrates a settings screen built with radix-native-ui components.

## Screen Composition

The settings screen uses:
- `Switch` for toggle settings
- `Button` for navigation items
- `Separator` for section division
- `Flex` for layouts
- `Box` for list items

## Code Example

```tsx
import React, { useState } from 'react';
import { Box, Text, Button, Switch, Separator, Flex, Avatar } from 'radix-native-ui';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Flex align="center" direction="column" flex={1} gap={4} maxWidth={400}>
      {/* Header */}
      <Box padding={4} borderBottomWidth={1} style={{ width: '100%' }}>
        <Text variant="title">Settings</Text>
      </Box>

      <ScrollView flex={1}>
        <Flex gap={4} padding={4}>
          
          {/* Account Section */}
          <Box style={{ width: '100%' }}>
            <Text variant="caption" color="gray" marginBottom={2}>
              ACCOUNT
            </Text>
            <Flex gap={0}>
              <Button variant="ghost" justifyContent="flex-start" height="auto" padding={3}>
                <Flex gap={3} flexDirection="row" alignItems="center" style={{ width: '100%' }}>
                  <Avatar src="https://example.com/avatar.jpg" size={3} radius="full" />
                  <Box flex={1}>
                    <Text variant="body" weight="bold">John Doe</Text>
                    <Text variant="caption" color="gray">john@example.com</Text>
                  </Box>
                </Flex>
              </Button>
              <Separator />
              <Button variant="ghost" justifyContent="flex-start">
                Edit Profile
              </Button>
              <Separator />
              <Button variant="ghost" justifyContent="flex-start">
                Change Password
              </Button>
            </Flex>
          </Box>

          {/* Preferences Section */}
          <Box style={{ width: '100%' }}>
            <Text variant="caption" color="gray" marginBottom={2}>
              PREFERENCES
            </Text>
            <Flex gap={0}>
              <SettingToggle
                title="Push Notifications"
                description="Receive push notifications for updates"
                value={notifications}
                onValueChange={setNotifications}
              />
              <Separator />
              <SettingToggle
                title="Dark Mode"
                description="Use dark theme"
                value={darkMode}
                onValueChange={setDarkMode}
              />
              <Separator />
              <SettingToggle
                title="Location Services"
                description="Allow apps to access your location"
                value={location}
                onValueChange={setLocation}
              />
            </Flex>
          </Box>

          {/* Privacy Section */}
          <Box style={{ width: '100%' }}>
            <Text variant="caption" color="gray" marginBottom={2}>
              PRIVACY
            </Text>
            <Flex gap={0}>
              <Button variant="ghost" justifyContent="flex-start">
                Privacy Policy
              </Button>
              <Separator />
              <Button variant="ghost" justifyContent="flex-start">
                Terms of Service
              </Button>
              <Separator />
              <Button variant="ghost" justifyContent="flex-start">
                Data & Storage
              </Button>
            </Flex>
          </Box>

          {/* Marketing Section */}
          <Box style={{ width: '100%' }}>
            <Text variant="caption" color="gray" marginBottom={2}>
              MARKETING
            </Text>
            <Flex gap={0}>
              <SettingToggle
                title="Newsletter"
                description="Receive weekly newsletter"
                value={newsletter}
                onValueChange={setNewsletter}
              />
            </Flex>
          </Box>

          {/* Danger Zone */}
          <Box style={{ width: '100%' }}>
            <Text variant="caption" color="red" marginBottom={2}>
              DANGER ZONE
            </Text>
            <Button variant="outline" color="red">
              Delete Account
            </Button>
          </Box>

          {/* Version Info */}
          <Box alignItems="center" padding={4} style={{ width: '100%' }}>
            <Text variant="caption" color="gray">
              Version 1.0.0 (2024.1)
            </Text>
          </Box>

        </Flex>
      </ScrollView>
    </Flex>
  );
}

// Helper component for toggle settings
function SettingToggle({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      padding={3}
      justifyContent="space-between"
    >
      <Box flex={1} paddingRight={2}>
        <Text variant="body">{title}</Text>
        <Text variant="caption" color="gray">{description}</Text>
      </Box>
      <Switch value={value} onValueChange={onValueChange} />
    </Box>
  );
}
```

## Key Patterns

1. **Section headers** - Use caption text with `color="gray"` for section labels
2. **Toggle settings** - Use `Switch` component for boolean settings
3. **List items** - Use `Button` variant="ghost" with `justifyContent="flex-start"` for tappable items
4. **Separator between items** - Use `Separator` for visual division
5. **Helper components** - Extract `SettingToggle` for reusable toggle list items
6. **Danger zone** - Use `color="red"` for destructive actions
