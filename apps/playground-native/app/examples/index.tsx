import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';
import { Button, Card, Flex, Text } from 'radix-native-ui';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ExamplesIndex() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Examples</PageHeading>
      </PageHeader>
      <PageBody>
        <Flex direction={'column'} gap={12} padding={12}>
          <Text>Here are examples that you can copy and paste to your Projects</Text>
          <Card radius={'large'} size={3}>
            <Flex direction={'column'} gap={16}>
              <Text color={'gray'} size={5} weight={'regular'}>
                Twitter Profile Demo Example
              </Text>
              <Text color={'gray'}>Check out a twitter profile demo built using Copy Native UI.</Text>
              <Link asChild href={'/examples/profile'}>
                <Button variant={'ghost'}>
                  Twitter Profile Example
                  <Button.Icon>
                    <Ionicons name={'arrow-forward'} />
                  </Button.Icon>
                </Button>
              </Link>
            </Flex>
          </Card>

          <Card radius={'large'} size={3}>
            <Flex direction={'column'} gap={16}>
              <Text color={'gray'} size={5} weight={'regular'}>
                Login Example
              </Text>
              <Text color={'gray'}>Check out a copy-ready Login Page.</Text>
              <Link asChild href={'/examples/login'}>
                <Button variant={'ghost'}>
                  Login Page Example
                  <Button.Icon>
                    <Ionicons name={'arrow-forward'} />
                  </Button.Icon>
                </Button>
              </Link>
            </Flex>
          </Card>
        </Flex>
      </PageBody>
    </PageContainer>
  );
}
