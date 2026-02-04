import { Box, RadioGroup, Text, ThemeProvider } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function Radios() {
  const [radioValue, setRadioValue] = useState<string>('option1');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Box paddingVertical={12}>
          <Text size={2} weight="bold">
            Radio Group
          </Text>
          <RadioGroup
            gap={8}
            size={'3'}
            value={radioValue}
            onValueChange={setRadioValue}
            items={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
            ]}
          />
        </Box>
      </SafeAreaView>
    </ThemeProvider>
  );
}
