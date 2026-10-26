import { Box, Flex, Sidebar, ThemeProvider } from 'radix-native-ui';
import type { SidebarVariant } from 'radix-native-ui';
import React, { useState } from 'react';
import { PageContainer } from '@/components/PageSection';
import { AppDrawer } from '@/components/examples/ai-agent/AppDrawer';
import { AgentsPage, type AgentInfo } from '@/components/examples/ai-agent/AgentsPage';
import { ChatPage } from '@/components/examples/ai-agent/ChatPage';
import { SettingsPage, type AppSettings } from '@/components/examples/ai-agent/SettingsPage';
import { useAgentRuntime, type PageKey } from '@/components/examples/ai-agent/useAgentRuntime';

// ============================================================================
// AI Agent example app.
// A full app shell built on Sidebar: the drawer carries identity, history and
// navigation; three nested pages (Chats / Agents / Settings) render inside
// Sidebar.Main (or beside the overlay drawer). The agent runtime lives here,
// above the pages, so a streamed answer keeps flowing when you navigate away
// and back. Settings can switch the drawer variant live - overlay, push,
// under and reveal all drive this same shell.
// ============================================================================

const DEFAULT_AGENTS: AgentInfo[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'General support agent - triage, docs, PRs',
    initials: 'A',
    skills: ['triage', 'docs', 'pull requests'],
    enabled: true,
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Monitoring specialist - incidents and anomalies',
    initials: 'E',
    skills: ['logs', 'anomaly detection'],
    enabled: true,
  },
  {
    id: 'scribe',
    name: 'Scribe',
    role: 'Comms specialist - release notes and emails',
    initials: 'S',
    skills: ['drafting', 'tone match'],
    enabled: false,
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  model: 'atlas-fast',
  temperature: 50,
  streaming: true,
  haptics: true,
  autoTidy: false,
  systemPrompt: '',
};

function AgentApp() {
  const runtime = useAgentRuntime();
  const [page, setPage] = useState<PageKey>('chats');
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<SidebarVariant>('overlay');
  const [agents, setAgents] = useState<AgentInfo[]>(DEFAULT_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState('atlas');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const pageNode =
    page === 'chats' ? (
      <ChatPage
        conversation={runtime.active}
        busy={runtime.busy}
        onSend={(text) => runtime.send(runtime.active.id, text)}
      />
    ) : page === 'agents' ? (
      <AgentsPage
        agents={agents}
        activeAgentId={activeAgentId}
        onToggle={(id, enabled) => setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, enabled } : a)))}
        onPick={(id) => {
          setActiveAgentId(id);
          setPage('chats');
        }}
      />
    ) : (
      <SettingsPage
        settings={settings}
        onChange={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
        variant={variant}
        onVariantChange={(next) => {
          // Closing first keeps the swap glitch-free: each variant mounts a
          // different layer composition (Modal vs inline containers).
          setOpen(false);
          setVariant(next);
        }}
      />
    );

  const drawer = <AppDrawer runtime={runtime} page={page} setPage={setPage} />;

  return (
    <Sidebar.Root animationDuration={200} side="left" variant={variant} width={300} open={open} onOpenChange={setOpen}>
      {variant === 'overlay' ? (
        <>
          {/* Overlay keeps the page in flow; the drawer rides on top in a Modal. */}
          <Flex direction="column" flex={1}>
            {pageNode}
          </Flex>
          <Sidebar.Portal>
            <Sidebar.Overlay />
            <Sidebar.Content>{drawer}</Sidebar.Content>
          </Sidebar.Portal>
        </>
      ) : (
        // Inline variants: the page lives inside Sidebar.Main, which slides
        // (and for reveal, recedes) over the statically anchored drawer.
        <Sidebar.Container>
          <Sidebar.Content>{drawer}</Sidebar.Content>
          <Sidebar.Main>{pageNode}</Sidebar.Main>
        </Sidebar.Container>
      )}
    </Sidebar.Root>
  );
}

export default function AIAgentExample() {
  return (
    <ThemeProvider themeOptions={{ accentColor: 'violet', radius: 'large', scaling: 1 }}>
      <PageContainer>
        <Box style={{ flex: 1 }}>
          <AgentApp />
        </Box>
      </PageContainer>
    </ThemeProvider>
  );
}
