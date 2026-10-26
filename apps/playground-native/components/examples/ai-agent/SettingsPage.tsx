import {
  Callout,
  Card,
  DataList,
  Flex,
  Heading,
  Progress,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TextArea,
  Text,
} from 'radix-native-ui';
import type { SidebarVariant } from 'radix-native-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from './ScreenHeader';

export type AppSettings = {
  model: string;
  temperature: number;
  streaming: boolean;
  haptics: boolean;
  autoTidy: boolean;
  systemPrompt: string;
};

/**
 * Settings page of the AI agent example. The sidebar drawer variant is
 * switchable live - overlay / push / under / reveal all re-render the shell
 * the example runs in.
 */
export function SettingsPage({
  settings,
  onChange,
  variant,
  onVariantChange,
}: {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  variant: SidebarVariant;
  onVariantChange: (variant: SidebarVariant) => void;
}) {
  return (
    <Flex direction="column" flex={1}>
      <ScreenHeader title="Settings" subtitle="agent behavior and appearance" />
      <ScrollView contentContainerStyle={{ padding: 12, gap: 16 }}>
        <Card size={2} variant="surface">
          <Flex direction="column" gap={14}>
            <Heading size={3}>Drawer style</Heading>
            <Text size={2} color="gray">
              The whole example runs inside this Sidebar. Switch the variant and open the drawer (menu button or
              horizontal swipe) to feel the difference.
            </Text>
            <SegmentedControl.Root value={variant} onValueChange={(v) => onVariantChange(v as SidebarVariant)}>
              <SegmentedControl.Item value="overlay">Overlay</SegmentedControl.Item>
              <SegmentedControl.Item value="push">Push</SegmentedControl.Item>
              <SegmentedControl.Item value="under">Under</SegmentedControl.Item>
              <SegmentedControl.Item value="reveal">Reveal</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
        </Card>

        <Card size={2} variant="surface">
          <Flex direction="column" gap={14}>
            <Heading size={3}>Model</Heading>
            <Select.Root value={settings.model} onValueChange={(v) => onChange({ model: v })} color="violet">
              <Select.Trigger>
                <Select.Value placeholder="Choose a model" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  <Select.Item value="atlas-large">Atlas Large - sharpest reasoning</Select.Item>
                  <Select.Item value="atlas-fast">Atlas Fast - cheap and snappy</Select.Item>
                  <Select.Item value="atlas-local">Atlas Local - private, on-device</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <Flex direction="column" gap={6}>
              <Text size={2} weight="medium">
                Creativity
              </Text>
              <Slider
                value={settings.temperature}
                onValueChange={(v) => onChange({ temperature: v as number })}
                min={0}
                max={100}
                step={5}
              />
              <Text size={1} color="gray">
                {settings.temperature < 34
                  ? 'deterministic - factual ticket answers'
                  : settings.temperature < 67
                    ? 'balanced (recommended)'
                    : 'creative - drafting and brainstorming'}
              </Text>
            </Flex>
            <TextArea
              label="System prompt"
              value={settings.systemPrompt}
              onChangeText={(systemPrompt) => onChange({ systemPrompt })}
              placeholder="You are Atlas, a support agent..."
            />
          </Flex>
        </Card>

        <Card size={2} variant="surface">
          <Flex direction="column" gap={12}>
            <Heading size={3}>Behavior</Heading>
            <Flex direction="row" align="center" justify="space-between">
              <Text size={2}>Stream answers</Text>
              <Switch checked={settings.streaming} onCheckedChange={(streaming: boolean) => onChange({ streaming })} />
            </Flex>
            <Flex direction="row" align="center" justify="space-between">
              <Text size={2}>Haptic feedback</Text>
              <Switch checked={settings.haptics} onCheckedChange={(haptics: boolean) => onChange({ haptics })} />
            </Flex>
            <Flex direction="row" align="center" justify="space-between">
              <Text size={2}>Auto-tidy old conversations</Text>
              <Switch checked={settings.autoTidy} onCheckedChange={(autoTidy: boolean) => onChange({ autoTidy })} />
            </Flex>
          </Flex>
        </Card>

        <Callout.Root color="amber" variant="soft">
          <Callout.Icon>
            <Ionicons name="warning-outline" />
          </Callout.Icon>
          <Callout.Text>
            Enabled agents can run tools on your behalf. Review the activity log before merging anything they open.
          </Callout.Text>
        </Callout.Root>

        <Card size={2} variant="surface">
          <Flex direction="column" gap={12}>
            <Heading size={3}>Account</Heading>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>Plan</DataList.Label>
                <DataList.Value>Pro (monthly)</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Workspace</DataList.Label>
                <DataList.Value>copy-labs</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Usage this month</DataList.Label>
                <DataList.Value>
                  <Flex direction="row" align="center" gap={8} style={{ width: 140 }}>
                    <Progress value={72} size={1} style={{ flex: 1 }} />
                    <Text size={1} color="gray">
                      72%
                    </Text>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
        </Card>

        <Text size={1} color="gray" style={{ textAlign: 'center' }}>
          Atlas example build - all responses are mocked on-device
        </Text>
      </ScrollView>
    </Flex>
  );
}
