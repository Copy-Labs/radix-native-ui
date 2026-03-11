# Sidebar/Navigation Drawer Implementation Plan

## Overview

Implement a Sidebar/Navigation Drawer component for radix-native-ui following the same patterns as the existing BottomSheet component.

## Requirements

### Features

1. **Position**: `side` prop - left or right
2. **Variant**: `variant` prop - overlay (slides over content) or push (pushes content)
3. **Width**: `width` prop - customizable drawer width
4. **Gestures**: Swipe to open/close
5. **Animation**: Smooth slide animations using React Native Animated API

### API Structure

```tsx
<Sidebar.Root open={open} onOpenChange={setOpen}>
  <Sidebar.Trigger>
    <IconButton icon="menu" />
  </Sidebar.Trigger>
  <Sidebar.Portal>
    <Sidebar.Overlay />
    <Sidebar.Content side="left" variant="overlay" width={300}>
      <Sidebar.Header>
        <Heading>Menu</Heading>
      </Sidebar.Header>
      <Sidebar.Item>Home</Sidebar.Item>
      <Sidebar.Item>Settings</Sidebar.Item>
      <Sidebar.Separator />
      <Sidebar.Item>Logout</Sidebar.Item>
    </Sidebar.Content>
  </Sidebar.Portal>
</Sidebar.Root>
```

### Component Parts

| Component | Description |
|-----------|-------------|
| `Sidebar.Root` | Manages state, provides context |
| `Sidebar.Trigger` | Button to open sidebar |
| `Sidebar.Portal` | Renders content at root level using Modal |
| `Sidebar.Overlay` | Backdrop/dimming overlay |
| `Sidebar.Content` | The actual sidebar with animation |
| `Sidebar.Header` | Header section (optional) |
| `Sidebar.Item` | Menu items |
| `Sidebar.Separator` | Divider between items |

---

## Implementation Steps

### Step 1: Create Sidebar Component File

**File**: `packages/radix-ui-themes-native/src/components/overlays/Sidebar.tsx`

Create the main Sidebar component following the BottomSheet pattern:
- Import necessary React Native modules
- Import existing primitives (AnimatedPressable)
- Import theme hooks
- Create Context for state management

### Step 2: Implement Sidebar Context and Hook

```tsx
interface SidebarContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: 'left' | 'right';
  variant: 'overlay' | 'push';
  width: number;
  // Animation state
  translateX: Animated.Value;
  panHandlers: GestureResponderHandlers;
}
```

### Step 3: Implement Sidebar.Root

- Manage `open` state (controlled + uncontrolled)
- Create Animated.Value for translateX
- Create PanResponder for swipe gestures
- Provide context to children

### Step 4: Implement Sidebar.Trigger

- Clone child element with onPress handler
- Call `onOpenChange(true)` when pressed

### Step 5: Implement Sidebar.Portal

- Use React Native Modal
- Transparent background (content provides background)
- Pass through open state

### Step 6: Implement Sidebar.Overlay

- Full screen semi-transparent backdrop
- Press to close functionality
- Only visible in overlay mode

### Step 7: Implement Sidebar.Content

- Animated.View with translateX animation
- Position: absolute left or right based on side prop
- Apply shadow/elevation
- Border radius based on side

**Gesture Logic**:
- For `side="left"`: Swipe RIGHT to open, LEFT to close
- For `side="right"`: Swipe LEFT to open, RIGHT to close

### Step 8: Implement Sidebar Sub-components

- **Sidebar.Header**: Container with padding and optional border
- **Sidebar.Item**: Pressable list items with icon support
- **Sidebar.Separator**: Horizontal divider line

### Step 9: Export from index.ts

**File**: `packages/radix-ui-themes-native/src/components/overlays/index.ts`

Add export for Sidebar component.

### Step 10: Create Demo Page

**File**: `apps/playground-native/app/demo/sidebar/index.tsx`

Create demo page showing:
- Left sidebar with overlay
- Right sidebar with overlay
- Push variant
- Various menu items

---

## Technical Details

### Animation Values

- **Closed**: `translateX = -width` (left) or `translateX = width` (right)
- **Open**: `translateX = 0`
- **Duration**: 300ms

### Gesture Thresholds

- **Swipe to open**: 50px minimum
- **Swipe to close**: 50px minimum + velocity check
- **Velocity threshold**: 500

### Theme Integration

- Use `useTheme()` and `useThemeMode()` hooks
- Support dark/light mode
- Use theme colors for backgrounds, text, borders

### Platform Considerations

- Works on both iOS and Android (no native drawer dependency)
- Use `Dimensions.get('window')` for screen width

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `packages/radix-ui-themes-native/src/components/overlays/Sidebar.tsx` | Create |
| `packages/radix-ui-themes-native/src/components/overlays/index.ts` | Modify - add export |
| `apps/playground-native/app/demo/sidebar/index.tsx` | Create |

---

## Testing Checklist

- [ ] Left sidebar opens/closes correctly
- [ ] Right sidebar opens/closes correctly
- [ ] Swipe gesture works in both directions
- [ ] Overlay variant covers content
- [ ] Push variant shifts content
- [ ] Dark mode styling works
- [ ] Light mode styling works
- [ ] Press on overlay closes sidebar
- [ ] All sub-components render correctly
