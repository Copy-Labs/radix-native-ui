import {
  Button,
  Flex,
  ThemeProvider,
  Heading,
  Box,
  Text,
  Tooltip,
  IconButton,
} from '@radix-ui/themes-native';
import { ScrollView, View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { LucideInfo, LucideSettings, LucideSearch } from 'lucide-react-native';

export default function TooltipDemo() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Tooltip</Heading>
              <Text color={'gray'} size={4}>
                Floating element that provides a control with contextual information when long pressed.
              </Text>
            </Box>

            {/* Simple Tooltip */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Simple Tooltip</Heading>
              <Text color="gray" size={2}>
                The simplest way to add a tooltip. Just wrap your element and provide content.
              </Text>

              <Flex align={'center'} gap={12} wrap="wrap">
                <Tooltip content="This is a tooltip">
                  <Button variant={'soft'}>Hover me</Button>
                </Tooltip>

                <Tooltip content="Settings menu">
                  <IconButton
                    icon={<LucideSettings size={18} />}
                    accessibilityLabel="Settings"
                    variant="soft"
                  />
                </Tooltip>

                <Tooltip content="Search for items">
                  <IconButton
                    icon={<LucideSearch size={18} />}
                    accessibilityLabel="Search"
                    variant="outline"
                  />
                </Tooltip>
              </Flex>
            </Flex>
            {/* Tooltip Positioning */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Tooltip Positioning</Heading>
              <Text color="gray" size={2}>
                Tooltips can be positioned on any side of the trigger element.
              </Text>

              <Flex gap={12} wrap="wrap">
                <Tooltip content="Tooltip on top" side="top">
                  <Button variant={'soft'} color={'gray'}>
                    Top
                  </Button>
                </Tooltip>

                <Tooltip content="Tooltip on bottom" side="bottom">
                  <Button variant={'soft'} color={'gray'}>
                    Bottom
                  </Button>
                </Tooltip>

                <Tooltip content="Tooltip on left" side="left">
                  <Button variant={'soft'} color={'gray'}>
                    Left
                  </Button>
                </Tooltip>

                <Tooltip content="Tooltip on right" side="right">
                  <Button variant={'soft'} color={'gray'}>
                    Right
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
            {/* Tooltip Alignment */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Tooltip Alignment</Heading>
              <Text color="gray" size={2}>
                Control how the tooltip aligns relative to the trigger.
              </Text>

              <Flex gap={12} wrap="wrap">
                <Tooltip content="Aligned to start" side="bottom" align="start">
                  <Button variant={'soft'} color={'indigo'}>
                    Start
                  </Button>
                </Tooltip>

                <Tooltip content="Aligned to center" side="bottom" align="center">
                  <Button variant={'soft'} color={'indigo'}>
                    Center
                  </Button>
                </Tooltip>

                <Tooltip content="Aligned to end" side="bottom" align="end">
                  <Button variant={'soft'} color={'indigo'}>
                    End
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
            {/* Delay Duration */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Delay Duration</Heading>
              <Text color="gray" size={2}>
                Control how long to wait before showing the tooltip.
              </Text>

              <Flex gap={12} wrap="wrap">
                <Tooltip content="No delay (0ms)" delayDuration={0}>
                  <Button variant={'soft'} color={'green'}>
                    No delay
                  </Button>
                </Tooltip>

                <Tooltip content="Default delay (300ms)" delayDuration={300}>
                  <Button variant={'soft'} color={'green'}>
                    Default
                  </Button>
                </Tooltip>

                <Tooltip content="Long delay (700ms)" delayDuration={700}>
                  <Button variant={'soft'} color={'green'}>
                    Long delay
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
            {/* Side Offset */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Side Offset</Heading>
              <Text color="gray" size={2}>
                Control the distance between the tooltip and the trigger.
              </Text>

              <Flex gap={12} wrap="wrap">
                <Tooltip content="Close (4px)" side="top" sideOffset={4}>
                  <Button variant={'soft'} color={'orange'}>
                    Close
                  </Button>
                </Tooltip>

                <Tooltip content="Default (8px)" side="top" sideOffset={8}>
                  <Button variant={'soft'} color={'orange'}>
                    Default
                  </Button>
                </Tooltip>

                <Tooltip content="Far (16px)" side="top" sideOffset={16}>
                  <Button variant={'soft'} color={'orange'}>
                    Far
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
            {/* Compound Component Usage */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Compound Component API</Heading>
              <Text color="gray" size={2}>
                For more control, use the compound component API with Tooltip.Root, Tooltip.Trigger,
                Tooltip.Portal, and Tooltip.Content.
              </Text>

              <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger>
                  <Button variant={'solid'} color="blue">
                    <LucideInfo size={16} />
                    Info Button
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="bottom" sideOffset={8} align="center">
                    This button provides additional information about the current context.
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Flex>
            {/* Controlled Tooltip */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Controlled Tooltip</Heading>
              <Text color="gray" size={2}>
                You can control the tooltip state externally using open and onOpenChange props.
              </Text>

              <ControlledTooltipDemo />
            </Flex>
            {/* Multiple Tooltips */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Multiple Tooltips</Heading>
              <Text color="gray" size={2}>
                Tooltips work well with multiple trigger elements.
              </Text>

              <Flex gap={8} wrap="wrap">
                {['Home', 'Profile', 'Messages', 'Settings', 'Help'].map((item) => (
                  <Tooltip key={item} content={`Go to ${item}`} side="top">
                    <Button variant={'ghost'} size={2}>
                      {item}
                    </Button>
                  </Tooltip>
                ))}
              </Flex>
            </Flex>
            {/* Long Content */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Long Content</Heading>
              <Text color="gray" size={2}>
                Tooltips can display longer text content.
              </Text>

              <Tooltip
                content="This is a longer tooltip message that demonstrates how the tooltip handles more verbose content. It should wrap appropriately."
                side="bottom"
              >
                <Button variant={'outline'}>Hover for long tooltip</Button>
              </Tooltip>
            </Flex>
            {/* Mobile Long Press */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Mobile Support (Long Press)</Heading>
              <Text color="gray" size={2}>
                On mobile devices without hover, tooltips are triggered by long-press. The delay is
                configurable via the longPressDuration prop (default: 500ms).
              </Text>

              <Flex gap={12} wrap="wrap">
                <Tooltip content="Default long press (500ms)" side="top" longPressDuration={500}>
                  <Button variant={'soft'} color={'cyan'}>
                    Default (500ms)
                  </Button>
                </Tooltip>

                <Tooltip content="Quick long press (300ms)" side="top" longPressDuration={300}>
                  <Button variant={'soft'} color={'cyan'}>
                    Quick (300ms)
                  </Button>
                </Tooltip>

                <Tooltip content="Slow long press (800ms)" side="top" longPressDuration={800}>
                  <Button variant={'soft'} color={'cyan'}>
                    Slow (800ms)
                  </Button>
                </Tooltip>
              </Flex>

              <Box
                style={{
                  backgroundColor: 'var(--gray-a3)',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                <Text size={1} color="gray">
                  💡 On mobile: Press and hold the button to see the tooltip. On web: Hover over the
                  button to see the tooltip.
                </Text>
              </Box>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}

// Controlled tooltip demo component
function ControlledTooltipDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex direction="column" gap={12}>
      <Text size={2} color="gray">
        State: {isOpen ? 'Open' : 'Closed'}
      </Text>
      <Flex gap={12}>
        <Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip.Trigger>
            <Button variant={'outline'} color="purple">
              Controlled Tooltip
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content radius={'medium'} side="top">
              This tooltip is controlled externally!
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Button
          variant="soft"
          size={2}
          onPress={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Open'} Tooltip
        </Button>
      </Flex>
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
