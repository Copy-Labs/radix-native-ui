import { Flex, TextArea, ThemeProvider } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function TextAreas() {
  const [textValue, setTextValue] = useState<string>('text example text');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Flex direction={'column'} gap={12} padding={12}>
          <TextArea
            label={'Your Bio'}
            size={'3'}
            placeholder={'Set placeholder'}
            value={textValue}
            onChangeText={setTextValue}
          />
        </Flex>
      </SafeAreaView>
    </ThemeProvider>
  );
}
