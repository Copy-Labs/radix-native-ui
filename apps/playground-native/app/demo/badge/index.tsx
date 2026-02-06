import { Badge, Flex, ThemeProvider, Heading } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function Badges() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Flex direction={'column'} gap={16} padding={12}>
          <Heading size={4}>Badges</Heading>
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
            <Badge variant="outline" color="bronze">
              Warning
            </Badge>
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
            <Badge variant="solid" radius="none" color="indigo">
              New
            </Badge>
            <Badge variant="solid" radius="large" color="indigo">
              New
            </Badge>
            <Badge variant="solid" radius="full" color="indigo">
              New
            </Badge>
          </Flex>
        </Flex>
      </View>
    </ThemeProvider>
  );
}
