import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Box, Button, Flex, Heading, Select, Text, ThemeProvider } from '@radix-ui/themes-native';

export default function SelectDemo() {
  const [fruit, setFruit] = useState<string>('');
  const [vegetable, setVegetable] = useState<string>('carrot');
  const [country, setCountry] = useState<string>('');

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'indigo', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Select</Heading>
              <Text color={'gray'} size={4}>
                Displays a list of options for the user to pick from—triggered by a button.
              </Text>
            </Box>

            {/* Basic Select */}
            <View style={styles.section}>
              <Text size={3} weight="medium" style={styles.label}>
                Basic Select
              </Text>
              <Select.Root value={fruit} onValueChange={setFruit}>
                <Flex width={160}>
                  <Select.Trigger asChild>
                    <Button variant="outline">
                      <Button.Label>
                        <Select.Value placeholder="Select a fruit" />
                      </Button.Label>
                    </Button>
                  </Select.Trigger>
                </Flex>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content>
                    <Select.Item value="apple">Apple</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                    <Select.Item value="grape">Grape</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {fruit && (
                <Text size={2} style={styles.selectedText}>
                  Selected: {fruit}
                </Text>
              )}
            </View>

            {/* Select with Default Value (Uncontrolled) */}
            <View style={styles.section}>
              <Text weight="medium" style={styles.label}>
                With Default Value (Uncontrolled)
              </Text>
              <Select.Root defaultValue="carrot">
                <Select.Trigger asChild>
                  <Button variant="solid" style={styles.trigger}>
                    <Button.Label>
                      <Select.Value />
                    </Button.Label>
                  </Button>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content>
                    <Select.Item value="carrot">Carrot</Select.Item>
                    <Select.Item value="broccoli">Broccoli</Select.Item>
                    <Select.Item value="spinach">Spinach</Select.Item>
                    <Select.Item value="potato">Potato</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              <Text size={1} style={styles.hintText}>
                Uses defaultValue prop - no state management needed
              </Text>
            </View>

            {/* Select with Controlled Value */}
            <View style={styles.section}>
              <Text weight="medium" style={styles.label}>
                Controlled Select (with state)
              </Text>
              <Select.Root value={vegetable} onValueChange={setVegetable}>
                <Select.Trigger asChild>
                  <Button variant="outline" style={styles.trigger}>
                    <Button.Label>
                      <Select.Value placeholder="Select a vegetable" />
                    </Button.Label>
                  </Button>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content>
                    <Select.Item value="carrot">Carrot</Select.Item>
                    <Select.Item value="broccoli">Broccoli</Select.Item>
                    <Select.Item value="spinach">Spinach</Select.Item>
                    <Select.Item value="potato">Potato</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {vegetable && (
                <Text size={2} style={styles.selectedText}>
                  Selected: {vegetable}
                </Text>
              )}
            </View>

            {/* Select with Groups */}
            <View style={styles.section}>
              <Text size={3} weight="medium" style={styles.label}>
                With Groups
              </Text>
              <Select.Root value={country} onValueChange={setCountry}>
                <Select.Trigger asChild>
                  <Button variant="outline" style={styles.trigger}>
                    <Button.Label>
                      <Select.Value placeholder="Select a country" />
                    </Button.Label>
                  </Button>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Africa</Select.Label>
                      <Select.Item value="nigeria">Nigeria</Select.Item>
                      <Select.Item value="ghana">Ghana</Select.Item>
                      <Select.Item value="kenya">Kenya</Select.Item>
                    </Select.Group>
                    <Select.Separator />
                    <Select.Group>
                      <Select.Label>Europe</Select.Label>
                      <Select.Item value="uk">United Kingdom</Select.Item>
                      <Select.Item value="france">France</Select.Item>
                      <Select.Item value="germany">Germany</Select.Item>
                    </Select.Group>
                    <Select.Separator />
                    <Select.Group>
                      <Select.Label>Asia</Select.Label>
                      <Select.Item value="japan">Japan</Select.Item>
                      <Select.Item value="china">China</Select.Item>
                      <Select.Item value="india">India</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {country && (
                <Text size={2} style={styles.selectedText}>
                  Selected: {country}
                </Text>
              )}
            </View>

            {/* Disabled Items */}
            <View style={styles.section}>
              <Text weight="medium" style={styles.label}>
                With Disabled Items
              </Text>
              <Select.Root value={null} onValueChange={() => {}}>
                <Select.Trigger asChild>
                  <Button variant="outline" style={styles.trigger}>
                    <Button.Label>
                      <Select.Value placeholder="Some options disabled" />
                    </Button.Label>
                  </Button>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content>
                    <Select.Item value="1">Option 1 (Available)</Select.Item>
                    <Select.Item value="2" disabled>
                      Option 2 (Disabled)
                    </Select.Item>
                    <Select.Item value="3">Option 3 (Available)</Select.Item>
                    <Select.Item value="4" disabled>
                      Option 4 (Disabled)
                    </Select.Item>
                    <Select.Item value="5">Option 5 (Available)</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </View>

            {/* Different Sizes */}
            <View style={styles.section}>
              <Text size={3} weight="medium" style={styles.label}>
                Size Variants
              </Text>
              <View style={styles.row}>
                <Select.Root value={null} onValueChange={() => {}}>
                  <Select.Trigger asChild>
                    <Button variant="outline" size={1}>
                      <Button.Label>
                        <Select.Value placeholder="Size 1" />
                      </Button.Label>
                    </Button>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Overlay />
                    <Select.Content size={1}>
                      <Select.Item value="a">Option A</Select.Item>
                      <Select.Item value="b">Option B</Select.Item>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <Select.Root value={null} onValueChange={() => {}}>
                  <Select.Trigger asChild>
                    <Button variant="outline" size={2}>
                      <Button.Label>
                        <Select.Value placeholder="Size 2" />
                      </Button.Label>
                    </Button>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Overlay />
                    <Select.Content size={2}>
                      <Select.Item value="a">Option A</Select.Item>
                      <Select.Item value="b">Option B</Select.Item>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <Select.Root value={null} onValueChange={() => {}}>
                  <Select.Trigger asChild>
                    <Button variant="outline" size={3}>
                      <Button.Label>
                        <Select.Value placeholder="Size 3" />
                      </Button.Label>
                    </Button>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Overlay />
                    <Select.Content size={3}>
                      <Select.Item value="a">Option A</Select.Item>
                      <Select.Item value="b">Option B</Select.Item>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </View>
            </View>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  title: {
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  trigger: {
    minWidth: 200,
  },
  selectedText: {
    marginTop: 4,
    opacity: 0.7,
  },
  hintText: {
    marginTop: 4,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});
