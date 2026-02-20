import { Button, Flex, Heading, ThemeProvider, Text, Box, Card, useToast } from '@radix-ui/themes-native';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Component that uses toast - must be inside ThemeProvider
function ToastDemo() {
  const toast = useToast();

  return (
    <Flex direction="column" gap={32} padding={12}>
      <Box>
        <Heading size={6}>Toast</Heading>
        <Text color="gray" size={4}>
          Brief notifications that appear temporarily to inform users of actions or events.
        </Text>
      </Box>

      {/* Basic Toasts */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Basic Toasts</Heading>
          <Text color="gray" size={2}>
            Tap buttons to show different toast variants.
          </Text>

          <Button onPress={() => toast.show({ title: 'Default toast message' })}>
            Show Default Toast
          </Button>

          <Button color="green" onPress={() => toast.success({ title: 'Operation successful!' })}>
            Show Success Toast
          </Button>

          <Button color="red" onPress={() => toast.error({ title: 'Something went wrong' })}>
            Show Error Toast
          </Button>

          <Button color="yellow" onPress={() => toast.warning({ title: 'Warning: Please review' })}>
            Show Warning Toast
          </Button>

          <Button color="blue" onPress={() => toast.info({ title: 'Here is some information' })}>
            Show Info Toast
          </Button>

          <Button color="indigo" onPress={() => toast.accent({ title: 'Accent colored toast' })}>
            Show Accent Toast
          </Button>
        </Flex>
      </Card>

      {/* Toasts with Description */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>With Description</Heading>

          <Button
            onPress={() =>
              toast.success({
                title: 'File uploaded',
                description: 'Your document has been successfully uploaded to the server.',
              })
            }
          >
            Upload Complete
          </Button>

          <Button
            color="red"
            onPress={() =>
              toast.error({
                title: 'Connection failed',
                description:
                  'Unable to connect to the server. Please check your internet connection.',
              })
            }
          >
            Connection Error
          </Button>
        </Flex>
      </Card>

      {/* Toast with Action */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>With Action</Heading>

          <Button
            color="ruby"
            onPress={() =>
              toast.error({
                title: 'File deleted',
                description: 'Your file has been moved to trash.',
                action: {
                  label: 'Undo',
                  onPress: () => toast.success({ title: 'File restored!' }),
                },
                showClose: false,
                icon: (
                  <Text color={'ruby'}>
                    <Ionicons name="trash-outline" size={20} color="currentColor" />
                  </Text>
                ),
              })
            }
          >
            <Button.Icon>
              <Ionicons name="trash-outline" size={20} color="currentColor" />
            </Button.Icon>
            Delete File (with Undo)
          </Button>
        </Flex>
      </Card>

      {/* Custom Duration */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Custom Duration</Heading>

          <Button
            onPress={() =>
              toast.show({
                title: 'Quick toast (2s)',
                duration: 2000,
              })
            }
          >
            2 Second Toast
          </Button>

          <Button
            onPress={() =>
              toast.show({
                title: 'Long toast (10s)',
                description: 'This toast will stay for 10 seconds',
                duration: 10000,
              })
            }
          >
            10 Second Toast
          </Button>
        </Flex>
      </Card>

      {/* Position Override */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Position Override</Heading>

          <Button
            onPress={() =>
              toast.show({
                title: 'Top positioned toast',
                position: 'top',
              })
            }
          >
            Show at Top
          </Button>

          <Button
            onPress={() =>
              toast.show({
                title: 'Bottom positioned toast',
                position: 'bottom',
              })
            }
          >
            Show at Bottom
          </Button>
        </Flex>
      </Card>

      {/* Stacking Demo */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Stacking</Heading>
          <Text color="gray" size={2}>
            Multiple toasts stack. Max 3 visible by default.
          </Text>

          <Button
            onPress={() => {
              toast.show({ title: 'First toast' });
              setTimeout(() => toast.show({ title: 'Second toast' }), 300);
              setTimeout(() => toast.show({ title: 'Third toast' }), 600);
              setTimeout(() => toast.success({ title: 'All done!' }), 900);
            }}
          >
            Show Multiple Toasts
          </Button>
        </Flex>
      </Card>

      {/* Programmatic Control */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Programmatic Control</Heading>

          <Flex direction="row" gap={8}>
            <Button color="red" variant="soft" onPress={() => toast.hideAll()}>
              Hide All
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Without Close Button */}
      <Card>
        <Flex direction="column" gap={12} paddingHorizontal={4}>
          <Heading size={4}>Without Close Button</Heading>

          <Button
            onPress={() =>
              toast.show({
                title: 'No close button',
                description: 'Swipe to dismiss',
                showClose: false,
              })
            }
          >
            Show Toast (no X)
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

export default function ToastDemoScreen() {
  return (
    <ThemeProvider
      mode="light"
      themeOptions={{ accentColor: 'blue', radius: 'large', scaling: 1 }}
      toastConfig={{
        position: 'bottom',
        maxVisible: 3,
        duration: 5000,
        swipeToDismiss: true,
      }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <ToastDemo />
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
