import { Avatar, Badge, Box, Button, Flex, Heading, Sidebar, Text } from 'radix-native-ui';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { AgentRuntime, PageKey } from './useAgentRuntime';

/**
 * The Sidebar drawer for the AI agent example: agent identity header,
 * new-conversation action, conversation history, and workspace navigation.
 * `Sidebar.Item` closes the drawer on press automatically, so each `onPress`
 * here only switches the page / conversation.
 */
export function AppDrawer({
  runtime,
  page,
  setPage,
}: {
  runtime: AgentRuntime;
  page: PageKey;
  setPage: (page: PageKey) => void;
}) {
  const { conversations, activeId, setActiveId, newConversation } = runtime;

  const startNewChat = () => {
    newConversation();
    setPage('chats');
  };

  return (
    <>
      <Sidebar.Header>
        <Flex direction="row" align="center" gap={10}>
          <Avatar radius="full" size={3} fallback={<Ionicons name="sparkles" size={18} color="#FFFFFF" />} />
          <Box style={{ flex: 1 }}>
            <Heading size={3}>Atlas</Heading>
            <Text size={1} color="gray">
              Support agent
            </Text>
          </Box>
          <Badge size={1} variant="soft" color="green">
            online
          </Badge>
        </Flex>
      </Sidebar.Header>

      <Box paddingHorizontal={12} paddingBottom={8}>
        <Button size={2} variant="soft" style={{ width: '100%' }} onPress={startNewChat}>
          <Ionicons name="add" />
          <Button.Label>New conversation</Button.Label>
        </Button>
      </Box>

      <Sidebar.Separator />

      <Box paddingHorizontal={12} paddingVertical={6}>
        <Text size={1} color="gray" weight="medium">
          CONVERSATIONS
        </Text>
      </Box>
      {conversations.slice(0, 6).map((c) => (
        <Sidebar.Item
          key={c.id}
          onPress={() => {
            setActiveId(c.id);
            setPage('chats');
          }}
        >
          <Flex direction="row" align="center" gap={8} style={{ flex: 1 }}>
            <Ionicons
              name={c.id === activeId && page === 'chats' ? 'chatbubble' : 'chatbubble-ellipses-outline'}
              size={15}
              color="inherit"
            />
            <Text size={2} numberOfLines={1} style={{ flex: 1 }}>
              {c.title}
            </Text>
          </Flex>
        </Sidebar.Item>
      ))}

      <Sidebar.Separator />

      <Box paddingHorizontal={12} paddingVertical={6}>
        <Text size={1} color="gray" weight="medium">
          WORKSPACE
        </Text>
      </Box>
      <Sidebar.Item
        onPress={() => setPage('agents')}
      >
        <Flex direction="row" align="center" gap={8} style={{ flex: 1 }}>
          <Ionicons name="people-outline" size={15} color="inherit" />
          <Text size={2} style={{ flex: 1 }}>Agents</Text>
          <Badge size={1} variant="surface" color="gray">
            3
          </Badge>
        </Flex>
      </Sidebar.Item>
      <Sidebar.Item onPress={() => setPage('settings')}>
        <Flex direction="row" align="center" gap={8} style={{ flex: 1 }}>
          <Ionicons name="settings-outline" size={15} color="inherit" />
          <Text size={2} style={{ flex: 1 }}>Settings</Text>
        </Flex>
      </Sidebar.Item>

      <Box style={{ flexGrow: 1 }} />
      <Sidebar.Separator />
      <Sidebar.Item>
        <Flex direction="row" align="center" gap={8} style={{ flex: 1 }}>
          <Avatar radius="full" size={2} fallback="B" />
          <Box style={{ flex: 1 }}>
            <Text size={2} weight="medium">
              blessed
            </Text>
            <Text size={1} color="gray">
              Pro plan
            </Text>
          </Box>
          <Ionicons name="log-out-outline" size={16} color="inherit" />
        </Flex>
      </Sidebar.Item>
    </>
  );
}
