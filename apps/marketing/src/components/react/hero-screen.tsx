import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Callout,
  Card,
  FloatingTabBar,
  Flex,
  Heading,
  Inset,
  Progress,
  Switch,
  Text,
  ThemeProvider,
} from 'radix-native-ui';
import { Glyph } from './glyph';
import { useSiteAppearance, type SiteAppearance } from './use-site-appearance';

/**
 * Hero visual: an app screen built from the real components, inside a CSS phone
 * shell. One CSS pixel equals one layout pixel here, so what you see is what the
 * library produces on a device — the only thing the page adds is the bezel.
 *
 * The screen starts on the page's own color scheme and the switch inside it is a
 * real override, exactly like a dark-mode setting in a real app: flip the page
 * while the switch is untouched and the phone follows; touch the switch and the
 * screen keeps its own mind.
 */
const HeroScreen = () => {
  const siteAppearance = useSiteAppearance();
  const [override, setOverride] = useState<SiteAppearance | null>(null);
  const appearance = override ?? siteAppearance;
  const [tab, setTab] = useState('home');

  return (
    <ThemeProvider
      accentColor="indigo"
      grayColor="mauve"
      radius="medium"
      appearance={appearance}
    >
      <View style={{ height: 596, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <Flex direction="column" style={{ flex: 1 }} gap={0}>
          <Inset clip="padding-box" p={4}>
            <Flex direction="row" align="center" justify="space-between" gap={8}>
              <Flex direction="row" align="center" gap={10}>
                <Avatar variant="soft" fallback="SK" size={4} radius="full" />
                <Flex direction="column">
                  <Heading size={5}>Good evening</Heading>
                  <Text size={1} color="gray">
                    4 tasks due today
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="row" align="center" gap={6}>
                <Text size={1} color="gray">
                  Dark
                </Text>
                <Switch
                  size={1}
                  checked={appearance === 'dark'}
                  onCheckedChange={(next) => setOverride(next ? 'dark' : 'light')}
                />
              </Flex>
            </Flex>
          </Inset>

          {/* Deliberately *not* flex:1: Callout.Root carries `flex: 1` in its own
              container style, so a growing column here lets the callout swallow
              the remaining height and pushes the action row out of the frame. The
              spacer below absorbs the slack instead. */}
          <Flex direction="column" gap={12} style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Card size={3}>
              <Flex direction="column" gap={8}>
                <Flex direction="row" align="center" justify="space-between">
                  <Heading size={4}>Design review</Heading>
                  <Badge size={1} variant="soft" color="amber">
                    Due 5pm
                  </Badge>
                </Flex>
                <Text size={2} color="gray">
                  Ship the token story and refresh the overlay demos.
                </Text>
                <Progress value={68} size={2} />
                <Flex direction="row" gap={8}>
                  <Button size={1} color="indigo">
                    Open
                  </Button>
                  <Button size={1} variant="ghost" color="gray">
                    Snooze
                  </Button>
                </Flex>
              </Flex>
            </Card>

            <Callout.Root color="grass" variant="soft" size={2}>
              <Callout.Icon>
                <Text size={2}>✓</Text>
              </Callout.Icon>
              <Callout.Text>3 tasks completed today — nicely done.</Callout.Text>
            </Callout.Root>

            <Card size={3} variant="surface">
              <Flex direction="column" gap={6}>
                <Flex direction="row" align="center" gap={8}>
                  <Avatar color="crimson" variant="soft" fallback="JD" size={2} radius="full" />
                  <Flex direction="column" style={{ flex: 1 }}>
                    <Text size={2}>Jordan sent a comment</Text>
                    <Text size={1} color="gray">
                      “Can we get the pill on drag?”
                    </Text>
                  </Flex>
                  <Badge size={1} variant="solid" color="red">
                    2
                  </Badge>
                </Flex>
              </Flex>
            </Card>

            <Flex direction="row" gap={8} wrap="wrap">
              <Button size={2} variant="soft" color="gray">
                <Button.Icon>
                  <Glyph name="＋" />
                </Button.Icon>
                New task
              </Button>
              <Button size={2} variant="outline" color="gray">
                Filter
              </Button>
            </Flex>
          </Flex>

          {/* Absorbs whatever vertical space the screen has left, so the tab bar
              below stays pinned to the bottom edge. */}
          <View style={{ flex: 1 }} />

          {/* FloatingTabBar owns the bottom edge, exactly as it would under a
              home indicator on device. */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <FloatingTabBar.Root
              value={tab}
              onValueChange={setTab}
              size={2}
              inset={12}
              elevation={2}
            >
              <FloatingTabBar.Item value="home" label="Home" icon={<Glyph name="⌂" />} />
              <FloatingTabBar.Item
                value="tasks"
                label="Tasks"
                icon={<Glyph name="☑" />}
                badge={4}
              />
              <FloatingTabBar.Item value="chat" label="Search" icon={<Glyph name="⌕" />} />
              <FloatingTabBar.Item value="you" label="You" icon={<Glyph name="☺" />} />
            </FloatingTabBar.Root>
          </View>
        </Flex>
      </View>
    </ThemeProvider>
  );
};

export default HeroScreen;
