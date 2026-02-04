import { Flex, ThemeProvider, Heading, Switch } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function Switches() {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Flex direction={'column'} gap={12} padding={12}>
          <Heading size={4}>Switches</Heading>
          <Flex padding={8} gap={8}>
            <Switch
              checked={checked}
              color={'orange'}
              disabled={false}
              highContrast={true}
              size={'1'}
              onCheckedChange={(checked: boolean) => setChecked(checked)}
            />
            <Switch
              checked={checked}
              disabled={false}
              highContrast={true}
              size={'2'}
              onCheckedChange={(checked: boolean) => setChecked(checked)}
            />
            <Switch
              checked={checked}
              color={'brown'}
              disabled={false}
              highContrast={true}
              size={'3'}
              onCheckedChange={(checked: boolean) => setChecked(checked)}
            />
          </Flex>
        </Flex>
      </SafeAreaView>
    </ThemeProvider>
  );
}
