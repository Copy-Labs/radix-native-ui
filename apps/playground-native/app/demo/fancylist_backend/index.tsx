import React from 'react';
import { Heading, Box, Text, ThemeProvider } from 'radix-native-ui';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';
import { FancyListWithLegendList } from '@/components/FancyListWithLegendList';

export default function FancyListBackendPage() {
  return (
    <ThemeProvider themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}>
      <PageContainer>
        <PageHeader showBackButton>
          <PageHeading>
            <Box>
              <Heading size={6}>FancyList × LegendList</Heading>
              <Text color="gray">
                AI-agent chat with a swappable virtualization backend (ListBackend)
              </Text>
            </Box>
          </PageHeading>
        </PageHeader>
        <PageBody>
          <FancyListWithLegendList />
        </PageBody>
      </PageContainer>
    </ThemeProvider>
  );
}
