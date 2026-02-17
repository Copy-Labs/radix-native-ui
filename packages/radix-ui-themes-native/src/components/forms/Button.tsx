import React, { useMemo, useCallback, Children, isValidElement } from 'react';
import {
  type ViewStyle,
  type GestureResponderEvent,
  ActivityIndicator,
  DimensionValue,
  View,
  type TextStyle,
} from 'react-native';
import { TouchableOpacity } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import {
  getAccentColor,
  getAccentAlpha,
  getGrayAlpha,
  getFocusColor,
  getContrast,
  getColorScale,
  getColorAlpha, getVariantColors,
} from '../../theme/color-helpers';
import RnTouchableOpacity from '../../components/primitives/TouchableOpacity';
import { Color, RadiusSize } from '../../theme';

// ============================================================================
// Types
// ============================================================================

interface ButtonProps {
  /**
   * Color scheme for the badge
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * Children components
   */
  children?: React.ReactNode;
  /**
   * Style prop for the Button
   */
  style?: ViewStyle;
  /**
   * Button variant
   * @default 'classic'
   */
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'surface' | 'ghost';
  /**
   * Radius variant mode for accessibility
   * @default 'medium'
   */
  radius?: RadiusSize;
  /**
   * Button size
   * @default 2
   */
  size?: 1 | 2 | 3;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Callback when button is pressed
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Callback when button is long-pressed
   */
  onLongPress?: (event: GestureResponderEvent) => void;
  /**
   * Duration (in milliseconds) before onLongPress is called
   * @default 500
   */
  delayLongPress?: number;
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Width of the button
   */
  width?: DimensionValue;
  /**
   * High contrast mode for accessibility
   */
  highContrast?: boolean;
}

interface ButtonIconProps {
  /**
   * Icon or content to render
   */
  children: React.ReactNode;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
}

interface ButtonLabelProps {
  /**
   * Label content to render
   */
  children: React.ReactNode;
  /**
   * Optional style overrides for the label
   */
  style?: TextStyle;
}

// ============================================================================
// ButtonIcon Component
// ============================================================================

const ButtonIcon = React.forwardRef<React.ComponentRef<typeof View>, ButtonIconProps>(
  ({ children, style, ...props }, ref) => {
    // This component is primarily a marker for the parent Button
    // The actual rendering and styling is handled by the Button component
    return (
      <View ref={ref} style={style} {...props}>
        {children}
      </View>
    );
  }
);

ButtonIcon.displayName = 'ButtonIcon';

// ============================================================================
// ButtonLabel Component
// ============================================================================

const ButtonLabel = React.forwardRef<React.ComponentRef<typeof Text>, ButtonLabelProps>(
  ({ children, style, ...props }, ref) => {
    // This component is primarily a marker for the parent Button
    // The actual rendering and styling is handled by the Button component
    return (
      <Text ref={ref} style={style} {...props}>
        {children}
      </Text>
    );
  }
);

ButtonLabel.displayName = 'ButtonLabel';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get icon size based on button size
 */
const getIconSize = (size: 1 | 2 | 3): number => {
  switch (size) {
    case 1:
      return 16;
    case 3:
      return 24;
    case 2:
    default:
      return 20;
  }
};

// ============================================================================
// Custom areEqual function for Button to optimize re-renders
// ============================================================================

const areEqual = (prevProps: ButtonProps, nextProps: ButtonProps) => {
  if (
    prevProps.children === nextProps.children &&
    prevProps.style === nextProps.style &&
    prevProps.variant === nextProps.variant &&
    prevProps.color === nextProps.color &&
    prevProps.radius === nextProps.radius &&
    prevProps.size === nextProps.size &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onLongPress === nextProps.onLongPress &&
    prevProps.delayLongPress === nextProps.delayLongPress &&
    prevProps.width === nextProps.width &&
    prevProps.highContrast === nextProps.highContrast
  ) {
    return true;
  }
  return false;
};

// ============================================================================
// Button Component
// ============================================================================

interface ButtonCompoundComponent extends React.ForwardRefExoticComponent<ButtonProps> {
  Icon: typeof ButtonIcon;
  Label: typeof ButtonLabel;
}

const Button = React.memo(
  React.forwardRef<React.ComponentRef<typeof RnTouchableOpacity>, ButtonProps>(
    (
      {
        children,
        style,
        variant = 'classic',
        color,
        radius = 'medium',
        size = 2,
        disabled,
        loading,
        onPress,
        accessibilityLabel,
        width,
        highContrast,
        ...rest
      },
      ref
    ) => {
      const theme = useTheme();
      const mode = useThemeMode();
      const isDark = mode === 'dark';
      const grayScale = isDark ? theme.colors.gray.dark : theme.colors.gray;
      const grayAlpha = getGrayAlpha(theme);
      const activeColor = color || theme.accentColor;
      const accentScale = getColorScale(theme, activeColor, mode);
      const accentAlpha = getColorAlpha(theme, activeColor);
      const focusColor = getFocusColor(theme, mode);
      const radii = theme.radii[radius] ?? theme.radii.medium;
      const selectedRadius = radius || theme.radius;

      const variantColors = useMemo(() => getVariantColors(theme, activeColor, mode, variant, highContrast), [getVariantColors, color, variant, highContrast, isDark, theme]);

      // Get size values
      const getSizeValues = useCallback(() => {
        switch (size) {
          case 1:
            return {
              paddingVertical: theme.space[1],
              paddingHorizontal: theme.space[3],
              fontSize: theme.typography.fontSizes[1].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
          case 3:
            return {
              paddingVertical: theme.space[3],
              paddingHorizontal: theme.space[5],
              fontSize: theme.typography.fontSizes[4].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
          case 2:
          default:
            return {
              paddingVertical: theme.space[2],
              paddingHorizontal: theme.space[4],
              fontSize: theme.typography.fontSizes[2].fontSize,
              borderRadius: selectedRadius === 'full' ? 9999 : radii,
            };
        }
      }, [size, theme, radii]);

      const sizeValues = useMemo(() => getSizeValues(), [getSizeValues]);

      // Process children to separate ButtonIcon and ButtonLabel from text content
      const { leftIcons, rightIcons, labelContent, textContent } = useMemo(() => {
        const leftIcons: React.ReactNode[] = [];
        const rightIcons: React.ReactNode[] = [];
        let labelContent: React.ReactNode = null;
        let textContent: string | null = null;
        let foundLabel = false;

        Children.forEach(children, (child) => {
          if (!isValidElement(child)) {
            // Handle string/number children as text content
            if (typeof child === 'string' || typeof child === 'number') {
              textContent = textContent ? `${textContent}${child}` : String(child);
            }
            return;
          }

          // Check if it's a ButtonIcon
          if ((child.type as any)?.displayName === 'ButtonIcon') {
            if (textContent || foundLabel || labelContent) {
              // Icon after label = right position
              rightIcons.push(child);
            } else {
              // Icon before label = left position
              leftIcons.push(child);
            }
            return;
          }

          // Check if it's a ButtonLabel
          if ((child.type as any)?.displayName === 'ButtonLabel') {
            labelContent = child;
            foundLabel = true;
            return;
          }

          // For other valid elements, treat as non-text content
          // If we haven't found label yet, it's a left icon
          // If we have found label, it's a right icon
          if (foundLabel || labelContent) {
            rightIcons.push(child);
          } else {
            leftIcons.push(child);
          }
        });

        return { leftIcons, rightIcons, labelContent, textContent };
      }, [children]);

      const buttonStyle: ViewStyle = useMemo(
        () => ({
          backgroundColor: disabled
            ? grayAlpha['3']
            : variantColors.backgroundColor,
          borderColor: variantColors.borderColor,
          borderWidth: variant === 'outline' || 'surface' ? 1 : 0,
          borderRadius: sizeValues.borderRadius,
          paddingVertical: sizeValues.paddingVertical,
          paddingHorizontal: sizeValues.paddingHorizontal,
          width,
          opacity: disabled ? 0.5 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexShrink: 1,
          columnGap: theme.space[2],
        }),
        [disabled, grayAlpha, variantColors, variant, sizeValues, width, color, activeColor]
      );

      const textStyle = useMemo(
        () => ({
          color: disabled ? grayAlpha['8'] : variantColors.textColor,
          fontSize: sizeValues.fontSize,
          fontWeight: '500' as const,
          // lineHeight: sizeValues.fontSize * 1.4,
        }),
        [disabled, grayAlpha, variantColors, sizeValues]
      );

      const handlePress = useCallback(
        (event: GestureResponderEvent) => {
          if (!disabled && !loading) {
            onPress?.(event);
          }
        },
        [disabled, loading, onPress]
      );

      // Icon size based on button size
      const iconSize = getIconSize(size);
      const iconColor = disabled ? grayAlpha['8'] : variantColors.textColor;

      // Render an icon with proper size and color
      const renderIcon = (iconChild: React.ReactNode, index: number) => {
        if (!isValidElement(iconChild)) return iconChild;

        // Get the children from ButtonIcon
        const iconProps = iconChild.props as ButtonIconProps;
        const iconContent = iconProps.children;

        // Clone the icon element with size and color props
        if (isValidElement(iconContent)) {
          const clonedIcon = React.cloneElement(iconContent as React.ReactElement<any>, {
            size: iconSize,
            color: iconColor,
          });

          return (
            <View key={index} style={iconProps.style}>
              {clonedIcon}
            </View>
          );
        }

        return (
          <View key={index} style={iconProps.style}>
            {iconContent}
          </View>
        );
      };

      // Render label with proper styling
      const renderLabel = () => {
        if (!labelContent) return null;

        const labelProps = (labelContent as React.ReactElement).props as ButtonLabelProps;

        return (
          <Text key="label" style={[textStyle, labelProps.style || {}]}>
            {labelProps.children}
          </Text>
        );
      };

      return (
        <TouchableOpacity
          ref={ref}
          style={[buttonStyle, style]}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabel || (typeof children === 'string' ? children : undefined)
          }
          accessibilityState={{ disabled }}
          {...rest}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variantColors.textColor} />
          ) : (
            <>
              {/* Left Icons */}
              {leftIcons.map((icon, index) => renderIcon(icon, index))}

              {/* ButtonLabel (explicit) */}
              {labelContent && renderLabel()}

              {/* Text Content (implicit from string children) */}
              {textContent && <Text style={[textStyle]}>{textContent}</Text>}

              {/* Right Icons */}
              {rightIcons.map((icon, index) => renderIcon(icon, index))}
            </>
          )}
        </TouchableOpacity>
      );
    }
  ),
  areEqual
) as ButtonCompoundComponent;

Button.displayName = 'Button';

// ============================================================================
// Compound Component Attachment
// ============================================================================

Button.Icon = ButtonIcon;
Button.Label = ButtonLabel;

// ============================================================================
// Exports
// ============================================================================

export { Button, ButtonIcon, ButtonLabel };
export type { ButtonProps, ButtonIconProps, ButtonLabelProps, ButtonCompoundComponent };
