import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Badge,
  BottomSheet,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from 'radix-native-ui';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

const SNAP_LABELS = ['Peek · 25%', 'Half · 60%', 'Tall · 90%'];

// The sheet lives in a full-screen Modal (its own native surface, outside the
// app's SafeAreaView), so every demo sheet passes the device insets.
function Sheet(props: React.ComponentProps<typeof BottomSheet.Root>) {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet.Root {...props} safeAreaInsets={{ top: insets.top, bottom: insets.bottom }} />
  );
}

function MultiSnapSheet() {
  const [snapIndex, setSnapIndex] = React.useState(0);

  return (
    <Sheet snapPoints={['25%', '60%', '90%']} onSnapPointChange={setSnapIndex}>
      <BottomSheet.Trigger>
        <Button>Multi-Snap Sheet</Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <Flex align="center" justify="space-between">
            <BottomSheet.Title>Drag me between snaps</BottomSheet.Title>
            <Badge color="blue" size={1}>
              {SNAP_LABELS[snapIndex]}
            </Badge>
          </Flex>
          <BottomSheet.Description>
            This sheet rests at 25%, 60% or 90% of the screen. Drag the title, handle or footer to
            move it. The list is a BottomSheet.Scrollable — it scrolls freely, and pulling down
            once it's back at the top hands over to the sheet so you can dismiss from the list.
          </BottomSheet.Description>
          <Separator />
          <BottomSheet.Scrollable contentContainerStyle={{ paddingVertical: 12, gap: 8 }}>
            {Array.from({ length: 30 }, (_, i) => (
              <Text key={i} size={3} color="gray">
                Content row {i + 1} — scrolls; pull down at the top to move the sheet
              </Text>
            ))}
          </BottomSheet.Scrollable>
          <BottomSheet.Footer>
            <BottomSheet.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </BottomSheet.Close>
          </BottomSheet.Footer>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </Sheet>
  );
}

export default function BottomSheetDemo() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <Box>
          <Heading size={6}>Bottom Sheet</Heading>
          <Text color="gray" size={3}></Text>
        </Box>
      </PageHeader>
      <PageBody>
        <ScrollView style={styles.container}>
          <Flex direction="column" gap={16} padding={16}>
            {/* Basic BottomSheet */}
            <Card>
              <Sheet>
                <BottomSheet.Trigger>
                  <Button>Open Bottom Sheet</Button>
                </BottomSheet.Trigger>
                <BottomSheet.Portal>
                  <BottomSheet.Overlay />
                  <BottomSheet.Content>
                    <BottomSheet.Title>Basic Bottom Sheet</BottomSheet.Title>
                    <BottomSheet.Description>
                      This is a basic bottom sheet with default settings. It slides up from the
                      bottom of the screen.
                    </BottomSheet.Description>
                    <BottomSheet.Footer>
                      <BottomSheet.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </BottomSheet.Close>
                      <Button>Confirm</Button>
                    </BottomSheet.Footer>
                  </BottomSheet.Content>
                </BottomSheet.Portal>
              </Sheet>
            </Card>

            {/* Snap Points */}
            <Card>
              <View style={styles.row}>
                <Sheet snapPoints={['25%']}>
                  <BottomSheet.Trigger>
                    <Button size={2}>25%</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content>
                      <BottomSheet.Title>25% Height</BottomSheet.Title>
                      <BottomSheet.Description>
                        This sheet takes up 25% of the screen height.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>

                <Sheet snapPoints={['50%']}>
                  <BottomSheet.Trigger>
                    <Button size={2}>50%</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content>
                      <BottomSheet.Title>50% Height</BottomSheet.Title>
                      <BottomSheet.Description>
                        This sheet takes up 50% of the screen height.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>

                <Sheet snapPoints={['90%']}>
                  <BottomSheet.Trigger>
                    <Button size={2}>90%</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content>
                      <BottomSheet.Title>90% Height</BottomSheet.Title>
                      <BottomSheet.Description>
                        This sheet takes up 90% of the screen height, almost covering the entire
                        screen.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>
              </View>
            </Card>

            {/* Multi-Snap Points */}
            <Card>
              <MultiSnapSheet />
            </Card>

            {/* Without Handle */}
            <Card>
              <Sheet>
                <BottomSheet.Trigger>
                  <Button>No Handle</Button>
                </BottomSheet.Trigger>
                <BottomSheet.Portal>
                  <BottomSheet.Overlay />
                  <BottomSheet.Content hideHandle>
                    <BottomSheet.Title>No Drag Handle</BottomSheet.Title>
                    <BottomSheet.Description>
                      This bottom sheet does not have a drag handle at the top. Useful for more
                      custom layouts.
                    </BottomSheet.Description>
                    <BottomSheet.Footer>
                      <BottomSheet.Close>
                        <Button>Close</Button>
                      </BottomSheet.Close>
                    </BottomSheet.Footer>
                  </BottomSheet.Content>
                </BottomSheet.Portal>
              </Sheet>
            </Card>

            {/* Content Sizes */}
            <Card>
              <View style={styles.row}>
                <Sheet>
                  <BottomSheet.Trigger>
                    <Button size={1}>Size 1</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content size={1}>
                      <BottomSheet.Title>Small Padding</BottomSheet.Title>
                      <BottomSheet.Description>
                        Compact padding for dense content.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button size={1}>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>

                <Sheet>
                  <BottomSheet.Trigger>
                    <Button size={2}>Size 2</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content size={2}>
                      <BottomSheet.Title>Medium Padding</BottomSheet.Title>
                      <BottomSheet.Description>
                        Default padding size for most use cases.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button size={2}>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>

                <Sheet>
                  <BottomSheet.Trigger>
                    <Button size={3}>Size 3</Button>
                  </BottomSheet.Trigger>
                  <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheet.Content size={3}>
                      <BottomSheet.Title>Large Padding</BottomSheet.Title>
                      <BottomSheet.Description>
                        More spacious padding for prominent content.
                      </BottomSheet.Description>
                      <BottomSheet.Footer>
                        <BottomSheet.Close>
                          <Button size={3}>Close</Button>
                        </BottomSheet.Close>
                      </BottomSheet.Footer>
                    </BottomSheet.Content>
                  </BottomSheet.Portal>
                </Sheet>
              </View>
            </Card>

            {/* With List Content */}
            <Card>
              <Sheet snapPoints={['50%']}>
                <BottomSheet.Trigger>
                  <Button>Show Options</Button>
                </BottomSheet.Trigger>
                <BottomSheet.Portal>
                  <BottomSheet.Overlay />
                  <BottomSheet.Content snapPoints={['50%']}>
                    <BottomSheet.Title>Select an Option</BottomSheet.Title>
                    <BottomSheet.Description>
                      Choose from the available options below.
                    </BottomSheet.Description>

                    <View style={styles.listItem}>
                      <Text>Camera</Text>
                      <Badge color="green">Recommended</Badge>
                    </View>
                    <Separator />
                    <View style={styles.listItem}>
                      <Text>Gallery</Text>
                    </View>
                    <Separator />
                    <View style={styles.listItem}>
                      <Text>Documents</Text>
                    </View>
                    <Separator />
                    <View style={styles.listItem}>
                      <Text>Files</Text>
                    </View>

                    <BottomSheet.Footer>
                      <BottomSheet.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </BottomSheet.Close>
                    </BottomSheet.Footer>
                  </BottomSheet.Content>
                </BottomSheet.Portal>
              </Sheet>
            </Card>

            {/* Controlled State */}
            <Card>
              <ControlledBottomSheetDemo />
            </Card>

            {/* Action Sheet Style */}
            <Card>
              <Sheet snapPoints={['40%']}>
                <BottomSheet.Trigger>
                  <Button color="red">Delete Item</Button>
                </BottomSheet.Trigger>
                <BottomSheet.Portal>
                  <BottomSheet.Overlay />
                  <BottomSheet.Content snapPoints={['40%']}>
                    <BottomSheet.Title color="red">Confirm Deletion</BottomSheet.Title>
                    <BottomSheet.Description>
                      Are you sure you want to delete this item? This action cannot be undone.
                    </BottomSheet.Description>

                    <BottomSheet.Footer>
                      <BottomSheet.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </BottomSheet.Close>
                      <BottomSheet.Action color="red">Delete</BottomSheet.Action>
                    </BottomSheet.Footer>
                  </BottomSheet.Content>
                </BottomSheet.Portal>
              </Sheet>
            </Card>

            {/* Form Example */}
            <Card>
              <Sheet snapPoints={['60%']}>
                <BottomSheet.Trigger>
                  <Button>Add Comment</Button>
                </BottomSheet.Trigger>
                <BottomSheet.Portal>
                  <BottomSheet.Overlay />
                  <BottomSheet.Content snapPoints={['60%']}>
                    <BottomSheet.Title>Add a Comment</BottomSheet.Title>
                    <BottomSheet.Description>
                      Share your thoughts with the community.
                    </BottomSheet.Description>

                    <View style={styles.formContent}>
                      <Text size={2} weight="medium">
                        Your Name
                      </Text>
                      <Card style={styles.inputCard}>
                        <Text color="gray">Enter your name...</Text>
                      </Card>

                      <Text size={2} weight="medium" style={{ marginTop: 12 }}>
                        Comment
                      </Text>
                      <Card style={[styles.inputCard, { height: 80 }]}>
                        <Text color="gray">Write your comment...</Text>
                      </Card>
                    </View>

                    <BottomSheet.Footer>
                      <BottomSheet.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </BottomSheet.Close>
                      <Button>Submit</Button>
                    </BottomSheet.Footer>
                  </BottomSheet.Content>
                </BottomSheet.Portal>
              </Sheet>
            </Card>

            <View style={{ height: 40 }} />
          </Flex>
        </ScrollView>
      </PageBody>
    </PageContainer>
  );
}

// Controlled state demo component
function ControlledBottomSheetDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <View>
      <Button onPress={() => setOpen(true)}>Open Controlled Sheet</Button>
      <Text size={1} color="gray" style={{ marginTop: 8 }}>
        Status: {open ? 'Open' : 'Closed'}
      </Text>

      <Sheet open={open} onOpenChange={setOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Title>Controlled Bottom Sheet</BottomSheet.Title>
            <BottomSheet.Description>
              This bottom sheet is controlled externally using the `open` and `onOpenChange` props.
            </BottomSheet.Description>
            <BottomSheet.Footer>
              <BottomSheet.Close>
                <Button>Close</Button>
              </BottomSheet.Close>
            </BottomSheet.Footer>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  formContent: {
    marginVertical: 12,
  },
  inputCard: {
    marginTop: 4,
    padding: 12,
  },
});
