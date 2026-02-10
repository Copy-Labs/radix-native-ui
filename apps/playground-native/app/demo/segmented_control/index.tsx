import { Box, Flex, SegmentedControl, ThemeProvider, Text } from '@radix-ui/themes-native';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export default function SegmentedControlDemo() {
  const [sg, setSg] = useState<string>('apple');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <Flex direction={'column'} gap={12} padding={12} align={'center'} justify={'center'}>
          <Box padding={12}>
            <SegmentedControl.Root defaultValue={'option1'}>
              <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
              <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
              <SegmentedControl.Item value="option3">Option 3</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Size 1 - Segmented Control */}
          <Box padding={12}>
            <SegmentedControl.Root defaultValue={'apple'} value={sg} onValueChange={setSg} size={1}>
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Size 2 - Segmented Control */}
          <Box padding={12}>
            <SegmentedControl.Root defaultValue={'apple'} size={2}>
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Size 3 - Segmented Control */}
          <Box padding={12}>
            <SegmentedControl.Root radius={'large'} defaultValue={'apple'} size={3}>
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Size 4 - Segmented Control */}
          <Box padding={12}>
            <SegmentedControl.Root radius={'full'} defaultValue={'apple'} size={4}>
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Colors - Segmented Control */}
          <Box padding={12}>
            <SegmentedControl.Root
              color={'grass'}
              defaultValue={'apple'}
              radius={'full'}
            >
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          <Box padding={12}>
            <SegmentedControl.Root color={'blue'} radius={'large'} defaultValue={'banana'}>
              <SegmentedControl.Item value="apple">Apple</SegmentedControl.Item>
              <SegmentedControl.Item value="banana">Banana</SegmentedControl.Item>
              <SegmentedControl.Item value="carrot">Carrot</SegmentedControl.Item>
              <SegmentedControl.Item value="dodo">Dodo</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          {/* Per-item disabled */}
          <Box padding={12}>
            <SegmentedControl.Root defaultValue={'enabled'}>
              <SegmentedControl.Item value="enabled">Enabled</SegmentedControl.Item>
              <SegmentedControl.Item value="disabled" disabled>
                Disabled
              </SegmentedControl.Item>
              <SegmentedControl.Item value="also-enabled">Also Enabled</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>

          <Flex align="flex-start" direction="column" gap={16}>
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
    </ThemeProvider>
  );
}
