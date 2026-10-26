import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// Shared types + mock agent runtime for the AI Agent example app.
// The runtime lives ABOVE the pages (in the example shell) so a streamed
// answer keeps flowing while you navigate to Agents/Settings and back.
// ============================================================================

export type ToolStep = { id: string; label: string; state: 'running' | 'done' };

export type Message = {
  id: number;
  role: 'user' | 'agent';
  text: string;
  steps?: ToolStep[];
  streaming?: boolean;
};

export type Conversation = { id: string; title: string; messages: Message[] };

export type PageKey = 'chats' | 'agents' | 'settings';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function pickResponse(prompt: string): { steps: string[]; text: string } {
  const lower = prompt.toLowerCase();
  if (lower.includes('cach')) {
    return {
      steps: ['web_search', 'analyze_codebase', 'write_plan'],
      text: 'Based on your endpoints, I recommend a two-tier cache: an in-memory LRU for hot keys with a 60s TTL, backed by Redis for shared state. Stale-while-revalidate will hide tail latency on the dashboard routes. I have drafted the invalidation rules next to your existing cache keys, and flagged three endpoints where per-user responses must not be shared.',
    };
  }
  if (lower.includes('incident') || lower.includes('deploy')) {
    return {
      steps: ['fetch_logs', 'correlate_errors'],
      text: 'Yesterday had two incidents. First: a 4-minute spike of 502s at 14:12 UTC caused by a rollout that exhausted the connection pool; the automatic rollback recovered it, but pool sizing should be raised before the next deploy. Second: a silent migration lock on the reporting replica for ~20 minutes, no user impact.',
    };
  }
  if (lower.includes('email') || lower.includes('release')) {
    return {
      steps: ['read_changelog', 'draft_email'],
      text: 'Here is a draft: subject "Version 2.4 - faster dashboards, safer exports". The body leads with the three user-visible wins, a short thank-you to community contributors, and the upgrade window. I kept it under 150 words and matched the tone of your 2.3 announcement.',
    };
  }
  return {
    steps: ['web_search', 'synthesize_answer'],
    text: 'I have broken that down into subtasks. The short version: the change is safe to make behind a flag, the blast radius is limited to two services, and there is one ordering constraint to respect. I am drafting the step-by-step plan now - you can approve each stage before it runs.',
  };
}

// Seeded history so the app opens with real-looking conversations.
const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-seed-1',
    title: 'Cache strategy for /api',
    messages: [
      { id: 1, role: 'user', text: 'What caching strategy fits our read-heavy API?' },
      {
        id: 2,
        role: 'agent',
        text: 'Two-tier: in-memory LRU for hot keys (60s TTL) backed by Redis. Stale-while-revalidate hides tail latency on the dashboard routes.',
        steps: [
          { id: 'web_search', label: 'web_search', state: 'done' },
          { id: 'analyze_codebase', label: 'analyze_codebase', state: 'done' },
        ],
      },
    ],
  },
  {
    id: 'conv-seed-2',
    title: 'Incident #4121 summary',
    messages: [
      { id: 1, role: 'user', text: 'Summarize yesterday incidents for the standup.' },
      {
        id: 2,
        role: 'agent',
        text: 'A 4-minute 502 spike at 14:12 UTC (connection-pool exhaustion, auto-rolled back) and a 20-minute migration lock on the reporting replica with no user impact.',
        steps: [{ id: 'fetch_logs', label: 'fetch_logs', state: 'done' }],
      },
    ],
  },
];

export function useAgentRuntime() {
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(SEED_CONVERSATIONS[0].id);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(100);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const nextId = () => ++idRef.current;

  // Patch one conversation's message list. All loops capture their own
  // conversation id, so streaming keeps landing in the right thread even if
  // the user switches conversations/pages mid-answer.
  const patchConversation = useCallback((convId: string, patch: (messages: Message[]) => Message[]) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, messages: patch(c.messages) } : c)));
  }, []);

  const newConversation = useCallback(() => {
    const id = `conv-${nextId()}`;
    setConversations((prev) => [{ id, title: 'New conversation', messages: [] }, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const runAgent = useCallback(
    async (convId: string, userText: string) => {
      const agentId = nextId();
      patchConversation(convId, (msgs) => [...msgs, { id: agentId, role: 'agent', text: '', steps: [], streaming: true }]);
      setBusy(true);

      await sleep(800); // "thinking" before the first tool call
      if (!mountedRef.current) return;

      const { steps, text } = pickResponse(userText);
      for (const step of steps) {
        patchConversation(convId, (msgs) =>
          msgs.map((m) =>
            m.id === agentId ? { ...m, steps: [...(m.steps ?? []), { id: step, label: step, state: 'running' as const }] } : m
          )
        );
        await sleep(700);
        if (!mountedRef.current) return;
        patchConversation(convId, (msgs) =>
          msgs.map((m) =>
            m.id === agentId
              ? { ...m, steps: (m.steps ?? []).map((s) => (s.id === step ? { ...s, state: 'done' as const } : s)) }
              : m
          )
        );
      }

      // Stream the answer word by word.
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await sleep(45);
        if (!mountedRef.current) return;
        patchConversation(convId, (msgs) =>
          msgs.map((m) => (m.id === agentId ? { ...m, text: m.text + (i ? ' ' : '') + words[i] } : m))
        );
      }
      patchConversation(convId, (msgs) => msgs.map((m) => (m.id === agentId ? { ...m, streaming: false } : m)));
      setBusy(false);
    },
    [patchConversation]
  );

  const send = useCallback(
    (convId: string, raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      // Append the user message and, when it is the first one, title the
      // conversation from the prompt — in a single update so both see the
      // same pre-append state.
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const isFirst = c.messages.length === 0;
          return {
            ...c,
            title: isFirst ? (text.length > 32 ? `${text.slice(0, 32)}...` : text) : c.title,
            messages: [...c.messages, { id: nextId(), role: 'user', text }],
          };
        })
      );
      runAgent(convId, text);
    },
    [busy, runAgent]
  );

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  return { conversations, active, activeId, setActiveId, busy, send, newConversation };
}

export type AgentRuntime = ReturnType<typeof useAgentRuntime>;
