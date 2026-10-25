import { Flex, Strong, Text, ThemeProvider } from 'radix-native-ui';

export default function Strongs() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <Flex direction={'column'} gap={12} padding={12}>
        <Flex align={'baseline'} gap={8}>
          <Text size={7} weight={'bold'}>
            Strong
          </Text>
          <Text size={4} weight={'medium'}>
            (Marks text to signify strong importance)
          </Text>
        </Flex>

        <Flex direction={'column'} gap={12}>
          <Text>
            The most important thing to remember is, <Strong>stay positive</Strong>.
          </Text>

          <Flex maxWidth={300}>
            <Strong>
              The goal of typography is to relate font size, line height, and line width in a
              proportional way that maximizes beauty and makes reading easier and more pleasant.
            </Strong>
          </Flex>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}
