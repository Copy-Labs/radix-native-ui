import { ScrollView, View } from 'react-native';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Tabs,
  Text,
  ThemeProvider,
} from 'radix-native-ui';
import { useState } from 'react';
import {
  LucideBookmark,
  LucideChartNoAxesColumn,
  LucideHeart, LucideMail,
  LucideMessageCircle,
  LucideRepeat2,
  LucideShare2,
} from 'lucide-react-native';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';

export default function ProfileScreen() {
  const [tabValue, setTabValue] = useState<string>('home');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'large', scaling: 1 }}
    >
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>Twitter Profile page</PageHeading>
        </PageHeader>
        <PageBody>
          <ScrollView style={{ flex: 1 }}>
            <Flex style={{ backgroundColor: 'lightgray', minHeight: 140 }}>
              <Avatar
                radius={'full'}
                size={7}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
                style={{ position: 'absolute', bottom: -32, left: 16, zIndex: 40 }}
              />
            </Flex>

            <Flex
              direction={'column'}
              gap={8}
              paddingHorizontal={16}
              paddingTop={40}
              paddingVertical={12}
            >
              <Flex align={'center'} justify={'space-between'} gap={4}>
                <Box>
                  <Heading size={4}>Mayowa Obisesan</Heading>
                  <Text color={'gray'}>@amdblessed</Text>
                </Box>
                <Flex align={'center'} gap={4}>
                  <IconButton accessibilityLabel={'mail'}>
                    <LucideMail />
                  </IconButton>
                  <Button color={'crimson'} size={1}>
                    Subscribe
                  </Button>
                  <Button size={1}>Follow</Button>
                </Flex>
              </Flex>
              <Text color={'gray'} size={3}>
                @iamaprogrammer01 | @thecopylabs | I&apos;m a versatile Programmer
              </Text>
            </Flex>

            <Tabs.Root
              value={tabValue}
              onValueChange={(value: string) => setTabValue(value)}
              // variant={'line'}
            >
              <Tabs.List>
                <Tabs.Trigger value="home">
                  <Text>Home</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value="posts">
                  <Text>Posts</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value="likes">
                  <Text>Likes</Text>
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="home">
                <View>
                  <Text>Your Home Timeline</Text>
                </View>
                <Flex direction={'column'} gap={8}>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <Card size={1} key={index} style={{ borderRadius: 12, gap: 4 }}>
                      <Flex align={'center'} backgroundColor={'transparent'} gap={6}>
                        <Avatar
                          size={2}
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                        />
                        <Flex direction={'column'} backgroundColor={'transparent'} flex={1}>
                          <Text size={3}>amdblessed</Text>
                          <Text color={'gray'} size={1}>
                            {new Date().toDateString()}
                          </Text>
                        </Flex>
                        <Button color={'gray'} size={1} variant={'soft'}>
                          -
                        </Button>
                      </Flex>
                      <Box backgroundColor={'transparent'}>
                        <Text lineHeight={1}>
                          The goal of typography is to relate font size, line height, and line width in
                          a proportional way that maximizes beauty and makes reading easier and more
                          pleasant.
                        </Text>
                      </Box>

                      <Flex
                        backgroundColor={'transparent'}
                        gap={4}
                        justify={'space-between'}
                        paddingTop={4}
                      >
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'} backgroundColor={'transparent'} gap={4}>
                            <Text>
                              <LucideMessageCircle size={16} />
                            </Text>
                            <Text>15</Text>
                          </Flex>
                        </Button>
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'} backgroundColor={'transparent'} gap={4}>
                            <Text>
                              <LucideRepeat2 size={16} />
                            </Text>
                            <Text color={'gray'}>25</Text>
                          </Flex>
                        </Button>
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'} backgroundColor={'transparent'} gap={4}>
                            <Text>
                              <LucideHeart size={16} />
                            </Text>
                            <Text>10</Text>
                          </Flex>
                        </Button>
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'} backgroundColor={'transparent'} gap={4}>
                            <Text>
                              <LucideChartNoAxesColumn size={16} />
                            </Text>
                            <Text>90.5k</Text>
                          </Flex>
                        </Button>
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'}>
                            <LucideBookmark size={16} />
                          </Flex>
                        </Button>
                        <Button color={'gray'} size={1} variant={'ghost'}>
                          <Flex align={'center'} backgroundColor={'transparent'}>
                            <LucideShare2 size={16} />
                            {/*<Text></Text>*/}
                          </Flex>
                        </Button>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Tabs.Content>
              <Tabs.Content value="posts">
                <View>
                  <Text>Your Posts are available here...</Text>
                </View>
              </Tabs.Content>
              <Tabs.Content value="likes">
                <View>
                  <Text>Your Likes are available here...</Text>
                </View>
              </Tabs.Content>
            </Tabs.Root>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
