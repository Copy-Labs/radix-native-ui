import { Box, Flex, Strong, Text, ThemeProvider } from 'radix-native-ui';

export default function Texts() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <Flex direction={'column'} gap={12} padding={12}>
        <Flex align={'baseline'} gap={8}>
          <Text size={7} weight={'bold'}>
            Texts
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
          <Text size={3}>
            But we still need to <Strong>make more</Strong> updates to the components. We have to do
            this
          </Text>
          <Flex direction="column" gap={8}>
            <Text size={1}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={2}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={3}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={4}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={5}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={6}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={7}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={8}>The quick brown fox jumps over the lazy dog.</Text>
            <Text size={9}>The quick brown fox jumps over the lazy dog.</Text>
          </Flex>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}
