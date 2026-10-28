import React, { useEffect, useRef, useState } from 'react';
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
  useThemeColors,
  type Color,
} from 'radix-native-ui';
import { Glyph } from './glyph';
import { prefersReducedMotion, useSiteAppearance } from './use-site-appearance';

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
  | 'account'
  | 'selection'
  | 'data'
  | 'navigation'
  | 'overlays'
  | 'feedback'
  | 'auto'
  | 'faq';

export interface DemoProps {
  kind: DemoKind;
  accentColor?: Color;
  grayColor?: 'mauve' | 'olive' | 'sage' | 'sand' | 'slate' | 'gray';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  scaling?: number;
  appearance?: 'light' | 'dark' | 'inherit';
  /**
   * Paint the island's own background from the theme. Needed where a demo is
   * pinned to a scheme that differs from the page around it — dark text on a
   * white panel is not a dark mode, it is a bug.
   */
  surface?: boolean;
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

/*
  The "With radix-native-ui" half of the comparison. Same screen as
  `raw-panel.tsx`, same content, so the two columns are directly comparable and
  nothing is stacked in the library's favour except the code it takes to write.
*/
const Account = () => {
  const [name, setName] = useState('Susan Kare');
  const [email, setEmail] = useState('susan@apple.com');
  return (
    <Card size={3} variant="surface">
      <Flex direction="column" gap={12}>
        <Flex direction="row" align="center" gap={10}>
          <Avatar variant="soft" fallback="SK" size={2} radius="full" />
          <Flex direction="column" style={{ flex: 1 }}>
            <Heading size={4}>Susan Kare</Heading>
            <Text size={1} color="gray">
              Design lead · 12 projects
            </Text>
          </Flex>
          <Badge variant="soft" color="amber" size={1}>
            Pro
          </Badge>
        </Flex>

        {/* Size 1 controls: the point of this column is the code, so the card is
            staged at roughly the same scale as the hand-rolled one beside it
            rather than at the 44px touch target a real screen would use. */}
        <TextField.Root label="Display name" size={1} value={name} onChangeText={setName} />
        <TextField.Root
          label="Email"
          size={1}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Flex direction="row" align="center" justify="space-between">
          <Text size={2}>Email me product updates</Text>
          <Switch defaultChecked size={1} />
        </Flex>

        <Flex direction="column" gap={4}>
          <Flex direction="row" justify="space-between">
            <Text size={1} color="gray">
              Storage
            </Text>
            <Text size={1} color="gray">
              78%
            </Text>
          </Flex>
          <Progress value={78} size={1} />
        </Flex>

        <Flex direction="row" gap={8}>
          <Button size={1} style={{ flex: 1 }}>
            <Button.Icon>
              <Glyph name="✓" />
            </Button.Icon>
            Save changes
          </Button>
          <Button size={1} variant="ghost" color="gray">
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Card>
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
            {/* Button.Label is not decoration: a Button given an arbitrary element
                as its child treats it as an icon slot and renders only that
                child's children, so a bare Select.Value disappears. */}
            <Button.Label>
              <Select.Value placeholder="Pick a fruit" />
            </Button.Label>
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
      <Avatar variant="solid" fallback="SK" size={5} radius="full" />
      <Avatar color="crimson" variant="soft" fallback="JD" size={5} radius="full" />
      <Avatar highContrast color="purple" variant="solid" fallback="AB" size={5} radius="full" />
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

    {/* Horizontal is the component's own default and the denser layout, so the
        label column lines up instead of stacking two lines per row. */}
    <DataList.Root size={2} orientation="horizontal">
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>Susan Kare</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Email</DataList.Label>
        <DataList.Value>susan@apple.com</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Role</DataList.Label>
        <DataList.Value>Design lead</DataList.Value>
      </DataList.Item>
    </DataList.Root>

    <Table.Root size={3}>
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
        <Table.Row>
          <Table.Cell>astro</Table.Cell>
          <Table.Cell align="right">5.18.2</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>

    {/* A lone skeleton bar reads as a rendering glitch; two bars under a label
        read as the loading state they are. */}
    <Flex direction="column" gap={6}>
      <Text size={1} color="gray">
        Loading activity…
      </Text>
      <Skeleton width={280} height={14} />
      <Skeleton width={180} height={14} />
    </Flex>
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

/*
  A demo that runs itself. `client:visible` hydrates this island the first time the
  panel scrolls into view, so a mount effect *is* the scroll trigger — no observer
  and no scroll listener of our own. Everything the sequence touches is a real
  component state change: the progress bar animates, the segmented pill slides,
  the switch flips, the toast fires through the provider's viewport.
*/
const Auto = () => {
  const toast = useToast();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [upload, setUpload] = useState(0);
  const [view, setView] = useState('day');
  const [synced, setSynced] = useState(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const run = () => {
    clearTimers();
    setUpload(0);
    setView('day');
    setSynced(false);
    at(120, () => setUpload(18));
    at(700, () => setUpload(47));
    at(950, () => setView('week'));
    at(1400, () => setUpload(72));
    at(1750, () => setSynced(true));
    at(2150, () => setUpload(100));
    at(2550, () =>
      toast.success({
        title: 'Upload complete',
        description: '12 files synced to the workspace.',
      }),
    );
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      setUpload(100);
      setView('week');
      setSynced(true);
    } else {
      run();
    }
    return clearTimers;
  }, []);

  return (
    <Flex direction="column" gap={12}>
      <Flex direction="row" align="center" justify="space-between">
        <Text size={2}>{synced ? 'Synced just now' : 'Syncing workspace…'}</Text>
        <Badge variant="outline" color={synced ? 'grass' : 'amber'} size={1}>
          {upload}%
        </Badge>
      </Flex>
      <Progress value={upload} size={2} color={synced ? 'grass' : 'indigo'} />
      <SegmentedControl.Root value={view} onValueChange={setView} size={2}>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Flex direction="row" align="center" justify="space-between" gap={8}>
        <Text size={2}>Auto-sync over cellular</Text>
        <Switch size={2} checked={synced} onCheckedChange={setSynced} />
      </Flex>
      <Button size={1} variant="ghost" color="gray" onPress={run}>
        <Button.Icon>
          <Glyph name="↻" />
        </Button.Icon>
        Run it again
      </Button>
    </Flex>
  );
};

/*
  The FAQ is the product: `Accordion` in single collapsible mode, themed by the
  same provider as everything else. Other launch pages draw a chevron and animate
  a div; this one has no bespoke markup at all.
*/
const FAQ_ITEMS: { id: string; q: string; a: string }[] = [
  {
    id: 'radix',
    q: 'Is this a port of Radix Themes?',
    a: 'No. It takes the design tokens and the API shape from the web library and rebuilds them for React Native, with no shared code and no web shim. Not affiliated with or endorsed by Radix.',
  },
  {
    id: 'deps',
    q: 'How does it stay dependency-free?',
    a: 'Gestures are built on React Native\u2019s own PanResponder, animations on the built-in Animated API, and haptics fall back to Vibration when expo-haptics is missing. The published manifest declares no dependencies — only peers.',
  },
  {
    id: 'state',
    q: 'Controlled or uncontrolled?',
    a: 'Both, per component: value / onValueChange beside defaultValue, checked / onCheckedChange beside defaultChecked, and asChild when you want to style an existing element.',
  },
  {
    id: 'web',
    q: 'Does it render on web?',
    a: 'This page is the proof — every panel here is the npm package going through react-native-web. It is still native-first: on web, gestures use pointer events and haptic calls are silent.',
  },
  {
    id: 'dark',
    q: 'What about dark mode?',
    a: 'ThemeProvider takes appearance light, dark or inherit, and every color step has a dark ramp. Flip the Theme button in the nav: these answers, the demos and the phone above all recompute through the library.',
  },
  {
    id: 'box',
    q: 'What is in the box?',
    a: '50+ components across typography, layout, forms, selection, overlays, navigation, data display and disclosure — plus the theme hooks, 95 unit tests, a full playground app and per-component docs.',
  },
];

const Faq = () => (
  <Accordion.Root type="single" collapsible defaultValue="radix">
    {FAQ_ITEMS.map((item) => (
      <Accordion.Item key={item.id} value={item.id}>
        <Accordion.Header>
          <Accordion.Trigger>{item.q}</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Text size={2} color="gray">
            {item.a}
          </Text>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);

const panels: Record<DemoKind, () => React.JSX.Element> = {
  buttons: Buttons,
  typography: Typography,
  forms: Forms,
  account: Account,
  selection: Selection,
  data: Data,
  navigation: Navigation,
  overlays: Overlays,
  feedback: Feedback,
  auto: Auto,
  faq: Faq,
};

/* ----------------------------------------------------------------- island -- */

/*
  A surface that comes from the theme rather than from the page. Used by the
  pinned light/dark pair: `appearance="dark"` swaps the ramps the components paint
  with, but the CSS panel behind them still follows the *page*, so without this the
  dark half would be light-gray text on white.
*/
const ThemedSurface = ({ children }: { children: React.ReactNode }) => {
  const { background } = useThemeColors();
  return (
    <View style={{ backgroundColor: background, borderRadius: 12, padding: 14 }}>
      {children}
    </View>
  );
};

const DemoIsland = ({ kind, appearance, surface, ...theme }: DemoProps) => {
  const Panel = panels[kind];
  const siteAppearance = useSiteAppearance();
  /*
    Islands follow the page's scheme by default, which is what makes the day/night
    button a genuine re-theme rather than a CSS trick. A demo that owns its scheme —
    the pinned light/dark pair in the theming section — passes `appearance` and wins.
    ThemeProvider owns the toast viewport (it renders one internally), so the toast
    demos need no extra mounting here.
  */
  return (
    <ThemeProvider appearance={appearance ?? siteAppearance} {...theme}>
      {surface ? (
        <ThemedSurface>
          <Panel />
        </ThemedSurface>
      ) : (
        <Panel />
      )}
    </ThemeProvider>
  );
};

export default DemoIsland;
