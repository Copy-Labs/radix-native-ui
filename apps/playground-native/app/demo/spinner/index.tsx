import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Box,
  Flex,
  Heading,
  Text,
  ThemeProvider,
  Slider,
  Card,
  Button, Spinner,
} from '@radix-ui/themes-native';
import { useState } from 'react';

export default function SpinnerDemo() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemeProvider mode="light" themeOptions={{ accentColor: 'indigo' }}>
        <View style={{ flex: 1, gap: 16 }}>
          <Flex direction={'column'} gap={32} padding={16}>
            <Flex direction="column" gap={24} paddingTop={16}>
              <Box>
                <Heading size={6}>Slider Component Demo</Heading>
                <Text color="gray" size={3}>
                  Demonstrating all slider variants and features
                </Text>
              </Box>
            </Flex>

            <Card>
              <Flex align={'center'} justify={'center'} gap={16}>
                <Spinner size={'large'} />
                <Spinner size={'medium'} />
                <Spinner size={'small'} />
              </Flex>
            </Card>

            <Flex direction={'column'} gap={16}>
              <Heading>Loading Button</Heading>
              <Button loading></Button>
            </Flex>

            <Flex direction={'column'} gap={16}>
              <Heading>Loading Button with Text</Heading>
              <Button color={'amber'}>
                Loading content
                <Button.Label>
                  <Spinner size={'small'} />
                </Button.Label>
              </Button>
            </Flex>

            {/* Basic Slider */}
            <Flex direction={'column'} gap={8} marginBottom={16}>
              <Text size={4} weight="bold">
                Basic Spinner
              </Text>
              <Text size={2} color="gray">
                Uncontrolled slider with defaultValue
              </Text>
              <Slider
                defaultValue={50}
                showValueLabel
                label="Volume"
                onValueChange={(value) => console.log('Basic:', value)}
              />
            </Flex>
          </Flex>
        </View>
      </ThemeProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
