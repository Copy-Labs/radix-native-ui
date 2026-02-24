import {
  Spacer,
  Flex,
  ThemeProvider,
  Heading,
  Box,
  Text,
  Button,
  useTheme, useThemeMode,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function SpacerDemo() {
  const theme = useTheme();
  const mode = useThemeMode();
  const bgGray = mode === 'dark' ? theme.colors.gray.dark['4'] : theme.colors.gray['4'];

  return (
    <ThemeProvider
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <PageContainer>
        <PageHeader showBackButton>
          <Flex direction={'column'} flex={1}>
            <Heading size={6}>Spacer</Heading>
            <Text color="gray" size={2}>
              Takes up space without affecting the layout of
              surrounding elements.
            </Text>
          </Flex>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <Flex direction="column" gap={20} padding={12}>
                {/* Flexible Spacer */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>Flexible Spacer (default)</Heading>
                  <Text color="gray" size={2}>
                    Spacer without size prop creates flexible space
                  </Text>
                  <Box
                    style={{
                      backgroundColor: bgGray,
                      height: 60,
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <Flex direction="row" style={{ height: '100%' }} padding={2}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Left</Text>
                      </Box>
                      <Spacer />
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Right</Text>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>

                {/* Fixed Size Spacer */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>Fixed Size Spacer</Heading>
                  <Text color="gray" size={2}>
                    Using size prop with theme.space values (1-9)
                  </Text>
                  {([1, 2, 3, 4, 5] as const).map((size) => (
                    <Box key={size} style={{ backgroundColor: bgGray, borderRadius: 8 }}>
                      <Flex direction="row" align="center">
                        <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>A</Text>
                        </Box>
                        <Spacer size={size} />
                        <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>B</Text>
                        </Box>
                      </Flex>
                      <Text size={1} color="gray" style={{ marginTop: 4 }}>size={size}</Text>
                    </Box>
                  ))}
                </Flex>

                {/* Direction Prop */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>Direction Prop</Heading>
                  <Text color="gray" size={2}>
                    Control which direction the spacer takes space
                  </Text>

                  {/* Horizontal Direction */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">direction = horizontal</Text>
                    <Flex direction="row" align="center">
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Left</Text>
                      </Box>
                      <Spacer size={4} direction="horizontal" />
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Right</Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Vertical Direction */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">direction=vertical</Text>
                    <Flex direction="column">
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Top</Text>
                      </Box>
                      <Spacer size={3} direction="vertical" />
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Bottom</Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Both Direction */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">direction=both (default)</Text>
                    <Box style={{ height: 100, width: '100%' }}>
                      <Flex direction="row" style={{ height: '100%' }}>
                        <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>Top Left</Text>
                        </Box>
                        <Spacer size={6} direction="both" />
                        <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>Top Right</Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>

                {/* Flex Prop */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>Flex Prop</Heading>
                  <Text color="gray" size={2}>
                    Control flex grow value for proportional spacing
                  </Text>
                  <Box
                    style={{
                      backgroundColor: bgGray,
                      height: 60,
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <Flex direction="row" style={{ height: '100%' }} padding={2}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>1</Text>
                      </Box>
                      <Spacer flex={1} />
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>2</Text>
                      </Box>
                      <Spacer flex={2} />
                      <Box style={{ backgroundColor: '#f59e0b', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>3</Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Text size={1} color="gray">
                    Spacer with flex={1} between 1-2, and flex={2} between 2-3
                  </Text>
                </Flex>

                {/* Practical Examples */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>Practical Examples</Heading>

                  {/* Header with spacer */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">Header Layout</Text>
                    <Flex direction="row" align="center">
                      <Text weight="bold">App Title</Text>
                      <Spacer />
                      <Button size={1} variant="ghost">Menu</Button>
                    </Flex>
                  </Box>

                  {/* Card footer */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">Card Footer</Text>
                    <Flex direction="column" gap={2}>
                      <Text>Card content goes here...</Text>
                      <Flex direction="row" align="center">
                        <Text size={1} color="gray">Last updated: 2 hours ago</Text>
                        <Spacer />
                        <Button size={1} variant="soft">Action</Button>
                      </Flex>
                    </Flex>
                  </Box>

                  {/* Toolbar */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={2} weight="medium">Toolbar</Text>
                    <Flex direction="row" align="center" gap={2}>
                      <Button size={1} variant="outline">Undo</Button>
                      <Button size={1} variant="outline">Redo</Button>
                      <Spacer />
                      <Button size={1} variant="solid">Save</Button>
                    </Flex>
                  </Box>
                </Flex>

                {/* Combination with other layouts */}
                <Flex direction="column" gap={16}>
                  <Heading size={4}>With Other Layout Components</Heading>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Flex direction="row" style={{ height: 80 }}>
                      <Box style={{ backgroundColor: '#3b82f6', width: 60, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>Sidebar</Text>
                      </Box>
                      <Spacer size={2} />
                      <Box style={{ backgroundColor: '#10b981', flex: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>Main Content</Text>
                      </Box>
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
