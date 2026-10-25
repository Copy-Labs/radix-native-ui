// FancyListWithLegendList
// ---------------------------------------------------------------------------
// An AI-agent chat experience rendered through FancyList's pluggable
// `ListBackend` prop. 500 messages out of the box, with a button to inflate
// the conversation to 5,000 so the difference between cell *recycling*
// (LegendList) and windowed re-creation (FlatList) becomes visible: flip the
// backend mid-scroll on the large dataset and watch fast scrolling on FlatList
// flash blank cells while LegendList keeps painted rows on screen.
//
// The library itself stays dependency-free — LegendList is an app-side
// dependency supplied through `ListBackend`, and `renderItem`/`keyExtractor`
// contracts are unchanged.
// ---------------------------------------------------------------------------
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list/react-native';
import { Badge, Button, FancyList, Flex, Text } from 'radix-native-ui';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: number;
}

const USER_PROMPTS = [
  'Book me a flight to Lagos next Friday',
  'What’s my balance in USD and NGN?',
  'Send money to Chioma — ₦25,000',
  'Do I need a visa transit card for London?',
  'Convert 500 GBP to NGN at the mid-market rate',
  'Summarize my spending this month by category',
  'Lock my virtual card until I unlock it',
  'Which FX fee tier am I on right now?',
];

const AGENT_REPLIES = [
  'Done — outbound fare found. I held the itinerary for 24h; confirm to ticket.',
  'Your balance is 1,204.66 USD and ₦1,872,410.00 across two wallets.',
  'Transfer queued for Chioma. It usually settles in under 2 minutes.',
  'Yes — you’ll need to check in online and your boarding pass must show a UK address. I can add it.',
  '500 GBP converts to ₦1,072,850 at today’s mid-market rate (₦2,145.70/GBP).',
  'Flights 42%, software subscriptions 23%, transfers 18%, lifestyle 17%. Total 3.1M ₦.',
  'Card ending 4821 is now locked. Any declined attempt will notify you instantly.',
  'You’re on Tier 2 — 0.35% FX markup. Two more transfers this month gets you to Tier 1.',
];

const generateMessages = (count: number): ChatMessage[] => {
  const start = Date.now() - count * 90_000;
  return Array.from({ length: count }, (_, i) => {
    const isUser = i % 2 === 0;
    const pool = isUser ? USER_PROMPTS : AGENT_REPLIES;
    // Vary bubble heights so estimatedItemSize actually matters.
    const repeats = 1 + (i % 4);
    const base = pool[i % pool.length];
    return {
      id: `msg-${i}`,
      sender: isUser ? 'user' : ('agent' as const),
      content: repeats > 1 ? `${base} ${base.slice(0, 40)}…` : base,
      timestamp: start + i * 90_000,
    };
  });
};

export function FancyListWithLegendList() {
  const [useLegendBackend, setUseLegendBackend] = useState(true);
  const [messageCount, setMessageCount] = useState(500);

  const messages = useMemo(() => generateMessages(messageCount), [messageCount]);
  const backend = useLegendBackend ? LegendList : undefined;

  return (
    <Flex direction="column" style={{ flex: 1 }}>
      {/* Controls */}
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        style={{ padding: 12, paddingBottom: 8 }}
      >
        <Flex direction="row" align="center" gap={8}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }} />
          <Text weight="medium">AFriB Agent</Text>
          <Badge color="gray" size={1}>
            {messageCount} messages
          </Badge>
        </Flex>
        <Flex direction="row" gap={8}>
          <Button size={2} variant="soft" onPress={() => setUseLegendBackend((v) => !v)}>
            {useLegendBackend ? 'LegendList' : 'FlatList'}
          </Button>
          <Button
            size={2}
            variant={messageCount >= 5000 ? 'soft' : 'solid'}
            disabled={messageCount >= 5000}
            onPress={() => setMessageCount(5000)}
          >
            {messageCount >= 5000 ? 'Stressed' : 'Load 5,000'}
          </Button>
        </Flex>
      </Flex>

      {/* The chat — one FancyList, swappable engine underneath */}
      <FancyList
        data={messages}
        showDividers={false}
        ListBackend={backend}
        backendProps={
          useLegendBackend
            ? { estimatedItemSize: 64, maintainVisibleContentPosition: { minIndexForVisible: 0 } }
            : undefined
        }
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <Flex
            direction="column"
            align={item.sender === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Flex
              style={{
                maxWidth: '82%',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 14,
                backgroundColor: item.sender === 'user' ? '#2563EB' : 'rgba(120,120,128,0.16)',
              }}
            >
              <Text color={item.sender === 'user' ? 'white' : 'black'}>{item.content}</Text>
            </Flex>
            <Text size={1} color="gray" style={{ marginTop: 2 }}>
              {item.sender === 'user' ? 'You' : 'AFriB Agent'} ·{' '}
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Flex>
        )}
      />

      <Text size={2} color="gray" style={{ padding: 12, paddingTop: 6 }}>
        Recycling vs windowing: hit “Load 5,000”, scroll fast, then flip the backend button.
        FlatList unmounts off-screen bubbles and re-creates them (blank flashes); LegendList
        recycles the native views (button: {useLegendBackend ? 'LegendList ✔' : 'FlatList'}).
      </Text>
    </Flex>
  );
}
