import { Button, Flex, Heading, ThemeProvider, Text, Box, Card } from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Simple icon components for demo purposes
// In a real app, you would use a proper icon library like phosphor-react-native
/*const PlusIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color, fontWeight: 'bold' }}>+</Text>
);

const ChevronRightIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>→</Text>
);

const ChevronLeftIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>←</Text>
);

const StarIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>★</Text>
);*/

export default function Buttons() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'large', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Buttons</Heading>
              <Text color={'gray'} size={4}>
                Trigger an action or event, such as submitting a form or displaying a dialog.
              </Text>
            </Box>

            {/* Basic Buttons */}
            <Card>
              <Flex direction={'column'} gap={12} paddingHorizontal={4}>
                <Button>Basic Button</Button>
                <Button variant={'ghost'}>Ghost Button</Button>
                <Button variant={'outline'}>Outline Button</Button>
                <Button variant={'soft'}>Soft Button</Button>
                <Button variant={'surface'}>Surface Button</Button>
                <Button loading>Loading Button</Button>
                <Button highContrast={true}>High Contrast</Button>
              </Flex>
            </Card>

            <Flex gap={3} align="center">
              <Button size={1} variant="soft">
                Edit profile
              </Button>
              <Button size={2} variant="soft">
                Edit profile
              </Button>
              <Button size={3} variant="soft">
                Edit profile
              </Button>
            </Flex>

            <Heading size={5} style={{ marginTop: 16 }}>
              Button.Icon Examples
            </Heading>

            {/* Icon on Left */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>Icon on Left</Heading>
              <Button>
                <Button.Icon>
                  <Ionicons name={'add'} />
                </Button.Icon>
                Add Item
              </Button>

              <Button variant="soft">
                <Button.Icon>
                  <Ionicons name={'star'} />
                </Button.Icon>
                Favorite
              </Button>

              <Button variant="outline" color="green">
                <Button.Icon>
                  <Ionicons name={'add'} />
                </Button.Icon>
                Create New
              </Button>
            </Flex>

            {/* Icon on Right */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>Icon on Right</Heading>
              <Button>
                Continue
                <Button.Icon>
                  <Ionicons name={'chevron-forward'} />
                </Button.Icon>
              </Button>

              <Button variant="soft" color="purple">
                Go Back
                <Button.Icon>
                  <Ionicons name={'chevron-back'} />
                </Button.Icon>
              </Button>
            </Flex>

            {/* Icons on Both Sides */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>Icons on Both Sides</Heading>
              <Button>
                <Button.Icon>
                  <Ionicons name={'chevron-back'} />
                </Button.Icon>
                Navigate
                <Button.Icon>
                  <Ionicons name={'chevron-forward'} />
                </Button.Icon>
              </Button>
            </Flex>

            {/* Different Sizes */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>Different Sizes</Heading>
              <Flex direction="row" gap={8} align="center">
                <Button size={1}>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  Small
                </Button>
                <Button size={2}>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  Medium
                </Button>
                <Button size={3}>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  Large
                </Button>
              </Flex>
            </Flex>

            {/* States */}
            <Flex direction={'column'} gap={12}>
              <Heading>States</Heading>
              <Flex direction="row" gap={8}>
                <Button disabled>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  Disabled
                </Button>
                <Button loading>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  Loading
                </Button>
              </Flex>
            </Flex>

            {/* Radius Variants */}
            <Flex gap={3} padding={4}>
              <Button radius="none" variant="soft">
                <Button.Icon>
                  <Ionicons name={'add'} />
                </Button.Icon>
                No Radius
              </Button>
              <Button radius="full" variant="soft">
                <Button.Icon>
                  <Ionicons name={'add'} />
                </Button.Icon>
                Full Radius
              </Button>
            </Flex>

            <Heading size={3} style={{ marginTop: 16 }}>
              Button.Label Examples
            </Heading>

            {/* Button.Label - Explicit Label */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>Explicit Label with Button.Label</Heading>
              <Button>
                <Button.Icon>
                  <Ionicons name={'add'} />
                </Button.Icon>
                <Button.Label>Add Item</Button.Label>
              </Button>

              <Button variant="soft" color="purple">
                <Button.Icon>
                  <Ionicons name={'star'} />
                </Button.Icon>
                <Button.Label>Favorite Item</Button.Label>
                <Button.Icon>
                  <Ionicons name={'chevron-forward'} />
                </Button.Icon>
              </Button>

              <Button variant="outline" color="green">
                <Button.Label style={{ fontStyle: 'italic' }}>Custom Styled Label</Button.Label>
              </Button>
            </Flex>

            {/* Comparison: String vs Button.Label */}
            <Flex direction={'column'} gap={12} paddingHorizontal={4}>
              <Heading>String children vs Button.Label</Heading>
              <Flex direction="row" gap={8}>
                <Button>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  String Label
                </Button>
                <Button>
                  <Button.Icon>
                    <Ionicons name={'add'} />
                  </Button.Icon>
                  <Button.Label>Button.Label</Button.Label>
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
