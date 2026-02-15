import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Box,
  Flex,
  Heading,
  Text,
  ThemeProvider,
  Slider,
  Card,
  Button,
} from '@radix-ui/themes-native';
import { useState } from 'react';

export default function SliderDemo() {
  // Single value sliders
  const [basicValue, setBasicValue] = useState<number>(50);
  const [controlledValue, setControlledValue] = useState<number>(25);
  const [stepValue, setStepValue] = useState<number>(50);

  // Range sliders
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500]);

  // Value change end callback demo
  const [commitValue, setCommitValue] = useState<number>(50);
  const [lastCommit, setLastCommit] = useState<string>('Not yet committed');

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemeProvider mode="light" themeOptions={{ accentColor: 'indigo' }}>
        <View style={{ flex: 1, gap: 16 }}>
          <Flex direction={'column'} gap={32} padding={16}>
            <Flex direction="column" gap={24} paddingTop={16}>
              <Box>
                <Heading size={6}>
                  Slider Component Demo
                </Heading>
                <Text color="gray" size={3}>
                  Demonstrating all slider variants and features
                </Text>
              </Box>
            </Flex>

            <Card>
              <Text size={3} color="gray">
                Note: The slider component is currently in beta. Please report any issues you encounter.
              </Text>
            </Card>

            {/* Basic Slider */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Basic Slider
              </Text>
              <Text size={2} color="gray">
                Uncontrolled slider with defaultValue
              </Text>
              <Slider
                defaultValue={50}
                showValueLabel
                label="Volume"
                onValueChange={(value) => console.log('Basic:', value)}
              />
            </Flex>

            {/* Controlled Slider */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Controlled Slider
              </Text>
              <Text size={2} color="gray">
                Value: {controlledValue}
              </Text>
              <Slider
                value={controlledValue}
                onValueChange={(value) => setControlledValue(value as number)}
                showValueLabel
                label="Brightness"
              />
            </Flex>

            {/* Size Variants */}
            <Flex direction={'column'} gap={16} marginBottom={16}>
              <Text size={4} weight="bold">
                Size Variants
              </Text>

              <Card size={1}>
                <Text size={2} color="gray">
                  Size 1 (Small)
                </Text>
                <Slider
                  size="1"
                  defaultValue={30}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Size 2 (Medium - Default)
                </Text>
                <Slider
                  size="2"
                  defaultValue={50}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Size 3 (Large)
                </Text>
                <Slider
                  size="3"
                  defaultValue={70}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Size 4 (Large)
                </Text>
                <Slider
                  size="4"
                  defaultValue={85}
                  showValueLabel
                />
              </Card>
            </Flex>

            {/* Variant Styles */}
            <Flex direction={'column'} gap={16} marginBottom={16}>
              <Text size={4} weight="bold">
                Variant Styles
              </Text>

              <Card size={1}>
                <Text size={2} color="gray">
                  Solid Variant (Default)
                </Text>
                <Slider
                  variant="solid"
                  defaultValue={40}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Soft Variant
                </Text>
                <Slider
                  variant="soft"
                  defaultValue={60}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Surface Variant
                </Text>
                <Slider
                  variant="surface"
                  defaultValue={40}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Outline Variant
                </Text>
                <Slider
                  variant="outline"
                  defaultValue={60}
                  showValueLabel
                />
              </Card>
            </Flex>

            {/* High Contrast */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                High Contrast Mode
              </Text>

              <Card size={1}>
                <Text size={2} color="gray">
                  Accent Color - Normal Contrast
                </Text>
                <Slider
                  defaultValue={50}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Accent Color - High Contrast
                </Text>
                <Slider
                  highContrast
                  defaultValue={50}
                  showValueLabel
                />
              </Card>
              <Button highContrast>Default Indigo Highcontrast Button</Button>
            </Flex>

            {/* Custom Colors */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Custom Colors
              </Text>

              <Card size={1}>
                <Text size={2} color="gray">
                  Blue (Default)
                </Text>
                <Slider
                  color="blue"
                  defaultValue={40}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Green
                </Text>
                <Slider
                  color="green"
                  defaultValue={60}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Red
                </Text>
                <Slider
                  color="red"
                  defaultValue={30}
                  showValueLabel
                />
              </Card>

              <Card size={1}>
                <Text size={2} color="gray">
                  Purple
                </Text>
                <Slider
                  color="purple"
                  defaultValue={70}
                  showValueLabel
                />
              </Card>
            </Flex>

            {/* Step Increments */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Step Increments
              </Text>
              <Text size={2} color="gray">
                Step: 10, Value: {stepValue}
              </Text>
              <Slider
                value={stepValue}
                onValueChange={(value) => setStepValue(value as number)}
                step={10}
                showValueLabel
                label="Step 10"
              />
            </Flex>

            {/* Range Slider */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Range Slider (Two Thumbs)
              </Text>
              <Text size={2} color="gray">
                Range: {rangeValue[0]} - {rangeValue[1]}
              </Text>
              <Slider
                value={rangeValue}
                onValueChange={(value) => setRangeValue(value as [number, number])}
                showValueLabel
                label="Select Range"
              />
            </Flex>

            {/* Price Range Demo */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Price Range Filter
              </Text>
              <Text size={2} color="gray">
                ${priceRange[0]} - ${priceRange[1]}
              </Text>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={1000}
                step={50}
                minStepsBetweenThumbs={1}
                showValueLabel
                label="Price Range"
                valueLabelFormatter={(v) => `$${v}`}
              />
            </Flex>

            {/* onValueChangeEnd Demo */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Commit on Drag End
              </Text>
              <Text size={2} color="gray">
                Current Value: {commitValue}
              </Text>
              <Text size={2} color="gray">
                Last Commit: {lastCommit}
              </Text>
              <Slider
                value={commitValue}
                onValueChange={(value) => setCommitValue(value as number)}
                onValueChangeEnd={(value) => {
                  setLastCommit(`Committed: ${value}`);
                }}
                showValueLabel
                label="Drag and Release"
              />
            </Flex>

            {/* Disabled State */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Disabled State
              </Text>
              <Slider
                disabled
                defaultValue={50}
                showValueLabel
                label="Disabled Slider"
              />
            </Flex>

            {/* Min/Max Range */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Custom Min/Max Range
              </Text>
              <Text size={2} color="gray">
                Range: -50 to 50, Default: 0
              </Text>
              <Slider
                min={-50}
                max={50}
                defaultValue={0}
                showValueLabel
                label="Temperature"
              />
            </Flex>

            {/* Radius Variants */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Radius Variants
              </Text>

              <Text size={2} color="gray">
                Full (Default)
              </Text>
              <Slider
                radius="full"
                defaultValue={50}
                showValueLabel

              />

              <Text size={2} color="gray">
                Large
              </Text>
              <Slider
                radius="large"
                defaultValue={50}
                showValueLabel

              />

              <Text size={2} color="gray">
                Medium
              </Text>
              <Slider
                radius="medium"
                defaultValue={50}
                showValueLabel

              />

              <Text size={2} color="gray">
                Small
              </Text>
              <Slider
                radius="small"
                defaultValue={50}
                showValueLabel
              />

              <Text size={2} color="gray">
                None
              </Text>
              <Slider
                radius="none"
                defaultValue={50}
                showValueLabel
              />
            </Flex>

            {/* Accessibility Demo */}
            <Box marginBottom={24}>
              <Text size={4} weight="bold">
                Accessibility
              </Text>
              <Text size={2} color="gray">
                Slider with custom accessibility label and hint
              </Text>
              <Slider
                defaultValue={50}
                showValueLabel
                label="Font Size"
                accessibilityLabel="Font size adjustment slider"
                accessibilityHint="Drag to adjust the font size between 12 and 24 pixels"
                min={12}
                max={24}
                valueLabelFormatter={(v) => `${v}px`}
              />
            </Box>
          </Flex>
        </View>
      </ThemeProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
