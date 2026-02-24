import {
  Center,
  HCenter,
  VCenter,
  AbsoluteCenter,
  VStack,
  HStack,
  ThemeProvider,
  Heading,
  Box,
  Text,
  Spinner,
  useTheme,
  useThemeMode,
  Card,
  Flex,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function CenterDemo() {
  const theme = useTheme();
  const mode = useThemeMode();
  const bgGray = mode === 'dark' ? theme.colors.gray.dark['4'] : theme.colors.gray['4'];

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box flexGrow={1} flexShrink={1}>
            <Heading size={6}>Center</Heading>
            <Text color="gray" size={2}>
              Center, HCenter, VCenter, and AbsoluteCenter are utility components for centering
              content.
            </Text>
          </Box>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <VStack gap={2} padding={2}>
                {/* Basic Center */}
                <VStack gap={1}>
                  <Heading size={4}>Center (both axes)</Heading>
                  <Text color="gray" size={2}>
                    Default axis="both" centers horizontally and vertically
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, overflow: 'hidden' }}>
                    <Center style={{ height: 150 }}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 16, borderRadius: 8 }}>
                        <Text style={{ color: 'white' }}>Centered Content</Text>
                      </Box>
                    </Center>
                  </Box>
                </VStack>

                {/* Axis Prop */}
                <VStack gap={1}>
                  <Heading size={4}>Axis Prop</Heading>
                  <Text color="gray" size={2}>
                    Control which axis to center on
                  </Text>

                  {/* Horizontal only */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      axis="horizontal"
                    </Text>
                    <Center axis="horizontal" style={{ height: 100 }}>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>H-Centered</Text>
                      </Box>
                    </Center>
                  </Box>

                  {/* Vertical only */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      axis="vertical"
                    </Text>
                    <Center axis="vertical" style={{ height: 100 }}>
                      <Box style={{ backgroundColor: '#10b981', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>V-Centered</Text>
                      </Box>
                    </Center>
                  </Box>

                  {/* Both */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <Text size={1} color="gray">
                      axis="both" (default)
                    </Text>
                    <Center axis="both" style={{ height: 100 }}>
                      <Box style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Both-Centered</Text>
                      </Box>
                    </Center>
                  </Box>
                </VStack>

                {/* HCenter */}
                <VStack gap={1}>
                  <Heading size={4}>HCenter</Heading>
                  <Text color="gray" size={2}>
                    HCenter is a convenience wrapper with axis="horizontal"
                  </Text>
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8 }}>
                    <HCenter>
                      <Box style={{ backgroundColor: '#3b82f6', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Horizontally Centered</Text>
                      </Box>
                    </HCenter>
                  </Box>
                </VStack>

                {/* VCenter */}
                <VStack gap={1}>
                  <Heading size={4}>VCenter</Heading>
                  <Text color="gray" size={2}>
                    VCenter is a convenience wrapper with axis="vertical"
                  </Text>
                  <Box
                    style={{ backgroundColor: bgGray, borderRadius: 8, padding: 8, height: 120 }}
                  >
                    <VCenter style={{ height: '100%' }}>
                      <Box style={{ backgroundColor: '#10b981', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Vertically Centered</Text>
                      </Box>
                    </VCenter>
                  </Box>
                </VStack>

                {/* AbsoluteCenter */}
                <VStack gap={1}>
                  <Heading size={4}>AbsoluteCenter</Heading>
                  <Text color="gray" size={2}>
                    Uses absolute positioning for centering
                  </Text>
                  <Box
                    style={{
                      backgroundColor: bgGray,
                      borderRadius: 8,
                      height: 150,
                      position: 'relative',
                    }}
                  >
                    <AbsoluteCenter>
                      <Box style={{ backgroundColor: '#8b5cf6', padding: 12, borderRadius: 4 }}>
                        <Text style={{ color: 'white' }}>Absolutely Centered</Text>
                      </Box>
                    </AbsoluteCenter>
                  </Box>
                </VStack>

                {/* Width and Height */}
                <VStack gap={1}>
                  <Heading size={4}>Width and Height</Heading>
                  <Text color="gray" size={2}>
                    Center can have explicit dimensions
                  </Text>
                  <Center width={200} height={100} backgroundColor="#f0f0f0" radius="large">
                    <Text>200x100 Center</Text>
                  </Center>
                </VStack>

                {/* Background and Radius */}
                <VStack gap={1}>
                  <Heading size={4}>Background and Radius</Heading>
                  <Text color="gray" size={2}>
                    Center supports backgroundColor and radius props
                  </Text>
                  <HStack gap={3}>
                    <Center width={60} height={60} backgroundColor="#3b82f6" radius="medium">
                      <Text style={{ color: 'white' }}>1</Text>
                    </Center>
                    <Center width={60} height={60} backgroundColor="#10b981" radius="large">
                      <Text style={{ color: 'white' }}>2</Text>
                    </Center>
                    <Center width={60} height={60} backgroundColor="#f59e0b" radius="full">
                      <Text style={{ color: 'white' }}>3</Text>
                    </Center>
                  </HStack>
                </VStack>

                {/* Practical Examples */}
                <VStack gap={1}>
                  <Heading size={4}>Practical Examples</Heading>

                  {/* Loading state */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, height: 120 }}>
                    <Center style={{ height: '100%' }}>
                      <VStack align="center" gap={2}>
                        <Spinner size={'large'} />
                        <Text color="gray">Loading...</Text>
                      </VStack>
                    </Center>
                  </Box>

                  {/* Empty state */}
                  <Box style={{ backgroundColor: bgGray, borderRadius: 8, height: 150 }}>
                    <Center style={{ height: '100%' }}>
                      <VStack align="center" gap={2}>
                        <Text size={6}>📭</Text>
                        <Text weight="bold">No items found</Text>
                        <Text color="gray" size={2}>
                          Try adjusting your search
                        </Text>
                      </VStack>
                    </Center>
                  </Box>

                  {/* Icon button */}
                  <HStack gap={2}>
                    {['🏠', '🔍', '❤️', '👤'].map((icon, i) => (
                      <Center
                        key={i}
                        width={44}
                        height={44}
                        backgroundColor="#f0f0f0"
                        radius="full"
                      >
                        <Text size={5}>{icon}</Text>
                      </Center>
                    ))}
                  </HStack>

                  {/* Full screen center */}
                  <Text color="gray" size={2}>
                    Full screen center example:
                  </Text>
                  <Box
                    style={{
                      backgroundColor: '#1f2937',
                      borderRadius: 8,
                      height: 200,
                      overflow: 'hidden',
                    }}
                  >
                    <Center width="100%" height="100%">
                      <VStack align="center" gap={2}>
                        <Text size={8}>🎯</Text>
                        <Text style={{ color: 'white' }} weight="bold">
                          Welcome
                        </Text>
                        <Text style={{ color: '#9ca3af' }}>Centered on full screen</Text>
                      </VStack>
                    </Center>
                  </Box>

                  {/* Overlay with AbsoluteCenter */}
                  <Text color="gray" size={2}>
                    Overlay with AbsoluteCenter:
                  </Text>
                  <Box
                    style={{
                      backgroundColor: bgGray,
                      borderRadius: 8,
                      height: 150,
                      position: 'relative',
                    }}
                  >
                    <VStack padding={3}>
                      <Text>Background content</Text>
                      <Text color="gray" size={2}>
                        This is behind the overlay
                      </Text>
                    </VStack>
                    <Box
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                      }}
                    >
                      <AbsoluteCenter>
                        <Card>
                          <Flex direction="column" gap={3}>
                            <Heading size={3}>Card Title</Heading>
                            <Text>Card content goes here.</Text>
                          </Flex>
                        </Card>
                      </AbsoluteCenter>
                    </Box>
                  </Box>
                </VStack>

                {/* Comparison */}
                <VStack gap={1}>
                  <Heading size={4}>Comparison</Heading>
                  <Text color="gray" size={2}>
                    Different centering approaches side by side
                  </Text>
                  <HStack gap={2}>
                    <VStack gap={1} style={{ flex: 1 }}>
                      <Text size={1} color="gray">
                        Center
                      </Text>
                      <Box style={{ backgroundColor: bgGray, height: 80, borderRadius: 4 }}>
                        <Center style={{ height: '100%' }}>
                          <Text>Both</Text>
                        </Center>
                      </Box>
                    </VStack>
                    <VStack gap={1} style={{ flex: 1 }}>
                      <Text size={1} color="gray">
                        HCenter
                      </Text>
                      <Box style={{ backgroundColor: bgGray, height: 80, borderRadius: 4 }}>
                        <HCenter style={{ height: '100%' }}>
                          <Text>H-Only</Text>
                        </HCenter>
                      </Box>
                    </VStack>
                    <VStack gap={1} style={{ flex: 1 }}>
                      <Text size={1} color="gray">
                        VCenter
                      </Text>
                      <Box style={{ backgroundColor: bgGray, height: 80, borderRadius: 4 }}>
                        <VCenter style={{ height: '100%' }}>
                          <Text>V-Only</Text>
                        </VCenter>
                      </Box>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
