import { Badge, Flex, ThemeProvider, Heading, TextField, TextArea } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function TextFields() {
  const [textValue, setTextValue] = useState<string>('text example text');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Flex direction={'column'} gap={12} padding={12}>
          <TextField size={'3'} value={textValue} onChangeText={setTextValue} />
        </Flex>
      </SafeAreaView>
    </ThemeProvider>
  );
}
