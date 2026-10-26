import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Spinner,
  Text,
  TextField,
  ThemeProvider,
  useTheme,
} from 'radix-native-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * AI Agent chat example — a complete, copy-ready agent UI built entirely with
 * radix-native-ui primitives and a small MOCK agent loop (thinking delay,
 * sequential tool-call steps, word-by-word streamed answer). Swap `runAgent`
 * for a real API call and the UI works unchanged.
 */

type ToolStep = { id: string; label: string; state: 'running' | 'done' };

type Message = {
  id: number;
  role: 'user' | 'agent';
  text: string;
  steps?: ToolStep[];
  streaming?: boolean;
};

const SUGGESTIONS = [
  'Research the best caching strategy for my API',
  'Summarize yesterday deploy incidents',
  'Draft a release email for version 2.4',
];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function pickResponse(prompt: string): { steps: string[]; text: string } {
  const lower = prompt.toLowerCase();
  if (lower.includes('cach')) {
    return {
      steps: ['web_search', 'analyze_codebase', 'write_plan'],
      text: 'Based on your endpoints, I recommend a two-tier cache: an in-memory LRU for hot keys with a 60s TTL, backed by Redis for shared state. Stale-while-revalidate will hide tail latency on the dashboard routes. I have drafted the invalidation rules next to your existing cache keys, and flagged three endpoints where per-user responses must not be shared. Say the word and I will open a PR with the wrapper.',
    };
  }
  if (lower.includes('incident') || lower.includes('deploy')) {
    return {
      steps: ['fetch_logs', 'correlate_errors'],
      text: 'Yesterday had two incidents. First: a 4-minute spike of 502s at 14:12 UTC caused by a rollout that exhausted the connection pool; the automatic rollback recovered it, but pool sizing should be raised before the next deploy. Second: a silent migration lock on the reporting replica for ~20 minutes, no user impact. Full timeline and both root-cause docs are linked in the incident channel.',
    };
  }
  if (lower.includes('email') || lower.includes('release')) {
    return {
      steps: ['read_changelog', 'draft_email'],
      text: 'Here is a draft: subject "Version 2.4 - faster dashboards, safer exports". The body leads with the three user-visible wins (3x faster first paint, one-click CSV exports, granular share links), a short thank-you to community contributors, and the upgrade window. I kept it under 150 words and matched the tone of your 2.3 announcement. Want a technical deep-dive version for the changelog page too?',
    };
  }
  return {
    steps: ['web_search', 'synthesize_answer'],
    text: 'I have broken that down into subtasks. The short version: the change is safe to make behind a flag, the blast radius is limited to two services, and there is one ordering constraint to respect. I am drafting the step-by-step plan now - I will post it here with checkpoints so you can approve each stage before it runs.',
  };
}

function AgentScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const mountedRef = useRef(true);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const nextId = () => ++idRef.current;

  const patchAgent = useCallback((agentId: number, patch: (m: Message) => Message) => {
    setMessages((prev) => prev.map((m) => (m.id === agentId ? patch(m) : m)));
  }, []);

  /** Mock agent loop: think, run tool steps one by one, then stream the answer. */
  const runAgent = useCallback(
    async (userText: string) => {
      const agentId = nextId();
      setMessages((prev) => [...prev, { id: agentId, role: 'agent', text: '', steps: [], streaming: true }]);
      setBusy(true);

      await sleep(800); // "thinking" before the first tool call
      if (!mountedRef.current) return;

      const { steps, text } = pickResponse(userText);
      for (const step of steps) {
        patchAgent(agentId, (m) => ({ ...m, steps: [...(m.steps ?? []), { id: step, label: step, state: 'running' }] }));
        await sleep(700);
        if (!mountedRef.current) return;
        patchAgent(agentId, (m) => ({
          ...m,
          steps: (m.steps ?? []).map((s) => (s.id === step ? { ...s, state: 'done' as const } : s)),
        }));
      }

      // Stream the answer word by word.
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await sleep(45);
        if (!mountedRef.current) return;
        patchAgent(agentId, (m) => ({ ...m, text: m.text + (i ? ' ' : '') + words[i] }));
        listRef.current?.scrollToEnd({ animated: false });
      }
      patchAgent(agentId, (m) => ({ ...m, streaming: false }));
      setBusy(false);
    },
    [patchAgent]
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput('');
      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }]);
      runAgent(text);
    },
    [busy, runAgent]
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
              <Card size={1} variant="surface" style={{ maxWidth: '82%' }}>
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
                        <Badge size={1} variant={step.state === 'done' ? 'soft' : 'surface'} color={step.state === 'done' ? 'green' : 'gray'}>
                          {step.state === 'done' ? 'done' : 'running'}
                        </Badge>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              </Card>
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
    <PageContainer>
      <PageHeader showBackButton>
        <Flex direction="row" align="center" gap={10} flex={1}>
          <Avatar radius="full" size={2} fallback={<Ionicons name="sparkles" size={14} color="#FFFFFF" />} />
          <Box>
            <PageHeading>Atlas - Support Agent</PageHeading>
            <Text size={1} color="gray">
              resolves tickets, searches docs, opens PRs
            </Text>
          </Box>
          <Box style={{ marginLeft: 'auto' }}>
            <Badge size={1} variant="soft" color={busy ? 'amber' : 'green'}>
              {busy ? 'working' : 'idle'}
            </Badge>
          </Box>
        </Flex>
      </PageHeader>
      <PageBody>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 12, flexGrow: 1, justifyContent: 'flex-end' }}
            ListEmptyComponent={
              <Flex direction="column" gap={12} padding={12} align="center" style={{ paddingTop: 60 }}>
                <Avatar radius="full" size={6} fallback={<Ionicons name="sparkles" size={28} color="#FFFFFF" />} />
                <Text color="gray" align="center" size={3}>
                  Give Atlas a task. It plans, runs tools, and answers with citations.
                </Text>
                <Flex direction="column" gap={8} style={{ width: '100%' }}>
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} size={2} variant="outline" color="gray" onPress={() => send(s)}>
                      <Ionicons name="arrow-forward-circle-outline" />
                      <Text style={{ flex: 1, textAlign: 'left', marginLeft: 8 }}>{s}</Text>
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
      </PageBody>
    </PageContainer>
  );
}

export default function AIAgentExample() {
  return (
    <ThemeProvider themeOptions={{ accentColor: 'violet', radius: 'large', scaling: 1 }}>
      <AgentScreen />
    </ThemeProvider>
  );
}
