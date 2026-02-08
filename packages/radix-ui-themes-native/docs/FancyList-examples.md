# FancyList Component Examples

This document provides various examples of how to use the [`FancyList`](packages/radix-ui-themes-native/src/components/data-display/FancyList.tsx:65) component in different scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Simple Text List](#simple-text-list)
- [Contact List with Avatars](#contact-list-with-avatars)
- [Settings/Options List](#settingsoptions-list)
- [Product List with Prices](#product-list-with-prices)
- [List with Actions/Buttons](#list-with-actionsbuttons)
- [Non-Scrollable Form List](#non-scrollable-form-list)
- [List with Headers and Footers](#list-with-headers-and-footers)
- [Empty State Handling](#empty-state-handling)
- [Custom Key Extraction](#custom-key-extraction)

---

## Basic Usage

```tsx
import { FancyList } from '@radix-ui-themes-native/components';
import { Flex, Text } from '@radix-ui-themes-native/layout';

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

<FancyList
  data={users}
  renderItem={({ item }) => (
    <Flex direction="column">
      <Text weight="bold">{item.name}</Text>
      <Text size="2" color="gray">{item.email}</Text>
    </Flex>
  )}
/>
```

---

## Simple Text List

Display a simple list of strings or basic items.

```tsx
import { FancyList } from '@radix-ui-themes-native/components';
import { Text } from '@radix-ui-themes-native/typography';

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];

<FancyList
  data={countries}
  renderItem={({ item }) => <Text>{item}</Text>}
  showDividers={true}
/>
```

---

## Contact List with Avatars

Create a contact list using the [`Avatar`](packages/radix-ui-themes-native/src/components/data-display/Avatar.tsx:71) component.

```tsx
import { FancyList, Avatar } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

const contacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=1', phone: '+1 555-0101' },
  { id: '2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=2', phone: '+1 555-0102' },
  { id: '3', name: 'Carol White', avatar: 'https://i.pravatar.cc/150?u=3', phone: '+1 555-0103' },
];

<FancyList
  data={contacts}
  renderItem={({ item }) => (
    <Flex align="center" gap={3}>
      <Avatar src={item.avatar} alt={item.name} size={3} />
      <Flex direction="column" flex={1}>
        <Text weight="medium">{item.name}</Text>
        <Text size="2" color="gray">{item.phone}</Text>
      </Flex>
    </Flex>
  )}
/>
```

---

## Settings/Options List

Build a settings screen with toggle switches or checkmarks.

```tsx
import { FancyList, Switch } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';
import { useState } from 'react';

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'info';
}

const settings: Setting[] = [
  { id: 'notifications', title: 'Push Notifications', description: 'Receive push notifications', type: 'toggle' },
  { id: 'dark_mode', title: 'Dark Mode', description: 'Use dark theme', type: 'toggle' },
  { id: 'version', title: 'Version', description: '1.0.0', type: 'info' },
];

const SettingsList = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    dark_mode: false,
  });

  return (
    <FancyList
      data={settings}
      renderItem={({ item }) => (
        <Flex align="center" justify="space-between">
          <Flex direction="column" flex={1}>
            <Text weight="medium">{item.title}</Text>
            <Text size="2" color="gray">{item.description}</Text>
          </Flex>
          {item.type === 'toggle' && (
            <Switch
              checked={toggles[item.id]}
              onValueChange={(value) => setToggles(prev => ({ ...prev, [item.id]: value }))}
            />
          )}
        </Flex>
      )}
    />
  );
};
```

---

## Product List with Prices

Display products with images, descriptions, and pricing using [`Badge`](packages/radix-ui-themes-native/src/components/data-display/Badge.tsx:50) for labels.

```tsx
import { FancyList, Badge, Avatar } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 199.99, category: 'Electronics', inStock: true },
  { id: '2', name: 'Leather Wallet', price: 79.99, category: 'Accessories', inStock: true },
  { id: '3', name: 'Smart Watch', price: 299.99, category: 'Electronics', inStock: false },
];

<FancyList
  data={products}
  renderItem={({ item }) => (
    <Flex align="center" gap={3}>
      <Box
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          backgroundColor: '#f0f0f0',
        }}
      />
      <Flex direction="column" flex={1}>
        <Flex align="center" gap={2}>
          <Text weight="bold">{item.name}</Text>
          {!item.inStock && (
            <Badge color="red" size={1}>Out of Stock</Badge>
          )}
        </Flex>
        <Text size="2" color="gray">{item.category}</Text>
        <Text weight="bold" color="green">${item.price.toFixed(2)}</Text>
      </Flex>
    </Flex>
  )}
/>
```

---

## List with Actions/Buttons

Create a list where each item has action buttons using [`Button`](packages/radix-ui-themes-native/src/components/forms/Button.tsx:98).

```tsx
import { FancyList, Button } from '@radix-ui-themes-native/components';
import { Flex } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const tasks: Task[] = [
  { id: '1', title: 'Complete project proposal', dueDate: '2024-01-15', priority: 'high' },
  { id: '2', title: 'Review pull requests', dueDate: '2024-01-16', priority: 'medium' },
  { id: '3', title: 'Update documentation', dueDate: '2024-01-20', priority: 'low' },
];

const TaskList = () => {
  const handleView = (taskId: string) => {
    console.log('View task:', taskId);
  };

  const handleComplete = (taskId: string) => {
    console.log('Complete task:', taskId);
  };

  return (
    <FancyList
      data={tasks}
      renderItem={({ item }) => (
        <Flex direction="column" gap={2}>
          <Flex align="center" justify="space-between">
            <Flex direction="column" flex={1}>
              <Text weight="medium">{item.title}</Text>
              <Text size="2" color="gray">Due: {item.dueDate}</Text>
            </Flex>
            <Badge
              color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'}
              size={1}
            >
              {item.priority}
            </Badge>
          </Flex>
          <Flex gap={2} justify="flex-end">
            <Button size={1} variant="outline" onPress={() => handleView(item.id)}>
              View
            </Button>
            <Button size={1} onPress={() => handleComplete(item.id)}>
              Complete
            </Button>
          </Flex>
        </Flex>
      )}
      showDividers={false}
    />
  );
};
```

---

## Non-Scrollable Form List

Use `scrollable={false}` for fixed-height form-like lists.

```tsx
import { FancyList } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';
import { TextField } from '@radix-ui-themes-native/forms';

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password';
}

const formFields: FormField[] = [
  { id: 'first_name', label: 'First Name', placeholder: 'Enter first name', type: 'text' },
  { id: 'email', label: 'Email', placeholder: 'Enter email', type: 'email' },
  { id: 'password', label: 'Password', placeholder: 'Enter password', type: 'password' },
];

const FormList = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <FancyList
      data={formFields}
      scrollable={false}
      showDividers={false}
      renderItem={({ item }) => (
        <Flex direction="column" gap={1}>
          <Text size={2} weight="medium">{item.label}</Text>
          <TextField
            placeholder={item.placeholder}
            value={values[item.id] || ''}
            onChangeText={(text) => setValues(prev => ({ ...prev, [item.id]: text }))}
            secureTextEntry={item.type === 'password'}
          />
        </Flex>
      )}
    />
  );
};
```

---

## List with Headers and Footers

Add section headers, descriptions, and footer actions.

```tsx
import { FancyList, Button } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text, Heading } from '@radix-ui-themes-native/typography';

interface Section {
  title: string;
  items: { id: string; name: string; value: string }[];
}

const sections: Section[] = [
  {
    title: 'Personal Information',
    items: [
      { id: 'name', name: 'Full Name', value: 'John Doe' },
      { id: 'email', name: 'Email', value: 'john@example.com' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'theme', name: 'Theme', value: 'Dark' },
      { id: 'language', name: 'Language', value: 'English' },
    ],
  },
];

const ProfileList = () => {
  const renderHeader = () => (
    <Flex direction="column" align="center" gap={2} paddingVertical={4}>
      <Heading size={4}>Profile Settings</Heading>
      <Text size={2} color="gray">Manage your account preferences</Text>
    </Flex>
  );

  const renderFooter = () => (
    <Flex padding={4} gap={2}>
      <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
      <Button style={{ flex: 1 }}>Save Changes</Button>
    </Flex>
  );

  return (
    <FancyList
      data={sections.flatMap(s => s.items)}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <Flex direction="column" gap={1}>
          <Text size={2} color="gray">{item.name}</Text>
          <Text weight="medium">{item.value}</Text>
        </Flex>
      )}
    />
  );
};
```

---

## Empty State Handling

Display a custom empty state when no data is available.

```tsx
import { FancyList } from '@radix-ui-themes-native/components';
import { Flex } from '@radix-ui-themes-native/layout';
import { Text, Heading } from '@radix-ui-themes-native/typography';

const EmptyList = () => {
  const EmptyComponent = () => (
    <Flex direction="column" align="center" gap={2} paddingVertical={8}>
      <Heading size={4} color="gray">No Items Found</Heading>
      <Text size={2} color="gray">Get started by adding your first item</Text>
    </Flex>
  );

  return (
    <FancyList
      data={[]} // Empty data
      ListEmptyComponent={EmptyComponent}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
};
```

---

## Custom Key Extraction

Use `keyExtractor` for custom key generation when items don't have an `id` property.

```tsx
import { FancyList } from '@radix-ui-themes-native/components';
import { Flex, Box } from '@radix-ui-themes-native/layout';
import { Text } from '@radix-ui-themes-native/typography';

interface Message {
  sender: string;
  content: string;
  timestamp: number;
}

// Data without unique IDs
const messages: Message[] = [
  { sender: 'Alice', content: 'Hello!', timestamp: Date.now() - 10000 },
  { sender: 'Bob', content: 'Hi there!', timestamp: Date.now() - 5000 },
  { sender: 'Alice', content: 'How are you?', timestamp: Date.now() },
];

<FancyList
  data={messages}
  keyExtractor={(item, index) => `${item.sender}-${item.timestamp}-${index}`}
  renderItem={({ item }) => (
    <Flex
      direction="column"
      align={item.sender === 'Alice' ? 'flex-end' : 'flex-start'}
    >
      <Box
        style={{
          maxWidth: '80%',
          padding: 2,
          paddingHorizontal: 3,
          borderRadius: 8,
          backgroundColor: item.sender === 'Alice' ? 'blue' : 'gray',
        }}
      >
        <Text color={item.sender === 'Alice' ? 'white' : 'black'}>
          {item.content}
        </Text>
      </Box>
    </Flex>
  )}
/>
```

---

## Props Reference

| Prop | Type                                  | Default | Description |
|------|---------------------------------------|---------|-------------|
| `data` | `T[]`                                 | Required | Array of data items to render |
| `renderItem` | `(info: FancyListItem<T>) => ReactNode` | Required | Function to render each item |
| `keyExtractor` | `(item: T, index: number) => string`  | Auto-detects `id` | Custom key extraction |
| `style` | `StyleProp<ViewStyle>`                | - | Custom container style |
| `showDividers` | `boolean`                             | `true` | Show dividers between items |
| `scrollable` | `boolean`                             | `true` | Enable/disable scrolling |
| `itemPadding` | `number`                              | Theme space[3] | Custom item padding |
| `ListEmptyComponent` | `ReactNode`                           | - | Component when list is empty |
| `ListHeaderComponent` | `ReactNode`                           | - | Header component |
| `ListFooterComponent` | `ReactNode`                           | - | Footer component |

---

## Tips and Best Practices

1. **Memoize `renderItem`** - For optimal performance, wrap your renderItem function with `useCallback` to prevent unnecessary re-renders.

2. **Use `scrollable={false}` for forms** - When using FancyList in a fixed-height container like a modal, set `scrollable={false}` to prevent scroll conflicts.

3. **Leverage `keyExtractor`** - Always provide a stable unique key when your items might change order or be filtered.

4. **Customize dividers** - Set `showDividers={false}` when you need a different visual separator or card-like appearance.

5. **Combine with Layout components** - Use [`Flex`](packages/radix-ui-themes-native/src/components/layout/Flex.tsx:216) and [`Box`](packages/radix-ui-themes-native/src/components/layout/Box.tsx) for complex item layouts.
