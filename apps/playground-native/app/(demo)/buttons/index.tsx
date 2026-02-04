import { Button, Flex, Heading, ThemeProvider } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Buttons() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Heading size={4}>Buttons</Heading>
        <Flex direction={'column'} gap={12} paddingHorizontal={4}>
          <Button>Hey bro - Solid</Button>
          <Button variant={'ghost'}>Hey bro - Ghost</Button>
          <Button variant={'outline'}>Hey bro - Outline</Button>
          <Button variant={'soft'}>Hey bro - Soft</Button>
          <Button variant={'surface'}>Hey bro - Surface</Button>
          <Button loading>Hey bro - Loading</Button>
          <Button loading variant={'soft'}>
            Hey bro - Loading (soft)
          </Button>
          <Button onPress={() => console.log('Pressed!')}>Click Me</Button>
          <Button highContrast={true}>
            High Contrast
          </Button>
          <Button highContrast={true} variant={'soft'}>
            High Contrast - Soft
          </Button>
        </Flex>
      </SafeAreaView>
    </ThemeProvider>
  );
}
