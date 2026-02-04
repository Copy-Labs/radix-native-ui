import { Badge, Flex, ThemeProvider, Heading } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Badges() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Flex direction={'column'} gap={12} padding={12}>
          <Heading size={4}>
            Badges
          </Heading>
          <Flex gap={8} wrap="wrap">
            <Badge size={3} variant="solid">
              Accent
            </Badge>
            <Badge variant="solid" color="gray">
              New
            </Badge>
            <Badge variant="soft" color="purple">
              Featured
            </Badge>
            <Badge variant="outline" color="bronze">
              Warning
            </Badge>
          </Flex>
        </Flex>
      </SafeAreaView>
    </ThemeProvider>
  );
}
