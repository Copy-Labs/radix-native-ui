import React, { Children, isValidElement, useMemo } from 'react';
import {
  StyleSheet,
  type ViewStyle,
  TextInput as RNTextInput,
  type KeyboardType,
  View,
  KeyboardTypeOptions,
  TextInputProps,
} from 'react-native';
import { TextInput as RadixTextInputPrimitive, PrimitiveText } from '../primitives';
import { Slot } from '../utilities/Slot';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';
import { Flex } from '../../components';

// ============================================================================
// Types
// ============================================================================

interface TextFieldProps extends TextInputProps {
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Radius variant
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * The value of the text input
   */
  value?: string;
  /**
   * Badge variant
   * @default 'soft'
   */
  variant?: 'surface' | 'soft' | 'outline';
  /**
   * High contrast mode for accessibility
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
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Error message displayed below the input
   */
  error?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   * @default 2
   */
  size?: '1' | '2' | '3';
  /**
   * Whether this is a multiline input
   */
  multiline?: boolean;
  /**
   * Whether to hide text input (password mode)
   */
  secureTextEntry?: boolean;
  /**
   * Keyboard type
   * @default 'default'
   */
  keyboardType?: KeyboardTypeOptions;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  /**
   * Additional container style
   */
  style?: ViewStyle;
  /**
   * Children (for compound component pattern with Root and Slot)
   */
  children?: React.ReactNode;
}

interface TextFieldSlotProps {
  /**
   * Side to position the slot (optional - auto-detected if not provided)
   * First slots = left, Last slots = right
   */
  side?: 'left' | 'right';
  /**
   * Color for the slot content
   */
  color?: Color;
  /**
   * Gap between slot and input
   */
  gap?: number;
  /**
   * Horizontal padding for the slot
   */
  paddingHorizontal?: number;
  /**
   * Left padding for the slot
   */
  paddingLeft?: number;
  /**
   * Right padding for the slot
   */
  paddingRight?: number;
  /**
   * Content to display in the slot
   */
  children: React.ReactNode;
}

// ============================================================================
// Utility: Get TextInput child from children
// ============================================================================

function getTextInputChild(children: React.ReactNode): React.ReactNode | null {
  let textInputChild: React.ReactNode | null = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    // Check if it's a TextInput primitive or RNTextInput
    if (
      child.type === RadixTextInputPrimitive ||
      child.type === RNTextInput ||
      (child.type as any)?.displayName === 'TextInput' ||
      (child.props as any)?.['data-textinput'] === true
    ) {
      textInputChild = child;
    }
  });

  return textInputChild;
}

// ============================================================================
// Slot Component
// ============================================================================

const TextFieldSlot = React.forwardRef<any, TextFieldSlotProps>(
  ({ side, color, gap, paddingHorizontal, paddingLeft, paddingRight, children, ...props }, ref) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';

    // Build slot style based on props
    const slotStyle: ViewStyle = {
      ...props.style,
      gap: gap !== undefined ? gap : undefined,
      paddingHorizontal: paddingHorizontal !== undefined ? paddingHorizontal : undefined,
      paddingLeft: paddingLeft !== undefined ? paddingLeft : undefined,
      paddingRight: paddingRight !== undefined ? paddingRight : undefined,
    };

    // Apply color if provided
    const coloredChild = useMemo(() => {
      if (!color || !isValidElement(children)) return children;

      return React.cloneElement(children as React.ReactElement<any>, {
        color: theme.colors[color][9],
      });
    }, [children, color, theme, isDark]);

    return (
      <Slot ref={ref} style={slotStyle} {...props}>
        {coloredChild}
      </Slot>
    );
  }
);

TextFieldSlot.displayName = 'TextFieldSlot';

// ============================================================================
// Root Component
// ============================================================================

interface TextFieldRootProps extends Omit<TextFieldProps, 'children'> {
  children?: React.ReactNode;
}

const TextFieldRoot = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextFieldRootProps
>(({ children, ...props }, ref) => {
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);

  // Destructure props
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
    multiline = false,
    secureTextEntry = false,
    keyboardType = 'default',
    accessibilityLabel,
    accessibilityHint,
    style,
    ...rest
  } = props;
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius] ?? theme.radii.medium;
  const selectedRadius = radius || theme.radius;
  const variantColors = getVariantColors(theme, activeColor, mode, variant || 'outline', highContrast || false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Get size values
  const getSizeValues = () => {
    switch (size) {
      case '1':
        return {
          fontSize: theme.typography.fontSizes[4].fontSize,
          paddingVertical: theme.space[2],
          paddingHorizontal: theme.space[3],
          borderRadius: selectedRadius === 'full' ? 9999 : radii,
          height: multiline ? undefined : 36,
          slotPadding: theme.space[1],
        };
      case '3':
        return {
          fontSize: theme.typography.fontSizes[6].fontSize,
          paddingVertical: theme.space[4],
          paddingHorizontal: theme.space[4],
          borderRadius: selectedRadius === 'full' ? 9999 : radii,
          height: multiline ? undefined : 56,
          slotPadding: theme.space[3],
        };
      case '2':
      default:
        return {
          fontSize: theme.typography.fontSizes[5].fontSize,
          paddingVertical: theme.space[3],
          paddingHorizontal: theme.space[3],
          borderRadius: selectedRadius === 'full' ? 9999 : radii,
          height: multiline ? undefined : 44,
          slotPadding: theme.space[2],
        };
    }
  };

  const sizeValues = getSizeValues();
  const defaultSlotPadding = sizeValues.slotPadding;

  // Process children to separate slots from text input
  const { leftSlots, rightSlots, textInput } = useMemo(() => {
    const slotChildren: React.ReactNode[] = [];
    let textInputChild: React.ReactNode | null = null;

    Children.forEach(children, (child, index) => {
      if (!isValidElement(child)) return;

      // Check if it's a TextFieldSlot
      if ((child.type as any)?.displayName === 'TextFieldSlot') {
        slotChildren.push(child);
        return;
      }

      // Check if it's a TextInput primitive or RNTextInput
      if (
        child.type === RadixTextInputPrimitive ||
        child.type === RNTextInput ||
        (child.type as any)?.displayName === 'TextInput' ||
        (child.props as any)?.['data-textinput'] === true
      ) {
        textInputChild = child;
        return;
      }
    });

    // Auto-detect side for slots without explicit side prop
    const leftSlots: React.ReactNode[] = [];
    const rightSlots: React.ReactNode[] = [];

    slotChildren.forEach((child, index) => {
      if (!isValidElement(child)) return;

      const childProps = child.props as TextFieldSlotProps;
      const explicitSide = childProps.side;

      if (explicitSide === 'left') {
        leftSlots.push(child);
      } else if (explicitSide === 'right') {
        rightSlots.push(child);
      } else {
        // Auto-detect: first half = left, second half = right
        // For simplicity, we'll use index-based logic
        // First slot without explicit side goes left, last goes right
        const totalSlotsWithoutExplicitSide = slotChildren.filter(
          (c) => isValidElement(c) && !((c.props as TextFieldSlotProps)?.side)
        ).length;

        if (index === 0) {
          leftSlots.push(child);
        } else {
          rightSlots.push(child);
        }
      }
    });

    return { leftSlots, rightSlots, textInput: textInputChild };
  }, [children]);

  const containerStyle: ViewStyle = {
    gap: sizeValues.paddingVertical / 2 || theme.space[1],
  };

  const labelStyle = {
    color: variantColors.textColor || theme.colors.gray['11'],
    fontSize: sizeValues.fontSize,
    fontWeight: '500' as const,
  };

  const inputContainerBorderColor = () => {
    if (error) {
      return theme.colors.ruby[9];
    } else {
      return isFocused ? theme.colors[activeColor]['8'] : 'transparent';
    }
  };

  const inputContainerBackgroundColor = () => {
    if (disabled) {
      return isDark ? grayAlpha['3'] : grayAlpha['2'];
    } else {
      return variantColors.backgroundColor;
    }
  };

  const inputBorderColor = () => {
    if (isFocused) {
      return 'transparent';
    } else {
      return variantColors.borderColor;
    }
  };

  const inputContainerStyle: ViewStyle = {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: inputContainerBorderColor(),
    backgroundColor: inputContainerBackgroundColor(),
    borderRadius: sizeValues.borderRadius,
    opacity: disabled ? 0.6 : 1,
  };

  const inputInnerContainerStyle = {
    borderWidth: 1,
    // borderColor: isFocused ? 'transparent' : color ? variantColors.borderColor : grayAlpha['8'],
    borderColor: inputBorderColor(),
    borderRadius: sizeValues.borderRadius,
    paddingVertical: sizeValues.paddingVertical / 4,
    paddingHorizontal: sizeValues.paddingHorizontal / 2,
  };

  const inputStyle = {
    fontSize: sizeValues.fontSize,
    color: color !== 'gray' ? variantColors.textColor : grayScale[12],
    paddingVertical: sizeValues.paddingVertical / 4,
    paddingHorizontal: sizeValues.paddingHorizontal / 2,
    minHeight: multiline ? sizeValues.height : undefined,
    height: multiline ? undefined : sizeValues.height,
    textAlignVertical: multiline ? ('top' as const) : ('center' as const),
  };

  const errorStyle = {
    color: theme.colors.ruby[10],
    fontSize: theme.typography.fontSizes[3].fontSize,
  };

  // Default slot wrapper style
  const slotWrapperStyle: ViewStyle = {
    // paddingHorizontal: defaultSlotPadding,
    // backgroundColor: 'green'
  };

  // Common props for both user-provided and default TextInput
  const commonInputProps = {
    ref,
    value,
    onChangeText,
    placeholder,
    placeholderTextColor:
      color !== 'gray'
        ? theme.colors[color][12]+'99' // theme.colors[activeColor].alpha['8']
        : theme.colors.gray[9],
    editable: !disabled,
    secureTextEntry,
    keyboardType,
    multiline,
    accessibilityLabel: accessibilityLabel || label,
    accessibilityHint,
    accessibilityState: { disabled },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    ...rest,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <PrimitiveText style={labelStyle} accessibilityLabel={accessibilityLabel}>
          {label}
        </PrimitiveText>
      )}
      <View style={inputContainerStyle}>
        <Flex align={'center'} direction={'row'} style={inputInnerContainerStyle}>
          {/* Left Slots */}
          {leftSlots.length > 0 && (
            <View style={[styles.leftSlots, slotWrapperStyle]}>
              {leftSlots.map((child, index) =>
                isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<any>, {
                      key: index,
                      side: 'left',
                    })
                  : child
              )}
            </View>
          )}

          {/* Text Input */}
          {/*{textInput ? (
            isValidElement(textInput)
              ? React.cloneElement(textInput as React.ReactElement<any>, {
                  ...commonInputProps,
                  style: [inputStyle, (textInput as React.ReactElement<any>).props?.style],
                })
              : null
          ) : (
          )}*/}
          <Flex direction={'row'} style={{ flex: 1 }}>
            <RadixTextInputPrimitive
              {...commonInputProps}
              style={[styles.input, inputStyle]}
            />
          </Flex>

          {/* Right Slots */}
          {rightSlots.length > 0 && (
            <View style={[styles.rightSlots, slotWrapperStyle]}>
              {rightSlots.map((child, index) =>
                isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<any>, {
                      key: index,
                      side: 'right',
                    })
                  : child
              )}
            </View>
          )}
        </Flex>
      </View>
      {error && <PrimitiveText style={errorStyle}>{error}</PrimitiveText>}
    </View>
  );
});

TextFieldRoot.displayName = 'TextFieldRoot';

// ============================================================================
// Main TextField Component (Backward Compatible)
// ============================================================================

interface TextFieldCompoundComponent extends React.ForwardRefExoticComponent<TextFieldProps> {
  Root: typeof TextFieldRoot;
  Slot: typeof TextFieldSlot;
}

const TextField = React.forwardRef<React.ComponentRef<typeof RNTextInput>, TextFieldProps>(
  (props, ref) => {
    return <TextFieldRoot ref={ref} {...props} />;
  }
) as TextFieldCompoundComponent;

TextField.displayName = 'TextField';

// ============================================================================
// Compound Components
// ============================================================================

TextField.Root = TextFieldRoot;
TextField.Slot = TextFieldSlot;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  leftSlots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSlots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    width: '100%',
    minWidth: '100%',
    flex: 1,
  },
});

export { TextField, TextFieldRoot, TextFieldSlot };
export type { TextFieldProps, TextFieldSlotProps };
