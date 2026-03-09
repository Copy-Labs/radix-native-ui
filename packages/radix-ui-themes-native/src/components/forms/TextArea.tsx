import React, { useState, Children, isValidElement, useMemo } from 'react';
import {
  StyleSheet,
  type ViewStyle,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import { TextInput as RadixTextInputPrimitive, PrimitiveText } from '../primitives';
import { Slot } from '../utilities/Slot';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getColorScale, getGrayAlpha, getVariantColors } from '../../theme/color-helpers';
import { Color, RadiusSize } from '../../theme';
import { Flex } from '../../components';

// ============================================================================
// Types
// ============================================================================

interface TextAreaProps extends Omit<RNTextInputProps, 'multiline'> {
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
   * Additional container style
   */
  style?: ViewStyle;
  /**
   * Orientation of the input container
   * @default 'vertical'
   */
  // orientation?: 'horizontal' | 'vertical';
  /**
   * Children (for compound component pattern with Root and Slot)
   */
  children?: React.ReactNode;
}

interface TextAreaSlotProps {
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
// Slot Component
// ============================================================================

const TextAreaSlot = React.forwardRef<any, TextAreaSlotProps>(
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

TextAreaSlot.displayName = 'TextAreaSlot';

// ============================================================================
// Root Component
// ============================================================================

interface TextAreaRootProps extends Omit<TextAreaProps, 'children'> {
  children?: React.ReactNode;
}

const TextAreaRoot = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextAreaRootProps
>(({ children, ...props }, ref) => {
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
    // orientation = 'horizontal',
    ...rest
  } = props;

  // Process children to separate slots from textarea
  const { leftSlots, rightSlots } = useMemo(() => {
    const slotChildren: React.ReactNode[] = [];

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      // Check if it's a TextAreaSlot
      if ((child.type as any)?.displayName === 'TextAreaSlot') {
        slotChildren.push(child);
      }
    });

    // Auto-detect side for slots without explicit side prop
    const leftSlots: React.ReactNode[] = [];
    const rightSlots: React.ReactNode[] = [];

    slotChildren.forEach((child) => {
      if (!isValidElement(child)) return;

      const childProps = child.props as TextAreaSlotProps;
      const explicitSide = childProps.side;

      if (explicitSide === 'left') {
        leftSlots.push(child);
      } else if (explicitSide === 'right') {
        rightSlots.push(child);
      } else {
        // First slot without explicit side goes left, rest go right
        const slotsWithoutExplicitSide = slotChildren.filter(
          (c) => isValidElement(c) && !((c.props as TextAreaSlotProps)?.side)
        );
        const currentIndex = slotsWithoutExplicitSide.indexOf(child);

        if (currentIndex === 0) {
          leftSlots.push(child);
        } else {
          rightSlots.push(child);
        }
      }
    });

    return { leftSlots, rightSlots };
  }, [children]);

  const [isFocused, setIsFocused] = useState(false);
  const activeColor = color || theme.accentColor;
  const radii = theme.radii[radius] ?? theme.radii.medium;
  const selectedRadius = radius || theme.radius;
  const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);
  const accentColorScale = getColorScale(theme, activeColor, mode);

  // Size values (fixed height for textarea)
  const getSizeValues = () => {
    switch (size) {
      case '1':
        return {
          fontSize: theme.typography.fontSizes[4].fontSize,
          padding: theme.space[2],
          height: 100,
        };
      case '3':
        return {
          fontSize: theme.typography.fontSizes[6].fontSize,
          padding: theme.space[4],
          height: 140,
        };
      case '2':
      default:
        return {
          fontSize: theme.typography.fontSizes[5].fontSize,
          padding: theme.space[3],
          height: 120,
        };
    }
  };

  const sizeValues = getSizeValues();

  const containerStyle: ViewStyle = {
    gap: theme.space[2],
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
      return isFocused ? accentColorScale['8'] : 'transparent';
    }
  };

  const inputContainerBackgroundColor = () => {
    if (disabled) {
      return isDark ? grayAlpha['2'] : grayAlpha['2'];
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: variant === 'soft' ? 1.4 : 2,
    borderColor: inputContainerBorderColor(),
    backgroundColor: inputContainerBackgroundColor(),
    borderRadius: selectedRadius === 'full' ? theme.radii.large : radii,
    opacity: disabled ? 0.6 : 1,
  };

  const inputInnerContainerStyle = {
    borderWidth: 1,
    borderColor: inputBorderColor(),
    borderRadius: selectedRadius === 'full' ? theme.radii.large : radii,
    // flex: 1,
  };

  const inputStyle = {
    fontSize: sizeValues.fontSize,
    color: color !== 'gray' ? variantColors.textColor : grayScale[12],
    padding: sizeValues.padding,
    textAlignVertical: 'top' as const,
    minHeight: sizeValues.height,
    maxHeight: sizeValues.height + (sizeValues.height / 2),
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
        <Flex align={'stretch'} direction={'row'} style={inputInnerContainerStyle}>
          {/* Left Slots */}
          {leftSlots.length > 0 && (
            <View style={styles.leftSlots}>
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

          {/* TextArea Input */}
          <Flex direction={'row'} style={{ flex: 1 }} wrap={'wrap'}>
            <RadixTextInputPrimitive
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={
                color !== 'gray' ? theme.colors[color][12] + '99' : theme.colors.gray[9]
              }
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
          </Flex>

          {/* Right Slots */}
          {rightSlots.length > 0 && (
            <View style={styles.rightSlots}>
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

TextAreaRoot.displayName = 'TextAreaRoot';

// ============================================================================
// Main TextArea Component
// ============================================================================

interface TextAreaCompoundComponent extends React.ForwardRefExoticComponent<TextAreaProps> {
  Root: typeof TextAreaRoot;
  Slot: typeof TextAreaSlot;
}

const TextArea = React.forwardRef<
  React.ComponentRef<typeof RNTextInput>,
  TextAreaProps
>((props, ref) => {
  return <TextAreaRoot ref={ref} {...props} />;
}) as TextAreaCompoundComponent;

TextArea.displayName = 'TextArea';

// ============================================================================
// Compound Components
// ============================================================================

TextArea.Root = TextAreaRoot;
TextArea.Slot = TextAreaSlot;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  leftSlots: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rightSlots: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    minWidth: '100%',
    // width: '100%', // Using width causes the text to overflow the input field on android.
    // minHeight: 100,
  },
});

export { TextArea, TextAreaRoot, TextAreaSlot };
export type { TextAreaProps, TextAreaSlotProps };
