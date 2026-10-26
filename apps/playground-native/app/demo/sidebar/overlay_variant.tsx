import { Box, Flex, Heading, IconButton, Sidebar, Text } from 'radix-native-ui';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';
import { Ionicons } from '@expo/vector-icons';

export default function SidebarOverlayVariant() {
  return (
    <PageContainer>
      <Sidebar.Root animationDuration={200} side="left" variant="overlay" width={280}>
        <PageHeader showBackButton>
          {/* Plain forward row filling the space after the back arrow —
              nesting a row-reverse space-between row here made the title
              overlap the arrow. */}
          <Flex direction={'row'} align={'center'} flex={1} gap={8} justify={'space-between'} paddingRight={12}>
            <Box>
              <Heading size={6}>Sidebar (Overlay Variant)</Heading>
              <Text color="gray" size={3}>
                The drawer slides in on top of the page behind a dim
              </Text>
            </Box>
            <Sidebar.Trigger>
              <IconButton accessibilityLabel={'menu-icon'} size={1} variant={'soft'}>
                <Ionicons name={'menu'} />
              </IconButton>
            </Sidebar.Trigger>
          </Flex>
        </PageHeader>
        <PageBody>
          <ScrollView style={{ flex: 1 }}>
            <Flex direction="column" gap={16} padding={16}>
              <Text>
                Tap the menu or swipe horizontally anywhere on the page — the
                drawer rides on top of this page, which stays still behind a
                fading dim. Tap the dim or swipe the drawer back to close it.
              </Text>
              <View style={{ height: 40 }} />
            </Flex>
          </ScrollView>
        </PageBody>
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
            <Sidebar.Item>
              <Text>Settings</Text>
            </Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Portal>
      </Sidebar.Root>
    </PageContainer>
  );
}
