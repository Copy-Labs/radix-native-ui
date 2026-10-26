import { Box, Button, Card, Flex, FloatingTabBar, Heading, Text, ThemeProvider } from 'radix-native-ui';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'inbox', label: 'Inbox', icon: 'mail' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
] as const;

export default function FloatingTabBarDemo() {
  const [tab, setTab] = useState<string>('home');
  const [inboxCount, setInboxCount] = useState<number>(3);

  const active = TABS.find((t) => t.value === tab)!;

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', grayColor: 'gray', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box>
            <Heading size={6}>Floating Tab Bar</Heading>
            <Text color={'gray'} size={3}>
              Elevated bottom navigation with animated active pill
            </Text>
          </Box>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <Flex direction={'column'} gap={24} padding={12}>
              {/* Interactive app-like preview */}
              <Card radius={'large'}>
                <Flex direction={'column'} gap={12}>
                  <Heading size={4}>Try it</Heading>
                  <Text color={'gray'} size={3}>
                    The bar below is controlled - the content area reacts to the active tab. Tap Inbox and it
                    consumes one unread message.
                  </Text>
                  <Box
                    style={{
                      minHeight: 120,
                      borderRadius: 12,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flex direction={'column'} align={'center'} gap={8}>
                      <Ionicons name={active.icon as any} size={28} color={'#6E56CF'} />
                      <Text weight={'medium'}>{active.label} screen</Text>
                      {active.value === 'inbox' ? (
                        <Text color={'gray'} size={2}>{inboxCount} unread</Text>
                      ) : null}
                    </Flex>
                  </Box>
                  <FloatingTabBar.Root value={tab} onValueChange={(v) => {
                    setTab(v);
                    if (v === 'inbox') setInboxCount((c) => Math.max(0, c - 1));
                  }}>
                    {TABS.map((t) => (
                      <FloatingTabBar.Item
                        key={t.value}
                        value={t.value}
                        label={t.label}
                        icon={<Ionicons name={t.icon as any} />}
                        badge={t.value === 'inbox' && inboxCount > 0 ? inboxCount : undefined}
                      />
                    ))}
                  </FloatingTabBar.Root>
                </Flex>
              </Card>

              {/* Sizes */}
              <Card radius={'large'}>
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Sizes</Heading>
                  {[1, 2, 3, 4].map((size) => (
                    <Box key={size}>
                      <Text color={'gray'} size={2} style={{ marginBottom: 6 }}>
                        size={'{'}{size}{'}'}
                      </Text>
                      <FloatingTabBar.Root defaultValue={'home'} size={size as 1 | 2 | 3 | 4} elevation={1}>
                        <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
                        <FloatingTabBar.Item value="search" label="Search" icon={<Ionicons name="search" />} />
                        <FloatingTabBar.Item value="alerts" label="Alerts" icon={<Ionicons name="notifications" />} badge={7} />
                        <FloatingTabBar.Item value="profile" label="Profile" icon={<Ionicons name="person" />} />
                      </FloatingTabBar.Root>
                    </Box>
                  ))}
                </Flex>
              </Card>

              {/* Colors */}
              <Card radius={'large'}>
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Colors & elevation</Heading>
                  <Box>
                    <Text color={'gray'} size={2} style={{ marginBottom: 6 }}>
                      {'color={"crimson"} elevation={3}'}
                    </Text>
                    <FloatingTabBar.Root defaultValue={'search'} color="crimson" elevation={3}>
                      <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
                      <FloatingTabBar.Item value="search" label="Search" icon={<Ionicons name="search" />} />
                      <FloatingTabBar.Item value="heart" label="Saved" icon={<Ionicons name="heart" />} badge={12} />
                    </FloatingTabBar.Root>
                  </Box>
                  <Box>
                    <Text color={'gray'} size={2} style={{ marginBottom: 6 }}>
                      {'color={"gray"} radius={"large"} - neutral selection, no floating margin'}
                    </Text>
                    <FloatingTabBar.Root defaultValue={'settings'} color="gray" radius={'large'} inset={0} elevation={0}>
                      <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
                      <FloatingTabBar.Item value="search" label="Search" icon={<Ionicons name="search" />} />
                      <FloatingTabBar.Item value="settings" label="Settings" icon={<Ionicons name="settings" />} />
                    </FloatingTabBar.Root>
                  </Box>
                  <Box>
                    <Text color={'gray'} size={2} style={{ marginBottom: 6 }}>
                      disabled bar
                    </Text>
                    <FloatingTabBar.Root defaultValue={'home'} disabled>
                      <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
                      <FloatingTabBar.Item value="search" label="Search" icon={<Ionicons name="search" />} badge={2} />
                    </FloatingTabBar.Root>
                  </Box>
                </Flex>
              </Card>

              {/* Uncontrolled + reset */}
              <Card radius={'large'}>
                <Flex direction={'column'} gap={12}>
                  <Heading size={4}>Uncontrolled</Heading>
                  <Text color={'gray'} size={3}>
                    Omit value/onValueChange and the bar manages its own state (seeded by defaultValue).
                  </Text>
                  <FloatingTabBar.Root defaultValue={'profile'}>
                    <FloatingTabBar.Item value="home" label="Home" icon={<Ionicons name="home" />} />
                    <FloatingTabBar.Item value="search" label="Search" icon={<Ionicons name="search" />} />
                    <FloatingTabBar.Item value="profile" label="Profile" icon={<Ionicons name="person" />} />
                  </FloatingTabBar.Root>
                  <Button size={2} variant={'ghost'} color={'gray'} onPress={() => setTab('home')}>
                    Reset the controlled bar above to Home
                  </Button>
                </Flex>
              </Card>
            </Flex>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
