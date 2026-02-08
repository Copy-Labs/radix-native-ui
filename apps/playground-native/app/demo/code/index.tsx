import { Box, Code, Flex, Text, ThemeProvider } from '@radix-ui/themes-native';

export default function Codes() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <Flex direction={'column'} gap={12} padding={12}>
        <Flex align={'baseline'} gap={8}>
          <Text size={7} weight={'bold'}>
            Code
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
          <Flex direction="column" gap={8}>
            <Code size={1}>console.log()</Code>
            <Code size={2}>console.log()</Code>
            <Code size={3}>console.log()</Code>
            <Code size={4}>console.log()</Code>
            <Code size={5}>console.log()</Code>
            <Code size={6}>console.log()</Code>
            <Code size={7}>console.log()</Code>
            <Code size={8}>console.log()</Code>
            <Code size={9}>console.log()</Code>
          </Flex>

          <Flex direction="column" align="flex-start" gap={2}>
            <Code>console.log()</Code>
            <Code>console.log()</Code>
            <Code>console.log()</Code>
            <Code>console.log()</Code>
          </Flex>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}
