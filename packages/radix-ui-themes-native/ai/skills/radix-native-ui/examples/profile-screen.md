# Profile Screen Example

This example demonstrates a user profile screen built with radix-native-ui components.

## Screen Composition

The profile screen uses:
- `Avatar` for user image
- `Text` for headings and info
- `Button` for actions
- `Card` for grouping content
- `Flex` for layout (vertical and horizontal)
- `Separator` for visual division

## Code Example

```tsx
import React from 'react';
import { Box, Text, Avatar, Button, Card, Separator, Flex } from 'radix-native-ui';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  joinedDate: string;
}

export default function ProfileScreen() {
  const user: User = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Mobile developer passionate about React Native',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
  };

  return (
    <ScrollView flex={1}>
      <Flex 
        align="center" 
        direction="column" 
        flex={1} 
        gap={4} 
        justify="center" 
        maxWidth={400} 
        padding={4}
      >
        {/* Avatar */}
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          size={4}
          radius="full"
        />

        {/* Name & Email */}
        <Box alignItems="center">
          <Text variant="title" align="center">
            {user.name}
          </Text>
          <Text variant="body" color="gray" align="center">
            {user.email}
          </Text>
        </Box>

        {/* Bio */}
        <Text variant="body" align="center">
          {user.bio}
        </Text>

        {/* Location & Joined - Horizontal layout */}
        <Flex gap={1} alignItems="center">
          <Text variant="caption" color="gray">
            📍 {user.location}
          </Text>
          <Text variant="caption" color="gray">•</Text>
          <Text variant="caption" color="gray">
            Joined {user.joinedDate}
          </Text>
        </Flex>

        {/* Action Buttons - Horizontal layout */}
        <Flex gap={2} flexDirection="row" style={{ width: '100%' }}>
          <Button variant="solid" size={3} style={{ flex: 1 }}>
            Edit Profile
          </Button>
          <Button variant="outline" size={3}>
            Share
          </Button>
        </Flex>

        <Separator />

        {/* Stats Card */}
        <Card style={{ width: '100%' }}>
          <Flex gap={3} direction="row" justifyContent="space-around">
            <Box alignItems="center">
              <Text variant="title">142</Text>
              <Text variant="caption" color="gray">Posts</Text>
            </Box>
            <Box alignItems="center">
              <Text variant="title">1.2K</Text>
              <Text variant="caption" color="gray">Followers</Text>
            </Box>
            <Box alignItems="center">
              <Text variant="title">890</Text>
              <Text variant="caption" color="gray">Following</Text>
            </Box>
          </Flex>
        </Card>

        <Separator />

        {/* Menu Items - Vertical layout */}
        <Flex align={'center'} direction={'column'} gap={2}>
          <Button variant="ghost" justifyContent="flex-start">
            My Posts
          </Button>
          <Button variant="ghost" justifyContent="flex-start">
            Saved Items
          </Button>
          <Button variant="ghost" justifyContent="flex-start">
            Settings
          </Button>
        </Flex>
      </Flex>
    </ScrollView>
  );
}
```

## Key Patterns

1. **Flex for main layout** - Use `Flex` with `direction="column"` for the main profile container
2. **Avatar sizing** - Use `size={4}` and `radius="full"` for circular avatar
3. **Card for grouping** - Use `Card` to group related content like stats
4. **Horizontal layouts** - Use `Flex` with `flexDirection="row"` for horizontal button groups and location/date
5. **Separator for visual breaks** - Use `Separator` between sections
