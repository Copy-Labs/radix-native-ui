import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
  Sidebar,
} from 'radix-native-ui';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function SidebarDemo() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <Box>
          <Heading size={6}>Sidebar</Heading>
          <Text color="gray" size={3}>
            Navigation drawer / Hamburger menu
          </Text>
        </Box>
      </PageHeader>
      <PageBody>
        <ScrollView style={styles.container}>
          <Flex direction="column" gap={16} padding={16}>
            {/* Basic Sidebar - Left */}
            <Card>
              <Heading size={4} style={{ marginBottom: 12 }}>
                Left Sidebar (Overlay)
              </Heading>
              <Text size={2} color="gray" style={{ marginBottom: 16 }}>
                The classic hamburger menu that slides in from the left.
              </Text>

              <BasicLeftSidebar />
            </Card>

            {/* Right Sidebar */}
            <Card>
              <Heading size={4} style={{ marginBottom: 12 }}>
                Right Sidebar
              </Heading>
              <Text size={2} color="gray" style={{ marginBottom: 16 }}>
                A sidebar that slides in from the right side.
              </Text>

              <BasicRightSidebar />
            </Card>

            {/* Custom Width */}
            <Card>
              <Heading size={4} style={{ marginBottom: 12 }}>
                Custom Widths
              </Heading>
              <Text size={2} color="gray" style={{ marginBottom: 16 }}>
                Sidebars can have different widths.
              </Text>

              <View style={styles.row}>
                <SidebarWidthDemo width={200} />
                <SidebarWidthDemo width={300} />
              </View>
            </Card>

            {/* With Menu Items */}
            <Card>
              <Heading size={4} style={{ marginBottom: 12 }}>
                Navigation Menu
              </Heading>
              <Text size={2} color="gray" style={{ marginBottom: 16 }}>
                A typical navigation menu with items and separators.
              </Text>

              <NavigationSidebar />
            </Card>

            {/* Controlled State */}
            <Card>
              <Heading size={4} style={{ marginBottom: 12 }}>
                Controlled Sidebar
              </Heading>
              <Text size={2} color="gray" style={{ marginBottom: 16 }}>
                Control the sidebar state externally.
              </Text>

              <ControlledSidebarDemo />
            </Card>

            <View style={{ height: 40 }} />
          </Flex>
        </ScrollView>
      </PageBody>
    </PageContainer>
  );
}

// Basic Left Sidebar Demo
function BasicLeftSidebar() {
  return (
    <Sidebar.Root side="left" variant="overlay">
      <Sidebar.Trigger>
        <Button>Open Left Sidebar</Button>
      </Sidebar.Trigger>
      <Sidebar.Portal>
        <Sidebar.Overlay />
        <Sidebar.Content>
          <Sidebar.Header>
            <Heading size={4}>Menu</Heading>
          </Sidebar.Header>
          <Sidebar.Item>
            <Text>Home</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text>Search</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text>Profile</Text>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Portal>
    </Sidebar.Root>
  );
}

// Basic Right Sidebar Demo
function BasicRightSidebar() {
  return (
    <Sidebar.Root side="right" variant="overlay">
      <Sidebar.Trigger>
        <Button>Open Right Sidebar</Button>
      </Sidebar.Trigger>
      <Sidebar.Portal>
        <Sidebar.Overlay />
        <Sidebar.Content>
          <Sidebar.Header>
            <Heading size={4}>Settings</Heading>
          </Sidebar.Header>
          <Sidebar.Item>
            <Text>Account</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text>Notifications</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text>Privacy</Text>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Portal>
    </Sidebar.Root>
  );
}

// Custom Width Demo
function SidebarWidthDemo({ width }: { width: number }) {
  return (
    <Sidebar.Root side="left" variant="overlay" width={width}>
      <Sidebar.Trigger>
        <Button size={1}>{width}px</Button>
      </Sidebar.Trigger>
      <Sidebar.Portal>
        <Sidebar.Overlay />
        <Sidebar.Content>
          <Sidebar.Header>
            <Text size={2} weight="bold">
              {width}px Wide
            </Text>
          </Sidebar.Header>
          <Sidebar.Item>
            <Text size={2}>Item 1</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text size={2}>Item 2</Text>
          </Sidebar.Item>
          <Sidebar.Item>
            <Text size={2}>Item 3</Text>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Portal>
    </Sidebar.Root>
  );
}

// Navigation Menu Demo
function NavigationSidebar() {
  return (
    <Sidebar.Root side="left" variant="overlay" width={280}>
      <Sidebar.Trigger>
        <Button>Open Menu</Button>
      </Sidebar.Trigger>
      <Sidebar.Portal>
        <Sidebar.Overlay />
        <Sidebar.Content>
          <Sidebar.Header>
            <Box>
              <Heading size={4}>Navigation</Heading>
              <Text size={1} color="gray">
                Welcome, User
              </Text>
            </Box>
          </Sidebar.Header>

          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>🏠</Text>
              <Text>Home</Text>
            </Flex>
          </Sidebar.Item>
          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>🔍</Text>
              <Text>Explore</Text>
            </Flex>
          </Sidebar.Item>
          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>❤️</Text>
              <Text>Favorites</Text>
            </Flex>
          </Sidebar.Item>
          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>⚙️</Text>
              <Text>Settings</Text>
            </Flex>
          </Sidebar.Item>

          <Sidebar.Separator />

          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>❓</Text>
              <Text>Help & Support</Text>
            </Flex>
          </Sidebar.Item>
          <Sidebar.Item>
            <Flex gap={12} align="center">
              <Text>ℹ️</Text>
              <Text>About</Text>
            </Flex>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Portal>
    </Sidebar.Root>
  );
}

// Controlled Sidebar Demo
function ControlledSidebarDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <View>
      <Flex gap={12}>
        <Button onPress={() => setOpen(true)}>Open Sidebar</Button>
        <Button variant="soft" onPress={() => setOpen(false)}>
          Close Sidebar
        </Button>
      </Flex>
      <Text size={1} color="gray" style={{ marginTop: 8 }}>
        Status: {open ? 'Open' : 'Closed'}
      </Text>

      <Sidebar.Root side="left" variant="overlay" open={open} onOpenChange={setOpen}>
        <Sidebar.Portal>
          <Sidebar.Overlay />
          <Sidebar.Content>
            <Sidebar.Header>
              <Heading size={4}>Controlled</Heading>
            </Sidebar.Header>
            <Sidebar.Item>
              <Text>This sidebar is controlled externally.</Text>
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item>
              <Text>Try the buttons above!</Text>
            </Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Portal>
      </Sidebar.Root>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
