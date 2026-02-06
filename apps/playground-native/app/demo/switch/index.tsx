import { Flex, ThemeProvider, Heading, Switch, Grid, Text } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Switches() {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1, grayColor: 'slate' }}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={16} padding={12}>
            <Heading size={4}>Switches</Heading>
            <Flex padding={8} gap={8}>
              <Switch
                checked={checked}
                color={'orange'}
                disabled={false}
                highContrast={false}
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

            {/* Sizes */}
            <Heading>Sizes</Heading>
            <Flex align="center" gap={8}>
              <Switch size="1" defaultChecked />
              <Switch size="2" defaultChecked />
              <Switch size="3" defaultChecked />
            </Flex>

            {/* Variants */}
            <Heading>Variants</Heading>
            <Flex gap={8}>
              <Flex direction="column" gap={12}>
                <Switch variant="surface" />
                <Switch variant="solid" />
                <Switch variant="soft" />
              </Flex>

              <Flex direction="column" gap={12}>
                <Switch variant="surface" defaultChecked />
                <Switch variant="solid" defaultChecked />
                <Switch variant="soft" defaultChecked />
              </Flex>
            </Flex>

            {/* Colors */}
            <Heading>Colors</Heading>
            <Flex gap={8}>
              <Switch color="indigo" defaultChecked />
              <Switch color="cyan" defaultChecked />
              <Switch color="orange" defaultChecked />
              <Switch color="crimson" defaultChecked />
            </Flex>

            {/* High Contrast */}
            <Grid rows="2" gapX={2} gapY={3} display="inline-grid" flow="column">
              <Switch color="indigo" defaultChecked />
              <Switch color="indigo" defaultChecked highContrast />
              <Switch color="cyan" defaultChecked />
              <Switch color="cyan" defaultChecked highContrast />
              <Switch color="orange" defaultChecked />
              <Switch color="orange" defaultChecked highContrast />
              <Switch color="crimson" defaultChecked />
              <Switch color="crimson" defaultChecked highContrast />
              <Switch color="gray" defaultChecked />
              <Switch color="gray" defaultChecked highContrast />
            </Grid>

            {/* Radius */}
            <Heading>Radius</Heading>
            <Flex gap={12}>
              <Switch radius="none" defaultChecked />
              <Switch radius="small" defaultChecked />
              <Switch radius="full" defaultChecked />
            </Flex>

            {/* Alignment */}
            <Heading>Alignment</Heading>
            <Flex direction="column" gap={12}>
              <Switch size="1" label={"Sync Settings"} defaultChecked />

              <Switch size="2" label={"Sync settings"} defaultChecked />

              <Switch size="3" label={"Sync settings"} defaultChecked />
            </Flex>

            {/* Disabled */}
            <Heading>Disabled</Heading>
            <Flex direction="column" gap={8}>
              <Switch label={"Off"} size="1" />

              <Switch label={"On"} size="1" defaultChecked />

              <Switch label={"On"} size="1" disabled />

              <Switch label={"Off"} size="1" disabled defaultChecked />
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
