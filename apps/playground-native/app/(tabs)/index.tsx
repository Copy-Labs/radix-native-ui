import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  Flex,
  Heading,
  RadioGroup, Select, Slider,
  Strong,
  Switch,
  Text, TextArea, TextField,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function HomeScreen() {
  const [radioValue, setRadioValue] = useState<string>('option1');
  const [textValue, setTextValue] = useState<string>('text example text');
  const [sliderValue, setSliderValue] = useState<number>(3);
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemeProvider
        mode={'light'}
        themeOptions={{ accentColor: 'grass', radiusFactor: 2, scaling: 0.9 }}
      >
        <SafeAreaView style={{ flex: 1, gap: 16 }}>
          <Flex direction={'column'} gap={16} paddingVertical={4} backgroundColor="gray.2">
            <Flex direction={'column'} gap={4} paddingVertical={12}>
              <Text align={'center'} size={9} weight={'bold'}>
                Radix UI Native
              </Text>
              <Text align={'center'} size={6}>
                Playground App for Testing Components
              </Text>
            </Flex>
            <Heading align={'center'} size={3}>
              Apparently, the Accent Color now works for buttons 😁
            </Heading>
            <Text size={3}>
              But we still need to <Strong>make more</Strong> updates to the components. We have to
              do this
            </Text>
            <Code size={7}>This is a code text</Code>
            <Flex direction="column" align="stretch" justify={'space-between'} gap={8}>
              <Button size={3} variant="solid">
                Solid
              </Button>
              <Button highContrast={true} size={3} variant="soft">
                Soft
              </Button>
              <Flex gap={6} flexGrow={1}>
                <Button variant="outline">Outline</Button>
                <Button color="grass" highContrast={false} size={2} variant="surface">
                  Surface
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </Flex>
              <Button loading color={'violet'}>
                Loading...
              </Button>
              {/*<Button onPress={() => console.log('Pressed!')}>Click Me</Button>*/}
              <Button highContrast={true} color={'crimson'}>
                High Contrast
              </Button>
              <Button highContrast color={'orange'} variant={'soft'}>
                Orange Soft Button
              </Button>
            </Flex>

            <Box>
              <Text size={2} weight="bold">
                Badge
              </Text>
              <Flex gap={8} wrap="wrap">
                <Badge size={3} variant="solid">
                  Accent
                </Badge>
                <Badge variant="solid" color="gray">
                  New
                </Badge>
                <Badge variant="soft" color="purple">
                  Featured
                </Badge>
                <Badge variant="outline" color="bronze">
                  Warning
                </Badge>
              </Flex>
            </Box>

            <Flex padding={8} gap={8}>
              <Switch
                checked={checked}
                color={'orange'}
                disabled={false}
                highContrast={true}
                size={'1'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />
              <Switch
                checked={checked}
                disabled={false}
                highContrast={true}
                size={'2'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />
              <Switch
                checked={checked}
                color={'brown'}
                disabled={false}
                highContrast={true}
                size={'3'}
                onCheckedChange={(checked: boolean) => setChecked(checked)}
              />
            </Flex>

            <Box paddingVertical={12}>
              <Text size={2} weight="bold">
                Radio Group
              </Text>
              <RadioGroup
                gap={8}
                size={'3'}
                value={radioValue}
                onValueChange={setRadioValue}
                items={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                ]}
              />
            </Box>

            <Box paddingVertical={8}>
              <Text color={'crimson'} size={9} weight="bold">
                Card
              </Text>
              <Card style={{ backgroundColor: 'orange' }} size={2} variant={'outline'}>
                <Box>
                  <Heading size={3}>Card Title</Heading>
                  <Text size={2}>This is a card component with content.</Text>
                </Box>
              </Card>
            </Box>

            <Box maxWidth={240}>
              <Card size={1}>
                <Flex style={{ backgroundColor: 'transparent' }} gap={3} align="center">
                  <Avatar
                    size={3}
                    src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                    fallback="T"
                  />
                  <Box backgroundColor={'transparent'}>
                    <Text size={2} weight="bold">
                      Teodros Girmay
                    </Text>
                    <Text size={2} color="gray">
                      Engineering
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Box>

            <Checkbox
              checked={checked}
              size={'3'}
              onCheckedChange={(checked: boolean) => setChecked(checked)}
            />

            <Select
              disabled={false}
              placeholder={"Select a select"}
              size={'3'}
              value={radioValue}
              onValueChange={setRadioValue}
              items={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ]}
            />

            {/*<Slider value={sliderValue} onValueChange={setSliderValue} />*/}

            <TextField size={'3'} value={textValue} onChangeText={setTextValue} />
            <TextArea label={'Your Bio'} size={'3'} placeholder={'Set placeholder'} value={textValue} onChangeText={setTextValue}
            />
          </Flex>
        </SafeAreaView>
      </ThemeProvider>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
