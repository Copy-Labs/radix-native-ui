import { Box, Flex, Heading, IconButton, Sidebar, Text } from 'radix-native-ui';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';
import { Ionicons } from '@expo/vector-icons';

export default function SidebarRevealVariant() {
  return (
    <PageContainer>
      <Sidebar.Root animationDuration={150} side="left" variant="reveal" width={280}>
        <PageHeader showBackButton>
          <Flex direction={'row'} align={'center'} flex={1} gap={8} justify={'space-between'} paddingRight={12}>
            <Box>
              <Heading size={6}>Sidebar (Reveal Variant)</Heading>
              <Text color="gray" size={3}>
                The page recedes — scaling down and dimming — to reveal it
              </Text>
            </Box>
            <Sidebar.Trigger>
              <IconButton accessibilityLabel={'menu-icon'} size={1} variant={'soft'}>
                <Ionicons name={'menu'} />
              </IconButton>
            </Sidebar.Trigger>
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
          {/* The page slides aside AND scales down + dims, receding over the
              statically anchored drawer (Material reveal style) */}
          <Sidebar.Main>
            <PageBody>
              <ScrollView style={{ flex: 1 }}>
                <Flex direction="column" gap={16} padding={16}>
                  <Text>
                    Swipe horizontally anywhere (or tap the menu) and this page
                    slides aside while shrinking and dimming, exposing the
                    drawer anchored underneath it. Tap the dimmed page or swipe
                    back to close.
                  </Text>
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
