import { Avatar, Badge, Box, Button, Card, Flex, Heading, Switch, Text } from 'radix-native-ui';
import React from 'react';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from './ScreenHeader';

export type AgentInfo = {
  id: string;
  name: string;
  role: string;
  initials: string;
  skills: string[];
  enabled: boolean;
};

/**
 * Agents page of the AI agent example: roster cards with per-agent skill
 * badges, enable switches, and an active-agent picker.
 */
export function AgentsPage({
  agents,
  activeAgentId,
  onToggle,
  onPick,
}: {
  agents: AgentInfo[];
  activeAgentId: string;
  onToggle: (id: string, enabled: boolean) => void;
  onPick: (id: string) => void;
}) {
  return (
    <Flex direction="column" flex={1}>
      <ScreenHeader title="Agents" subtitle="specialists Atlas can delegate to" />
      <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
        {agents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <Card key={agent.id} size={2} variant="surface">
              <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={10}>
                  <Avatar radius="full" size={3} fallback={agent.initials} />
                  <Box style={{ flex: 1 }}>
                    <Flex direction="row" align="center" gap={6}>
                      <Heading size={3}>{agent.name}</Heading>
                      {isActive ? (
                        <Badge size={1} variant="solid" color="green">
                          active
                        </Badge>
                      ) : null}
                    </Flex>
                    <Text size={2} color="gray">
                      {agent.role}
                    </Text>
                  </Box>
                  <Switch checked={agent.enabled} onCheckedChange={(v: boolean) => onToggle(agent.id, v)} />
                </Flex>

                <Flex direction="row" gap={6} wrap="wrap">
                  {agent.skills.map((skill) => (
                    <Badge key={skill} size={1} variant="soft" color="gray">
                      {skill}
                    </Badge>
                  ))}
                </Flex>

                <Flex direction="row" gap={8} justify="flex-end">
                  <Button
                    size={1}
                    variant={isActive ? 'soft' : 'solid'}
                    color="gray"
                    disabled={!agent.enabled || isActive}
                    onPress={() => onPick(agent.id)}
                  >
                    {isActive ? 'Current agent' : 'Chat with agent'}
                    {!isActive ? (
                      <Button.Icon>
                        <Ionicons name="arrow-forward" />
                      </Button.Icon>
                    ) : null}
                  </Button>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </ScrollView>
    </Flex>
  );
}
