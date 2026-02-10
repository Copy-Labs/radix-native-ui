# AspectRatio Component Examples

The `AspectRatio` component is a utility component that maintains a consistent aspect ratio for its children. It's particularly useful for images, videos, and responsive containers.

## Import

```tsx
import { AspectRatio } from '@radix-ui/themes-native';
```

## Basic Usage

### Default 1:1 Square

```tsx
<AspectRatio ratio={1} style={{ backgroundColor: '#e0e0e0' }}>
  <Text>1:1 Square</Text>
</AspectRatio>
```

### 16:9 Video Container

```tsx
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
```

### 4:3 Standard Photo

```tsx
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
```

### 9:16 Portrait (TikTok, Reels)

```tsx
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
```

## Image Examples

### With Image Content

```tsx
import { Image as RNImage } from 'react-native';

<AspectRatio ratio={16 / 9}>
  <RNImage
    source={{
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    }}
    style={{ width: '100%', height: '100%', borderRadius: 8 }}
    resizeMode="cover"
  />
</AspectRatio>
```

### Profile Card with Avatar

```tsx
<Flex gap={16} align="center">
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
      source={{ uri: 'https://example.com/avatar.jpg' }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </AspectRatio>
  <Box>
    <Text weight="bold">User Name</Text>
    <Text color="gray" size={2}>
      User bio
    </Text>
  </Box>
</Flex>
```

### Photo Gallery Grid

```tsx
<Flex gap={8} wrap="wrap">
  {[1, 2, 3, 4].map((item) => (
    <Box key={item} width={150}>
      <AspectRatio ratio={1}>
        <RNImage
          source={{ uri: `https://picsum.photos/400/400?random=${item}` }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          resizeMode="cover"
        />
      </AspectRatio>
    </Box>
  ))}
</Flex>
```

### Hero Image with Text Overlay

```tsx
<AspectRatio ratio={21 / 9}>
  <RNImage
    source={{ uri: 'https://example.com/hero.jpg' }}
    style={{ width: '100%', height: '100%' }}
    resizeMode="cover"
  />
  <Flex
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 16,
    }}
  >
    <Text size={4} weight="bold" style={{ color: 'white' }}>
      Hero Title
    </Text>
  </Flex>
</AspectRatio>
```

## Product Card Example

```tsx
<Flex
  style={{
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  }}
>
  <AspectRatio ratio={1}>
    <RNImage
      source={{ uri: 'https://example.com/product.jpg' }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </AspectRatio>
  <Box padding={12}>
    <Text weight="bold">Product Name</Text>
    <Text color="blue" weight="bold">
      $99
    </Text>
  </Box>
</Flex>
```

## Custom Styling Examples

### Colored Square Tiles

```tsx
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
</Flex>
```

### With Border and Shadow

```tsx
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
    source={{ uri: 'https://example.com/image.jpg' }}
    style={{ width: '100%', height: '100%' }}
    resizeMode="cover"
  />
</AspectRatio>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | `number` | `1` | Aspect ratio (width / height) |
| `style` | `StyleProp<ViewStyle>` | - | Additional style overrides |
| `children` | `React.ReactNode` | - | Children content |

## Common Aspect Ratios

| Ratio | Value | Use Case |
|-------|-------|----------|
| 1:1 | `1` | Square images, avatars, thumbnails |
| 4:3 | `4/3` | Standard photos, legacy TV |
| 3:4 | `3/4` | Portrait photos |
| 16:9 | `16/9` | Widescreen video, YouTube |
| 9:16 | `9/16` | TikTok, Instagram Reels, Stories |
| 21:9 | `21/9` | Ultrawide video, cinema |
| 2:3 | `2/3` | Portrait photography, Instagram posts |
| 3:2 | `3/2` | Landscape photography |

## Tips

1. **Always set a width** on the parent container to constrain the AspectRatio
2. **Use `resizeMode="cover"`** on images to fill the container while maintaining aspect ratio
3. **Combine with `overflow: 'hidden'`** for rounded corners
4. **Use `position: 'absolute'`** children for overlays and text on top of images
