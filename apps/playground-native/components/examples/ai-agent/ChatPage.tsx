import { Avatar, Badge, Box, Button, Flex, IconButton, Spinner, Text, TextField, useTheme } from 'radix-native-ui';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from './ScreenHeader';
import type { Conversation, Message } from './useAgentRuntime';

const SUGGESTIONS = [
  'Research the best caching strategy for my API',
  'Summarize yesterday deploy incidents',
  'Draft a release email for version 2.4',
];

/**
 * Chat page of the AI agent example: message thread (user bubbles, agent
 * answers with tool-call cards) + suggestion chips + keyboard-aware composer.
 */
export function ChatPage({
  conversation,
  busy,
  onSend,
}: {
  conversation: Conversation;
  busy: boolean;
  onSend: (text: string) => void;
}) {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput('');
      onSend(text);
    },
    [busy, onSend]
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      if (item.role === 'user') {
        return (
          <Flex justify="flex-end" paddingVertical={4}>
            <Box
              style={{
                backgroundColor: theme.colors[theme.accentColor]['9'],
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 9,
                maxWidth: '82%',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20 }}>{item.text}</Text>
            </Box>
          </Flex>
        );
      }

      const awaitingAnswer = item.streaming && !item.text;
      return (
        <Flex direction="row" gap={8} paddingVertical={4} align="flex-start">
          <Avatar radius="full" size={2} fallback={<Ionicons name="sparkles" size={14} color="#FFFFFF" />} />
          <Flex direction="column" gap={8} style={{ flex: 1 }}>
            {(item.steps ?? []).length > 0 && (
              <Box
                style={{
                  backgroundColor: theme.colors.gray['2'],
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.gray['6'],
                  padding: 10,
                  maxWidth: '82%',
                }}
              >
                <Flex direction="column" gap={6}>
                  {item.steps!.map((step) => (
                    <Flex key={step.id} direction="row" align="center" gap={8}>
                      {step.state === 'running' ? (
                        <Spinner size="small" />
                      ) : (
                        <Ionicons name="checkmark-circle" size={15} color={theme.colors.green['11']} />
                      )}
                      <Text size={2} color="gray" style={{ fontFamily: 'monospace' }}>
                        {step.label}()
                      </Text>
                      <Box style={{ marginLeft: 'auto' }}>
                        <Badge
                          size={1}
                          variant={step.state === 'done' ? 'soft' : 'surface'}
                          color={step.state === 'done' ? 'green' : 'gray'}
                        >
                          {step.state === 'done' ? 'done' : 'running'}
                        </Badge>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            )}
            {awaitingAnswer ? (
              <Flex direction="row" align="center" gap={8}>
                <Spinner size="small" />
                <Text size={2} color="gray">
                  Thinking...
                </Text>
              </Flex>
            ) : (
              <Box
                style={{
                  backgroundColor: theme.colors.gray['2'],
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  maxWidth: '82%',
                }}
              >
                <Text style={{ color: theme.colors.gray['12'], fontSize: 14, lineHeight: 21 }}>
                  {item.text}
                  {item.streaming ? ' ▌' : ''}
                </Text>
              </Box>
            )}
          </Flex>
        </Flex>
      );
    },
    [theme]
  );

  return (
    <Flex direction="column" flex={1}>
      <ScreenHeader
        title={conversation.title}
        subtitle="resolves tickets, searches docs, opens PRs"
        right={
          <Badge size={1} variant="soft" color={busy ? 'amber' : 'green'}>
            {busy ? 'working' : 'idle'}
          </Badge>
        }
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={(m) => String(m.id)}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12, flexGrow: 1, justifyContent: 'flex-end' }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <Flex direction="column" gap={12} padding={12} align="center" style={{ paddingTop: 48 }}>
              <Avatar radius="full" size={6} fallback={<Ionicons name="sparkles" size={28} color="#FFFFFF" />} />
              <Text color="gray" align="center" size={3}>
                Give Atlas a task. It plans, runs tools, and answers with citations.
              </Text>
              <Flex direction="column" gap={8} style={{ width: '100%' }}>
                {SUGGESTIONS.map((s) => (
                  <Button key={s} size={2} variant="outline" color="gray" onPress={() => send(s)}>
                    <Button.Icon>
                      <Ionicons name="arrow-forward-circle-outline" />
                    </Button.Icon>
                    <Button.Label style={{ flex: 1, textAlign: 'left' }}>{s}</Button.Label>
                  </Button>
                ))}
              </Flex>
            </Flex>
          }
        />
        <Flex direction="row" align="flex-end" gap={8} padding={12}>
          <Box style={{ flex: 1 }}>
            <TextField
              value={input}
              onChangeText={setInput}
              placeholder="Message Atlas..."
              onSubmitEditing={() => send(input)}
              enterKeyHint="send"
              returnKeyType="send"
              editable={!busy}
            />
          </Box>
          <IconButton
            accessibilityLabel="send-message"
            variant="solid"
            size={2}
            disabled={busy || !input.trim()}
            onPress={() => send(input)}
          >
            <Ionicons name="arrow-up" />
          </IconButton>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  );
}
