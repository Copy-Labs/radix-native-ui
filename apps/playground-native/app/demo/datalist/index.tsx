import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { DataList, Badge, Button, Heading, Text, Flex, Box } from '@radix-ui/themes-native';

export default function DataListDemoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Basic Usage */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Basic Usage
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Name</DataList.Label>
            <DataList.Value>Susan Kare</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Email</DataList.Label>
            <DataList.Value>susan.kare@apple.com</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Status</DataList.Label>
            <DataList.Value>
              <Box width={60}>
                <Badge color="green" size={2}>
                  Active
                </Badge>
              </Box>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Organization</DataList.Label>
            <DataList.Value>Apple Inc.</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Orientation: Vertical */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Vertical Orientation
        </Heading>
        <DataList.Root orientation="vertical">
          <DataList.Item>
            <DataList.Label>Status</DataList.Label>
            <DataList.Value>
              <Box width={60}>
                <Badge color="green" size={2}>
                  Active
                </Badge>
              </Box>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Name</DataList.Label>
            <DataList.Value>Susan Kare</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Email</DataList.Label>
            <DataList.Value>susan.kare@apple.com</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Bio</DataList.Label>
            <DataList.Value>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac nisl et libero
              ultricies viverra quis vitae quam.
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Size Variants */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Size Variants
        </Heading>
        <View style={styles.row}>
          <View style={styles.sizeColumn}>
            <Text style={styles.sizeLabel}>Size 1</Text>
            <DataList.Root size={1}>
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>John Doe</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>john@example.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
          <View style={styles.sizeColumn}>
            <Text style={styles.sizeLabel}>Size 2 (default)</Text>
            <DataList.Root size={2}>
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>Jane Doe</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>jane@example.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
          <View style={styles.sizeColumn}>
            <Text style={styles.sizeLabel}>Size 3</Text>
            <DataList.Root size={3}>
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>Bob Smith</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>bob@example.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
        </View>
      </View>

      {/* Alignment Options */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Alignment Options
        </Heading>
        <DataList.Root>
          <DataList.Item align="baseline">
            <DataList.Label>Baseline</DataList.Label>
            <DataList.Value>
              <Button size={1}>Button</Button>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="start">
            <DataList.Label>Start</DataList.Label>
            <DataList.Value>
              <Button size={2}>Button</Button>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label>Center</DataList.Label>
            <DataList.Value>
              <Button size={2}>Button</Button>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="end">
            <DataList.Label>End</DataList.Label>
            <DataList.Value>
              <Button size={2}>Button</Button>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Label Colors */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Label Colors
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Default</DataList.Label>
            <DataList.Value>Gray color</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="blue">Blue</DataList.Label>
            <DataList.Value>Blue accent color</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="green">Green</DataList.Label>
            <DataList.Value>Green accent color</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="red">Red</DataList.Label>
            <DataList.Value>Red accent color</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="purple">Purple</DataList.Label>
            <DataList.Value>Purple accent color</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* High Contrast Labels */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          High Contrast Labels
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label color="blue">Normal</DataList.Label>
            <DataList.Value>Standard contrast</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="blue" highContrast>
              High Contrast
            </DataList.Label>
            <DataList.Value>Darker, more prominent</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="green">Normal</DataList.Label>
            <DataList.Value>Standard contrast</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label color="green" highContrast>
              High Contrast
            </DataList.Label>
            <DataList.Value>Darker, more prominent</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Custom Label Width */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Custom Label Width
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label width={80}>Short</DataList.Label>
            <DataList.Value>Label width: 80px</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label width={150}>Medium Width</DataList.Label>
            <DataList.Value>Label width: 150px</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label width={200}>Long Label Width</DataList.Label>
            <DataList.Value>Label width: 200px</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Trim Options */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Trim Options
        </Heading>
        <Text style={styles.description}>
          Trim controls the leading/trailing spacing of the list.
        </Text>
        <View style={styles.trimRow}>
          <View style={styles.trimColumn}>
            <Text style={styles.trimLabel}>Normal</Text>
            <DataList.Root trim="normal">
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>John</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>john@mail.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
          <View style={styles.trimColumn}>
            <Text style={styles.trimLabel}>Trim Start</Text>
            <DataList.Root trim="start">
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>Jane</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>jane@mail.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
        </View>
        <View style={styles.trimRow}>
          <View style={styles.trimColumn}>
            <Text style={styles.trimLabel}>Trim End</Text>
            <DataList.Root trim="end">
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>Bob</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>bob@mail.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
          <View style={styles.trimColumn}>
            <Text style={styles.trimLabel}>Trim Both</Text>
            <DataList.Root trim="both">
              <DataList.Item>
                <DataList.Label>Name</DataList.Label>
                <DataList.Value>Alice</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>alice@mail.com</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </View>
        </View>
      </View>

      {/* Complex Content */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Complex Content in Values
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Tags</DataList.Label>
            <DataList.Value>
              <Flex direction="row" gap={8}>
                <Badge size={1}>React</Badge>
                <Badge size={1} color="blue">
                  TypeScript
                </Badge>
                <Badge size={1} color="green">
                  Node.js
                </Badge>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label>Actions</DataList.Label>
            <DataList.Value>
              <Flex align={'center'} direction="row" gap={2}>
                <Button size={1} variant="soft">
                  Edit
                </Button>
                <Button size={1} variant="soft" color="red">
                  Delete
                </Button>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Status</DataList.Label>
            <DataList.Value>
              <Flex direction="row" gap={2} align="center">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#22c55e',
                  }}
                />
                <Text>Online</Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>

      {/* Long Content */}
      <View style={styles.section}>
        <Heading size={4} style={styles.sectionTitle}>
          Long Content
        </Heading>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Description</DataList.Label>
            <DataList.Value>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac nisl et libero
              ultricies viverra quis vitae quam. Proin a feugiat metus. Donec vehicula purus at nisi
              convallis, vel volutpat sem volutpat.
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Very Long Label That Should Still Work</DataList.Label>
            <DataList.Value>Value with a long label</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 12,
    opacity: 0.7,
  },
  row: {
    gap: 24,
  },
  sizeColumn: {
    marginBottom: 16,
  },
  sizeLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  trimRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  trimColumn: {
    flex: 1,
  },
  trimLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
});
