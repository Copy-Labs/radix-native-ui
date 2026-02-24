import { Avatar, Badge, Box, Button, Card, Flex, Heading, IconButton, SegmentedControl, Text } from '@radix-ui/themes-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { PageBody, PageContainer, PageHeader } from '@/components/PageSection';
import { Link } from 'expo-router';
import React from 'react';

export default function Home() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <Flex align={'center'} flex={1} justify={'space-between'} paddingHorizontal={16}>
          <Avatar
            size={3}
            src="https://example.com/avatar.jpg"
            alt="User avatar"
            fallback="JD"
            variant={'soft'}
          />
          <Flex align={'center'} gap={8}>
            <Badge color="grass" radius={'full'} size={4} variant={'solid'}>
              Earn SGD 100
            </Badge>
            <IconButton
              accessibilityLabel={'hide-balance'}
              color={'gray'}
              radius={'full'}
              variant={'soft'}
            >
              <Ionicons name={'eye-off'} size={24} />
            </IconButton>
          </Flex>
        </Flex>
      </PageHeader>
      <PageBody>
        <ScrollView style={{ flex: 1 }}>
          <Box padding={16}>
            <Flex direction={'column'} gap={16} paddingVertical={16}>
              <Heading size={8}>Welcome to Wise</Heading>
              <Flex align={'center'} gap={8}>
                <Button radius={'full'} size={2}>
                  <Button.Label>Send</Button.Label>
                </Button>
                <Button color={'gray'} radius={'full'} size={2} variant={'soft'}>
                  <Button.Label>Add Money</Button.Label>
                </Button>
                <Button color={'gray'} radius={'full'} size={2} variant={'soft'}>
                  <Button.Label>Request</Button.Label>
                </Button>
              </Flex>

              {/* Scrollable Cards */}
              <ScrollView horizontal>
                <Flex align={'center'} gap={16} wrap={'nowrap'} paddingVertical={16}>
                  <Card>
                    <Flex
                      direction={'column'}
                      align={'flex-start'}
                      justify={'space-between'}
                      gap={16}
                      height={240}
                      minWidth={280}
                    >
                      <Flex align={'center'} gap={8}>
                        <Avatar
                          color={'ruby'}
                          size={4}
                          src="https://example.com/avatar.jpg"
                          alt="User avatar"
                          fallback="JD"
                        />
                        <Text size={6} weight={'medium'}>
                          SGD
                        </Text>
                      </Flex>
                      <Box>
                        <Text color={'gray'} size={3}>
                          <Ionicons name={'home-outline'} size={16} />
                          0.444-778
                        </Text>
                        <Text size={7} weight={'medium'}>
                          30.00
                        </Text>
                      </Box>
                    </Flex>
                  </Card>

                  <Card variant={'surface'}>
                    <Flex
                      direction={'column'}
                      align={'flex-start'}
                      justify={'space-between'}
                      gap={16}
                      height={240}
                      minWidth={280}
                    >
                      <Flex align={'center'} gap={8}>
                        <Avatar
                          color={'gray'}
                          size={4}
                          src="https://example.com/avatar.jpg"
                          alt="User avatar"
                          fallback="+"
                          variant={'soft'}
                        />
                        <Text size={6} weight={'medium'}>
                          New Card
                        </Text>
                      </Flex>
                      <Box width={200}>
                        <Text color={'gray'} size={3}>
                          Spend, save and transfer in 40+ currencies
                        </Text>
                      </Box>
                    </Flex>
                  </Card>

                  <Card variant={'surface'}>
                    <Flex
                      direction={'column'}
                      align={'flex-start'}
                      justify={'space-between'}
                      gap={16}
                      height={240}
                      minWidth={280}
                    >
                      <Flex align={'center'} gap={8}>
                        <Avatar
                          color={'gray'}
                          size={4}
                          src="https://example.com/avatar.jpg"
                          alt="User avatar"
                          fallback="+"
                          variant={'soft'}
                        />
                        <Text size={6} weight={'medium'}>
                          New Card
                        </Text>
                      </Flex>
                      <Box width={200}>
                        <Text color={'gray'} size={3}>
                          Spend, save and transfer in 40+ currencies
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Flex>
              </ScrollView>

              {/* Transaction Section */}
              <Flex direction={'column'} gap={16}>
                <Flex align={'center'} justify={'space-between'}>
                  <Heading size={7} weight={'medium'}>
                    Transactions
                  </Heading>
                  <Button
                    color={'gray'}
                    size={3}
                    variant={'ghost'}
                    style={{ paddingHorizontal: 0 }}
                  >
                    See all
                  </Button>
                </Flex>

                <Card variant={'ghost'} style={{ paddingHorizontal: 0 }}>
                  <Flex align={'center'} justify={'space-between'}>
                    <Flex align={'center'} flex={1} gap={16}>
                      <IconButton
                        accessibilityLabel={'add-balance'}
                        color={'gray'}
                        radius={'full'}
                        size={3}
                        variant={'outline'}
                      >
                        <Ionicons name={'add-outline'} size={32} />
                      </IconButton>
                      <Flex direction={'column'}>
                        <Text size={4} weight={'medium'}>
                          To your SGD Balance
                        </Text>
                        <Text color={'gray'}>Added Wed, Mar 12</Text>
                      </Flex>
                    </Flex>

                    <Flex direction={'column'}>
                      <Text color={'grass'} size={4} weight={'medium'}>
                        + 30 SGD
                      </Text>
                      <Text color={'gray'}>31.41 SGD</Text>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>

              <Flex direction={'column'} gap={16}>
                <Heading size={7} weight={'medium'}>
                  Introducing Interest
                </Heading>
              </Flex>
            </Flex>
          </Box>
        </ScrollView>
      </PageBody>
      <Flex align={'center'} justify={'space-evenly'} paddingTop={12}>
        <Link href={'/'}>
          <Box alignItems={'center'}>
            <Ionicons name={'home-outline'} size={24} />
            <Text>Home</Text>
          </Box>
        </Link>
        <Link href={'/'}>
          <Box alignItems={'center'}>
            <Ionicons name={'ticket-outline'} size={24} />
            <Text color={'gray'}>Card</Text>
          </Box>
        </Link>
        <Link href={'/'}>
          <Box alignItems={'center'}>
            <Ionicons name={'person-outline'} size={24} />
            <Text color={'gray'}>Recipients</Text>
          </Box>
        </Link>
        <Link href={'/'}>
          <Box alignItems={'center'}>
            <Ionicons name={'arrow-up-right-box-outline'} size={24} />
            <Text color={'gray'}>Payments</Text>
          </Box>
        </Link>
      </Flex>
    </PageContainer>
  );
}

