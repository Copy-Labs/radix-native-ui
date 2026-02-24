import {
  Separator,
  VStack,
  HStack,
  ThemeProvider,
  Heading,
  Box,
  Text,
  Card,
  useTheme,
  useThemeMode,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function SeparatorDemo() {
  const theme = useTheme();
  const mode = useThemeMode();
  const bgGray = mode === 'dark' ? theme.colors.gray.dark['4'] : theme.colors.gray['4'];

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box flexGrow={1} flexShrink={1}>
            <Heading size={6}>Separator</Heading>
            <Text color="gray" size={2}>A visual divider between sections or groups of content.</Text>
          </Box>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <VStack gap={2} padding={2}>
                {/* Basic Horizontal Separator */}
                <VStack gap={1}>
                  <Heading size={4}>Horizontal Separator (default)</Heading>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 12 }}>
                    <Text>Section 1</Text>
                    <Separator />
                    <Text>Section 2</Text>
                    <Separator />
                    <Text>Section 3</Text>
                  </Box>
                </VStack>

                {/* Vertical Separator */}
                <VStack gap={1}>
                  <Heading size={4}>Vertical Separator</Heading>
                  <Text color="gray" size={2}>
                    Use orientation="vertical" for vertical separators
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 12 }}>
                    <HStack align="center" gap={2}>
                      <Text>Left</Text>
                      <Separator orientation="vertical" style={{ height: 20 }} />
                      <Text>Center</Text>
                      <Separator orientation="vertical" style={{ height: 20 }} />
                      <Text>Right</Text>
                    </HStack>
                  </Box>
                </VStack>

                {/* Color Variations */}
                <VStack gap={1}>
                  <Heading size={4}>Color Variations</Heading>
                  <Text color="gray" size={2}>
                    Separator supports the Color type from theme
                  </Text>
                  {(['gray', 'blue', 'green', 'red', 'orange', 'purple'] as const).map((color) => (
                    <Box
                      key={color}
                      style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}
                    >
                      <Text size={1} color="gray">
                        color="{color}"
                      </Text>
                      <Separator color={color} marginVertical={2} />
                    </Box>
                  ))}
                </VStack>

                {/* Size Variations */}
                <VStack gap={1}>
                  <Heading size={4}>Size (Thickness)</Heading>
                  <Text color="gray" size={2}>
                    Control the thickness of the separator
                  </Text>
                  {[1, 2, 3, 4].map((size) => (
                    <Box
                      key={size}
                      style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}
                    >
                      <Text size={1} color="gray">
                        size={size}
                      </Text>
                      <Separator size={size} marginVertical={2} />
                    </Box>
                  ))}
                </VStack>

                {/* Margin */}
                <VStack gap={1}>
                  <Heading size={4}>Margin</Heading>
                  <Text color="gray" size={2}>
                    Add margin using theme.space scale
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>No margin</Text>
                    <Separator />
                    <Text>After no margin</Text>
                  </Box>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>marginVertical={1}</Text>
                    <Separator marginVertical={1} />
                    <Text>After margin</Text>
                  </Box>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>marginVertical={3}</Text>
                    <Separator marginVertical={3} />
                    <Text>After margin</Text>
                  </Box>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>marginVertical={5}</Text>
                    <Separator marginVertical={5} />
                    <Text>After margin</Text>
                  </Box>
                </VStack>

                {/* In Card */}
                <VStack gap={1}>
                  <Heading size={4}>In Card</Heading>
                  <Card variant="outline" style={{ padding: 12 }}>
                    <VStack gap={2}>
                      <Text weight="bold">Card Title</Text>
                      <Separator />
                      <Text color="gray">
                        This is the card content. The separator helps divide sections.
                      </Text>
                      <Separator marginVertical={2} />
                      <HStack align="center" gap={2}>
                        <Text size={2} color="gray">
                          Action 1
                        </Text>
                        <Separator orientation="vertical" style={{ height: 16 }} />
                        <Text size={2} color="gray">
                          Action 2
                        </Text>
                        <Separator orientation="vertical" style={{ height: 16 }} />
                        <Text size={2} color="gray">
                          Action 3
                        </Text>
                      </HStack>
                    </VStack>
                  </Card>
                </VStack>

                {/* In List */}
                <VStack gap={1}>
                  <Heading size={4}>In List</Heading>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, overflow: 'hidden' }}>
                    <VStack>
                      <Box padding={3}>
                        <Text>Item 1</Text>
                      </Box>
                      <Separator />
                      <Box padding={3}>
                        <Text>Item 2</Text>
                      </Box>
                      <Separator />
                      <Box padding={3}>
                        <Text>Item 3</Text>
                      </Box>
                      <Separator />
                      <Box padding={3}>
                        <Text>Item 4</Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>

                {/* Decorative vs Semantic */}
                <VStack gap={1}>
                  <Heading size={4}>Decorative vs Semantic</Heading>
                  <Text color="gray" size={2}>
                    decorative=true (default) - purely visual, no accessibility role
                  </Text>
                  <Text color="gray" size={2}>
                    decorative=false - has semantic separator role for screen readers
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>Decorative separator:</Text>
                    <Separator decorative={true} />
                    <Text>Content after</Text>
                  </Box>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text>Semantic separator:</Text>
                    <Separator decorative={false} />
                    <Text>Content after</Text>
                  </Box>
                </VStack>

                {/* Practical Examples */}
                <VStack gap={1}>
                  <Heading size={4}>Practical Examples</Heading>

                  {/* Divider in settings */}
                  <Card variant="surface" style={{ padding: 12 }}>
                    <VStack gap={2}>
                      <Text weight="bold">Settings</Text>
                      <Separator marginVertical={2} />
                      <HStack justify="space-between">
                        <Text>Notifications</Text>
                        <Text color="gray">Enabled</Text>
                      </HStack>
                      <Separator />
                      <HStack justify="space-between">
                        <Text>Dark Mode</Text>
                        <Text color="gray">Disabled</Text>
                      </HStack>
                      <Separator />
                      <HStack justify="space-between">
                        <Text>Language</Text>
                        <Text color="gray">English</Text>
                      </HStack>
                    </VStack>
                  </Card>

                  {/* Toolbar separator */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <HStack align="center" gap={2}>
                      <Text size={2}>Bold</Text>
                      <Text size={2}>Italic</Text>
                      <Text size={2}>Underline</Text>
                      <Separator orientation="vertical" style={{ height: 20 }} />
                      <Text size={2}>Align Left</Text>
                      <Text size={2}>Align Center</Text>
                      <Text size={2}>Align Right</Text>
                    </HStack>
                  </Box>

                  {/* Section divider */}
                  <VStack gap={2}>
                    <Text weight="bold">Introduction</Text>
                    <Text color="gray">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Text>
                    <Separator marginVertical={3} color="blue" />
                    <Text weight="bold">Main Content</Text>
                    <Text color="gray">
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Text>
                  </VStack>
                </VStack>
              </VStack>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
