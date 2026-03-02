import { Pressable, TouchableOpacity, View } from 'react-native';
import { Avatar, Box, Button, Flex, Heading, IconButton, Text } from 'radix-native-ui';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';

export default function WiseScreen() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <Box position={'absolute'} right={8}>
          <IconButton accessibilityLabel={'settings-button'}>
            <Link href={'/wise/settings'}>
              <Ionicons name={'settings'} size={24} />
            </Link>
          </IconButton>
        </Box>
      </PageHeader>
      <PageBody>
        <Flex align={'center'} direction={'column'} gap={16} flex={1} padding={16}>
          <Flex align={'center'} flex={1}>
            <Avatar
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
              alt="User avatar"
              fallback="JD"
              size={9}
              style={{ width: 240, height: 240 }}
            />
          </Flex>
          <Flex direction={'column'} gap={24}>
            <Heading align={'center'} size={8}>
              ONE ACCOUNT FOR ALL THE MONEY IN THE WORLD
            </Heading>
            {/* For testing that our component implementation works similar to the native View, Pressable and TouchableOpacity */}
            {/*<Pressable style={{ backgroundColor: 'green' }}>
              <Text>Click here...</Text>
            </Pressable>
            <Flex align={'center'} gap={8}>
              <TouchableOpacity style={{ backgroundColor: 'orange', flex: 1 }}><Text>Click orange</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'purple' }}><Text>Click purple</Text></TouchableOpacity>
            </Flex>
            <Flex align={'center'} gap={8}>
              <Button color={'orange'} style={{ flex: 1 }}>Click orange</Button>
              <Button color={'purple'}>Click purple</Button>
            </Flex>*/}
            <Box maxWidth={'100%'}>
              <Flex align={'center'} gap={16} justify={'space-between'} padding={12}>
                <Link asChild href={'/wise/home'}>
                  <Button radius={'full'} size={4} style={{ flex: 1 }}>
                    <Button.Label>Log in</Button.Label>
                  </Button>
                </Link>
                <Link asChild href={'/wise/home'}>
                  <Button radius={'full'} size={4} style={{ flex: 1 }}>
                    <Button.Label>Register</Button.Label>
                  </Button>
                </Link>
              </Flex>
              <Box padding={12}>
                <Button color={'black'} radius={'full'} size={4}>
                  <Button.Icon>
                    <Ionicons name="logo-apple" size={16} />
                  </Button.Icon>
                  <Button.Label>
                    Sign in With Apple
                  </Button.Label>
                </Button>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </PageBody>
    </PageContainer>
  );
}
