import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Text,
  ThemeProvider,
} from '@radix-ui/themes-native';
import { Image as RNImage, ScrollView, View } from 'react-native';
import React from 'react';

export default function AspectRatioDemo() {
  return (
    <ThemeProvider
      mode={'light'}
      themeOptions={{ accentColor: 'blue', radius: 'medium', scaling: 1 }}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Flex direction={'column'} gap={20} padding={12}>
            <Box>
              <Heading size={6}>AspectRatio</Heading>
              <Text color={'gray'} size={4}>
                Displays content within a desired ratio.
              </Text>
            </Box>

            {/* Default 1:1 */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Default ratio (1:1)</Heading>
              <Box width={200}>
                <AspectRatio
                  ratio={1}
                  style={{
                    backgroundColor: '#e0e0e0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>1:1 Square</Text>
                </AspectRatio>
              </Box>
            </Flex>

            {/* 16:9 for videos */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>16:9 Video Container</Heading>
              <Box width={320}>
                <AspectRatio
                  ratio={16 / 9}
                  style={{
                    backgroundColor: '#1a1a1a',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>16:9 Video</Text>
                </AspectRatio>
              </Box>
            </Flex>

            {/* 4:3 Standard photo */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>4:3 Standard Photo</Heading>
              <Box width={240}>
                <AspectRatio
                  ratio={4 / 3}
                  style={{
                    backgroundColor: '#f0f0f0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>4:3 Photo</Text>
                </AspectRatio>
              </Box>
            </Flex>

            {/* 9:16 Portrait/TikTok/Reels */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>9:16 Portrait (TikTok, Reels)</Heading>
              <Box width={180}>
                <AspectRatio
                  ratio={9 / 16}
                  style={{
                    backgroundColor: '#2d2d2d',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>9:16 Portrait</Text>
                </AspectRatio>
              </Box>
            </Flex>

            {/* Image with aspect ratio */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>With Image Content</Heading>
              <Box width={300}>
                <AspectRatio ratio={16 / 9}>
                  <RNImage
                    source={{
                      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?&w=800&h=450&dpr=2&q=80&fit=crop',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </AspectRatio>
              </Box>
            </Flex>

            {/* Profile Card with Avatar */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Profile Card with Avatar</Heading>
              <Box width={360}>
                <Flex
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  gap={16}
                  align="center"
                >
                  <AspectRatio
                    ratio={1}
                    style={{
                      width: 80,
                      backgroundColor: '#3b82f6',
                      borderRadius: 40,
                      overflow: 'hidden',
                    }}
                  >
                    <RNImage
                      source={{
                        uri: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=160&h=160&dpr=2&q=80&fit=crop',
                      }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </AspectRatio>
                  <Box>
                    <Text size={3} weight="bold">
                      Teodros Girmay
                    </Text>
                    <Text size={2} color="gray">
                      Software Engineer
                    </Text>
                    <Text size={1} color="gray" style={{ marginTop: 4 }}>
                      Building amazing mobile experiences
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            {/* Photo Gallery Grid */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Photo Gallery Items</Heading>
              <Flex gap={8} wrap="wrap">
                {[1, 2, 3, 4].map((item) => (
                  <Box key={item} width={150}>
                    <AspectRatio ratio={1}>
                      <RNImage
                        source={{
                          uri: `https://picsum.photos/400?random=${item}`,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                    </AspectRatio>
                  </Box>
                ))}
              </Flex>
            </Flex>

            {/* Hero Image with overlay */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Hero Image with Text Overlay</Heading>
              <Box width={'100%'}>
                <AspectRatio ratio={21 / 9}>
                  <RNImage
                    source={{
                      uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?&w=1200&h=514&dpr=2&q=80&fit=crop',
                    }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <Box
                    position={'absolute'}
                    bottom={0}
                    left={0}
                    right={0}
                    padding={16}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <Text size={4} weight="bold" style={{ color: 'white' }}>
                      Beautiful Landscape
                    </Text>
                    <Text size={2} style={{ color: 'white' }}>
                      Amazing nature photography
                    </Text>
                  </Box>
                </AspectRatio>
              </Box>
            </Flex>

            {/* Product Card */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Product Card</Heading>
              <Box>
                <Flex
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <AspectRatio ratio={1}>
                    <RNImage
                      source={{
                        uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?&w=400&h=400&dpr=2&q=80&fit=crop',
                      }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </AspectRatio>
                  <Box padding={12}>
                    <Text size={2} weight="bold">
                      Wireless Headphones
                    </Text>
                    <Text size={3} color="blue" weight="bold" style={{ marginTop: 4 }}>
                      $299
                    </Text>
                    <Text size={1} color="gray" style={{ marginTop: 4 }}>
                      Premium sound quality
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            {/* Custom ratio with styling */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>Custom Styling</Heading>
              <Flex gap={12} wrap="wrap">
                <AspectRatio
                  ratio={1}
                  style={{
                    width: 100,
                    backgroundColor: '#ef4444',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>Red</Text>
                </AspectRatio>
                <AspectRatio
                  ratio={1}
                  style={{
                    width: 100,
                    backgroundColor: '#22c55e',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>Green</Text>
                </AspectRatio>
                <AspectRatio
                  ratio={1}
                  style={{
                    width: 100,
                    backgroundColor: '#3b82f6',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>Blue</Text>
                </AspectRatio>
              </Flex>
            </Flex>

            {/* With border and shadow */}
            <Flex direction={'column'} gap={16}>
              <Heading size={4}>With Border and Shadow</Heading>
              <Box width={250}>
                <AspectRatio
                  ratio={4 / 3}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#e5e7eb',
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <RNImage
                    source={{
                      uri: 'https://images.unsplash.com/photo-1516959511247-47f1d7102365?&w=600&h=450&dpr=2&q=80&fit=crop',
                    }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </AspectRatio>
              </Box>
            </Flex>
          </Flex>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
