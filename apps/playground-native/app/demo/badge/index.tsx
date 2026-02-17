import { Badge, Flex, ThemeProvider, Heading, Text, Box } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import React from 'react';

export default function Badges() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Flex direction={'column'} gap={16} padding={12}>
          <Box>
            <Heading size={6}>Badges</Heading>
            <Text color={'gray'} size={4}>
              Stylized badge element.
            </Text>
          </Box>

          <Flex align={'center'} gap={8} wrap="wrap">
            <Badge size={3} variant="solid">
              Accent
            </Badge>
            <Badge size={1} variant="solid" color="gray">
              New
            </Badge>
            <Badge size={2} variant="soft" color="purple">
              Featured
            </Badge>
            <Badge size={3} variant="surface" color="amber">
              Warning
            </Badge>
            <Badge radius={'full'} size={4} variant="solid" color="ruby">
              Danger
            </Badge>
          </Flex>

          <Flex gap={2}>
            <Badge color="orange">In progress</Badge>
            <Badge color="blue">In review</Badge>
            <Badge color="green">Complete</Badge>
          </Flex>

          <Flex direction="column" gap={8}>
            <Flex gap={2}>
              <Badge color="gray" variant="solid">
                New
              </Badge>
              <Badge color="gray" variant="soft">
                New
              </Badge>
              <Badge color="gray" variant="surface">
                New
              </Badge>
              <Badge color="gray" variant="outline">
                New
              </Badge>
            </Flex>
            <Flex gap={2}>
              <Badge color="gray" variant="solid" highContrast>
                New
              </Badge>
              <Badge color="gray" variant="soft" highContrast>
                New
              </Badge>
              <Badge color="gray" variant="surface" highContrast>
                New
              </Badge>
              <Badge color="gray" variant="outline" highContrast>
                New
              </Badge>
            </Flex>
          </Flex>

          <Flex align="center" gap={2}>
            <Badge size={1} color="indigo" variant={'surface'}>
              New
            </Badge>
            <Badge size={2} color="indigo" variant={'surface'}>
              New
            </Badge>
            <Badge size={3} color="indigo" variant={'surface'}>
              New
            </Badge>
          </Flex>

          <Flex gap={2}>
            <Badge variant="solid" size={2} radius="none" color="indigo">
              New
            </Badge>
            <Badge variant="solid" size={2} radius="large" color="indigo">
              New
            </Badge>
            <Badge variant="solid" size={2} radius="full" color="indigo">
              New
            </Badge>
          </Flex>
        </Flex>
      </View>
    </ThemeProvider>
  );
}
