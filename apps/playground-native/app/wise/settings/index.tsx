import { useState } from 'react';
import {
  Flex,
  Text,
  Heading,
  Card,
  Switch,
  Select,
  Button,
  SegmentedControl,
  Accordion,
  TextField,
  AlertDialog,
  IconButton,
  Separator,
} from '@radix-ui/themes-native';

interface Settings {
  appearance: 'light' | 'dark' | 'system';
  accentColor: string;
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showActivity: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    appearance: 'system',
    accentColor: 'blue',
    notifications: {
      push: true,
      email: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'friends',
      showActivity: true,
    },
  });

  const updateSetting = <K extends keyof Settings>(category: K, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        [key]: value,
      },
    }));
  };

  return (
    <Flex direction="column" gap={4} padding={4}>
      {/* Header */}
      <Heading size={5}>Settings</Heading>

      {/* Appearance Section */}
      <Card>
        <Flex direction="column" gap={3}>
          <Heading size={3}>Appearance</Heading>

          {/* Theme */}
          <Flex direction="column" gap={2}>
            <Text size={2} weight="medium">
              Theme
            </Text>
            <SegmentedControl.Root
              value={settings.appearance}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, appearance: value as Settings['appearance'] }))
              }
            >
              <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
              <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
              <SegmentedControl.Item value="system">System</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>

          {/* Accent Color */}
          <Flex direction="column" gap={2}>
            <Text size={2} weight="medium">
              Accent Color
            </Text>
            <Select.Root
              value={settings.accentColor}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, accentColor: value }))}
            >
              <Select.Trigger>
                <Text capitalize>{settings.accentColor}</Text>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="blue">Blue</Select.Item>
                <Select.Item value="green">Green</Select.Item>
                <Select.Item value="purple">Purple</Select.Item>
                <Select.Item value="red">Red</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Card>

      {/* Notifications Section */}
      <Card>
        <Flex direction="column" gap={3}>
          <Heading size={3}>Notifications</Heading>

          {/* Push Notifications */}
          <Flex direction="row" justify="space-between" align="center">
            <Flex direction="column" gap={1}>
              <Text size={2} weight="medium">
                Push Notifications
              </Text>
              <Text size={1} color="gray">
                Receive push notifications on your device
              </Text>
            </Flex>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
            />
          </Flex>

          <Separator />

          {/* Email Notifications */}
          <Flex direction="row" justify="space-between" align="center">
            <Flex direction="column" gap={1}>
              <Text size={2} weight="medium">
                Email Notifications
              </Text>
              <Text size={1} color="gray">
                Receive notifications via email
              </Text>
            </Flex>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
            />
          </Flex>

          <Separator />

          {/* Marketing */}
          <Flex direction="row" justify="space-between" align="center">
            <Flex direction="column" gap={1}>
              <Text size={2} weight="medium">
                Marketing Emails
              </Text>
              <Text size={1} color="gray">
                Receive updates about new features
              </Text>
            </Flex>
            <Switch
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
            />
          </Flex>
        </Flex>
      </Card>

      {/* Privacy Section */}
      <Card>
        <Flex direction="column" gap={3}>
          <Heading size={3}>Privacy</Heading>

          {/* Profile Visibility */}
          <Flex direction="column" gap={2}>
            <Text size={2} weight="medium">
              Profile Visibility
            </Text>
            <Select.Root
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
            >
              <Select.Trigger>
                <Text>{settings.privacy.profileVisibility}</Text>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="public">Public</Select.Item>
                <Select.Item value="friends">Friends Only</Select.Item>
                <Select.Item value="private">Private</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Separator />

          {/* Show Activity */}
          <Flex direction="row" justify="space-between" align="center">
            <Flex direction="column" gap={1}>
              <Text size={2} weight="medium">
                Show Activity Status
              </Text>
              <Text size={1} color="gray">
                Let others see when you're active
              </Text>
            </Flex>
            <Switch
              checked={settings.privacy.showActivity}
              onCheckedChange={(checked) => updateSetting('privacy', 'showActivity', checked)}
            />
          </Flex>
        </Flex>
      </Card>

      {/* Account Section */}
      <Card>
        <Flex direction="column" gap={3}>
          <Heading size={3}>Account</Heading>

          {/* Change Password */}
          <Button variant="soft">
            <Text>Change Password</Text>
          </Button>

          {/* Export Data */}
          <Button variant="soft">
            <Text>Export My Data</Text>
          </Button>

          {/* Delete Account */}
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="red" variant="soft">
                <Text>Delete Account</Text>
              </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
              <AlertDialog.Title>Delete Account</AlertDialog.Title>
              <AlertDialog.Description>
                This will permanently delete your account and all associated data. This action
                cannot be undone.
              </AlertDialog.Description>

              <Flex gap={3} mt={4} justify="flex-end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button color="red">Delete</Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
      </Card>

      {/* App Info */}
      <Flex direction="column" gap={1} align="center">
        <Text size={1} color="gray">
          Version 1.0.0
        </Text>
        <Text size={1} color="gray">
          © 2024 Your Company
        </Text>
      </Flex>
    </Flex>
  );
}
