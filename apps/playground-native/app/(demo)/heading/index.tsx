import { Badge, Flex, ThemeProvider, Heading, TextField, TextArea, Text, Strong, Code } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function Headings() {
  const [textValue, setTextValue] = useState<string>('text example text');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Heading align={'center'} size={3}>
          Apparently, the Accent Color now works for buttons 😁
        </Heading>
        <Text size={3}>
          But we still need to <Strong>make more</Strong> updates to the components. We have to do
          this
        </Text>
        <Code size={7}>This is a code text</Code>
      </SafeAreaView>
    </ThemeProvider>
  );
}
