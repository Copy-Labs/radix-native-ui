import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Radio,
  RadioGroup,
  Text,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Radios() {
  const [radioValue, setRadioValue] = useState<string>('option1');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={16} padding={12}>
            <Box>
              <Heading size={6}>Radios</Heading>
              <Text color={'gray'} size={4}>
                Allow users to select one option from a set.
              </Text>
            </Box>

            {/* Color */}
            <Box padding={12}>
              <Card color={'orange'} radius={'large'} variant={'surface'}>
                <Heading>Colors</Heading>
                <Flex gap={8} paddingVertical={12}>
                  <Radio color="indigo" defaultChecked value={'a'} />
                  <Radio color="cyan" defaultChecked value={'b'} />
                  <Radio color="orange" defaultChecked value={'c'} />
                  <Radio color="crimson" defaultChecked value={'d'} />
                  <Radio color="grass" defaultChecked value={'e'} />
                  <Radio color="amber" defaultChecked value={'f'} />
                  <Radio color="tomato" defaultChecked value={'g'} />
                  <Radio color="teal" defaultChecked value={'h'} />
                </Flex>
              </Card>
            </Box>

            {/* High Contrast */}
            <Flex direction={'column'} gap={12} padding={12}>
              <Card color={'grass'} radius={'large'} variant={'surface'}>
                <Heading>High Contrast</Heading>
                <Grid columns={5} rowGap={12} justify={'center'}>
                  <Radio value={'a'} color="indigo" defaultChecked />
                  <Radio value={'b'} color="cyan" defaultChecked />
                  <Radio value={'c'} color="orange" defaultChecked />
                  <Radio value={'d'} color="crimson" defaultChecked />
                  <Radio value={'e'} color="gray" defaultChecked />

                  <Radio value={'f'} color="indigo" defaultChecked highContrast />
                  <Radio value={'g'} color="cyan" defaultChecked highContrast />
                  <Radio value={'h'} color="orange" defaultChecked highContrast />
                  <Radio value={'i'} color="crimson" defaultChecked highContrast />
                  <Radio value={'j'} color="gray" defaultChecked highContrast />
                </Grid>
              </Card>
            </Flex>

            {/* Alignment */}
            <Flex direction={'column'} gap={12} padding={12}>
              <Heading>Alignment</Heading>
              <Flex align="flex-start" direction="column" gap={1}>
                <Radio
                  size={'1'}
                  label={'Default'}
                  value={'a'}
                  color="gray"
                  defaultChecked
                  highContrast
                />
                <Radio
                  size={'1'}
                  label={'Compact'}
                  value={'b'}
                  color="gray"
                  defaultChecked
                  highContrast
                />
              </Flex>

              <Card color={'gray'} radius={'large'} size={3} variant={'surface'}>
                <Flex align={'center'} justify={'space-between'}>
                  <Heading>Text Radio Card</Heading>
                  <Radio size={'2'} value={'b'} variant={'surface'} color="blue" defaultChecked />
                </Flex>
              </Card>

              <Flex align="flex-start" direction="column" gap={2}>
                <Radio label={'Default'} value={'a'} color="blue" defaultChecked />
                <Radio label={'Compact'} value={'b'} color="blue" defaultChecked />
              </Flex>

              <Flex align="flex-start" direction="column" gap={4}>
                <Radio size={'3'} label={'Default'} value={'a'} color="green" defaultChecked />
                <Radio size={'3'} label={'Compact'} value={'b'} color="green" defaultChecked />
              </Flex>
            </Flex>

            {/* Disabled */}
            <Flex direction={'column'} gap={12} padding={12}>
              <Heading>Disabled</Heading>
              <Flex align="flex-start" direction="column" gap={1}>
                <Radio size={'1'} label={'On'} value={'a_on'} defaultChecked />
                <Radio size={'1'} label={'Off'} value={'a_off'} />
              </Flex>

              <Flex align="flex-start" direction="column" gap={2}>
                <Radio label={'Default'} value={'a_on'} defaultChecked disabled />
                <Radio label={'Compact'} value={'a_off'} disabled />
              </Flex>

              <Flex align="flex-start" direction="column" gap={4}>
                <Radio size={'3'} label={'Default'} value={'a'} defaultChecked />
                <Radio size={'3'} label={'Compact'} value={'b'} defaultChecked />
              </Flex>
            </Flex>

            <Box padding={12}>
              <Text size={4} weight="bold">
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

            <Box padding={12}>
              <RadioGroup
                gap={8}
                size={'2'}
                value={radioValue}
                onValueChange={setRadioValue}
                items={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
              />
            </Box>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
