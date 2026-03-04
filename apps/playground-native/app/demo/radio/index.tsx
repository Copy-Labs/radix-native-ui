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
} from 'radix-native-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function Radios() {
  const [radioValue, setRadioValue] = useState<string>('option1');

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box>
            <Heading size={6}>Radios</Heading>
            <Text color={'gray'} size={4}>
              Allow users to select one option from a set.
            </Text>
          </Box>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <Flex direction={'column'} gap={16} padding={12}>
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
                      <Radio
                        size={'2'}
                        value={'b'}
                        variant={'surface'}
                        color="blue"
                        defaultChecked
                      />
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

                {/* Variant */}
                <Heading>Variant</Heading>
                <Flex align="center" gap={16}>
                  <Flex gap={8}>
                    <Radio variant="surface" value="1" defaultChecked />
                    <Radio variant="surface" value="2" />
                  </Flex>

                  <Flex gap={8}>
                    <Radio variant="solid" value="1" defaultChecked />
                    <Radio variant="solid" value="2" />
                  </Flex>

                  <Flex gap={8}>
                    <Radio variant="soft" value="1" defaultChecked />
                    <Radio variant="soft" value="2" />
                  </Flex>

                  <Flex gap={8}>
                    <Radio variant="outline" value="1" defaultChecked />
                    <Radio variant="outline" value="2" />
                  </Flex>
                </Flex>

                {/* Disabled */}
                <Flex direction={'column'} gap={12} padding={12}>
                  <Heading>Disabled</Heading>
                  <Flex align="flex-start" direction="column" gap={1}>
                    <Radio size={'1'} label={'On'} value={'a_on'} defaultChecked disabled />
                    <Radio size={'1'} label={'Off'} value={'a_off'} disabled />
                  </Flex>

                  <Flex align="flex-start" direction="column" gap={2}>
                    <Radio label={'Default'} value={'a_on'} defaultChecked disabled />
                    <Radio label={'Compact'} value={'a_off'} disabled />
                  </Flex>

                  <Flex align="flex-start" direction="column" gap={4}>
                    <Radio size={'3'} label={'Default'} value={'a'} defaultChecked disabled variant={'soft'} />
                    <Radio size={'3'} label={'Compact'} value={'b'} defaultChecked disabled variant={'soft'} />
                  </Flex>

                  <Flex align="flex-start" direction="column" gap={4}>
                    <Radio size={'3'} label={'Default'} value={'a'} defaultChecked disabled variant={'surface'} />
                    <Radio size={'3'} label={'Compact'} value={'b'} defaultChecked disabled variant={'surface'} />
                  </Flex>
                </Flex>

                {/* New Compound Component API */}
                <Box padding={12}>
                  <Text size={4} weight="bold">
                    Radio Group (Compound API)
                  </Text>
                  <RadioGroup.Root
                    gap={8}
                    size={'3'}
                    value={radioValue}
                    onValueChange={setRadioValue}
                  >
                    <RadioGroup.Item value="option1" label="Option 1" />
                    <RadioGroup.Item value="option2" label="Option 2" />
                  </RadioGroup.Root>
                </Box>

                <Box padding={12}>
                  <RadioGroup.Root
                    gap={8}
                    size={'2'}
                    color="indigo"
                    variant="solid"
                    value={radioValue}
                    onValueChange={setRadioValue}
                  >
                    <RadioGroup.Item value="option1" label="Option 1" />
                    <RadioGroup.Item value="option2" label="Option 2" />
                    <RadioGroup.Item value="option3" label="Option 3" />
                  </RadioGroup.Root>
                </Box>

                {/* Custom content example */}
                <Box padding={12}>
                  <Text size={4} weight="bold">
                    Radio Group with Custom Content
                  </Text>
                  <RadioGroup.Root
                    gap={4}
                    size={'2'}
                    value={radioValue}
                    onValueChange={setRadioValue}
                  >
                    <RadioGroup.Item value="option1">
                      <Text>Custom content for Option 1</Text>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="option2">
                      <Text>Custom content for Option 2</Text>
                    </RadioGroup.Item>
                  </RadioGroup.Root>
                </Box>


              </Flex>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
