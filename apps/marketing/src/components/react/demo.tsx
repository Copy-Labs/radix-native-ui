import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Accordion,
  Avatar,
  Badge,
  Blockquote,
  Button,
  Callout,
  Card,
  Checkbox,
  Code,
  DataList,
  Dialog,
  DropdownMenu,
  Em,
  Flex,
  Heading,
  Kbd,
  Link,
  Popover,
  Progress,
  SegmentedControl,
  Select,
  Separator,
  Skeleton,
  Slider,
  Strong,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
  Tooltip,
  BottomSheet,
  Sidebar,
  Spinner,
  Table,
  useToast,
  type Color,
} from 'radix-native-ui';
import { Glyph } from './glyph';

/**
 * One island, many demos.
 *
 * Everything below is the *published* `radix-native-ui` package rendering through
 * react-native-web — this is the same component tree a consumer ships on device,
 * not a styled re-creation of it. Keeping the categories in one module means the
 * site hydrates a single shared chunk instead of one per panel.
 */
export type DemoKind =
  | 'buttons'
  | 'typography'
  | 'forms'
  | 'selection'
  | 'data'
  | 'navigation'
  | 'overlays'
  | 'feedback';

export interface DemoProps {
  kind: DemoKind;
  accentColor?: Color;
  grayColor?: 'mauve' | 'olive' | 'sage' | 'sand' | 'slate' | 'gray';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  scaling?: number;
  appearance?: 'light' | 'dark' | 'inherit';
}

/* ------------------------------------------------------------------ panels -- */

const Buttons = () => (
  <Flex direction="column" gap={12}>
    <Flex gap={8} wrap="wrap" align="center">
      <Button>Solid</Button>
      <Button variant="soft" color="blue">
        Soft
      </Button>
      <Button variant="outline" color="green">
        Outline
      </Button>
      <Button variant="surface" color="amber">
        Surface
      </Button>
      <Button variant="ghost">Ghost</Button>
      <Button color="red">Delete</Button>
      <Button disabled>Disabled</Button>
    </Flex>
    <Flex gap={8} wrap="wrap" align="center">
      <Button size={1}>Size 1</Button>
      <Button size={2}>Size 2</Button>
      <Button size={3}>Size 3</Button>
      <Button highContrast color="indigo">
        High contrast
      </Button>
    </Flex>
    <Flex gap={8} wrap="wrap" align="center">
      <Button>
        <Button.Icon>
          <Glyph name="+" />
        </Button.Icon>
        Icon left
      </Button>
      <Button variant="soft" color="purple">
        Continue
        <Button.Icon>
          <Glyph name="→" />
        </Button.Icon>
      </Button>
      <Button variant="outline" color="cyan" radius="full">
        Pill
      </Button>
    </Flex>
  </Flex>
);

const Typography = () => (
  <Flex direction="column" gap={10}>
    <Heading size={6}>Heading 6</Heading>
    <Text size={3}>
      Body text at <Code>size=3</Code>, the default reading size.
    </Text>
    <Text size={2} color="gray">
      Secondary text in gray, used for captions and metadata.
    </Text>
    <Text>
      <Strong>Bold</Strong>, <Em>emphasis</Em>, <Code>inline code</Code> and a{' '}
      <Link href="#">link</Link> — plus <Kbd>⌘</Kbd> <Kbd>K</Kbd> for shortcuts.
    </Text>
    <Blockquote>“Inspired by Radix Themes, built for React Native.”</Blockquote>
    <Flex gap={6} wrap="wrap">
      <Text size={1} color="indigo">
        size 1
      </Text>
      <Text size={2} color="blue">
        size 2
      </Text>
      <Text size={4} color="crimson">
        size 4
      </Text>
      <Text size={5} color="grass">
        size 5
      </Text>
    </Flex>
  </Flex>
);

const Forms = () => {
  const [email, setEmail] = useState('');
  return (
    <Flex direction="column" gap={12}>
      <TextField.Root
        label="Email"
        placeholder="you@company.com"
        size={2}
        value={email}
        onChangeText={setEmail}
      />
      <TextField.Root label="With a slot" placeholder="Search…" size={2}>
        <TextField.Slot>
          <Glyph name="⌕" />
        </TextField.Slot>
      </TextField.Root>
      <TextArea label="Bio" placeholder="Tell us something about you" size={2} />
      <Flex gap={8} wrap="wrap" align="center">
        <Switch defaultChecked />
        <Switch color="green" />
        <Switch disabled />
        <Spinner size="small" />
      </Flex>
      <Slider defaultValue={64} showValueLabel label="Volume" />
    </Flex>
  );
};

const Selection = () => {
  const [fruit, setFruit] = useState('apple');
  return (
    <Flex direction="column" gap={14}>
      <SegmentedControl.Root defaultValue="option1" size={2}>
        <SegmentedControl.Item value="option1">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="option3">Month</SegmentedControl.Item>
      </SegmentedControl.Root>

      <Select.Root value={fruit} onValueChange={setFruit} variant="outline">
        <Select.Trigger asChild>
          <Button variant="outline" size={2} style={{ justifyContent: 'space-between' }}>
            <Select.Value placeholder="Pick a fruit" />
          </Button>
        </Select.Trigger>
        <Select.Portal>
          <Select.Overlay />
          <Select.Content sideOffset={6}>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
            <Select.Item value="carrot">Carrot</Select.Item>
            <Select.Separator />
            <Select.Item value="avocado" disabled>
              Avocado (disabled)
            </Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Flex direction="column" gap={8}>
        <Checkbox defaultChecked label="Agree to terms" />
        <Checkbox color="green" label="Email me product updates" />
      </Flex>
    </Flex>
  );
};

const Data = () => (
  <Flex direction="column" gap={14}>
    <Flex gap={10} wrap="wrap" align="center">
      <Avatar variant="solid" fallback="SK" size={5} />
      <Avatar color="crimson" variant="soft" fallback="JD" size={5} />
      <Avatar highContrast color="purple" variant="solid" fallback="AB" size={5} />
      <Badge variant="solid">New</Badge>
      <Badge variant="soft" color="teal">
        Beta
      </Badge>
      <Badge variant="outline" color="amber">
        Pending
      </Badge>
    </Flex>

    <Callout.Root color="sky" variant="soft">
      <Callout.Icon>
        <Glyph name="ℹ" />
      </Callout.Icon>
      <Callout.Text>Callouts carry inline, low-emphasis messages.</Callout.Text>
    </Callout.Root>

    <Card size={3} variant="surface">
      <Flex direction="column" gap={8}>
        <Heading size={5}>Susan Kare</Heading>
        <Text size={2} color="gray">
          Design lead · 12 projects
        </Text>
        <Progress value={72} size={2} />
        <Card.Footer>
          <Button size={1} variant="ghost">
            Message
          </Button>
          <Button size={1} color="indigo">
            Follow
          </Button>
        </Card.Footer>
      </Flex>
    </Card>

    <DataList.Root size={2} orientation="vertical">
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>Susan Kare</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Email</DataList.Label>
        <DataList.Value>susan@apple.com</DataList.Value>
      </DataList.Item>
    </DataList.Root>

    <Table.Root size={2}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Package</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">Version</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>radix-native-ui</Table.Cell>
          <Table.Cell align="right">0.1.11</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>react-native-web</Table.Cell>
          <Table.Cell align="right">0.21.4</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>

    <Skeleton width={220} height={18} />
  </Flex>
);

const Navigation = () => {
  const [tab, setTab] = useState('home');
  return (
    <Flex direction="column" gap={16}>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <Text size={2} color="gray">
            Tabs, TabNav, SegmentedControl and FloatingTabBar share the same controlled/uncontrolled
            API.
          </Text>
        </Tabs.Content>
        <Tabs.Content value="activity">
          <Text size={2} color="gray">
            Every indicator animates on the native driver.
          </Text>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <Text size={2} color="gray">
            Numeric sizes, theme colors, full tab-role accessibility.
          </Text>
        </Tabs.Content>
      </Tabs.Root>

      <View style={{ height: 76, justifyContent: 'flex-end' }}>
        <Sidebar.Root side="left" variant="overlay">
          <Sidebar.Trigger>
            <Button variant="soft" color="gray" size={2}>
              <Button.Icon>
                <Glyph name="☰" />
              </Button.Icon>
              Sidebar drawer
            </Button>
          </Sidebar.Trigger>
          <Sidebar.Portal>
            <Sidebar.Overlay />
            <Sidebar.Content>
              <Sidebar.Header>
                <Heading size={4}>Workspace</Heading>
              </Sidebar.Header>
              <Sidebar.Item>
                <Text>Chats</Text>
              </Sidebar.Item>
              <Sidebar.Item>
                <Text>Agents</Text>
              </Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item>
                <Text>Settings</Text>
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Portal>
        </Sidebar.Root>
      </View>

      <BottomSheet.Root snapPoints={['22%', '48%']} defaultSnapPoint={0}>
        <BottomSheet.Trigger>
          <Button variant="outline" size={2}>
            Bottom sheet
          </Button>
        </BottomSheet.Trigger>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Handle />
            <BottomSheet.Title>Snap points</BottomSheet.Title>
            <BottomSheet.Description>
              Drag between the two snaps; flick below the smallest one to dismiss.
            </BottomSheet.Description>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet.Root>
      <Text size={1} color="gray">
        Active tab: {tab}
      </Text>
      <SegmentedControl.Root value={tab} onValueChange={setTab} size={1}>
        <SegmentedControl.Item value="home">Home</SegmentedControl.Item>
        <SegmentedControl.Item value="search">Search</SegmentedControl.Item>
        <SegmentedControl.Item value="profile">Profile</SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  );
};

const Overlays = () => {
  const toast = useToast();
  const [note, setNote] = useState('');
  return (
    <Flex gap={8} wrap="wrap" align="center">
      <Tooltip content="Tooltips need no trigger wrapper prop">
        <Button variant="soft" size={2}>
          Tooltip
        </Button>
      </Tooltip>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button size={2}>Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content size={3}>
            <Dialog.Title size={5}>Rename project</Dialog.Title>
            <Dialog.Description size={2}>Names are visible to your team.</Dialog.Description>
            <TextField.Root
              placeholder="Project name"
              size={2}
              value={note}
              onChangeText={setNote}
            />
            <Dialog.Action>
              <Button color="indigo">Save</Button>
            </Dialog.Action>
            <Dialog.Close>
              <Button variant="ghost" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button variant="outline" size={2}>
            Popover
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Overlay />
          <Popover.Content size={2} sideOffset={8}>
            <Flex direction="column" gap={6}>
              <Text size={2}>Popovers anchor to their trigger.</Text>
              <Separator />
              <Text size={1} color="gray">
                side / align / sideOffset are honoured.
              </Text>
            </Flex>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="soft" color="gray" size={2}>
            Menu
            <Button.Icon>
              <Glyph name="⌄" />
            </Button.Icon>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Overlay />
          <DropdownMenu.Content sideOffset={6}>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Email</DropdownMenu.Item>
                <DropdownMenu.Item>Messages</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Button
        variant="surface"
        color="grass"
        size={2}
        onPress={() =>
          toast.success({ title: 'Saved', description: 'Toast stacks animate in and out.' })
        }
      >
        Fire toast
      </Button>
    </Flex>
  );
};

const Feedback = () => (
  <Flex direction="column" gap={14}>
    <Accordion.Root type="single" collapsible defaultValue="item-1">
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Zero runtime dependencies</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Text size={2} color="gray">
            The published package declares no dependencies at all — only peers for react,
            react-native and Expo.
          </Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Native-first API</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Text size={2} color="gray">
            Compound components, controlled and uncontrolled state, numeric sizes.
          </Text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Radix-compatible theming</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Text size={2} color="gray">
            Accent colors, gray scales, radius and scaling mirror web Radix Themes.
          </Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <Flex gap={10} direction="column">
      <Progress value={82} size={2} />
      <Progress value={45} size={2} color="grass" variant="soft" />
      <Progress value={25} size={2} color="amber" variant="surface" />
    </Flex>
  </Flex>
);

const panels: Record<DemoKind, () => React.JSX.Element> = {
  buttons: Buttons,
  typography: Typography,
  forms: Forms,
  selection: Selection,
  data: Data,
  navigation: Navigation,
  overlays: Overlays,
  feedback: Feedback,
};

/* ----------------------------------------------------------------- island -- */

const DemoIsland = ({ kind, ...theme }: DemoProps) => {
  const Panel = panels[kind];
  // ThemeProvider owns the toast viewport (it renders one internally), so the
  // toast demo below needs no extra mounting here.
  return (
    <ThemeProvider {...theme}>
      <Panel />
    </ThemeProvider>
  );
};

export default DemoIsland;
