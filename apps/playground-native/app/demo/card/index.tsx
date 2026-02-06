import {
  Badge,
  Flex,
  ThemeProvider,
  Heading,
  Card,
  Avatar,
  Box,
  Text,
} from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { Link } from 'expo-router';

export default function Cards() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={20} padding={12}>
            <Heading size={6}>Cards</Heading>
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Variants</Heading>
              <Box maxWidth={240}>
                <Card radius={'large'} size={2} variant={'solid'}>
                  <Flex style={{ backgroundColor: 'transparent' }} gap={12} align="center">
                    <Avatar
                      size={3}
                      src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                      fallback="T"
                      radius={'full'}
                    />
                    <Box backgroundColor={'transparent'}>
                      <Text size={2} weight="bold">
                        Teodros Girmay
                      </Text>
                      <Text size={2} color="gray">
                        Engineering
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>

              <Box maxWidth={240}>
                <Card color={'blue'} radius={'large'} size={2} variant={'surface'}>
                  <Flex style={{ backgroundColor: 'transparent' }} gap={12} align="center">
                    <Avatar
                      size={3}
                      src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                      fallback="T"
                      radius={'full'}
                    />
                    <Box backgroundColor={'transparent'}>
                      <Text size={2} weight="bold">
                        Teodros Girmay
                      </Text>
                      <Text size={2} color="gray">
                        Engineering
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>

              <Box maxWidth={240}>
                <Card color={'crimson'} radius={'large'} size={2} variant={'outline'}>
                  <Flex style={{ backgroundColor: 'transparent' }} gap={12} align="center">
                    <Avatar
                      size={3}
                      src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                      fallback="T"
                      radius={'full'}
                    />
                    <Box backgroundColor={'transparent'}>
                      <Text size={2} weight="bold">
                        Teodros Girmay
                      </Text>
                      <Text size={2} color="gray">
                        Engineering
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>

              <Box maxWidth={350}>
                <Card color={'amber'} radius={'large'} variant={'solid'}>
                  <Box>
                    <Text size={2} weight="bold">
                      Quick start
                    </Text>
                    <Text color="gray" size={2}>
                      Start building your next project in minutes
                    </Text>
                  </Box>
                </Card>
              </Box>

              <Box maxWidth={350}>
                <Card radius={'large'} variant={'ghost'}>
                  <Box>
                    <Text size={2} weight="bold">
                      Quick start
                    </Text>
                    <Text color="gray" size={2}>
                      Start building your next project in minutes
                    </Text>
                  </Box>
                </Card>
              </Box>
            </Flex>

            {/* As Child - Link */}
            <Flex direction={'column'} gap={16}>
              <Heading>As Child - Clickable Link</Heading>
              <Box maxWidth={350}>
                <Card asChild radius={'large'} variant={'outline'}>
                  <Link href="/">
                    <Box>
                      <Text size={2} weight="bold">
                        Click me
                      </Text>
                      <Text color="gray" size={2}>
                        I will take you to the homepage
                      </Text>
                    </Box>
                  </Link>
                </Card>
              </Box>
            </Flex>

            {/* Sizes */}
            <Flex gap={12} direction="column">
              <Heading>Sizes</Heading>
              <Box width={350}>
                <Card radius={'large'} size={1}>
                  <Flex gap={12} align="center">
                    <Avatar size={3} radius="full" fallback="T" color="indigo" />
                    <Box>
                      <Text size={2} weight="bold">
                        Teodros Girmay
                      </Text>
                      <Text size={2} color="gray">
                        Engineering
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>

              <Box width={400}>
                <Card size={2}>
                  <Flex gap={16} align="center">
                    <Avatar size={4} radius="full" fallback="T" color="indigo" />
                    <Box>
                      <Text weight="bold">Teodros Girmay</Text>
                      <Text color="gray">Engineering</Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>

              <Box>
                <Card radius={'large'} size={3}>
                  <Flex gap={16} align="center">
                    <Avatar size={5} radius="full" fallback="T" color="indigo" />
                    <Box>
                      <Text size={4} weight="bold">
                        Teodros Girmay
                      </Text>
                      <Text size={4} color="gray">
                        Engineering
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Box>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
