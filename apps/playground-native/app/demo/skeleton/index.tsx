import {
  Badge,
  Flex,
  ThemeProvider,
  Heading,
  Card,
  Avatar,
  Box,
  Text,
  Skeleton,
  Switch,
  Button,
} from 'radix-native-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';

export default function Skeletons() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>
            <Box>
              <Heading size={6}>Skeleton</Heading>
              <Text color={'gray'}>
                Component that may wrap any UI element and turn it into a loading skeleton.
              </Text>
            </Box>
          </PageHeading>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <Flex direction={'column'} gap={8} padding={8}>
                <Text size={7}>
                  <View>
                    <Text style={{ backgroundColor: 'gray', borderRadius: 6 }}>
                      <View>
                        <Text style={{ backgroundColor: 'tomato', opacity: 0 }}>Oh. Nice</Text>
                      </View>
                    </Text>
                  </View>
                </Text>

                <Text size={7} style={{ backgroundColor: 'orange', opacity: 0.8 }}>
                  <View>
                    <Text style={{ backgroundColor: 'gray' }}>
                      <View>
                        <Text style={{ backgroundColor: 'tomato', opacity: 0 }}>
                          Lorem ipsum dolor sit amet
                        </Text>
                      </View>
                    </Text>
                  </View>
                </Text>

                <Text size={7} style={{ backgroundColor: 'orange', opacity: 0.8 }}>
                  <View>
                    <Text style={{ backgroundColor: 'gray' }}>
                      <View>
                        <Text style={{ backgroundColor: 'tomato', opacity: 1 }}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                          felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                          erat, fringilla sed commodo sed, aliquet nec magna.
                        </Text>
                      </View>
                    </Text>
                  </View>
                </Text>

                <View style={{ backgroundColor: 'purple' }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque felis
                    tellus, efficitur id convallis a, viverra eget libero. Nam magna erat, fringilla
                    sed commodo sed, aliquet nec magna.
                  </Text>
                </View>

                <View style={{ backgroundColor: 'teal' }}>
                  <Text
                    textDecorationLine={'underline'}
                    style={{ color: 'transparent', backgroundColor: 'teal' }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque felis
                    tellus, efficitur id convallis a, viverra eget libero. Nam magna erat, fringilla
                    sed commodo sed, aliquet nec magna.
                  </Text>
                </View>

                <Flex gap={4}>
                  <Skeleton loading={true}>
                    <Switch defaultChecked />
                  </Skeleton>

                  <Skeleton loading={false}>
                    <Switch defaultChecked />
                  </Skeleton>
                </Flex>
              </Flex>
              <Flex direction={'column'} gap={32} padding={12}>
                {/* Loading Toggle */}
                <Flex direction={'column'} gap={12}>
                  <Heading size={4}>Loading State</Heading>
                  <Flex gap={8} align="center">
                    <Switch checked={isLoading} onCheckedChange={setIsLoading} />
                    <Text>Loading: {isLoading ? 'true' : 'false'}</Text>
                  </Flex>
                </Flex>

                {/* Text Skeletons - Inline Pattern */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Inline Text Skeletons</Heading>
                  <Text color="gray" size={2}>
                    Wrapping text directly (recommended pattern)
                  </Text>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={8}>
                      <Text>
                        <Skeleton loading={isLoading}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Skeleton>
                      </Text>

                      <Text>
                        <Skeleton loading={isLoading}>
                          Sed do eiusmod tempor incididunt ut labore.
                        </Skeleton>
                      </Text>

                      <Text>
                        <Skeleton loading={isLoading}>
                          Ut enim ad minim veniam, quis nostrud exercitation.
                        </Skeleton>
                      </Text>
                    </Flex>
                  </Box>

                  <Text color="gray" size={2}>
                    Alternative: Wrapping Text component
                  </Text>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={8}>
                      <Skeleton loading={isLoading}>
                        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                      </Skeleton>

                      <Skeleton loading={isLoading}>
                        <Text>Sed do eiusmod tempor incididunt ut labore.</Text>
                      </Skeleton>
                    </Flex>
                  </Box>
                </Flex>

                {/* Component Skeletons - Block Pattern */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Component Skeletons</Heading>
                  <Text color="gray" size={2}>
                    Wrapping components (for full component dimensions)
                  </Text>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={12}>
                      <Skeleton loading={isLoading}>
                        <Avatar
                          size={3}
                          src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                          fallback="T"
                          radius={'full'}
                        />
                      </Skeleton>

                      <Skeleton loading={isLoading}>
                        <Button>Submit</Button>
                      </Skeleton>

                      <Skeleton loading={isLoading}>
                        <Badge color="blue" variant="soft">
                          New Feature
                        </Badge>
                      </Skeleton>

                      <Skeleton loading={isLoading}>
                        <Switch defaultChecked />
                      </Skeleton>
                    </Flex>
                  </Box>
                </Flex>

                {/* Mixed Usage */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Mixed Usage</Heading>
                  <Box maxWidth={350}>
                    <Card radius="large" size="2" variant="outline">
                      <Flex gap={12} align="center">
                        <Skeleton loading={isLoading}>
                          <Avatar size={3} fallback="JD" radius="full" />
                        </Skeleton>
                        <Box flex={1}>
                          <Text>
                            <Skeleton loading={isLoading}>John Doe</Skeleton>
                          </Text>
                          <Text color="gray" size={2}>
                            <Skeleton loading={isLoading}>Software Engineer</Skeleton>
                          </Text>
                        </Box>
                        <Skeleton loading={isLoading}>
                          <Badge color="green" variant="soft">
                            Active
                          </Badge>
                        </Skeleton>
                      </Flex>
                    </Card>
                  </Box>
                </Flex>

                {/* Loading vs Not Loading */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Loading vs Not Loading</Heading>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={12}>
                      <Text weight="bold">With loading={true} (default):</Text>
                      <Skeleton loading={true}>
                        <Text>This text is hidden when loading</Text>
                      </Skeleton>

                      <Text weight="bold">With loading={false}:</Text>
                      <Skeleton loading={false}>
                        <Text>This text is visible when not loading</Text>
                      </Skeleton>

                      <Text weight="bold">Without loading prop (defaults to true):</Text>
                      <Skeleton>
                        <Text>This is also a skeleton</Text>
                      </Skeleton>
                    </Flex>
                  </Box>
                </Flex>

                {/* Custom Dimensions */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Custom Dimensions</Heading>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={12}>
                      <Skeleton width={200} height={20} />
                      <Skeleton width={150} height={20} />
                      <Skeleton width={180} height={20} />
                    </Flex>
                  </Box>
                </Flex>

                {/* Standalone Skeleton */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Standalone Skeletons</Heading>
                  <Box maxWidth={350}>
                    <Flex direction="column" gap={12}>
                      <Skeleton>
                        <Text>Inline skeleton (auto-sizes to text)</Text>
                      </Skeleton>
                      <Skeleton>
                        <Text>Another inline skeleton</Text>
                      </Skeleton>
                    </Flex>
                  </Box>
                </Flex>
              </Flex>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
