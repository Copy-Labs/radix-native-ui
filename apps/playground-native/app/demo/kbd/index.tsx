import { Box, Flex, Heading, Kbd, Strong, Text, ThemeProvider } from 'radix-native-ui';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function Texts() {
  return (
    <ThemeProvider
      themeOptions={{ accentColor: 'blue' }}
    >
      <PageContainer>
        <PageHeader showBackButton>
          <Box>
            <Heading size={6}>KBD</Heading>
            <Text color={'gray'}>Keyboard input element.</Text>
          </Box>
        </PageHeader>
        <PageBody>
          <Flex direction={'column'} gap={12} padding={12}>
            <Flex align={'baseline'} gap={8}>
              <Text size={7} weight={'bold'}>
                KBD
              </Text>
              <Text size={4} weight={'medium'}>
                (From Size 1 to 9)
              </Text>
            </Flex>
            <Box>
              <Text>Size 1 is the Smallest</Text>
              <Text>Size 9 is the Smallest</Text>
            </Box>

            <Flex direction={'column'} gap={12}>
              <Flex direction="column" align="flex-start" gap={12}>
                <Kbd size={1}>Shift + Tab</Kbd>
                <Kbd size={2}>Shift + Tab</Kbd>
                <Kbd size={3}>Shift + Tab</Kbd>
                <Kbd size={4}>Shift + Tab</Kbd>
                <Kbd size={5}>Shift + Tab</Kbd>
                <Kbd size={6}>Shift + Tab</Kbd>
                <Kbd size={7}>Shift + Tab</Kbd>
                <Kbd size={8}>Shift + Tab</Kbd>
                <Kbd size={9}>Shift + Tab</Kbd>
              </Flex>
            </Flex>
          </Flex>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
