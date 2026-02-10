import {
  Box,
  Card,
  Checkbox, Code,
  Flex,
  Grid,
  Heading,
  Select,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { useState } from 'react';

export default function CheckboxDemo() {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView nestedScrollEnabled>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Checkbox</Heading>
              <Text size={4}>Base input element to toggle an option on and off.</Text>
            </Box>

            <Card radius={'large'} size={2} variant={'surface'}>
              <Flex gap={12} align="center">
                <Checkbox defaultChecked label={'Agree to Terms and Conditions'} />
              </Flex>
              {/*<Code>
                <Checkbox defaultChecked label={'Checkbox'} />
              </Code>*/}
            </Card>

            {/* Sizes */}
            <Flex gap={12}>
              <Heading>Sizes</Heading>
              <Checkbox
                defaultChecked
                checked={checked}
                size={'3'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />

              <Checkbox
                checked={checked}
                size={'2'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />

              <Checkbox
                checked={checked}
                size={'1'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />
            </Flex>

            {/* Color */}
            <Flex gap={12}>
              <Heading>Colors</Heading>
              <Checkbox
                checked={checked}
                color={'amber'}
                size={'3'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />

              <Checkbox
                checked={checked}
                color={'indigo'}
                size={'2'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />

              <Checkbox
                checked={checked}
                color={'crimson'}
                size={'1'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />
            </Flex>

            {/* High Contrast */}
            <Heading>High Contrast</Heading>
            <Grid columns={5} rowGap={12}>
              <Checkbox color="indigo" indeterminate />
              <Checkbox color="cyan" defaultChecked />
              <Checkbox color="orange" defaultChecked />
              <Checkbox color="crimson" defaultChecked />
              <Checkbox color="gray" defaultChecked />

              <Checkbox color="indigo" defaultChecked highContrast />
              <Checkbox color="cyan" defaultChecked highContrast />
              <Checkbox color="orange" defaultChecked highContrast />
              <Checkbox color="crimson" defaultChecked highContrast />
              <Checkbox color="gray" defaultChecked highContrast />
            </Grid>

            {/* Variants */}
            <Heading>Variants</Heading>
            <Flex align="center" gap={16}>
              <Flex gap={8}>
                <Checkbox variant="surface" defaultChecked />
                <Checkbox variant="surface" />
              </Flex>

              <Flex gap={8}>
                <Checkbox variant="solid" defaultChecked />
                <Checkbox variant="solid" />
              </Flex>

              <Flex gap={8}>
                <Checkbox variant="soft" defaultChecked />
                <Checkbox variant="soft" />
              </Flex>

              <Flex gap={8}>
                <Checkbox variant="outline" defaultChecked />
                <Checkbox variant="outline" />
              </Flex>
            </Flex>

            {/* Disabled */}
            <Flex direction={'column'} gap={16}>
              <Heading>Disabled</Heading>
              <Flex direction="column" gap={8}>
                <Heading size={3}>Size 1</Heading>
                <Checkbox label={'Not checked'} size={'1'} />
                <Checkbox defaultChecked label={'Checked'} size={'1'} />
                <Checkbox disabled label={'Not checked'} size={'1'} />
                <Checkbox disabled defaultChecked label={'Checked'} size={'1'} />
              </Flex>

              <Flex direction="column" gap={8}>
                <Heading size={3}>Size 2</Heading>
                <Checkbox label={'Not checked'} />
                <Checkbox defaultChecked label={'Checked'} />
                <Checkbox disabled label={'Not checked'} />
                <Checkbox disabled defaultChecked label={'Checked'} />
              </Flex>

              <Flex direction="column" gap={8}>
                <Heading size={3}>Size 3</Heading>
                <Checkbox label={'Not checked'} size={'3'} />
                <Checkbox defaultChecked label={'Checked'} size={'3'} />
                <Checkbox disabled label={'Not checked'} size={'3'} />
                <Checkbox disabled defaultChecked label={'Checked'} size={'3'} />
              </Flex>
            </Flex>

            <Flex direction={'column'} gap={16}>
              <Heading>Indeterminate</Heading>
              <Flex gap={8}>
                <Checkbox indeterminate />
                <Checkbox checked />
              </Flex>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
