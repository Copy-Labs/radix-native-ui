import { Avatar, Box, Button, Flex, Grid, Heading, Text, ThemeProvider } from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { LucideUsers } from 'lucide-react-native';
import React from 'react';

export default function Screen() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1, gap: 8 }}>
          <Flex direction={'column'} gap={32} padding={12}>
            <Box>
              <Heading size={6}>Avatars</Heading>
              <Text color={'gray'} size={4}>
                Profile picture, user initials or fallback icon.
              </Text>
            </Box>

            <Flex gap={2}>
              <Avatar variant="solid" fallback="A" size={8} />
              <Avatar variant="soft" fallback="A" />
              <Avatar color={'crimson'} variant="soft" fallback="A" size={5} />
              <Avatar highContrast color={'purple'} variant="solid" fallback="A" size={4} />
            </Flex>

            <Grid gap={2}>
              <Avatar variant="solid" color="indigo" fallback="A" />
              <Avatar variant="solid" color="indigo" fallback="A" highContrast />
              <Avatar variant="solid" color="cyan" fallback="A" />
              <Avatar variant="solid" color="cyan" fallback="A" highContrast />
              <Avatar variant="solid" color="orange" fallback="A" />
              <Avatar variant="solid" color="orange" fallback="A" highContrast />
              <Avatar variant="solid" color="crimson" fallback="A" />
              <Avatar variant="solid" color="crimson" fallback="A" highContrast />
              <Avatar variant="solid" color="gray" fallback="A" />
              <Avatar variant="solid" color="gray" fallback="A" highContrast />
            </Grid>

            <Flex gap={2}>
              <Avatar radius="none" fallback="A" />
              <Avatar radius="large" fallback="A" />
              <Avatar radius="full" fallback="A" />
            </Flex>

            <Flex gap={2}>
              <Avatar fallback="A" />
              <Avatar fallback="AB" />
              <Avatar
                fallback={
                  <Box>
                    <Text color={'purple'}>
                      <LucideUsers fill={'currentColor'} size={18} />
                    </Text>
                  </Box>
                }
              />
            </Flex>

            <Flex direction={'column'} align="flex-start" gap={8} padding={8}>
              <Avatar
                size={1}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={2}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={3}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={4}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={5}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={6}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
              <Avatar
                size={7}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
                radius={'none'}
              />
              <Avatar
                size={8}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
                radius={'full'}
              />
              <Avatar
                size={9}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
                radius={'full'}
              />
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
