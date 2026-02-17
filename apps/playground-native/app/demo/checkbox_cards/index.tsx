import {
  Box,
  CheckboxCards,
  Flex,
  Heading,
  Text,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import { useState } from 'react';

export default function CheckboxCardsDemo() {
  const [selectedValues, setSelectedValues] = useState<string[]>(['1']);

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView nestedScrollEnabled>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Checkbox Cards</Heading>
              <Text size={4}>Card-style checkboxes for selecting multiple options.</Text>
            </Box>

            {/* Basic Example */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Basic Example</Heading>
              <CheckboxCards.Root defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">A1 Keyboard</Text>
                    <Text color="gray">US Layout</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Pro Mouse</Text>
                    <Text color="gray">Zero-lag wireless</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="3">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Lightning Mat</Text>
                    <Text color="gray">Wireless charging</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* Controlled Mode */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Controlled Mode</Heading>
              <CheckboxCards.Root
                value={selectedValues}
                onValueChange={setSelectedValues}
                gap={12}
              >
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Option 1</Text>
                    <Text color="gray">Description for option 1</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Option 2</Text>
                    <Text color="gray">Description for option 2</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="3">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Option 3</Text>
                    <Text color="gray">Description for option 3</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
              <Text size={2} color="gray" style={{ marginTop: 8 }}>
                Selected: {selectedValues.join(', ') || 'None'}
              </Text>
            </Box>

            {/* Indicator on Left */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Indicator on Left</Heading>
              <CheckboxCards.Root side="left" defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Left Indicator</Text>
                    <Text color="gray">Indicator appears on the left</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Another Option</Text>
                    <Text color="gray">With left-side indicator</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* Mixed Indicator Positions */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Mixed Indicator Positions</Heading>
              <CheckboxCards.Root side="left" defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Left (from Root)</Text>
                    <Text color="gray">Inherits from Root</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2" side="right">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Right (overridden)</Text>
                    <Text color="gray">Overrides Root setting</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* Horizontal Layout */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Horizontal Layout</Heading>
              <CheckboxCards.Root direction="row" defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Card 1</Text>
                    <Text color="gray">Row layout</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Card 2</Text>
                    <Text color="gray">Row layout</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* Sizes */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Sizes</Heading>
              <Flex direction="column" gap={16}>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Size 1</Text>
                  <CheckboxCards.Root size="1" defaultValue={['1']} gap={8}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Small Card</Text>
                    </CheckboxCards.Item>
                    <CheckboxCards.Item value="2">
                      <Text weight="bold">Another Small</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Size 2 (default)</Text>
                  <CheckboxCards.Root size="2" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Medium Card</Text>
                    </CheckboxCards.Item>
                    <CheckboxCards.Item value="2">
                      <Text weight="bold">Another Medium</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Size 3</Text>
                  <CheckboxCards.Root size="3" defaultValue={['1']} gap={16}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Large Card</Text>
                    </CheckboxCards.Item>
                    <CheckboxCards.Item value="2">
                      <Text weight="bold">Another Large</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
              </Flex>
            </Box>

            {/* Variants */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Variants</Heading>
              <Flex direction="column" gap={16}>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Surface (default)</Text>
                  <CheckboxCards.Root variant="surface" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Surface Card</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Solid</Text>
                  <CheckboxCards.Root variant="solid" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Solid Card</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Soft</Text>
                  <CheckboxCards.Root variant="soft" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Soft Card</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Outline</Text>
                  <CheckboxCards.Root variant="outline" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Outline Card</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
              </Flex>
            </Box>

            {/* Colors */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Colors</Heading>
              <Flex direction="column" gap={16}>
                <CheckboxCards.Root color="indigo" defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">Indigo</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
                <CheckboxCards.Root color="green" defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">Green</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
                <CheckboxCards.Root color="crimson" defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">Crimson</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
                <CheckboxCards.Root color="amber" defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">Amber</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
              </Flex>
            </Box>

            {/* High Contrast */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>High Contrast</Heading>
              <Flex direction="column" gap={16}>
                <CheckboxCards.Root color="blue" defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">Normal Contrast</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
                <CheckboxCards.Root color="blue" highContrast defaultValue={['1']} gap={12}>
                  <CheckboxCards.Item value="1">
                    <Text weight="bold">High Contrast</Text>
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
              </Flex>
            </Box>

            {/* Disabled */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Disabled State</Heading>
              <CheckboxCards.Root defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Enabled Item</Text>
                    <Text color="gray">This item is enabled</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2" disabled>
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Disabled Item</Text>
                    <Text color="gray">This item is disabled</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* All Disabled */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>All Items Disabled</Heading>
              <CheckboxCards.Root disabled defaultValue={['1']} gap={12}>
                <CheckboxCards.Item value="1">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Disabled via Root</Text>
                    <Text color="gray">All items are disabled</Text>
                  </Flex>
                </CheckboxCards.Item>
                <CheckboxCards.Item value="2">
                  <Flex direction="column" width="100%">
                    <Text weight="bold">Also Disabled</Text>
                    <Text color="gray">Inherited from Root</Text>
                  </Flex>
                </CheckboxCards.Item>
              </CheckboxCards.Root>
            </Box>

            {/* Radius Options */}
            <Box>
              <Heading size={4} style={{ marginBottom: 12 }}>Radius Options</Heading>
              <Flex direction="column" gap={16}>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Small Radius</Text>
                  <CheckboxCards.Root radius="small" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Small Radius</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Medium Radius (default)</Text>
                  <CheckboxCards.Root radius="medium" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Medium Radius</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
                <Box>
                  <Text size={2} color="gray" style={{ marginBottom: 8 }}>Large Radius</Text>
                  <CheckboxCards.Root radius="large" defaultValue={['1']} gap={12}>
                    <CheckboxCards.Item value="1">
                      <Text weight="bold">Large Radius</Text>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
