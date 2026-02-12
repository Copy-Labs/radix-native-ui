import {
  Badge,
  Flex,
  ThemeProvider,
  Heading,
  TextField,
  TextArea,
  Box,
  Text,
  Card,
  IconButton,
  Button,
} from '@radix-ui/themes-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  CrossIcon,
  LucideDot,
  LucideEllipsis,
  LucideEye,
  LucideMail,
  LucideSearch,
} from 'lucide-react-native';

/*// Simple icons for demo purposes
const MagnifyingGlassIcon = ({ size = 16, color = '#666' }: { size?: number; color?: string }) => (
  <RNText style={{ fontSize: size, color }}>🔍</RNText>
);

const CrossIcon = ({ size = 14, color = '#666' }: { size?: number; color?: string }) => (
  <RNText style={{ fontSize: size, color }}>✕</RNText>
);

const DotsHorizontalIcon = ({ size = 14, color = '#666' }: { size?: number; color?: string }) => (
  <RNText style={{ fontSize: size, color }}>⋯</RNText>
);*/

export default function TextFields() {
  const [textValue, setTextValue] = useState<string>('text example text');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={16}>
            <Box>
              <Heading size={6}>Text Field</Heading>
              <Text color={'gray'} size={4}>
                Captures user input with an optional slot for buttons and icons.
              </Text>
            </Box>

            <Card radius={'large'} size={3} variant={'surface'}>
              <Heading align={'center'} size={5}>
                Form Example
              </Heading>
              <Text color={'gray'} align={'center'}>
                An example of an email signup form with TextField
              </Text>
              <Flex direction={'column'} gap={20} padding={12}>
                <TextField.Root
                  label={'Email'}
                  placeholder={'Your email address'}
                  size={'2'}
                  keyboardType={'email-address'}
                  textContentType={'emailAddress'}
                >
                  <TextField.Slot>
                    <Flex direction={'row'} align={'center'} justify={'center'} width={32}>
                      <LucideMail color={'gray'} size={20} />
                    </Flex>
                  </TextField.Slot>
                </TextField.Root>

                <TextField.Root
                  secureTextEntry
                  label={'Password'}
                  placeholder={'Password'}
                  size={'2'}
                  verticalAlign={'middle'}
                >
                  <TextField.Slot side={'right'}>
                    <Button color={'gray'} variant={'ghost'} width={40}>
                      <LucideEye color={'gray'} size={20} />
                    </Button>
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
              <Card.Footer>
                <Button radius={'large'} variant={'soft'}>
                  Reset
                </Button>
                <Button radius={'large'}>Submit</Button>
              </Card.Footer>
            </Card>

            {/* Sizes */}
            <Flex direction={'column'} gap={12}>
              <Heading>Sizes</Heading>
              <Flex direction="column" gap={12}>
                <Box maxWidth={200}>
                  <TextField size="1" placeholder="Search the docs…" />
                </Box>
                <Box maxWidth={250}>
                  <TextField size="2" placeholder="Search the docs…" />
                </Box>
                <Box maxWidth={300}>
                  <TextField size="3" placeholder="Search the docs…" />
                </Box>
              </Flex>
            </Flex>

            {/* Variants */}
            <Flex direction={'column'} gap={12}>
              <Heading>Variants</Heading>
              <TextField placeholder={'Surface size 3 input'} size={'2'} variant={'surface'} />
              <TextField placeholder={'Outline size 3 input'} size={'2'} variant={'outline'} />
              <TextField placeholder={'Soft size 3 input'} size={'2'} variant={'soft'} />
            </Flex>

            {/* Colors */}
            <Flex direction="column" gap={12}>
              <Heading>Colors</Heading>
              <TextField color="indigo" variant="soft" placeholder="Search the docs…" />
              <TextField color="green" variant="soft" placeholder="Search the docs…" />
              <TextField color="red" variant="soft" placeholder="Search the docs…" />
            </Flex>

            {/* Radius */}
            <Flex direction="column" gap={12}>
              <Heading>Radius</Heading>
              <Flex direction="column" gap={12}>
                <TextField radius="none" placeholder="None - Search the docs…" />
                <TextField radius="small" placeholder="Small - Search the docs…" />
                <TextField radius="medium" placeholder="Medium - Search the docs…" />
                <TextField radius="large" placeholder="Large - Search the docs…" />
                <TextField radius="full" placeholder="Full - Search the docs…" />
              </Flex>
            </Flex>

            {/* Error State */}
            <Flex direction="column" gap={12}>
              <Heading>Error State</Heading>
              <TextField
                value={textValue}
                onChangeText={setTextValue}
                placeholder={'Default placeholder'}
                variant="soft"
                size={'2'}
                disabled={false}
                error={'Error occurred'}
                multiline={false}
                // numberOfLines={3}
                accessibilityLabel={''}
                secureTextEntry={false}
                // highContrast={boolean}
              />
            </Flex>

            {/* TextField Slots - Left slot only */}
            <Flex direction="column" gap={12}>
              <Heading>TextField with Left Slot</Heading>
              <TextField.Root placeholder="Search the docs…" size="2">
                <TextField.Slot>
                  <LucideSearch size={16} />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* TextField Slots - Right slot only */}
            <Flex direction="column" gap={12}>
              <Heading>TextField with Right Slot</Heading>
              <TextField.Root placeholder="Search the docs…" size="2">
                <TextField.Slot side={'right'}>
                  <IconButton
                    accessibilityLabel={''}
                    icon={<CrossIcon size={14} />}
                    size={1}
                    variant="solid"
                  />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* TextField Slots - Both sides */}
            <Flex direction="column" gap={12}>
              <Heading>TextField with Both Slots</Heading>
              <TextField.Root placeholder="Search the docs…" size="2">
                <TextField.Slot>
                  <Flex direction={'row'} align={'center'} justify={'center'} width={32}>
                    <LucideSearch size={16} />
                  </Flex>
                </TextField.Slot>
                <TextField.Slot>
                  <IconButton
                    accessibilityLabel={'horizontal dot icon'}
                    icon={<LucideEllipsis size={14} />}
                    size={1}
                    variant="soft"
                  />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* TextField Slots - With explicit side prop */}
            <Flex direction="column" gap={12}>
              <Heading>TextField with Explicit Side Props</Heading>
              <TextField.Root placeholder="Search the docs…" size="2">
                <TextField.Slot side="left">
                  <Flex direction={'row'} align={'center'} justify={'center'} width={32}>
                    <LucideSearch size={20} />
                  </Flex>
                </TextField.Slot>
                <TextField.Slot side="right">
                  <IconButton
                    accessibilityLabel={'cross icon'}
                    icon={<CrossIcon size={14} />}
                    size={1}
                    variant="ghost"
                  />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* TextField Slots - Different sizes */}
            <Flex direction="column" gap={12}>
              <Heading>TextField Slots - Different Sizes</Heading>
              <Box maxWidth={200}>
                <TextField.Root size="1">
                  <TextField.Slot>
                    <LucideSearch size={12} />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
              <Box maxWidth={250}>
                <TextField.Root size="2">
                  <TextField.Slot>
                    <LucideSearch size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
              <Box maxWidth={300}>
                <TextField.Root size="3">
                  <TextField.Slot>
                    <LucideSearch size={20} />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>

            {/* TextField Slots - With variants */}
            <Flex direction="column" gap={12}>
              <Heading>TextField Slots - Different Variants</Heading>
              <TextField.Root placeholder="Outline" size="2" variant="outline">
                <TextField.Slot>
                  <LucideSearch size={16} />
                </TextField.Slot>
              </TextField.Root>
              <TextField.Root placeholder="Soft" size="2" variant="soft" color="blue">
                <TextField.Slot>
                  <Text color={'blue'}>
                    <LucideSearch size={16} />
                  </Text>
                </TextField.Slot>
              </TextField.Root>
              <TextField.Root placeholder="Surface" size="2" variant="surface">
                <TextField.Slot>
                  <LucideSearch size={16} />
                </TextField.Slot>
              </TextField.Root>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
