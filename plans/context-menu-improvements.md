# ContextMenu Component Improvements Plan

## Overview

This plan outlines the improvements needed for the `ContextMenu` component to bring it to parity with `DropdownMenu` and ensure proper positioning, collision detection, and consistent API.

## Current Issues

### 1. Dual Provider Pattern
- Both `ContextMenuProvider` and `ContextMenuRoot` exist with duplicate functionality
- Confusing for users - which one should they use?
- Inconsistent with other overlay components (DropdownMenu only has `Root`)

### 2. Hardcoded Content Sizing
- Lines 196-197 use hardcoded `menuWidth = 200` and `menuHeight = 200`
- Does not adapt to actual content size
- Collision detection is inaccurate

### 3. Missing Controlled State Support
- No `open` or `defaultOpen` props
- Cannot externally control menu state

### 4. Missing Features vs DropdownMenu
| Feature | DropdownMenu | ContextMenu |
|---------|--------------|-------------|
| `size` prop (1-4) | ✅ | ❌ |
| `color` prop on items | ✅ | ❌ |
| `shortcut` prop on items | ✅ | ❌ |
| Submenu support | ✅ | ❌ |
| Controlled state | ✅ | ❌ |
| Dynamic positioning | ✅ | ❌ |

### 5. Other Issues
- Dead code in `ContextMenuTrigger` (unused `longPressTimeoutRef`)
- Hardcoded destructive color `#dc2626` instead of theme colors
- Android back button not handled (`onRequestClose` is empty)

---

## Implementation Plan

### Phase 1: Core Positioning Infrastructure

#### 1.1 Create `calculateContextMenuPosition` Utility

Create a new utility function in `useAnchorPosition.ts` or a separate file for context menu positioning:

```typescript
// In packages/radix-ui-themes-native/src/hooks/useAnchorPosition.ts

export type ContextMenuSide = 'top' | 'bottom';
export type ContextMenuAlign = 'start' | 'center' | 'end';

export interface ContextMenuPosition {
  top: number;
  left: number;
  actualSide: ContextMenuSide;
}

export function calculateContextMenuPosition(
  touchPoint: { x: number; y: number },
  contentSize: { width: number; height: number },
  screenSize: { width: number; height: number },
  side: ContextMenuSide = 'bottom',
  align: ContextMenuAlign = 'start',
  sideOffset: number = 4,
  alignOffset: number = 0,
  avoidCollisions: boolean = true
): ContextMenuPosition {
  // Implementation:
  // 1. Calculate initial position based on touch point
  // 2. Apply alignment (start = left of touch, center = centered on touch, end = right of touch)
  // 3. Check for collisions with screen edges
  // 4. Flip side if needed (bottom -> top)
  // 5. Clamp to screen bounds with padding
}
```

**Key differences from `calculatePopoverPosition`:**
- Uses touch point as anchor instead of element bounds
- Only supports `top` and `bottom` sides (context menus appear above/below touch)
- Simpler alignment logic relative to touch coordinates

#### 1.2 Update `ContextMenuContent` to Use Dynamic Measurement

Replace hardcoded sizing with `onLayout`-based measurement:

```typescript
interface ContextMenuContentProps {
  children: ReactNode;
  side?: ContextMenuSide;
  sideOffset?: number;
  align?: ContextMenuAlign;
  alignOffset?: number;
  avoidCollisions?: boolean;
  size?: ContextMenuSize;
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuContent = ({
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  avoidCollisions = true,
  size = 2,
  style,
}: ContextMenuContentProps) => {
  const { colors, radii, position } = useContextMenuContext();
  const theme = useTheme();
  const contentRef = useRef<View>(null);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [calculatedPosition, setCalculatedPosition] = useState<ContextMenuPosition | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Calculate position when content size changes
  const updatePosition = useCallback(() => {
    if (contentSize.width === 0 || contentSize.height === 0) return;

    const pos = calculateContextMenuPosition(
      position,
      contentSize,
      { width: screenWidth, height: screenHeight },
      side,
      align,
      sideOffset,
      alignOffset,
      avoidCollisions
    );
    setCalculatedPosition(pos);
  }, [position, contentSize, screenWidth, screenHeight, side, align, sideOffset, alignOffset, avoidCollisions]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentSize({ width, height });
  }, []);

  // Size-based styles (same pattern as DropdownMenu)
  const sizeStyles = getSizeStyles(size, theme);

  return (
    <TouchableWithoutFeedback>
      <ContextMenuContext.Provider value={{ ...contextValue, size }}>
        <View
          ref={contentRef}
          onLayout={handleLayout}
          style={[
            styles.content,
            {
              backgroundColor: colors[1],
              borderRadius: radii.medium,
              borderWidth: 1,
              borderColor: colors[6],
              ...sizeStyles,
              ...(calculatedPosition ? {
                position: 'absolute',
                top: calculatedPosition.top,
                left: calculatedPosition.left,
              } : {
                position: 'absolute',
                left: -9999,
                opacity: 0,
              }),
            },
            style,
          ]}
        >
          {children}
        </View>
      </ContextMenuContext.Provider>
    </TouchableWithoutFeedback>
  );
};
```

---

### Phase 2: API Consistency with DropdownMenu

#### 2.1 Remove `ContextMenuProvider`

Keep only `ContextMenuRoot` for consistency:

```typescript
// REMOVE ContextMenuProvider entirely

// UPDATE ContextMenuRoot to support controlled state
interface ContextMenuRootProps {
  children: ReactNode;
  open?: boolean;           // NEW: Controlled state
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;    // NEW: Uncontrolled initial state
}

export const ContextMenuRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: ContextMenuRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [controlledOpen, onOpenChange]);

  // ... rest of implementation
};
```

#### 2.2 Add Size Prop Support

Add `ContextMenuSize` type and size-aware styling:

```typescript
export type ContextMenuSize = 1 | 2 | 3 | 4;

// Add to context
interface ContextMenuContextValue {
  // ... existing
  size: ContextMenuSize;
}

// Size-based styles helper
const getSizeStyles = (size: ContextMenuSize, theme: Theme) => {
  switch (size) {
    case 1:
      return {
        paddingVertical: theme.space[1],
        paddingHorizontal: theme.space[1],
        minWidth: 140,
        maxWidth: 220,
      };
    case 3:
      return {
        paddingVertical: theme.space[3],
        paddingHorizontal: theme.space[2],
        minWidth: 240,
        maxWidth: 360,
      };
    case 4:
      return {
        paddingVertical: theme.space[3],
        paddingHorizontal: theme.space[2],
        minWidth: 240,
        maxWidth: 360,
      };
    case 2:
    default:
      return {
        paddingVertical: theme.space[2],
        paddingHorizontal: theme.space[2],
        minWidth: 180,
        maxWidth: 280,
      };
  }
};
```

#### 2.3 Add `shortcut` Prop to `ContextMenuItem`

```typescript
interface ContextMenuItemProps {
  children: ReactNode;
  color?: Color;           // NEW
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  shortcut?: string;       // NEW
  style?: StyleProp<ViewStyle>;
}

export const ContextMenuItem = ({
  children,
  color,
  onSelect,
  disabled = false,
  destructive = false,
  icon,
  shortcut,
  style,
}: ContextMenuItemProps) => {
  // ... existing logic

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={[...]}>
      {icon && <View style={{ marginRight: theme.space[2] }}>{icon}</View>}
      <Text style={{ color: textColor, flex: 1, fontSize }}>
        {children}
      </Text>
      {shortcut && (
        <Text style={{ color: colors[11], fontSize: fontSize * 0.95 }}>
          {shortcut}
        </Text>
      )}
    </Pressable>
  );
};
```

---

### Phase 3: Bug Fixes & Cleanup

#### 3.1 Remove Dead Code in `ContextMenuTrigger`

Remove the unused `longPressTimeoutRef`:

```typescript
export const ContextMenuTrigger = ({
  children,
  onLongPress,
}: ContextMenuTriggerProps) => {
  const { setPosition, onOpenChange } = useContextMenuContext();

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setPosition({ x: pageX, y: pageY });
    onOpenChange(true);
    onLongPress?.(event);
  };

  // Remove: longPressTimeoutRef, handlePress, useEffect cleanup

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onLongPress: handleLongPress,
    });
  }

  return (
    <Pressable onLongPress={handleLongPress}>
      {children}
    </Pressable>
  );
};
```

#### 3.2 Fix Android Back Button Handler

Update `ContextMenuPortal`:

```typescript
export const ContextMenuPortal = ({ children }: ContextMenuPortalProps) => {
  const { open, onOpenChange } = useContextMenuContext();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => onOpenChange(false)}  // FIXED: Was empty
      hardwareAccelerated={false}
    >
      {children}
    </Modal>
  );
};
```

#### 3.3 Use Theme Colors for Destructive Items

```typescript
// In ContextMenuItem
const theme = useTheme();
const destructiveColor = theme.colors.red[11]; // Use theme red scale

const textColor = disabled 
  ? colors[8] 
  : destructive 
    ? destructiveColor  // Was: '#dc2626'
    : colors[12];
```

---

### Phase 4: Update Exports

Update `packages/radix-ui-themes-native/src/components/overlays/index.ts`:

```typescript
// ContextMenu
export { ContextMenu } from './ContextMenu';
export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuOverlayProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuSize,        // NEW
  ContextMenuSide,        // NEW
  ContextMenuAlign,       // NEW
} from './ContextMenu';

// REMOVE: ContextMenuProviderProps export
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/hooks/useAnchorPosition.ts` | Add `calculateContextMenuPosition` utility |
| `src/components/overlays/ContextMenu.tsx` | Major refactor - see details above |
| `src/components/overlays/index.ts` | Update exports |

---

## Testing Checklist

After implementation, verify:

- [ ] Context menu appears at touch point on long press
- [ ] Menu repositions when near screen edges
- [ ] Menu flips to top when touch is near bottom
- [ ] `size` prop affects padding and font sizes
- [ ] `shortcut` prop displays keyboard shortcuts
- [ ] Controlled state works with `open` and `onOpenChange`
- [ ] Android back button closes menu
- [ ] Destructive items use theme red color
- [ ] No TypeScript errors
- [ ] Existing demos still work

---

## Migration Guide for Users

### Before
```tsx
<ContextMenu.Provider>
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      <Text>Long press me</Text>
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Overlay />
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={handleAction}>Action</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</ContextMenu.Provider>
```

### After
```tsx
<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Text>Long press me</Text>
  </ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Overlay />
    <ContextMenu.Content size={2} side="bottom" avoidCollisions>
      <ContextMenu.Item onSelect={handleAction} shortcut="⌘S">
        Action
      </ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

**Breaking Changes:**
- `ContextMenu.Provider` removed - use `ContextMenu.Root` only
- `ContextMenuRootProps` interface updated (add `open`, `defaultOpen`)
