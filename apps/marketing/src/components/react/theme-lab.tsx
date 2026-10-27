import React, { useState } from 'react';
import { Pressable } from 'react-native';
import {
  Badge,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Progress,
  SegmentedControl,
  Slider,
  Switch,
  Text,
  TextField,
  ThemeProvider,
  type Color,
  type SliderValue,
} from 'radix-native-ui';

/**
 * The theming section, driven entirely by the real `ThemeProvider`.
 *
 * Nothing here repaints by hand: changing a swatch re-renders the provider with a
 * new `accentColor`/`grayColor`/`radius`/`scaling`/`appearance`, and every sample
 * below recomputes from the theme — which is the claim the section is making.
 */

// A representative slice of the 31 color tokens (all values are valid `Color`).
const ACCENTS: Color[] = [
  'indigo',
  'violet',
  'purple',
  'pink',
  'crimson',
  'red',
  'tomato',
  'orange',
  'amber',
  'yellow',
  'lime',
  'grass',
  'teal',
  'cyan',
  'blue',
  'sky',
];

type GrayColor = 'mauve' | 'olive' | 'sage' | 'sand' | 'slate' | 'gray';
type Radius = 'none' | 'small' | 'medium' | 'large' | 'full';

const first = (v: SliderValue): number => (Array.isArray(v) ? Number(v[0]) : Number(v));

const Samples = () => (
  <Flex direction="column" gap={12}>
    <Flex gap={8} wrap="wrap" align="center">
      <Button>Accent</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Badge variant="solid">Badge</Badge>
      <Badge variant="soft" color="gray">
        Gray
      </Badge>
    </Flex>
    <Card size={3} variant="surface">
      <Flex direction="column" gap={6}>
        <Heading size={5}>Card title</Heading>
        <Text size={2} color="gray">
          Radius, spacing and type all follow the scale you pick.
        </Text>
        <Progress value={58} size={2} />
      </Flex>
    </Card>
    <Callout.Root color="amber" variant="soft">
      <Callout.Icon>
        <Text size={2}>!</Text>
      </Callout.Icon>
      <Callout.Text>Callouts inherit the gray scale for their body text.</Callout.Text>
    </Callout.Root>
    <TextField.Root placeholder="Field border follows radius" size={2} />
    <Flex gap={8} align="center">
      <Switch defaultChecked />
      <Text size={2}>Switch uses the accent track</Text>
    </Flex>
  </Flex>
);

const ThemeLab = () => {
  const [accent, setAccent] = useState<Color>('indigo');
  const [gray, setGray] = useState<GrayColor>('mauve');
  const [radius, setRadius] = useState<Radius>('medium');
  const [scaling, setScaling] = useState<number>(1);
  const [dark, setDark] = useState(false);

  // One provider wraps the controls *and* the samples, so the pickers themselves
  // repaint with the theme you choose (they are library components too).
  return (
    <ThemeProvider
      accentColor={accent}
      grayColor={gray}
      radius={radius}
      scaling={scaling}
      appearance={dark ? 'dark' : 'light'}
    >
      <Flex direction="column" gap={16}>
        <Flex direction="column" gap={8}>
          <Text size={1} color="gray">
            accentColor
          </Text>
          <Flex wrap="wrap" gap={6}>
            {ACCENTS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setAccent(c)}
                accessibilityRole="radio"
                accessibilityState={{ selected: accent === c }}
                style={{ opacity: accent === c ? 1 : 0.55 }}
              >
                <Badge color={c} variant="solid" size={1}>
                  {c}
                </Badge>
              </Pressable>
            ))}
          </Flex>
        </Flex>

        <Flex gap={12} wrap="wrap">
          <Flex direction="column" gap={6} style={{ flex: 1, minWidth: 190 }}>
            <Text size={1} color="gray">
              grayColor
            </Text>
            <SegmentedControl.Root
              value={gray}
              onValueChange={(v) => setGray(v as GrayColor)}
              size={1}
            >
              <SegmentedControl.Item value="mauve">Mauve</SegmentedControl.Item>
              <SegmentedControl.Item value="slate">Slate</SegmentedControl.Item>
              <SegmentedControl.Item value="gray">Gray</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
          <Flex direction="column" gap={6} style={{ flex: 1, minWidth: 190 }}>
            <Text size={1} color="gray">
              radius
            </Text>
            <SegmentedControl.Root
              value={radius}
              onValueChange={(v) => setRadius(v as Radius)}
              size={1}
            >
              <SegmentedControl.Item value="none">None</SegmentedControl.Item>
              <SegmentedControl.Item value="small">Small</SegmentedControl.Item>
              <SegmentedControl.Item value="medium">Medium</SegmentedControl.Item>
              <SegmentedControl.Item value="large">Large</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
        </Flex>

        <Flex gap={16} align="center" wrap="wrap">
          <Flex direction="column" gap={4} style={{ flex: 1, minWidth: 200 }}>
            <Text size={1} color="gray">
              scaling · {scaling.toFixed(2)}×
            </Text>
            <Slider
              min={0.8}
              max={1.3}
              step={0.05}
              defaultValue={1}
              onValueChange={(v) => setScaling(first(v))}
            />
          </Flex>
          <Flex gap={8} align="center">
            <Switch checked={dark} onCheckedChange={setDark} />
            <Text size={2}>{dark ? 'Dark' : 'Light'} mode</Text>
          </Flex>
        </Flex>

        {/* The samples sit on their own surface so the preview reads as a screen
          inside the panel. */}
        <Flex style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Samples />
        </Flex>

        <Text size={1} color="gray">
          {`<ThemeProvider accentColor="${accent}" grayColor="${gray}" radius="${radius}" scaling={${scaling.toFixed(
            2,
          )}} appearance="${dark ? 'dark' : 'light'}">`}
        </Text>
      </Flex>
    </ThemeProvider>
  );
};

export default ThemeLab;
