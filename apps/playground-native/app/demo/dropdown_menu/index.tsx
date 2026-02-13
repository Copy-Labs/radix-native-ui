import {
  Button,
  Flex,
  ThemeProvider,
  Heading,
  Box,
  Text,
  DropdownMenu,
  Card,
  Avatar,
} from '@radix-ui/themes-native';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function DropdownMenuDemo() {
  const [selectedValue, setSelectedValue] = useState<string>('option1');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [radioValue, setRadioValue] = useState('small');

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    Alert.alert('Selected', `You selected: ${value}`);
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
              <Heading size={6}>Dropdown Menu</Heading>
              <Text color={'gray'} size={4}>
                Menu representing a set of actions, triggered by a button.
              </Text>
            </Box>

            <Card radius={'large'}>
              <Flex align={'center'} justify={'space-between'}>
                <Heading>Anno-mark</Heading>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost" size={1}>
                      <Button.Label>
                        <Avatar
                          radius={'full'}
                          size={2}
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                        />
                      </Button.Label>
                      <Button.Icon>
                        <Ionicons name="caret-down" size={12} />
                      </Button.Icon>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content align={'center'} sideOffset={5} size={2}>
                      <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                      <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                      <DropdownMenu.Separator />
                      <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </Flex>
            </Card>

            <Flex direction={'column'} gap={16}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" size={2}>
                    Options
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content align={'center'} sideOffset={5} size={2}>
                    <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                    <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                    <DropdownMenu.Separator />
                    <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* Basic DropdownMenu */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Basic DropdownMenu</Heading>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant={'soft'} width={120}>
                    Open Menu
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content align={'center'} sideOffset={5}>
                    <DropdownMenu.Item onSelect={() => handleSelect('Profile')}>
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Settings')}>
                      Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => handleSelect('Help')}>
                      Help
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => handleSelect('Logout')}>
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* DropdownMenu with groups and labels */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Groups</Heading>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant={'soft'} color={'indigo'} width={120}>
                    File Menu
                    <Button.Icon>
                      <Ionicons name="caret-down" style={{ fontSize: 16 }} />
                    </Button.Icon>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.Label>File Actions</DropdownMenu.Label>
                    <DropdownMenu.Item onSelect={() => handleSelect('New')}>New</DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Open')}>
                      Open
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Save')}>
                      Save
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>Export</DropdownMenu.Label>
                    <DropdownMenu.Item onSelect={() => handleSelect('Export PDF')}>
                      Export as PDF
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Export CSV')}>
                      Export as CSV
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* DropdownMenu with shortcuts */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Shortcuts</Heading>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button color={'crimson'} size={1} variant={'soft'} width={120}>
                    Edit Menu
                    <Button.Icon>
                      <Ionicons name="caret-down" size={12} />
                    </Button.Icon>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.Item onSelect={() => handleSelect('Undo')} shortcut="⌘Z">
                      Undo
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Redo')} shortcut="⌘⇧Z">
                      Redo
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => handleSelect('Cut')} shortcut="⌘X">
                      Cut
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Copy')} shortcut="⌘C">
                      Copy
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => handleSelect('Paste')} shortcut="⌘V">
                      Paste
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* DropdownMenu with Checkbox Items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Checkboxes</Heading>
              <Text size={2} color="gray">
                Current state: Bold: {isBold ? 'ON' : 'OFF'}, Italic: {isItalic ? 'ON' : 'OFF'}
              </Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant={'soft'} color={'amber'}>
                    Text Options ▾
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.CheckboxItem
                      checked={isBold}
                      onCheckedChange={setIsBold}
                      shortcut="⌘B"
                    >
                      Bold
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.CheckboxItem
                      checked={isItalic}
                      onCheckedChange={setIsItalic}
                      shortcut="⌘I"
                    >
                      Italic
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => handleSelect('Underline')}>
                      Underline
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* DropdownMenu with Radio Items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Radio Items</Heading>
              <Text size={2} color="gray">
                Selected size: {radioValue}
              </Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant={'soft'} color={'green'}>
                    Font Size ▾
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.RadioItem
                      value="small"
                      checked={radioValue === 'small'}
                      onCheckedChange={() => setRadioValue('small')}
                    >
                      Small
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      value="medium"
                      checked={radioValue === 'medium'}
                      onCheckedChange={() => setRadioValue('medium')}
                    >
                      Medium
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      value="large"
                      checked={radioValue === 'large'}
                      onCheckedChange={() => setRadioValue('large')}
                    >
                      Large
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      value="extra-large"
                      checked={radioValue === 'extra-large'}
                      onCheckedChange={() => setRadioValue('extra-large')}
                    >
                      Extra Large
                    </DropdownMenu.RadioItem>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* DropdownMenu with disabled items */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu with Disabled Items</Heading>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant={'outline'}>Advanced Options ▾</Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Overlay />
                  <DropdownMenu.Content sideOffset={5}>
                    <DropdownMenu.Item onSelect={() => handleSelect('Enabled')}>
                      Enabled Option
                    </DropdownMenu.Item>
                    <DropdownMenu.Item disabled onSelect={() => handleSelect('Disabled')}>
                      Disabled Option
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => handleSelect('Another')}>
                      Another Option
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>

            {/* Aligned DropdownMenu */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Menu Alignment</Heading>
              <Flex gap={12} wrap="wrap">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant={'soft'} color={'gray'}>
                      Align Start
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content align={'start'} sideOffset={5}>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option A')}>
                        Option A
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option B')}>
                        Option B
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant={'soft'} color={'gray'}>
                      Align Center
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content align={'center'} sideOffset={5}>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option C')}>
                        Option C
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option D')}>
                        Option D
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant={'soft'} color={'gray'}>
                      Align End
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content align={'end'} sideOffset={5}>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option E')}>
                        Option E
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => handleSelect('Option F')}>
                        Option F
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </Flex>
            </Flex>

            {/* Color-coded dropdowns */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Different Menu Styles</Heading>
              <Flex gap={12} wrap="wrap">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant={'solid'} color="blue">
                      Primary Action ▾
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content sideOffset={5}>
                      <DropdownMenu.Item onSelect={() => handleSelect('Primary 1')}>
                        Primary Option 1
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => handleSelect('Primary 2')}>
                        Primary Option 2
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant={'soft'} color="tomato">
                      Danger Actions ▾
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Overlay />
                    <DropdownMenu.Content sideOffset={5}>
                      <DropdownMenu.Item onSelect={() => handleSelect('Danger 1')}>
                        Danger Option 1
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item onSelect={() => handleSelect('Delete')}>
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </Flex>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
