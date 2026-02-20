import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  Flex,
  Heading,
  Select,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function App() {
  const [radioValue, setRadioValue] = useState<string>('option1');
  const [textValue, setTextValue] = useState<string>('text example text');
  const [sliderValue, setSliderValue] = useState<number>(3);
  const [checked, setChecked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <ScrollView style={{ flex: 1 }}>
      {/*<SafeAreaView>*/}
      <ThemeProvider mode={'light'} themeOptions={{ accentColor: 'blue', scaling: 1 }}>
        <Flex direction={'column'} gap={4} paddingVertical={16}>
          <Text align={'center'} size={8} weight={'bold'}>
            Radix-UI Native
          </Text>
          <Text color={'gray'} align={'center'} size={4}>
            Playground App for Testing Components
          </Text>
          <Text color={'ruby'} align={'center'} size={3}>
            All you see in this app is built using Radix-UI Native
          </Text>
        </Flex>
        <Flex direction={'column'} gap={16} paddingHorizontal={8}>
          <Link href={'/demo/alert_dialog'}>
            <Text size={4}>Alert Dialog</Text>
          </Link>
          <Link href={'/demo/accordion'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Accordion</Text>
              <Badge color={'amber'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/aspect_ratio'}>
            <Text size={4}>Aspect ratio</Text>
          </Link>
          <Link href={'/demo/avatars'}>
            <Text size={4}>Avatars</Text>
          </Link>
          <Link href={'/demo/badge'}>
            <Text size={4}>Badge</Text>
          </Link>
          <Link href={'/demo/buttons'}>
            <Text size={4}>Buttons</Text>
          </Link>
          <Link href={'/demo/callout'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Callout</Text>
              <Badge color={'green'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/card'}>
            <Text size={4}>Card</Text>
          </Link>
          <Link href={'/demo/checkbox'}>
            <Text size={4}>Checkbox</Text>
          </Link>
          <Link href={'/demo/checkbox_cards'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Checkbox Cards</Text>
              <Badge color={'purple'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/dialog'}>
            <Text size={4}>Dialog</Text>
          </Link>
          <Link href={'/demo/switch'}>
            <Text size={4}>Switch</Text>
          </Link>
          <Link href={'/demo/radio'}>
            <Text size={4}>Radio</Text>
          </Link>
          <Link href={'/demo/radio_cards'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Radio Cards</Text>
              <Badge color={'purple'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/text_fields'}>
            <Text size={4}>Text Fields</Text>
          </Link>
          <Link href={'/demo/textarea'}>
            <Text size={4}>Text Area</Text>
          </Link>
          <Link href={'/demo/heading'}>
            <Text size={4}>Heading</Text>
          </Link>
          <Link href={'/demo/text'}>
            <Text size={4}>text</Text>
          </Link>
          <Link href={'/demo/code'}>
            <Text size={4}>code</Text>
          </Link>
          <Link href={'/demo/em'}>
            <Text size={4}>em</Text>
          </Link>
          <Link href={'/demo/kbd'}>
            <Text size={4}>kbd</Text>
          </Link>
          <Link href={'/demo/strong'}>
            <Text size={4}>strong</Text>
          </Link>
          <Link href={'/demo/fancylist'}>
            <Text size={4}>fancylist</Text>
          </Link>
          <Link href={'/demo/segmented_control'}>
            <Text size={4}>segmented control</Text>
          </Link>
          <Link href={'/demo/popover'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Popover</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/dropdown_menu'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>DropdownMenu</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/select'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Select</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/slider'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Slider</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/spinner'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Spinner</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/progress'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Progress</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/tooltip'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Tooltip</Text>
              <Badge color={'ruby'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/context_menu'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Context Menu</Text>
              <Badge color={'green'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/datalist'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>DataList</Text>
              <Badge color={'blue'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/inset'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Inset</Text>
              <Badge color={'blue'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
          <Link href={'/demo/toast'}>
            <Flex align={'center'} gap={8}>
              <Text size={4}>Toast</Text>
              <Badge color={'green'} radius={'full'} size={2} variant={'solid'}>
                New
              </Badge>
            </Flex>
          </Link>
        </Flex>
      </ThemeProvider>

      <ThemeProvider
        mode={'light'}
        themeOptions={{ accentColor: 'indigo', radius: 'large', scaling: 0.9 }}
      >
        <SafeAreaView style={{ flex: 1, gap: 16 }}>
          <Flex direction={'column'} gap={16} paddingVertical={4} backgroundColor="gray.2">
            <AlertDialog.Root open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
              <AlertDialog.Trigger>
                <Button variant={'soft'}>Show Alert</Button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay />
                <AlertDialog.Content size={3}>
                  <AlertDialog.Title size={6}>Confirm Action</AlertDialog.Title>
                  <AlertDialog.Description size={3}>
                    Are you sure? This application will no longer be accessible and any existing
                    sessions will be expired.
                  </AlertDialog.Description>
                  <Flex gap={12} justify="flex-end">
                    <AlertDialog.Cancel color={'gray'} variant={'surface'}>
                      Cancel
                    </AlertDialog.Cancel>
                    <AlertDialog.Action variant={'solid'}>Confirm</AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>

            <Dialog.Root
              open={isDialogOpen}
              onOpenChange={(open: boolean) => setIsDialogOpen(open)}
            >
              <Dialog.Trigger>
                <Button variant={'soft'}>Show Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content size={3}>
                  <Dialog.Title size={6}>Action Dialog</Dialog.Title>
                  <Dialog.Description size={3}>
                    Are you sure? This application will no longer be accessible and any existing
                    sessions will be expired.
                  </Dialog.Description>
                  <Flex gap={12} justify="flex-end">
                    {/*<Dialog.Close>Cancel</Dialog.Close>*/}
                    {/*<Dialog.Action variant={'solid'}>Confirm</Dialog.Action>*/}
                  </Flex>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <Select.Root value={radioValue} onValueChange={setRadioValue}>
              <Select.Trigger asChild>
                <Button variant="solid">
                  <Button.Label>
                    <Select.Value placeholder="Select an option" />
                  </Button.Label>
                </Button>
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content size={3}>
                  <Select.Item value="option1">Option 1</Select.Item>
                  <Select.Item value="option2">Option 2</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/*<Slider value={sliderValue} onValueChange={setSliderValue} />*/}
          </Flex>
        </SafeAreaView>
      </ThemeProvider>
      {/*</SafeAreaView>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flex: 1,
    // backgroundColor: 'green',
    // marginBottom: 30,
    // alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  demoRow: {
    marginTop: 8,
  },
  boxDemo: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  flexItem: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#06B6D4',
  },
  gridDemo: {
    padding: 8,
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insetDemo: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 12,
  },
  label: {
    marginBottom: 8,
  },
  codeDemo: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  kbdDemo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 12,
  },
  blockquoteDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    paddingLeft: 16,
  },
  iconText: {
    fontSize: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardText: {
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'column',
  },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tabTrigger: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabContent: {
    padding: 16,
  },
  tabPane: {
    minHeight: 100,
  },
  tabText: {
    marginTop: 8,
    color: '#666',
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  themeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
});
