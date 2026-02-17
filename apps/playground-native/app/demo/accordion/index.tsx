import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Accordion,
  Box,
  Text,
  Heading,
  Flex,
} from '@radix-ui/themes-native';

export default function AccordionScreen() {
  const [singleValue, setSingleValue] = useState<string>('item-1');
  const [multipleValue, setMultipleValue] = useState<string[]>(['item-1']);

  return (
    <ScrollView style={styles.container}>
      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Single Mode (Collapsible)
        </Heading>
        <Text style={styles.description}>
          Only one item can be open at a time. With collapsible=true, the open item can be closed.
        </Text>
        <Accordion.Root
          type="single"
          collapsible
          value={singleValue}
          onValueChange={setSingleValue}
          style={styles.accordion}
        >
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>First Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                This is the content for the first accordion item. It contains detailed information
                that is revealed when the user taps the trigger.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>Second Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                This is the content for the second accordion item. Each item can contain any React
                Native components.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>
              <Accordion.Trigger>Third Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                This is the content for the third accordion item. Notice how opening one item closes
                the others.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Multiple Mode
        </Heading>
        <Text style={styles.description}>Multiple items can be open at the same time.</Text>
        <Accordion.Root
          type="multiple"
          value={multipleValue}
          onValueChange={(value) => setMultipleValue(value as string[])}
          style={styles.accordion}
        >
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>React Native</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                React Native lets you create native Android and iOS apps using JavaScript and React.
                It provides a rich set of components and APIs for building mobile applications.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>Expo</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                Expo is a framework for rapidly developing React Native applications. It provides
                tools for building, deploying, and iterating on iOS, Android, and web apps.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>
              <Accordion.Trigger>TypeScript</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                TypeScript is a strongly typed programming language that builds on JavaScript. It
                helps catch errors early and improves the developer experience with great tooling.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Sizes
        </Heading>
        <Text style={styles.description}>
          Accordion supports three sizes: 1 (small), 2 (medium), and 3 (large).
        </Text>

        <Text style={styles.sizeLabel}>Size 1 (Small)</Text>
        <Accordion.Root type="single" collapsible size="1" style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Small Accordion</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Compact size for tight spaces.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Text style={styles.sizeLabel}>Size 2 (Medium - Default)</Text>
        <Accordion.Root type="single" collapsible size="2" style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Medium Accordion</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Default size for most use cases.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Text style={styles.sizeLabel}>Size 3 (Large)</Text>
        <Accordion.Root type="single" collapsible size="3" style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Large Accordion</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Larger size for prominent sections.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Disabled State
        </Heading>
        <Text style={styles.description}>Disable individual items or the entire accordion.</Text>

        <Text style={styles.sizeLabel}>Disabled Item</Text>
        <Accordion.Root type="single" collapsible style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Enabled Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>This item is enabled and can be toggled.</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2" disabled>
            <Accordion.Header>
              <Accordion.Trigger>Disabled Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>This item is disabled.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Text style={styles.sizeLabel}>Entire Accordion Disabled</Text>
        <Accordion.Root type="single" collapsible disabled style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>All Items Disabled</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>The entire accordion is disabled.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Uncontrolled Mode
        </Heading>
        <Text style={styles.description}>
          Using defaultValue for uncontrolled state management.
        </Text>
        <Accordion.Root type="single" collapsible defaultValue="item-2" style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>First Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Content for first item.</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>Second Item (Default Open)</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>
                This item is open by default using defaultValue prop. The component manages its own
                state.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>
              <Accordion.Trigger>Third Item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Content for third item.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.section}>
        <Heading size={4} style={styles.heading}>
          Custom Icon
        </Heading>
        <Text style={styles.description}>
          You can provide a custom icon to the trigger.
        </Text>
        <Accordion.Root type="single" collapsible style={styles.accordion}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger icon={<Text size={5}>+</Text>}>
                Custom Icon Item
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text>This accordion uses a custom icon instead of the default chevron.</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Box>

      <Box style={styles.lastSection} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  lastSection: {
    height: 32,
  },
  heading: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  accordion: {
    marginBottom: 8,
  },
  sizeLabel: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
});
