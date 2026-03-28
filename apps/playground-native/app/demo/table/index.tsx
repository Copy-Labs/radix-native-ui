import {
  Badge,
  Flex,
  ThemeProvider,
  Heading,
  Card,
  Box,
  Text,
  Table,
} from 'radix-native-ui';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';

export default function TableDemo() {
  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>
            <Box>
              <Heading size={6}>Table</Heading>
              <Text color={'gray'}>
                Component for displaying tabular data.
              </Text>
            </Box>
          </PageHeading>
        </PageHeader>
        <PageBody>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <Flex direction={'column'} gap={20} padding={12}>
                {/* Basic Table */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Basic Table</Heading>
                  <View>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>John Doe</Table.Cell>
                          <Table.Cell>john@example.com</Table.Cell>
                          <Table.Cell>Admin</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jane Smith</Table.Cell>
                          <Table.Cell>jane@example.com</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Bob Wilson</Table.Cell>
                          <Table.Cell>bob@example.com</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </View>
                </Flex>

                {/* Non-scrollable */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Non-scrollable</Heading>
                  <View>
                    <Table.Root scrollable={false}>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>John Doe</Table.Cell>
                          <Table.Cell>john@example.com</Table.Cell>
                          <Table.Cell>Admin</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jane Smith</Table.Cell>
                          <Table.Cell>jane@example.com</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </View>
                </Flex>

                {/* With Status Badges */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>With Status Badges</Heading>
                  <View>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>John Doe</Table.Cell>
                          <Table.Cell>Admin</Table.Cell>
                          <Table.Cell>
                            <Badge color="green">Active</Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Jane Smith</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                          <Table.Cell>
                            <Badge color="green">Active</Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Bob Wilson</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                          <Table.Cell>
                            <Badge color="red">Inactive</Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>Alice Brown</Table.Cell>
                          <Table.Cell>Editor</Table.Cell>
                          <Table.Cell>
                            <Badge color="yellow">Pending</Badge>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </View>
                </Flex>

                {/* In Card */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>In Card</Heading>
                  <Card size={2}>
                    <Flex direction="column" gap={12}>
                      <Heading size={3}>Users</Heading>
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>John Doe</Table.Cell>
                            <Table.Cell>Admin</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Jane Smith</Table.Cell>
                            <Table.Cell>User</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Bob Wilson</Table.Cell>
                            <Table.Cell>User</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </Flex>
                  </Card>
                </Flex>

                {/* Wide table with scroll */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Wide Table (Horizontal Scroll)</Heading>
                  <View style={{ width: 300 }}>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell width={60}>ID</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell width={150}>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell width={200}>Email Address</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell width={100}>Role</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell width={100}>Status</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>1</Table.Cell>
                          <Table.Cell>John Doe</Table.Cell>
                          <Table.Cell>john@example.com</Table.Cell>
                          <Table.Cell>Admin</Table.Cell>
                          <Table.Cell>
                            <Badge color="green">Active</Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>2</Table.Cell>
                          <Table.Cell>Jane Smith</Table.Cell>
                          <Table.Cell>jane@example.com</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                          <Table.Cell>
                            <Badge color="green">Active</Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>3</Table.Cell>
                          <Table.Cell>Bob Wilson</Table.Cell>
                          <Table.Cell>bob@example.com</Table.Cell>
                          <Table.Cell>User</Table.Cell>
                          <Table.Cell>
                            <Badge color="red">Inactive</Badge>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </View>
                </Flex>

                {/* Sizes */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Sizes</Heading>
                  <View style={{ gap: 16, flexDirection: 'column' }}>
                    <View>
                      <Text size={2} color="gray" mb={2}>Size 1 (Small)</Text>
                      <Table.Root size="1">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>John</Table.Cell>
                            <Table.Cell>Admin</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </View>
                    <View>
                      <Text size={2} color="gray" mb={2}>Size 2 (Medium - Default)</Text>
                      <Table.Root size="2">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>John</Table.Cell>
                            <Table.Cell>Admin</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </View>
                    <View>
                      <Text size={2} color="gray" mb={2}>Size 3 (Large)</Text>
                      <Table.Root size="3">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>John</Table.Cell>
                            <Table.Cell>Admin</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </View>
                  </View>
                </Flex>

                {/* Alignment examples */}
                <Flex direction={'column'} gap={16}>
                  <Heading size={4}>Column Alignment</Heading>
                  <View>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell align="left">Left</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align="center">Center</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align="right">Right</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell align="left">Left text</Table.Cell>
                          <Table.Cell align="center">Center text</Table.Cell>
                          <Table.Cell align="right">Right text</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell align="left">More left</Table.Cell>
                          <Table.Cell align="center">More center</Table.Cell>
                          <Table.Cell align="right">More right</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </View>
                </Flex>
              </Flex>
            </View>
          </ScrollView>
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
