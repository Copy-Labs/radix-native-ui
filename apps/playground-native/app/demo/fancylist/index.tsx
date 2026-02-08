import {
  Flex,
  ThemeProvider,
  Heading,
  Card,
  Avatar,
  Box,
  Text,
  FancyList,
  Switch,
  Badge,
  Button,
  TextField,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Colors } from '@/constants/theme';

function BasicFancyList() {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <FancyList
      data={users}
      renderItem={({ item }) => (
        <Flex direction="column">
          <Text weight="bold">{item.name}</Text>
          <Text size={2} color="gray">
            {item.email}
          </Text>
        </Flex>
      )}
    />
  );
}

function ContactWithAvatarFancyList() {
  interface Contact {
    id: string;
    name: string;
    avatar: string;
    phone: string;
  }

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?u=1',
      phone: '+1 555-0101',
    },
    { id: '2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=2', phone: '+1 555-0102' },
    { id: '3', name: 'Carol White', avatar: 'https://i.pravatar.cc/150?u=3', phone: '+1 555-0103' },
  ];

  return (
    <FancyList
      data={contacts}
      renderItem={({ item }) => (
        <Flex align="center" gap={3}>
          <Avatar src={item.avatar} alt={item.name} size={3} />
          <Flex direction="column" flex={1}>
            <Text weight="medium">{item.name}</Text>
            <Text size={2} color="gray">
              {item.phone}
            </Text>
          </Flex>
        </Flex>
      )}
    />
  );
}

function SimpleFancyList() {
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];

  return (
    <FancyList
      data={countries}
      renderItem={({ item }) => <Text>{item}</Text>}
      showDividers={true}
    />
  );
}

const SettingsList = () => {
  interface Setting {
    id: string;
    title: string;
    description: string;
    type: 'toggle' | 'info';
  }

  const settings: Setting[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive push notifications',
      type: 'toggle',
    },
    { id: 'dark_mode', title: 'Dark Mode', description: 'Use dark theme', type: 'toggle' },
    { id: 'version', title: 'Version', description: '1.0.0', type: 'info' },
  ];

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
            <Text size={2} color="gray">
              {item.description}
            </Text>
          </Flex>
          {item.type === 'toggle' && (
            <Switch
              checked={toggles[item.id]}
              onCheckedChange={(value) => setToggles((prev) => ({ ...prev, [item.id]: value }))}
            />
          )}
        </Flex>
      )}
    />
  );
};

function ProductWithPricesList() {
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

  return (
    <FancyList
      data={products}
      renderItem={({ item }) => (
        <Flex align="center" gap={12}>
          <Avatar
            color={'gray'}
            fallback=" "
            radius={'large'}
            size={4}
            variant={'soft'}
          />
          <Flex direction="column" flex={1}>
            <Flex align="center" gap={8}>
              <Text weight="bold">{item.name}</Text>
              {!item.inStock && (
                <Badge color="red" radius={'full'} size={1}>
                  Out of Stock
                </Badge>
              )}
            </Flex>
            <Text size={2} color="gray">
              {item.category}
            </Text>
            <Text weight="bold" color="green">
              ${item.price.toFixed(2)}
            </Text>
          </Flex>
        </Flex>
      )}
    />
  );
}

const TaskList = () => {
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
              <Text size={2} color="gray">
                Due: {item.dueDate}
              </Text>
            </Flex>
            <Badge
              color={
                item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'green'
              }
              size={1}
            >
              {item.priority}
            </Badge>
          </Flex>
          <Flex gap={8} align={'center'} justify="flex-end">
            <Button size={1} variant="surface" onPress={() => handleView(item.id)}>
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

const FormList = () => {
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

  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <FancyList
      data={formFields}
      scrollable={false}
      showDividers={false}
      renderItem={({ item }) => (
        <Flex direction="column" gap={1}>
          <Text size={2} weight="medium">
            {item.label}
          </Text>
          <TextField
            placeholder={item.placeholder}
            value={values[item.id] || ''}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [item.id]: text }))}
            secureTextEntry={item.type === 'password'}
          />
        </Flex>
      )}
    />
  );
};

const ProfileList = () => {
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

  const renderHeader = () => (
    <Flex direction="column" align="center" gap={2} paddingVertical={4}>
      <Heading size={4}>Profile Settings</Heading>
      <Text size={2} color="gray">
        Manage your account preferences
      </Text>
    </Flex>
  );

  const renderFooter = () => (
    <Flex padding={4} gap={8}>
      <Button variant="surface" style={{ flex: 1 }}>
        Cancel
      </Button>
      <Button style={{ flex: 1 }}>Save Changes</Button>
    </Flex>
  );

  return (
    <FancyList
      data={sections.flatMap((s) => s.items)}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <Flex direction="column" gap={1}>
          <Text size={2} color="gray">
            {item.name}
          </Text>
          <Text weight="medium">{item.value}</Text>
        </Flex>
      )}
    />
  );
};

const EmptyList = () => {
  const EmptyComponent = () => (
    <Flex direction="column" align="center" gap={2} paddingVertical={8}>
      <Heading size={4} color="gray">
        No Items Found
      </Heading>
      <Text size={2} color="gray">
        Get started by adding your first item
      </Text>
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

const CustomKeyList = () => {
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

  return (
  <FancyList
    showDividers={false}
    data={messages}
    keyExtractor={(item, index) => `${item.sender}-${item.timestamp}-${index}`}
    renderItem={({ item }) => (
      <Flex
        direction="column"
        align={item.sender === 'Alice' ? 'flex-end' : 'flex-start'}
      >
        <Flex
          style={{
            maxWidth: '80%',
            padding: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: item.sender === 'Alice' ? 'blue' : 'gray',
          }}
        >
          <Text color={item.sender === 'Alice' ? 'white' : 'black'}>
            {item.content}
          </Text>
        </Flex>
      </Flex>
    )}
  />
  );
};

export default function Datalists() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView nestedScrollEnabled>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>FancyList</Heading>
              <Text size={4}>A FlatList with default styling</Text>
            </Box>
            <Flex direction={'column'} gap={16}>
              {/* Basic FancyList */}
              <Heading size={4}>Basic FancyList</Heading>
              <BasicFancyList />
            </Flex>

            {/* Contact List with Avatar */}
            <Flex direction={'column'} gap={16}>
              <Heading>Contact List with Avatar</Heading>
              <ContactWithAvatarFancyList />
            </Flex>

            {/* Settings List */}
            <Flex gap={12} direction="column">
              <Heading>Settings List</Heading>
              <SettingsList />
            </Flex>

            {/* Products With Prices List */}
            <Flex gap={12} direction="column">
              <Heading>Products List With Prices</Heading>
              <ProductWithPricesList />
            </Flex>

            {/* Task List */}
            <Flex gap={12} direction="column">
              <Heading>Task List</Heading>
              <TaskList />
            </Flex>

            {/* Form List */}
            <Flex gap={12} direction="column">
              <Heading>Form List</Heading>
              <FormList />
            </Flex>

            {/* Profile List */}
            <Flex gap={12} direction="column">
              <Heading>Profile List</Heading>
              <ProfileList />
            </Flex>

            {/* Empty List */}
            <Flex gap={12} direction="column">
              <Heading>Empty List</Heading>
              <EmptyList />
            </Flex>

            {/* CustomKey List */}
            <Flex gap={12} direction="column">
              <Heading>CustomKey List</Heading>
              <CustomKeyList />
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
