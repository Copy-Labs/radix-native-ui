# TextArea Standalone Component Plan

## Problem Statement

TextField has become too complex with its slot system. TextArea is a fundamentally different use case that doesn't need slots. Current TextArea extends TextField, which causes issues because:
- TextField's multiline handling is broken
- Slots don't make sense for a textarea
- The architecture is over-engineered for the use case

## Solution

Create TextArea as a **standalone component** that:
- Uses `RadixTextInputPrimitive` directly
- Has its own props interface (like TextField but without children/slots)
- Shares theme/color logic with TextField
- Simpler implementation

## Implementation

### Step 1: Create TextAreaProps

```tsx
interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  /**
   * Color scheme
   */
  color?: Color;
  /**
   * Radius variant
   */
  radius?: RadiusSize;
  /**
   * Value of the textarea
   */
  value?: string;
  /**
   * Variant
   */
  variant?: 'surface' | 'soft' | 'outline';
  /**
   * High contrast mode
   */
  highContrast?: boolean;
  /**
   * Callback when text changes
   */
  onChangeText?: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Label text displayed above
   */
  label?: string;
  /**
   * Error message displayed below
   */
  error?: string;
  /**
   * Whether disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   */
  size?: '1' | '2' | '3';
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Auto-grow height
   */
  autoGrow?: boolean;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  /**
   * Additional style
   */
  style?: ViewStyle;
}
```

### Step 2: Implement TextAreaRoot

```tsx
const TextAreaRoot = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextAreaProps
>((props, ref) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  const {
    value,
    onChangeText,
    placeholder,
    label,
    error,
    disabled = false,
    color = 'gray',
    highContrast = false,
    radius = 'medium',
    size = '2',
    variant = 'outline',
    rows = 4,
    autoGrow = false,
    accessibilityLabel,
    accessibilityHint,
    style,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius] ?? theme.radii.medium;
  const selectedRadius = radius || theme.radius;
  const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

  // Size values (fixed height for textarea)
  const sizeValues = {
    '1': { fontSize: theme.typography.fontSizes[4].fontSize, padding: theme.space[2], height: 100 },
    '2': { fontSize: theme.typography.fontSizes[5].fontSize, padding: theme.space[3], height: 120 },
    '3': { fontSize: theme.typography.fontSizes[6].fontSize, padding: theme.space[4], height: 140 },
  }[size];

  const containerStyle: ViewStyle = {
    gap: theme.space[2],
  };

  const labelStyle = {
    color: variantColors.textColor || theme.colors.gray['11'],
    fontSize: sizeValues.fontSize,
    fontWeight: '500' as const,
  };

  const inputContainerStyle: ViewStyle = {
    width: '100%',
    borderWidth: 2,
    borderColor: error
      ? theme.colors.ruby[9]
      : isFocused
      ? theme.colors[activeColor]['8']
      : variantColors.borderColor,
    backgroundColor: disabled
      ? isDark
        ? grayAlpha['3']
        : grayAlpha['2']
      : variantColors.backgroundColor,
    borderRadius: selectedRadius === 'full' ? 9999 : radii,
    opacity: disabled ? 0.6 : 1,
    minHeight: sizeValues.height,
  };

  const inputStyle = {
    fontSize: sizeValues.fontSize,
    color: color !== 'gray' ? variantColors.textColor : grayScale[12],
    padding: sizeValues.padding,
    textAlignVertical: 'top' as const,
  };

  const errorStyle = {
    color: theme.colors.ruby[10],
    fontSize: theme.typography.fontSizes[3].fontSize,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <PrimitiveText style={labelStyle} accessibilityLabel={accessibilityLabel}>
          {label}
        </PrimitiveText>
      )}
      <View style={inputContainerStyle}>
        <RadixTextInputPrimitive
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color !== 'gray' ? theme.colors[activeColor].alpha['8'] : theme.colors.gray[9]}
          editable={!disabled}
          multiline={true}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled }}
          style={[styles.input, inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>
      {error && <PrimitiveText style={errorStyle}>{error}</PrimitiveText>}
    </View>
  );
});
```

### Step 3: Update TextArea Export

```tsx
const TextArea = React.forwardRef<React.ComponentRef<typeof RNTextInput>, TextAreaProps>(
  (props, ref) => {
    return <TextAreaRoot ref={ref} {...props} />;
  }
) as TextAreaCompoundComponent;

TextArea.displayName = 'TextArea';
```

### Step 4: Update TextArea.tsx File

Replace the current TextArea.tsx content with the new implementation.

## Files to Modify

| File | Changes |
|------|---------|
| `packages/radix-ui-themes-native/src/components/forms/TextArea.tsx` | Complete rewrite as standalone component |

## Benefits

1. **Simpler** - No slots, no children, no complex rendering logic
2. **Works correctly** - Multiline behavior is correct by design
3. **Focused** - Only what TextArea needs
4. **Themeable** - Same colors, radii, sizes as TextField
5. **Maintainable** - Easy to modify without affecting TextField

## Usage

```tsx
// Simple
<TextArea
  value={value}
  onChangeText={setValue}
  placeholder="Enter text..."
  label="Description"
/>

// With error
<TextArea
  value={value}
  onChangeText={setValue}
  error={error}
/>

// With variant
<TextArea
  value={value}
  onChangeText={setValue}
  variant="soft"
  color="blue"
  size="2"
/>
```

## Backward Compatibility

This is a **breaking change** for existing TextArea users. They need to:
- Remove `<TextField>` wrapper usage
- Use `<TextArea>` directly with new props

## Testing Checklist

- [ ] TextArea renders correctly
- [ ] Multiline text wraps properly
- [ ] Text expands vertically
- [ ] Label displays correctly
- [ ] Error message shows
- [ ] Disabled state works
- [ ] All size variants work
- [ ] All color variants work
- [ ] Focus states work
- [ ] Accessibility props work
