# Implementation Plan: Skeleton Component for radix-ui-themes-native

## Overview

Implement a Skeleton component that mirrors the behavior of `@radix-ui/themes` Skeleton — wrapping any UI element and conditionally showing either a loading skeleton or the actual content based on a `loading` prop.

---

## Architecture

### File Structure

```
packages/radix-ui-themes-native/src/components/
├── data-display/
│   ├── Skeleton.tsx          # Main component
│   ├── Skeleton.props.tsx     # Prop definitions
│   └── index.ts              # Export (add Skeleton export)
```

---

## Implementation Details

### 1. Props ([`Skeleton.props.tsx`](packages/radix-ui-themes-native/src/components/data-display/Skeleton.props.tsx))

```typescript
import { heightPropDefs } from '../../props/height.props';
import { widthPropDefs } from '../../props/width.props';

const skeletonPropDefs = {
  loading: { type: 'boolean', default: true },
  ...widthPropDefs,
  ...heightPropDefs,
} satisfies {
  loading: PropDef<boolean>;
};

export { skeletonPropDefs };
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `true` | When `true`, shows skeleton; when `false`, shows content |
| `width` | `Width` | - | Standard width prop |
| `height` | `Height` | - | Standard height prop |

---

### 2. Component ([`Skeleton.tsx`](packages/radix-ui-themes-native/src/components/data-display/Skeleton.tsx))

```typescript
import * as React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { skeletonPropDefs } from './Skeleton.props';

type SkeletonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  style?: ViewStyle;
  width?: number | string;
  height?: number | string;
};

const Skeleton = React.forwardRef<View, SkeletonProps>((props, forwardedRef) => {
  const { children, loading = true, style, width, height, ...rest } = props;

  // If NOT loading, render children directly
  if (!loading) {
    return <>{children}</>;
  }

  // Detect if children is a React element or plain text
  const isInline = !React.isValidElement(children);

  // For inline (text), render skeleton that matches text dimensions
  if (isInline && typeof children === 'string') {
    return (
      <View
        ref={forwardedRef}
        style={[styles.skeletonInline, style]}
        accessibilityLabel="Loading"
        {...rest}
      >
        <Animated.Text style={styles.hiddenText}>
          {children}
        </Animated.Text>
      </View>
    );
  }

  // For block (component), render skeleton wrapping children dimensions
  return (
    <View
      ref={forwardedRef}
      style={[styles.skeletonBlock, style]}
      accessibilityLabel="Loading"
      {...rest}
    >
      {children && <View style={styles.hiddenChildren}>{children}</View>}
    </View>
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
```

---

### 3. Animation Styles

```typescript
const styles = StyleSheet.create({
  skeletonInline: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonBlock: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    minHeight: 20,
    overflow: 'hidden',
  },
  hiddenText: {
    color: 'transparent',
    fontSize: 14,
    lineHeight: 20,
  },
  hiddenChildren: {
    opacity: 0,
  },
});
```

---

## Key Adaptations for React Native

| Web (CSS) | React Native |
|-----------|--------------|
| `line-height: 0` | Use transparent `Text` with same fontSize/lineHeight |
| `visibility: hidden` | Use `opacity: 0` on children wrapper |
| `inert` attribute | N/A (not supported in RN) |
| `aria-hidden` | Use `accessibilityLabel` |
| CSS `@keyframes` | Use `Animated.View` with looping |

---

## Usage Examples

### 1. Basic usage with loading prop

```tsx
<Flex gap="4">
  <Skeleton loading={true}>
    <Switch defaultChecked />
  </Skeleton>

  <Skeleton loading={false}>
    <Switch defaultChecked />
  </Skeleton>
</Flex>
```

### 2. Inline text skeleton (recommended)

```tsx
<Text>
  <Skeleton>Lorem ipsum dolor sit amet.</Skeleton>
</Text>
```

### 3. Block skeleton (wrapping components)

```tsx
<Skeleton>
  <Avatar fallback="JD" />
</Skeleton>
```

### 4. Standalone skeleton

```tsx
<Skeleton />
// or
<Skeleton loading={true} />
```

---

## Demo Page

Create [`apps/playground-native/app/demo/skeleton/index.tsx`](apps/playground-native/app/demo/skeleton/index.tsx) showcasing:

1. Text skeleton examples (inline pattern)
2. Component skeleton examples (block pattern)  
3. Loading state toggle demonstration
4. Different sizes

---

## Export

Update [`packages/radix-ui-themes-native/src/components/data-display/index.ts`](packages/radix-ui-themes-native/src/components/data-display/index.ts) to export Skeleton.

---

## Summary

This implementation will:
- ✅ Support `loading` prop to toggle between skeleton and content
- ✅ Detect inline (text) vs block (component) children
- ✅ Match dimensions automatically for text content
- ✅ Provide shimmer/pulse animation effect
- ✅ Follow the same API as @radix-ui/themes Skeleton
