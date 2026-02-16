import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Callout, Text, Card, Flex, Button, Link, Heading, Box } from '@radix-ui/themes-native';
import { Ionicons } from '@expo/vector-icons';

// Simple icon components for demo
const InfoIcon = ({ color }: { color?: string }) => (
  <Ionicons name={'information-circle-outline'} size={16} />
);

const WarningIcon = ({ color }: { color?: string }) => (
  <Ionicons name={'warning-outline'} size={16} />
);

const ErrorIcon = ({ color }: { color?: string }) => (
  <Ionicons name={'close-circle'} size={16} />
);

export default function CalloutDemoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Box>
        <Heading size={6}>Callout</Heading>
        <Text color={'gray'} size={4}>
          Short message to attract user’s attention.
        </Text>
      </Box>

      {/* Variants Section */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          Variants
        </Text>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Soft (default)
          </Text>
          <Callout.Root variant="soft">
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>
              We have detected multiple issues in your application configuration.
            </Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Surface
          </Text>
          <Callout.Root variant="surface">
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>
              We have detected multiple issues in your application configuration.
            </Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Outline
          </Text>
          <Callout.Root variant="outline">
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>
              We have detected multiple issues in your application configuration.
            </Callout.Text>
          </Callout.Root>
        </View>
      </Card>

      {/* Sizes Section */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          Sizes
        </Text>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Size 1
          </Text>
          <Callout.Root size={1}>
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>There was an error in your configuration.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Size 2 (default)
          </Text>
          <Callout.Root size={2}>
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>There was an error in your configuration.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Size 3
          </Text>
          <Callout.Root size={3}>
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>There was an error in your configuration.</Callout.Text>
          </Callout.Root>
        </View>
      </Card>

      {/* Colors Section */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          Colors
        </Text>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Red (Warning)
          </Text>
          <Callout.Root color="red" variant="soft">
            <Callout.Icon>
              <Ionicons name={'close-circle'} size={18} />
            </Callout.Icon>
            <Callout.Text>Critical error detected. Please fix immediately.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Amber (Caution)
          </Text>
          <Callout.Root color="amber" variant="soft">
            <Callout.Icon>
              <Ionicons name={'warning-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>Warning: Your session will expire in 5 minutes.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Green (Success)
          </Text>
          <Callout.Root color="green" variant="soft">
            <Callout.Icon>
              <Ionicons name={'checkmark-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>Your changes have been saved successfully.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Blue (Info)
          </Text>
          <Callout.Root color="blue" variant="soft">
            <Callout.Icon>
              <Ionicons name={'cloud-download-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>A new version is available for download.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Indigo (Default)
          </Text>
          <Callout.Root color="indigo" variant="soft">
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={18} />
            </Callout.Icon>
            <Callout.Text>This is an informational message.</Callout.Text>
          </Callout.Root>
        </View>
      </Card>

      {/* High Contrast Section */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          High Contrast
        </Text>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            Normal
          </Text>
          <Callout.Root color="red" variant="soft">
            <Callout.Icon>
              <Ionicons name={'close-circle'} size={20} />
            </Callout.Icon>
            <Callout.Text>This is a normal contrast callout.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Text size={2} style={styles.label}>
            High Contrast
          </Text>
          <Callout.Root color="red" variant="soft" highContrast>
            <Callout.Icon>
              <Ionicons name={'close-circle'} size={20} />
            </Callout.Icon>
            <Callout.Text>This is a high contrast callout for better accessibility.</Callout.Text>
          </Callout.Root>
        </View>
      </Card>

      {/* Without Icon Section */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          Without Icon
        </Text>

        <View style={styles.gap}>
          <Callout.Root variant="soft">
            <Callout.Text>
              This is a callout without an icon. It still conveys important information.
            </Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Callout.Root variant="surface" color="blue">
            <Callout.Text>Surface variant without icon.</Callout.Text>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Callout.Root variant="outline" color="green">
            <Callout.Text>Outline variant without icon.</Callout.Text>
          </Callout.Root>
        </View>
      </Card>

      {/* Multiple Text Elements */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          Multiple Text Elements
        </Text>

        <View style={styles.gap}>
          <Callout.Root variant="soft" size={3}>
            <Callout.Icon>
              <Ionicons name={'information-circle-outline'} size={24} />
            </Callout.Icon>
            <Flex direction={'column'} align={'flex-start'}>
              <Callout.Text>Configuration Error.</Callout.Text>
              <Callout.Text>
                We have detected multiple issues in your application configuration.
              </Callout.Text>
            </Flex>
          </Callout.Root>
        </View>

        <View style={styles.gap}>
          <Callout.Root color={'ruby'} variant="soft" size={3}>
            <Flex align={'flex-start'}>
              <Callout.Text>There was an error in your configuration.</Callout.Text>
              <Button color={'ruby'} size={1}>Learn More</Button>
              {/*<Callout.Text>
                We have detected multiple issues in your application configuration.
              </Callout.Text>*/}
            </Flex>
          </Callout.Root>
        </View>
      </Card>

      {/* All Variants with All Colors */}
      <Card style={styles.section}>
        <Text size={4} weight="bold" style={styles.sectionTitle}>
          All Variants with Colors
        </Text>

        {(['soft', 'surface', 'outline'] as const).map((variant) => (
          <View key={variant} style={styles.variantRow}>
            <Text size={2} style={styles.label}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Text>
            {(['red', 'amber', 'green', 'blue', 'indigo'] as const).map((color) => (
              <View key={`${variant}-${color}`} style={styles.miniCallout}>
                <Callout.Root variant={variant} color={color} size={2}>
                  <Callout.Icon>
                    <Ionicons name={'information-circle-outline'} size={16} />
                  </Callout.Icon>
                  <Callout.Text>{color}</Callout.Text>
                </Callout.Root>
              </View>
            ))}
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  gap: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    opacity: 0.7,
  },
  variantRow: {
    marginBottom: 12,
  },
  miniCallout: {
    marginBottom: 8,
  },
  // Icon styles
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    marginTop: 2,
  },
  iconLine: {
    width: 1.5,
    height: 6,
    marginTop: 1,
  },
  // Warning icon
  warningIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningLine: {
    width: 1.5,
    height: 8,
    marginTop: 1,
  },
  warningDot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 0.75,
    marginTop: 2,
  },
  // Error icon (X)
  errorIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorLine1: {
    width: 12,
    height: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  errorLine2: {
    width: 12,
    height: 1.5,
    transform: [{ rotate: '-45deg' }],
    marginTop: -1.5,
  },
});
