import {
  Stack,
  VStack,
  HStack,
  ThemeProvider,
  Heading,
  Box,
  Text,
  Button,
  Badge,
  Card,
  useTheme,
  useThemeMode,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function StackDemo() {
  const theme = useTheme();
  const mode = useThemeMode();
  const bgGray = mode === 'dark' ? theme.colors.gray.dark['4'] : theme.colors.gray['4'];

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box flexGrow={1} flexShrink={1}>
            <Heading size={6}>Stack</Heading>
            <Text color="gray" size={2}>
              Stack, VStack, and HStack are simplified flex containers for stacking elements.
            </Text>
          </Box>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <VStack gap={4} padding={3}>
                {/* Basic Stack */}
                <VStack gap={2}>
                  <Heading size={4}>Basic Stack</Heading>
                  <Text color="gray" size={2}>
                    Default direction is vertical
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Stack gap={3}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Item 1</Text>
                      </Box>
                      <Box style={{ backgroundColor: '#10b981', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Item 2</Text>
                      </Box>
                      <Box style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Item 3</Text>
                      </Box>
                    </Stack>
                  </Box>
                </VStack>

                {/* VStack - Vertical Stack */}
                <VStack gap={1}>
                  <Heading size={4}>VStack (Vertical Stack)</Heading>
                  <Text color="gray" size={2}>
                    VStack is a convenience wrapper with direction="vertical"
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <VStack gap={2}>
                      <Text weight="bold">Vertical Items:</Text>
                      <Badge color="blue">Badge 1</Badge>
                      <Badge color="green">Badge 2</Badge>
                      <Badge color="orange">Badge 3</Badge>
                    </VStack>
                  </Box>
                </VStack>

                {/* HStack - Horizontal Stack */}
                <VStack gap={1}>
                  <Heading size={4}>HStack (Horizontal Stack)</Heading>
                  <Text color="gray" size={2}>
                    HStack is a convenience wrapper with direction="horizontal"
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <HStack gap={2}>
                      <Badge color="blue">Badge 1</Badge>
                      <Badge color="green">Badge 2</Badge>
                      <Badge color="orange">Badge 3</Badge>
                    </HStack>
                  </Box>
                </VStack>

                {/* Gap Variations */}
                <VStack gap={1}>
                  <Heading size={4}>Gap Variations</Heading>
                  <Text color="gray" size={2}>
                    Gap uses theme.space scale (1-9)
                  </Text>
                  {([1, 2, 3, 4, 5] as const).map((gap) => (
                    <Box
                      key={gap}
                      style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}
                    >
                      <Text size={1} color="gray">
                        gap={gap}
                      </Text>
                      <HStack gap={gap}>
                        <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>A</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>B</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#f59e0b', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>C</Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>

                {/* Alignment */}
                <VStack gap={1}>
                  <Heading size={4}>Alignment (align prop)</Heading>
                  <Text color="gray" size={2}>
                    Cross-axis alignment
                  </Text>
                  {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((align) => (
                    <Box
                      key={align}
                      style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}
                    >
                      <Text size={1} color="gray">
                        align="{align}"
                      </Text>
                      <HStack gap={2} align={align} style={{ height: 60 }}>
                        <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>Short</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#10b981', padding: 16, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>Taller</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#f59e0b', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>Short</Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>

                {/* Justify Content */}
                <VStack gap={1}>
                  <Heading size={4}>Justify Content</Heading>
                  <Text color="gray" size={2}>
                    Main-axis alignment
                  </Text>
                  {(
                    ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const
                  ).map((justify) => (
                    <Box
                      key={justify}
                      style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}
                    >
                      <Text size={1} color="gray">
                        justify="{justify}"
                      </Text>
                      <HStack gap={2} justify={justify}>
                        <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>1</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>2</Text>
                        </Box>
                        <Box style={{ backgroundColor: '#f59e0b', padding: 8, borderRadius: 4 }}>
                          <Text style={{ color: 'white' }}>3</Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>

                {/* Wrap */}
                <VStack gap={1}>
                  <Heading size={4}>Wrap</Heading>
                  <Text color="gray" size={2}>
                    Items wrap to next line when needed
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      wrap="wrap"
                    </Text>
                    <HStack gap={2} wrap="wrap">
                      {Array.from({ length: 10 }, (_, i) => (
                        <Badge key={i} color="blue">
                          <Text>Tag {i + 1}</Text>
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                </VStack>

                {/* Nested Stacks */}
                <VStack gap={1}>
                  <Heading size={4}>Nested Stacks</Heading>
                  <Card variant="outline" style={{ padding: 12 }}>
                    <VStack gap={3}>
                      <HStack justify="space-between" align="center">
                        <Text weight="bold">Card Title</Text>
                        <Badge>New</Badge>
                      </HStack>
                      <Text color="gray">
                        This card demonstrates nested stacks for complex layouts.
                      </Text>
                      <HStack gap={2} justify={'flex-end'}>
                        <Button size={1} variant="soft">
                          Cancel
                        </Button>
                        <Button size={1}>Confirm</Button>
                      </HStack>
                    </VStack>
                  </Card>
                </VStack>

                {/* Form Layout */}
                <VStack gap={1}>
                  <Heading size={4}>Form Layout</Heading>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 12 }}>
                    <VStack gap={4}>
                      <VStack gap={1}>
                        <Text size={2} weight="medium">
                          Email
                        </Text>
                        <Box
                          style={{
                            backgroundColor: 'white',
                            padding: 8,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                          }}
                        >
                          <Text color="gray">email@example.com</Text>
                        </Box>
                      </VStack>
                      <VStack gap={1}>
                        <Text size={2} weight="medium">
                          Password
                        </Text>
                        <Box
                          style={{
                            backgroundColor: 'white',
                            padding: 8,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                          }}
                        >
                          <Text color="gray">••••••••</Text>
                        </Box>
                      </VStack>
                      <HStack justify="flex-end" gap={2}>
                        <Button size={1} variant="outline">
                          Cancel
                        </Button>
                        <Button size={1}>Sign In</Button>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>

                {/* Direction Prop */}
                <VStack gap={1}>
                  <Heading size={4}>Direction Prop</Heading>
                  <Text color="gray" size={2}>
                    Use "horizontal" or "vertical" instead of row/column
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      direction="horizontal"
                    </Text>
                    <Stack direction="horizontal" gap={2}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>A</Text>
                      </Box>
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>B</Text>
                      </Box>
                    </Stack>
                  </Box>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      direction="vertical"
                    </Text>
                    <Stack direction="vertical" gap={4}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>A</Text>
                      </Box>
                      <Box style={{ backgroundColor: '#10b981', padding: 8, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>B</Text>
                      </Box>
                    </Stack>
                  </Box>
                </VStack>
              </VStack>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
