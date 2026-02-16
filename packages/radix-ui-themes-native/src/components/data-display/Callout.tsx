import React, { createContext, useContext, forwardRef, ReactNode, useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle, type TextStyle, View, ViewProps } from 'react-native';
import { Slot } from '../utilities/Slot';
import { View as PrimitiveView } from '../primitives';
import { Text } from '../typography';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { getVariantColors, getColorAlpha } from '../../theme/color-helpers';
import type { Color } from '../../theme';

// Callout sizes
type CalloutSize = 1 | 2 | 3;

// Callout variants
type CalloutVariant = 'soft' | 'surface' | 'outline';

// Context for sharing state between components
type CalloutContextValue = {
  size: CalloutSize;
  color: Color;
  highContrast: boolean;
  variantColors: ReturnType<typeof getVariantColors>;
};

const CalloutContext = createContext<CalloutContextValue>({
  size: 2,
  color: 'indigo',
  highContrast: false,
  variantColors: {
    backgroundColor: 'gray',
    borderColor: 'gray',
    textColor: 'gray',
  } as any,
});

// Helper to map callout size to text size
const mapCalloutSizeToTextSize = (size: CalloutSize): 1 | 2 | 3 => {
  switch (size) {
    case 1:
      return 2;
    case 2:
      return 2;
    case 3:
      return 3;
    default:
      return 2;
  }
};

// Helper to get size-based styles
const getSizeStyles = (size: CalloutSize, theme: ReturnType<typeof useTheme>) => {
  switch (size) {
    case 1:
      return {
        padding: theme.space[3],
        gap: theme.space[2],
        borderRadius: theme.radii.medium,
      };
    case 2:
      return {
        padding: theme.space[4],
        gap: theme.space[3],
        borderRadius: theme.radii.medium,
      };
    case 3:
      return {
        padding: theme.space[5],
        gap: theme.space[4],
        borderRadius: theme.radii.medium,
      };
    default:
      return {
        padding: theme.space[4],
        gap: theme.space[3],
        borderRadius: theme.radii.medium,
      };
  }
};

// ============================================================================
// CalloutRoot Component
// ============================================================================

interface CalloutRootProps extends Omit<ViewProps, 'children'> {
  /**
   * Whether to merge props onto the immediate child
   */
  asChild?: boolean;
  /**
   * Callout content
   */
  children: ReactNode;
  /**
   * Color scheme for the callout
   * @default undefined (uses theme's accentColor)
   */
  color?: Color;
  /**
   * High contrast mode for accessibility
   * @default false
   */
  highContrast?: boolean;
  /**
   * Callout size
   * @default 2
   */
  size?: CalloutSize;
  /**
   * Callout variant
   * @default 'soft'
   */
  variant?: CalloutVariant;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const CalloutRoot = forwardRef<View, CalloutRootProps>(
  (
    {
      asChild = false,
      children,
      color,
      highContrast = false,
      size = 2,
      variant = 'soft',
      style,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const mode = useThemeMode();
    const activeColor = color || theme.accentColor;

    // Get variant colors using the helper
    const variantColors = getVariantColors(theme, activeColor, mode, variant, highContrast);

    // Get size-based styles
    const sizeStyles = getSizeStyles(size, theme);

    // Build the container style
    const containerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: sizeStyles.padding,
      gap: sizeStyles.gap,
      borderRadius: sizeStyles.borderRadius,
      backgroundColor: variantColors.backgroundColor,
      borderWidth: variant === 'outline' || variant === 'surface' ? 1 : 0,
      borderColor: variantColors.borderColor,
      flex: 1,
    };

    // Context value for child components
    const contextValue = useMemo<CalloutContextValue>(
      () => ({
        size,
        color: activeColor,
        highContrast,
        variantColors,
      }),
      [size, activeColor, highContrast]
    );

    if (asChild) {
      return (
        <CalloutContext.Provider value={contextValue}>
          <Slot ref={ref} style={[containerStyle, style] as any} {...rest}>
            {children}
          </Slot>
        </CalloutContext.Provider>
      );
    }

    return (
      <CalloutContext.Provider value={contextValue}>
        <PrimitiveView ref={ref} style={[containerStyle, style]} {...rest}>
          {children}
        </PrimitiveView>
      </CalloutContext.Provider>
    );
  }
);

CalloutRoot.displayName = 'Callout.Root';

// ============================================================================
// CalloutIcon Component
// ============================================================================

interface CalloutIconProps {
  /**
   * Icon content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<ViewStyle>;
}

const CalloutIcon = forwardRef<View, CalloutIconProps>(
  ({ children, style }, ref) => {
    const { size, color, highContrast } = useContext(CalloutContext);
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';

    // Get the color scale for the icon color
    const colorAlpha = getColorAlpha(theme, color);
    const iconColor = highContrast
      ? isDark ? theme.colors[color].dark?.[12] : theme.colors[color][12]
      : colorAlpha[11];

    // Get icon height based on size
    const iconHeight = size === 3 ? theme.typography.fontSizes[3].lineHeight : theme.typography.fontSizes[2].lineHeight;

    const iconStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      height: iconHeight,
    };

    // If children is a valid React element, clone it with the color
    const coloredChildren = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<{ color?: string; style?: StyleProp<any> }>, {
          color: iconColor,
          style: [{}, (children as React.ReactElement).props?.style],
        })
      : children;

    return (
      <PrimitiveView ref={ref} style={[iconStyle, style]}>
        {coloredChildren}
      </PrimitiveView>
    );
  }
);

CalloutIcon.displayName = 'Callout.Icon';

// ============================================================================
// CalloutText Component
// ============================================================================

interface CalloutTextProps {
  /**
   * Text content
   */
  children: ReactNode;
  /**
   * Custom style
   */
  style?: StyleProp<TextStyle>;
  /**
   * Trim whitespace
   */
  trim?: 'start' | 'end' | 'both';
}

const CalloutText = forwardRef<any, CalloutTextProps>(
  ({ children, style, trim }, ref) => {
    const { size, color, highContrast } = useContext(CalloutContext);
    const theme = useTheme();
    const mode = useThemeMode();
    const isDark = mode === 'dark';

    // Map callout size to text size
    const textSize = mapCalloutSizeToTextSize(size);

    // Get the color for text
    const colorAlpha = getColorAlpha(theme, color);
    const textColor = highContrast
      ? isDark ? theme.colors[color].dark?.[12] : theme.colors[color][12]
      : colorAlpha[11];

    // Process children for trim
    const processedChildren = useMemo(() => {
      if (typeof children === 'string') {
        let text = children;
        if (trim === 'start') {
          text = text.trimStart();
        } else if (trim === 'end') {
          text = text.trimEnd();
        } else if (trim === 'both') {
          text = text.trim();
        }
        return text;
      }
      return children;
    }, [children, trim]);

    const textStyle: TextStyle = {
      color: textColor,
      flex: 1,
    };

    return (
      <Text
        ref={ref}
        size={textSize}
        style={[textStyle, style]}
      >
        {processedChildren}
      </Text>
    );
  }
);

CalloutText.displayName = 'Callout.Text';

// ============================================================================
// Compound Export
// ============================================================================

/**
 * Callout component for displaying important messages with optional icons.
 *
 * @example
 * ```tsx
 * <Callout.Root variant="soft" color="red">
 *   <Callout.Icon>
 *     <InfoIcon />
 *   </Callout.Icon>
 *   <Callout.Text>
 *     This is an important message
 *   </Callout.Text>
 * </Callout.Root>
 * ```
 */
const Callout = {
  Root: CalloutRoot,
  Icon: CalloutIcon,
  Text: CalloutText,
};

export { Callout, CalloutRoot, CalloutIcon, CalloutText };
export type { CalloutRootProps, CalloutIconProps, CalloutTextProps, CalloutSize, CalloutVariant };
