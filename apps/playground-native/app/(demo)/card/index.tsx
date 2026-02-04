import {
  Badge,
  Flex,
  ThemeProvider,
  Heading,
  Card,
  Avatar,
  Box,
  Text,
} from '@radix-ui/themes-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cards() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radiusFactor: 4, scaling: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView>
    </ThemeProvider>
  );
}
