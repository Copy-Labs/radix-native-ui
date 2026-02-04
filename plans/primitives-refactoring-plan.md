# Primitives Refactoring Plan

## Overview
Refactor all primitive components to extend React Native's native prop types instead of manually re-implementing them. This will ensure consistency with React Native/Expo and reduce maintenance burden.

## Current Architecture Issues

### 1. Prop Duplication
**Current (View.tsx):**
```typescript
export interface ViewProps
  extends LayoutProps,
    MarginProps,
    PaddingProps,
    BorderProps,
    ShadowProps,
    ColorProps,
    AccessibilityProps {
  style?: StyleProp<ViewStyle>;
}
```

**Problem:** Manually defines ~100 props that already exist in `ViewProps` from 'react-native'

### 2. Type Inconsistencies
- Local `StyleProp<T>` type conflicts with React Native's `StyleProp`
- Custom prop interfaces don't receive updates when RN adds new props
- Users lose IDE intellisense for standard RN props

### 3. Maintenance Overhead
- Need to manually sync props.ts with React Native updates
- Each primitive duplicates similar prop patterns
- theme.styles references don't exist on Theme type

## Target Architecture

### New Pattern
```typescript
import { View as RNView, ViewProps as RNViewProps } from 'react-native';

export interface ViewProps extends RNViewProps {
  // Only add theme-specific extensions
  wrap?: boolean;
}

export const View = React.forwardRef<RNView, ViewProps>(
  ({ style, wrap, ...rest }, ref) => {
    const theme = useTheme();
    const themedStyle = useThemeStyle('view', style); // Optional theme integration
    
    return <RNView ref={ref} style={themedStyle} {...rest} />;
  }
);
```

## Affected Files

### 11 Primitive Components to Refactor:
1. `View.tsx` - 209 lines → ~50 lines
2. `Text.tsx` - Re-implement using `TextProps` from RN
3. `FlatList.tsx` - 255 lines → ~80 lines
4. `ScrollView.tsx` - Currently has errors, needs full refactor
5. `Pressable.tsx` - Use `PressableProps` from RN
6. `TouchableOpacity.tsx` - Use `TouchableOpacityProps` from RN
7. `TouchableHighlight.tsx` - Use `TouchableHighlightProps` from RN
8. `Image.tsx` - Use `ImageProps` from RN
9. `TextInput.tsx` - Use `TextInputProps` from RN
10. `ActivityIndicator.tsx` - Use `ActivityIndicatorProps` from RN
11. `index.ts` - Update exports

### Supporting Files:
- `utils/props.ts` - Deprecate or reduce custom prop definitions
- Theme integration - Create `useThemeStyle` hook if needed

## Implementation Steps

### Phase 1: Core Primitives
1. **View.tsx**
   - Replace custom props with `ViewProps` from 'react-native'
   - Remove ~80 lines of manual prop destructuring
   - Keep theme background color integration

2. **Text.tsx**
   - Extend `TextProps` from 'react-native'
   - Remove custom typography prop definitions
   - Keep theme color integration

### Phase 2: List Components
3. **FlatList.tsx**
   - Extend `FlatListProps<T>` from 'react-native'
   - Remove manual layout prop handling
   - Keep theme container styling

4. **ScrollView.tsx**
   - Fix current circular reference errors
   - Extend `ScrollViewProps` from 'react-native'
   - Remove theme.styles references

### Phase 3: Interactive Components
5. **Pressable.tsx**
6. **TouchableOpacity.tsx**
7. **TouchableHighlight.tsx**

### Phase 4: Media & Input
8. **Image.tsx**
9. **TextInput.tsx**
10. **ActivityIndicator.tsx**

### Phase 5: Cleanup
11. Update `index.ts` exports
12. Deprecate unused utils/props.ts definitions
13. Update all consuming components

## Benefits

### For Users:
- ✅ Full access to all React Native props via IDE intellisense
- ✅ No learning curve - uses familiar RN prop names
- ✅ Automatic support for new RN props when library updates

### For Maintainers:
- ✅ ~70% reduction in primitive code (estimated ~1000 lines)
- ✅ No need to sync with React Native prop updates
- ✅ Single source of truth from React Native types
- ✅ Easier to review and test

### For Type Safety:
- ✅ Eliminates type inconsistencies
- ✅ Removes local StyleProp conflicts
- ✅ Proper generic type support for components like FlatList

## Migration Strategy

### Breaking Changes:
- Some custom props (like `wrap` in View) need to be preserved
- Theme integration points need to be redesigned

### Backward Compatibility:
- Can export both old and new props during transition
- Mark old props as `@deprecated` in JSDoc

### Testing Plan:
1. TypeScript compilation check
2. Component render tests
3. Theme integration tests
4. Consumer component regression tests

## Estimated Effort

| Phase | Files | Estimated Lines Changed | Time |
|-------|-------|------------------------|------|
| 1 | 2 | -200 lines | 2-3 hours |
| 2 | 2 | -300 lines | 3-4 hours |
| 3 | 3 | -250 lines | 2-3 hours |
| 4 | 3 | -200 lines | 2-3 hours |
| 5 | 3 | -100 lines | 1-2 hours |
| **Total** | **13** | **~1050 lines removed** | **10-15 hours** |

## Next Steps

1. Review and approve this plan
2. Create feature branch for refactoring
3. Implement Phase 1 (View, Text) as proof of concept
4. Review and adjust pattern based on findings
5. Continue with remaining phases
6. Update documentation and migration guide
