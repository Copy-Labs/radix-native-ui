import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Button, Card, Flex, Heading, Text } from 'radix-native-ui';

export default function AfribScreen() {
  return (
    <Flex direction={'column'} gap={16} padding={16} style={{ flex: 1 }}>
      <Link href={'/'} asChild>
        <Button variant={'ghost'} size={1}>
          <Button.Icon>
            <Ionicons name={'arrow-back'} />
          </Button.Icon>
          Back home
        </Button>
      </Link>
      <Card radius={'large'} size={3}>
        <Flex direction={'column'} gap={12}>
          <Heading size={5}>AFriB Design System</Heading>
          <Text color={'gray'}>
            The AFriB agency showcase is coming soon. This prototype will demonstrate a complete
            app built with radix-native-ui.
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
