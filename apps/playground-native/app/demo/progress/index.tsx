import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Box,
  Flex,
  Heading,
  Text,
  ThemeProvider,
  Card,
  Progress,
} from '@radix-ui/themes-native';
import { useState, useEffect } from 'react';

export default function ProgressDemo() {
  const [autoValue, setAutoValue] = useState(0);

  // Auto-increment demo
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoValue((v) => (v >= 100 ? 0 : v + 5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemeProvider mode="light" themeOptions={{ accentColor: 'indigo' }}>
        <View style={{ flex: 1, gap: 16 }}>
          <Flex direction={'column'} gap={32} padding={16}>
            <Flex direction="column" gap={24} paddingTop={16}>
              <Box>
                <Heading size={6}>Progress Component</Heading>
                <Text color="gray" size={3}>
                  Demonstrating all progress variants and features
                </Text>
              </Box>
            </Flex>

            {/* Animated Progress */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Animated Progress</Heading>
                <Text size={2} color="gray">
                  Auto-incrementing value with smooth animation
                </Text>
                <Progress value={autoValue} />
                <Text size={2} color="gray" align="right">
                  {autoValue}%
                </Text>
              </Flex>
            </Card>

            {/* Sizes */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Sizes</Heading>
                <Text size={2} color="gray">
                  Three size variants: 1, 2, and 3
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Size 1 (Small)</Text>
                    <Progress value={60} size={1} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Size 2 (Medium - Default)</Text>
                    <Progress value={60} size={2} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Size 3 (Large)</Text>
                    <Progress value={60} size={3} />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Variants */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Variants</Heading>
                <Text size={2} color="gray">
                  Three visual variants: surface, solid, and soft
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Solid (Default)</Text>
                    <Progress value={70} variant="solid" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Surface</Text>
                    <Progress value={70} variant="surface" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Soft</Text>
                    <Progress value={70} variant="soft" />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Colors */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Colors</Heading>
                <Text size={2} color="gray">
                  Using theme color names
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Indigo (Default)</Text>
                    <Progress value={75} color="indigo" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Blue</Text>
                    <Progress value={75} color="blue" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Green</Text>
                    <Progress value={75} color="green" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Red</Text>
                    <Progress value={75} color="red" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Amber</Text>
                    <Progress value={75} color="amber" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Purple</Text>
                    <Progress value={75} color="purple" />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* High Contrast */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>High Contrast</Heading>
                <Text size={2} color="gray">
                  For improved accessibility
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Normal</Text>
                    <Progress value={80} color="blue" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>High Contrast</Text>
                    <Progress value={80} color="blue" highContrast />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Radius */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Radius</Heading>
                <Text size={2} color="gray">
                  Custom border radius options
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>None</Text>
                    <Progress value={65} radius="none" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Small</Text>
                    <Progress value={65} radius="small" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Medium</Text>
                    <Progress value={65} radius="medium" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Large</Text>
                    <Progress value={65} radius="large" />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Full (Default)</Text>
                    <Progress value={65} radius="full" />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Animation Duration */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Animation Duration</Heading>
                <Text size={2} color="gray">
                  Customize the transition speed
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Fast (100ms)</Text>
                    <Progress value={autoValue} duration={100} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Normal (300ms - Default)</Text>
                    <Progress value={autoValue} duration={300} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Slow (800ms)</Text>
                    <Progress value={autoValue} duration={800} />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Edge Cases */}
            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Edge Cases</Heading>
                <Text size={2} color="gray">
                  Zero, full, and clamped values
                </Text>

                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>0%</Text>
                    <Progress value={0} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>100%</Text>
                    <Progress value={100} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Over 100% (clamped to 100%)</Text>
                    <Progress value={150} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Negative (clamped to 0%)</Text>
                    <Progress value={-20} />
                  </Flex>

                  <Flex direction="column" gap={4}>
                    <Text size={2}>Custom max (50/200)</Text>
                    <Progress value={50} max={200} />
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </View>
      </ThemeProvider>

      {/* Dark Mode Demo */}
      <ThemeProvider mode="dark" themeOptions={{ accentColor: 'indigo' }}>
        <View style={{ flex: 1, gap: 16, backgroundColor: '#111' }}>
          <Flex direction={'column'} gap={32} padding={16}>
            <Flex direction="column" gap={24} paddingTop={16}>
              <Box>
                <Heading size={6}>Dark Mode</Heading>
                <Text color="gray" size={3}>
                  Progress in dark mode
                </Text>
              </Box>
            </Flex>

            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Animated (Dark)</Heading>
                <Progress value={autoValue} />
                <Text size={2} color="gray" align="right">
                  {autoValue}%
                </Text>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Variants (Dark)</Heading>
                <Flex direction="column" gap={12}>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Surface</Text>
                    <Progress value={70} variant="surface" />
                  </Flex>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Solid</Text>
                    <Progress value={70} variant="solid" />
                  </Flex>
                  <Flex direction="column" gap={4}>
                    <Text size={2}>Soft</Text>
                    <Progress value={70} variant="soft" />
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap={16}>
                <Heading size={4}>Colors (Dark)</Heading>
                <Flex direction="column" gap={12}>
                  <Progress value={75} color="indigo" />
                  <Progress value={75} color="blue" />
                  <Progress value={75} color="green" />
                  <Progress value={75} color="red" />
                </Flex>
              </Flex>
            </Card>
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
