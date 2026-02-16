import {
  Flex,
  ThemeProvider,
  Heading,
  Box,
  Text,
  ContextMenu,
  Card,
} from '@radix-ui/themes-native';
import { ScrollView, View, StyleSheet, Alert, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ContextMenuDemo() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const handleSelect = (action: string) => {
    Alert.alert('Action', `You selected: ${action}`);
  };

  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'indigo', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Context Menu</Heading>
              <Text color={'gray'} size={4}>
                Menu triggered by a long-press, displaying contextual actions.
              </Text>
            </Box>

            {/* Basic Context Menu */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Basic Context Menu</Heading>
              <Text color="gray" size={2}>
                Long press the card below to open the context menu
              </Text>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>Long Press Me</Heading>
                        <Text color="gray">
                          Press and hold to see the context menu with basic options.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Item onSelect={() => handleSelect('Edit')}>
                      Edit
                    </ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => handleSelect('Duplicate')}>
                      Duplicate
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item onSelect={() => handleSelect('Archive')}>
                      Archive
                    </ContextMenu.Item>
                    <ContextMenu.Item destructive onSelect={() => handleSelect('Delete')}>
                      Delete
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Context Menu with Shortcuts */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Shortcuts</Heading>
              <Text color="gray" size={2}>
                Context menu displaying keyboard shortcuts
              </Text>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>Edit Actions</Heading>
                        <Text color="gray">
                          Long press to see edit actions with shortcuts.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Item onSelect={() => handleSelect('Undo')} shortcut="⌘Z">
                      Undo
                    </ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => handleSelect('Redo')} shortcut="⌘⇧Z">
                      Redo
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item onSelect={() => handleSelect('Cut')} shortcut="⌘X">
                      Cut
                    </ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => handleSelect('Copy')} shortcut="⌘C">
                      Copy
                    </ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => handleSelect('Paste')} shortcut="⌘V">
                      Paste
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Context Menu with Checkbox Items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Checkboxes</Heading>
              <Text size={2} color="gray">
                Bookmarked: {isBookmarked ? 'ON' : 'OFF'}, Favorite: {isFavorite ? 'ON' : 'OFF'}
              </Text>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>Document Actions</Heading>
                        <Text color="gray">
                          Long press to toggle bookmark and favorite states.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.CheckboxItem
                      checked={isBookmarked}
                      onCheckedChange={setIsBookmarked}
                      shortcut="⌘D"
                    >
                      Bookmark
                    </ContextMenu.CheckboxItem>
                    <ContextMenu.CheckboxItem
                      checked={isFavorite}
                      onCheckedChange={setIsFavorite}
                      shortcut="⌘F"
                    >
                      Favorite
                    </ContextMenu.CheckboxItem>
                    <ContextMenu.Separator />
                    <ContextMenu.Item onSelect={() => handleSelect('Share')}>
                      Share
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Context Menu with Radio Items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Radio Items</Heading>
              <Text size={2} color="gray">
                Current view mode: {viewMode}
              </Text>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>View Options</Heading>
                        <Text color="gray">
                          Long press to change the view mode.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Label>View Mode</ContextMenu.Label>
                    <ContextMenu.RadioItem
                      value="grid"
                      checked={viewMode === 'grid'}
                      onCheckedChange={() => setViewMode('grid')}
                    >
                      Grid View
                    </ContextMenu.RadioItem>
                    <ContextMenu.RadioItem
                      value="list"
                      checked={viewMode === 'list'}
                      onCheckedChange={() => setViewMode('list')}
                    >
                      List View
                    </ContextMenu.RadioItem>
                    <ContextMenu.RadioItem
                      value="compact"
                      checked={viewMode === 'compact'}
                      onCheckedChange={() => setViewMode('compact')}
                    >
                      Compact View
                    </ContextMenu.RadioItem>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Context Menu with Groups and Labels */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Groups</Heading>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>File Actions</Heading>
                        <Text color="gray">
                          Long press to see grouped file actions.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Label>File</ContextMenu.Label>
                    <ContextMenu.Group>
                      <ContextMenu.Item onSelect={() => handleSelect('New')}>
                        New File
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('Open')}>
                        Open
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('Save')}>
                        Save
                      </ContextMenu.Item>
                    </ContextMenu.Group>
                    <ContextMenu.Separator />
                    <ContextMenu.Label>Export</ContextMenu.Label>
                    <ContextMenu.Group>
                      <ContextMenu.Item onSelect={() => handleSelect('PDF')}>
                        Export as PDF
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('CSV')}>
                        Export as CSV
                      </ContextMenu.Item>
                    </ContextMenu.Group>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Context Menu with Disabled Items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Disabled Items</Heading>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card asChild>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>Advanced Options</Heading>
                        <Text color="gray">
                          Some options may be disabled.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Item onSelect={() => handleSelect('Enabled')}>
                      Enabled Option
                    </ContextMenu.Item>
                    <ContextMenu.Item disabled onSelect={() => handleSelect('Disabled')}>
                      Disabled Option
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item onSelect={() => handleSelect('Another')}>
                      Another Option
                    </ContextMenu.Item>
                    <ContextMenu.Item disabled onSelect={() => handleSelect('Premium')}>
                      Premium Only (Disabled)
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

            {/* Different Sizes */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Different Sizes</Heading>
              <Text color="gray" size={2}>
                Context menus with different size variants
              </Text>
              <Flex gap={12} wrap="wrap">
                {/* Size 1 - Small */}
                <ContextMenu.Root>
                  <ContextMenu.Trigger>
                    <Pressable>
                      <Card style={{ minWidth: 100 }}>
                        <Text size={2}>Size 1 (Small)</Text>
                      </Card>
                    </Pressable>
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Overlay />
                    <ContextMenu.Content size={1}>
                      <ContextMenu.Item onSelect={() => handleSelect('Edit')}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('Delete')}>
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>

                {/* Size 2 - Medium (default) */}
                <ContextMenu.Root>
                  <ContextMenu.Trigger>
                    <Pressable>
                      <Card style={{ minWidth: 100 }}>
                        <Text size={2}>Size 2 (Medium)</Text>
                      </Card>
                    </Pressable>
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Overlay />
                    <ContextMenu.Content size={2}>
                      <ContextMenu.Item onSelect={() => handleSelect('Edit')}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('Delete')}>
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>

                {/* Size 3 - Large */}
                <ContextMenu.Root>
                  <ContextMenu.Trigger>
                    <Pressable>
                      <Card style={{ minWidth: 100 }}>
                        <Text size={2}>Size 3 (Large)</Text>
                      </Card>
                    </Pressable>
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Overlay />
                    <ContextMenu.Content size={3}>
                      <ContextMenu.Item onSelect={() => handleSelect('Edit')}>
                        Edit
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={() => handleSelect('Delete')}>
                        Delete
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>
              </Flex>
            </Flex>

            {/* Controlled Context Menu */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Controlled State</Heading>
              <Text color="gray" size={2}>
                Context menu with externally controlled open state
              </Text>
              <ControlledContextMenuDemo />
            </Flex>

            {/* Destructive Actions */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Destructive Actions</Heading>
              <Text color="gray" size={2}>
                Context menu with destructive action highlighted
              </Text>
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Pressable>
                    <Card>
                      <Flex direction="column" gap={8}>
                        <Heading size={3}>Danger Zone</Heading>
                        <Text color="gray">
                          Long press to see destructive actions.
                        </Text>
                      </Flex>
                    </Card>
                  </Pressable>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Overlay />
                  <ContextMenu.Content>
                    <ContextMenu.Item onSelect={() => handleSelect('Edit')}>
                      Edit
                    </ContextMenu.Item>
                    <ContextMenu.Item onSelect={() => handleSelect('Move')}>
                      Move to Folder
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item destructive onSelect={() => handleSelect('Delete')}>
                      Delete Forever
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </Flex>

          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}

// Controlled Context Menu Demo Component
function ControlledContextMenuDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Flex direction="column" gap={8}>
      <Text size={2} color="gray">
        Menu is: {open ? 'OPEN' : 'CLOSED'}
      </Text>
      <ContextMenu.Root open={open} onOpenChange={setOpen}>
        <ContextMenu.Trigger>
          <Pressable>
            <Card>
              <Flex direction="column" gap={8}>
                <Heading size={3}>Controlled Menu</Heading>
                <Text color="gray">
                  Long press or use the button below to toggle.
                </Text>
              </Flex>
            </Card>
          </Pressable>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Overlay />
          <ContextMenu.Content>
            <ContextMenu.Item onSelect={() => setOpen(false)}>
              Close Menu
            </ContextMenu.Item>
            <ContextMenu.Item onSelect={() => setOpen(false)}>
              Another Action
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
