import {
  Box,
  Flex,
  Heading,
  RadioCards,
  Text,
  ThemeProvider,
} from 'radix-native-ui';
import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function RadioCardsDemo() {
  const [selectedValue, setSelectedValue] = useState<string>('1');

  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <Box>
            <Heading size={6}>Radio Cards</Heading>
          </Box>
        </PageHeader>
        <PageBody>
          <Text>Card-style radio buttons for selecting a single option.</Text>
          <ScrollView nestedScrollEnabled>
            <View style={{ flex: 1 }}>
              <Flex direction={'column'} gap={32} padding={12}>
                {/* Basic Example */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Basic Example
                  </Heading>
                  <RadioCards.Root defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">A1 Keyboard</Text>
                        <Text color="gray">US Layout</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Pro Mouse</Text>
                        <Text color="gray">Zero-lag wireless</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="3">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Lightning Mat</Text>
                        <Text color="gray">Wireless charging</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* Controlled Mode */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Controlled Mode
                  </Heading>
                  <RadioCards.Root value={selectedValue} onValueChange={setSelectedValue} gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 1</Text>
                        <Text color="gray">Description for option 1</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 2</Text>
                        <Text color="gray">Description for option 2</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="3">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Option 3</Text>
                        <Text color="gray">Description for option 3</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                  <Text size={2} color="gray" style={{ marginTop: 8 }}>
                    Selected: {selectedValue}
                  </Text>
                </Box>

                {/* Indicator on Left */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Indicator on Left
                  </Heading>
                  <RadioCards.Root side="left" defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Left Indicator</Text>
                        <Text color="gray">Indicator appears on the left</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Another Option</Text>
                        <Text color="gray">With left-side indicator</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* Mixed Indicator Positions */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Mixed Indicator Positions
                  </Heading>
                  <RadioCards.Root side="left" defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Left (from Root)</Text>
                        <Text color="gray">Inherits from Root</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2" side="right">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Right (overridden)</Text>
                        <Text color="gray">Overrides Root setting</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* Horizontal Layout */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Horizontal Layout
                  </Heading>
                  <RadioCards.Root direction="row" defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Card 1</Text>
                        <Text color="gray">Row layout</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Card 2</Text>
                        <Text color="gray">Row layout</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* Sizes */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Sizes
                  </Heading>
                  <Flex direction="column" gap={16}>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Size 1
                      </Text>
                      <RadioCards.Root size="1" defaultValue="1" gap={8}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Small Card</Text>
                        </RadioCards.Item>
                        <RadioCards.Item value="2">
                          <Text weight="bold">Another Small</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Size 2 (default)
                      </Text>
                      <RadioCards.Root size="2" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Medium Card</Text>
                        </RadioCards.Item>
                        <RadioCards.Item value="2">
                          <Text weight="bold">Another Medium</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Size 3
                      </Text>
                      <RadioCards.Root size="3" defaultValue="1" gap={16}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Large Card</Text>
                        </RadioCards.Item>
                        <RadioCards.Item value="2">
                          <Text weight="bold">Another Large</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                  </Flex>
                </Box>

                {/* Variants */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Variants
                  </Heading>
                  <Flex direction="column" gap={16}>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Surface (default)
                      </Text>
                      <RadioCards.Root variant="surface" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Surface Card</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Solid
                      </Text>
                      <RadioCards.Root variant="solid" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Solid Card</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Soft
                      </Text>
                      <RadioCards.Root variant="soft" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Soft Card</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Outline
                      </Text>
                      <RadioCards.Root variant="outline" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Outline Card</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                  </Flex>
                </Box>

                {/* Colors */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Colors
                  </Heading>
                  <Flex direction="column" gap={16}>
                    <RadioCards.Root color="indigo" defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">Indigo</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                    <RadioCards.Root color="green" defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">Green</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                    <RadioCards.Root color="crimson" defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">Crimson</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                    <RadioCards.Root color="amber" defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">Amber</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                  </Flex>
                </Box>

                {/* High Contrast */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    High Contrast
                  </Heading>
                  <Flex direction="column" gap={16}>
                    <RadioCards.Root color="blue" defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">Normal Contrast</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                    <RadioCards.Root color="blue" highContrast defaultValue="1" gap={12}>
                      <RadioCards.Item value="1">
                        <Text weight="bold">High Contrast</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                  </Flex>
                </Box>

                {/* Disabled */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Disabled State
                  </Heading>
                  <RadioCards.Root defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Enabled Item</Text>
                        <Text color="gray">This item is enabled</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2" disabled>
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Disabled Item</Text>
                        <Text color="gray">This item is disabled</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* All Disabled */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    All Items Disabled
                  </Heading>
                  <RadioCards.Root disabled defaultValue="1" gap={12}>
                    <RadioCards.Item value="1">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Disabled via Root</Text>
                        <Text color="gray">All items are disabled</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="2">
                      <Flex direction="column" width="100%">
                        <Text weight="bold">Also Disabled</Text>
                        <Text color="gray">Inherited from Root</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>

                {/* Radius Options */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Radius Options
                  </Heading>
                  <Flex direction="column" gap={16}>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Small Radius
                      </Text>
                      <RadioCards.Root radius="small" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Small Radius</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Medium Radius (default)
                      </Text>
                      <RadioCards.Root radius="medium" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Medium Radius</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                    <Box>
                      <Text size={2} color="gray" style={{ marginBottom: 8 }}>
                        Large Radius
                      </Text>
                      <RadioCards.Root radius="large" defaultValue="1" gap={12}>
                        <RadioCards.Item value="1">
                          <Text weight="bold">Large Radius</Text>
                        </RadioCards.Item>
                      </RadioCards.Root>
                    </Box>
                  </Flex>
                </Box>

                {/* Plan Selection Example */}
                <Box>
                  <Heading size={4} style={{ marginBottom: 12 }}>
                    Plan Selection Example
                  </Heading>
                  <RadioCards.Root defaultValue="starter" gap={12} side={'left'}>
                    <RadioCards.Item value="starter">
                      <Flex direction="row" justify="space-between" align="center">
                        <Flex direction="column" width="100%">
                          <Text weight="bold">Starter</Text>
                          <Text color="gray">Perfect for getting started</Text>
                        </Flex>
                        <Text color="green" weight="bold">
                          Free
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="pro">
                      <Flex direction="row" justify="space-between" align="center">
                        <Flex direction="column" width="100%">
                          <Text weight="bold">Pro</Text>
                          <Text color="gray">For professionals and small teams</Text>
                        </Flex>
                        <Text color="blue" weight="bold">
                          $12/mo
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="enterprise">
                      <Flex direction="row" justify="space-between" align="center">
                        <Flex direction="column" width="100%">
                          <Text weight="bold">Enterprise</Text>
                          <Text color="gray">For large organizations</Text>
                        </Flex>
                        <Text color="amber" weight="bold">
                          Custom
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>
              </Flex>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
