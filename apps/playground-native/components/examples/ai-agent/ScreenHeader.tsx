import { Box, Flex, Heading, IconButton, Sidebar, Text } from 'radix-native-ui';
import React, { type ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * Shared top bar for the AI agent example pages: sidebar trigger on the left,
 * title block, and an optional right-side element (status badge, actions).
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <Flex direction="row" align="center" gap={10} paddingHorizontal={12} paddingVertical={10}>
      <Sidebar.Trigger>
        <IconButton accessibilityLabel="open-menu" size={1} variant="soft" color="gray">
          <Ionicons name="menu" />
        </IconButton>
      </Sidebar.Trigger>
      <Box style={{ flex: 1 }}>
        <Heading size={5}>{title}</Heading>
        {subtitle ? (
          <Text size={1} color="gray">
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {right}
    </Flex>
  );
}
