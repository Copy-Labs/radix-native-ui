import { Box, Flex, SegmentedControl, ThemeProvider, Text, Heading, Card } from 'radix-native-ui';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function SegmentedControlDemo() {
  const [sg, setSg] = useState<string>('apple');

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', grayColor: 'gray', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box>
            <Heading size={6}>Segmented Control</Heading>
          </Box>
        </PageHeader>
        <PageBody>
          <Text color={'gray'} size={4}>
            Toggle buttons for switching between different values or views.
          </Text>
          <ScrollView>
            <Flex direction={'column'} gap={32} padding={12} align={'center'} justify={'center'}>
              <Card radius={'large'}>
                <Box width={'100%'} padding={12}>
                  <SegmentedControl.Root defaultValue={'option1'}>
                    <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
                    <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
                    <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>
              </Card>

              {/* Size 1 - Segmented Control */}
              <Flex direction={'column'} gap={16} width={'100%'}>
                <Heading>Sizes</Heading>
                <Box>
                  <SegmentedControl.Root
                    defaultValue={'apple'}
                    value={sg}
                    onValueChange={setSg}
                    size={1}
                  >
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>

                {/* Size 2 - Segmented Control */}
                <Box>
                  <SegmentedControl.Root defaultValue={'apple'} size={2}>
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>

                {/* Size 3 - Segmented Control */}
                <Box>
                  <SegmentedControl.Root radius={'large'} defaultValue={'apple'} size={3}>
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>

                {/* Size 4 - Segmented Control */}
                <Box>
                  <SegmentedControl.Root radius={'full'} defaultValue={'apple'} size={4}>
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>
              </Flex>

              {/* Colors - Segmented Control */}
              <Flex direction={'column'} gap={24} width={'100%'}>
                <Heading>Colors</Heading>
                <Box>
                  <SegmentedControl.Root color={'grass'} defaultValue={'apple'} radius={'full'}>
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>

                <Box>
                  <SegmentedControl.Root color={'blue'} radius={'large'} defaultValue={'banana'}>
                    <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
                    <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
                    <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
                    <SegmentedControl.Item value="dodo">Dodo</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>
              </Flex>

              {/* Per-item disabled */}
              <Flex direction={'column'} gap={12} width={'100%'}>
                <Heading>Disabled</Heading>
                <Box>
                  <SegmentedControl.Root defaultValue={'enabled'}>
                    <SegmentedControl.Item value="enabled">Enabled</SegmentedControl.Item>
                    <SegmentedControl.Item value="disabled" disabled>
                      Disabled
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="also-enabled">Also Enabled</SegmentedControl.Item>
                  </SegmentedControl.Root>
                </Box>
              </Flex>

              <Flex align="flex-start" direction="column" gap={16}>
                <Heading>Default Value</Heading>
                <SegmentedControl.Root defaultValue="inbox" size={1}>
                  <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
                  <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
                  <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
                </SegmentedControl.Root>

                <SegmentedControl.Root defaultValue="inbox" size={2}>
                  <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
                  <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
                  <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
                </SegmentedControl.Root>

                <SegmentedControl.Root defaultValue="inbox" radius={'large'} size={3}>
                  <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
                  <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
                  <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
                </SegmentedControl.Root>

                <SegmentedControl.Root defaultValue="inbox" radius={'large'} size={4}>
                  <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
                  <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
                  <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Flex>
            </Flex>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
