import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { LucideEye, LucideMail } from 'lucide-react-native';

export default function TextAreas() {
  const [textValue, setTextValue] = useState<string>('text example text');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Text Area</Heading>
              <Text color={'gray'} size={4}>
                Captures multi-line user input.
              </Text>
            </Box>

            <Card radius={'large'} size={3} variant={'surface'}>
              <Heading align={'center'} size={5}>
                Profile Card Form
              </Heading>
              <Text color={'gray'} align={'center'}>
                An email profile card form with TextArea
              </Text>
              <Flex direction={'column'} gap={20} padding={12}>
                <Card color={'blue'} radius={'large'} variant={'surface'}>
                  <Flex align={'center'} gap={12}>
                    <Avatar
                      radius={'full'}
                      size={5}
                      src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      fallback="A"
                    />
                    <Flex direction={'column'} flexShrink={1}>
                      <Heading>Carol One</Heading>
                      <Text color={'gray'} size={2}>
                        A Product Designer from Earth | Loves cool design | Against Bad UX
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
                <TextField.Root
                  label={'Email'}
                  placeholder={'Your email address'}
                  size={'1'}
                  keyboardType={'email-address'}
                  textContentType={'emailAddress'}
                >
                  <TextField.Slot>
                    <Flex direction={'row'} align={'center'} justify={'center'} width={32}>
                      <LucideMail color={'gray'} size={20} />
                    </Flex>
                  </TextField.Slot>
                </TextField.Root>
                <TextArea label={'Bio'} size="1" placeholder="Tell us something about you" />
                <Button radius={'large'}>Submit</Button>
              </Flex>
            </Card>

            <TextArea
              label={'Your Bio'}
              size={'3'}
              placeholder={'Set placeholder'}
              value={textValue}
              onChangeText={setTextValue}
            />

            <TextArea
              label={'Your Bio'}
              size={'2'}
              placeholder={'Set placeholder'}
              value={textValue}
              onChangeText={setTextValue}
            />

            {/* Sizes */}
            <Flex direction={'column'} gap={12}>
              <Heading>Sizes</Heading>
              <Flex direction="column" gap={12}>
                <Box maxWidth={200}>
                  <TextArea size="1" placeholder="Reply to comment…" />
                </Box>
                <Box maxWidth={250}>
                  <TextArea size="2" placeholder="Reply to comment…" />
                </Box>
                <Box maxWidth={300}>
                  <TextArea size="3" placeholder="Reply to comment…" />
                </Box>
              </Flex>
            </Flex>

            {/* Variants */}
            <Flex direction={'column'} gap={12}>
              <Heading>Variants</Heading>
              <TextArea variant="surface" placeholder="Surface - Reply to comment…" />
              <TextArea variant="outline" placeholder="Outline - Reply to comment…" />
              <TextArea variant="soft" placeholder="Soft - Reply to comment…" />
            </Flex>

            {/* Colors */}
            <Flex direction="column" gap={12}>
              <Heading>Colors</Heading>
              <TextArea color="blue" variant="soft" placeholder="Reply to comment…" />
              <TextArea color="green" variant="soft" placeholder="Reply to comment…" />
              <TextArea color="red" variant="soft" placeholder="Reply to comment…" />
            </Flex>

            {/* Radius */}
            <Flex direction="column" gap={12}>
              <Heading>Radius</Heading>
              <Text fontStyle={'italic'}>
                Large and Full have the same radius because full radius will look weird on TextArea
              </Text>
              <Flex direction="column" gap={12}>
                <TextArea radius="none" placeholder="None - Search the docs…" />
                <TextArea radius="small" placeholder="Small - Search the docs…" />
                <TextArea radius="medium" placeholder="Medium - Search the docs…" />
                <TextArea radius="large" placeholder="Large - Search the docs…" />
                <TextArea radius="full" placeholder="Full - Search the docs…" />
              </Flex>
            </Flex>

            {/* Error State */}
            <Flex direction="column" gap={12}>
              <Heading>Error State</Heading>
              <TextArea
                value={textValue}
                onChangeText={setTextValue}
                placeholder={'Default placeholder'}
                variant="soft"
                size={'2'}
                disabled={false}
                error={'Error occurred'}
                // numberOfLines={3}
                accessibilityLabel={''}
                secureTextEntry={false}
                // highContrast={boolean}
              />
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
