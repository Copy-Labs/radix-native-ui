import { Box, Button, Card, Flex, Heading, IconButton, Sidebar, Text } from 'radix-native-ui';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';
import { Ionicons } from '@expo/vector-icons';

export default function SidebarPushVariant() {
  return (
    <PageContainer>
      <Sidebar.Root animationDuration={150} side="left" variant="push" width={280}>
        <PageHeader showBackButton>
          <Flex direction={'row-reverse'} align={'center'} flex={1} gap={8} justify={'space-between'} paddingRight={12}>
            <Sidebar.Trigger>
              <IconButton accessibilityLabel={'menu-icon'} size={1} variant={'soft'}>
                <Ionicons name={'menu'} />
              </IconButton>
            </Sidebar.Trigger>
            <Box>
              <Heading size={6}>Sidebar (Push Variant)</Heading>
              <Text color="gray" size={3}>
                Navigation drawer / Hamburger menu
              </Text>
            </Box>
          </Flex>
        </PageHeader>
        <Sidebar.Container>
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
          {/* Main content that slides */}
          <Sidebar.Main>
            <PageBody>
              <ScrollView style={{ flex: 1 }}>
                <Flex direction="column" gap={16} padding={16}>
                  <Text>This is the Body that should be moving...</Text>
                  <View style={{ height: 40 }} />
                </Flex>
              </ScrollView>
            </PageBody>
          </Sidebar.Main>
        </Sidebar.Container>
      </Sidebar.Root>
    </PageContainer>
  );
}
