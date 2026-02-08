import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  type StyleProp,
  ViewStyle,
  Pressable,
  ScrollView,
  Dimensions,
  TextStyle,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { type ButtonProps, Heading } from '../../components';
import { Button } from '../../components';
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import type { HeadingProps } from '../typography/Heading';
import type { TextProps } from '../typography/Text';

// ============================================================================
// Dialog Context
// ============================================================================

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog.Root');
  }
  return context;
};

// ============================================================================
// Dialog.Root - Main component that manages state
// ============================================================================

interface DialogRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DialogRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
}: DialogRootProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [controlledOpen, onOpenChange]);

  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const colors = isDark ? theme.colors.gray.dark : theme.colors.gray;
  const grayAlpha = getGrayAlpha(theme);
  const radii = theme.radii;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange, colors, grayAlpha, radii }}>
      {children}
    </DialogContext.Provider>
  );
};

// ============================================================================
// Dialog.Trigger - The button that opens the dialog
// ============================================================================

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = ({ children, asChild = true }: DialogTriggerProps) => {
  const { onOpenChange, open } = useDialog();

  const handlePress = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
  );
};

// ============================================================================
// Dialog.Portal - Renders content at root level using Modal
// ============================================================================

interface DialogPortalProps {
  children: ReactNode;
  hostId?: string;
}

export const DialogPortal = ({ children, hostId }: DialogPortalProps) => {
  const { open } = useDialog();

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {}}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// Dialog.Overlay - The backdrop that dims the background
// ============================================================================

interface DialogOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const DialogOverlay = ({ style }: DialogOverlayProps) => {
  const { grayAlpha } = useDialog();
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  // Use alpha black for overlay based on theme - matches radix-ui styling
  // Light mode: rgba(10, 10, 10, 0.6) | Dark mode: rgba(0, 0, 0, 0.6)
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(10, 10, 10, 0.6)';

  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: overlayColor,
          },
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// Size configuration matching radix-ui-themes
// ============================================================================

const getSizeStyles = (
  size: 1 | 2 | 3 | 4,
  space: SpaceScale,
  radii: RadiusScale
) => {
  const sizeConfig = {
    1: {
      paddingHorizontal: space[3],
      paddingVertical: space[3],
      radius: radii.small,
    },
    2: {
      paddingHorizontal: space[4],
      paddingVertical: space[4],
      radius: radii.medium,
    },
    3: {
      paddingHorizontal: space[5],
      paddingVertical: space[5],
      radius: radii.medium,
    },
    4: {
      paddingHorizontal: space[6],
      paddingVertical: space[6],
      radius: radii.large,
    },
  };
  return sizeConfig[size];
};

// ============================================================================
// Dialog.Content - The actual dialog content
// ============================================================================

interface DialogContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
  size?: 1 | 2 | 3 | 4;
}

export const DialogContent = ({
  children,
  style,
  hideCloseButton = false,
  size = 2,
}: DialogContentProps) => {
  const { onOpenChange, colors, grayAlpha, radii } = useDialog();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Get size-specific styles
  const sizeStyles = getSizeStyles(size, theme.space, radii);

  // Get shadow for current theme mode
  const shadow = getShadow(6, isDark);

  const handleClose = () => {
    onOpenChange(false);
  };

  // Max width based on size - matches radix-ui behavior
  const maxWidth = size <= 2 ? Math.min(screenWidth - 64, 400) : Math.min(screenWidth - 64, 500);

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: isDark ? theme.colors.gray.dark[2] : '#ffffff',
          borderRadius: sizeStyles.radius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          maxWidth,
          minWidth: Math.min(screenWidth - 128, 400),
          top: screenHeight / 2 - 96, // Approximate vertical centering
          ...(shadow || {}),
        },
        style,
      ]}
    >
      {/* Scroll container matching radix-ui structure */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {children}
      </ScrollView>
      {!hideCloseButton && (
        <Pressable
          onPress={handleClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
        >
          <Text
            style={{
              color: isDark ? theme.colors.gray.dark[12] : theme.colors.gray[12],
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
};

// ============================================================================
// Dialog.Title - Accessible title for screen readers
// Extends HeadingProps to allow all Heading default props
// ============================================================================

interface DialogTitleProps extends Omit<HeadingProps, 'children'> {
  children: ReactNode;
  /**
   * @deprecated Use 'asChild' directly on the component if needed
   */
  style?: HeadingProps['style'];
}

export const DialogTitle = ({
  children,
  style = {},
  size = 4,
  weight = 'bold',
  align,
  color,
  truncate,
  numberOfLines,
  fontFamily,
  opacity,
  asChild = false,
  ...rest
}: DialogTitleProps) => {
  const { colors } = useDialog();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const dialogColors = isDark ? theme.colors.gray.dark : theme.colors.gray;

  return (
    <Heading
      asChild={asChild}
      size={size}
      weight={weight}
      align={align}
      color={color || dialogColors[12]}
      truncate={truncate}
      numberOfLines={numberOfLines}
      fontFamily={fontFamily}
      opacity={opacity}
      style={[style]}
      {...rest}
    >
      {children}
    </Heading>
  );
};

// ============================================================================
// Dialog.Description - Accessible description
// Extends TextProps to allow all Text default props
// ============================================================================

interface DialogDescriptionProps extends Omit<TextProps, 'children'> {
  children: ReactNode;
  /**
   * @deprecated Use 'asChild' directly on the component if needed
   */
  style?: TextProps['style'];
}

export const DialogDescription = ({
  children,
  style = {},
  size = 2,
  weight,
  align,
  color,
  truncate,
  numberOfLines,
  fontFamily,
  fontStyle,
  lineHeight,
  letterSpacing,
  textDecorationLine,
  opacity,
  asChild = false,
  ...rest
}: DialogDescriptionProps) => {
  const { colors } = useDialog();
  const theme = useTheme();
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const dialogColors = isDark ? theme.colors.gray.dark : theme.colors.gray;

  return (
    <Text
      asChild={asChild}
      size={size}
      weight={weight}
      align={align}
      color={color || dialogColors[11]}
      truncate={truncate}
      numberOfLines={numberOfLines}
      fontFamily={fontFamily}
      fontStyle={fontStyle}
      lineHeight={lineHeight || theme.typography.fontSizes[2].lineHeight}
      letterSpacing={letterSpacing}
      textDecorationLine={textDecorationLine}
      opacity={opacity}
      style={[{ marginVertical: theme.space[2] }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// Dialog.Close - Button to close the dialog
// ============================================================================

interface DialogCloseProps extends Omit<ButtonProps, 'children'> {
  children?: ReactNode;
  asChild?: boolean;
}

export const DialogClose = ({
  children,
  asChild = true,
  ...buttonProps
}: DialogCloseProps) => {
  const { onOpenChange } = useDialog();

  const handlePress = () => {
    onOpenChange(false);
  };

  if (asChild && children && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as any).props?.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <Button variant={'soft'} {...buttonProps} onPress={handlePress}>
      {children || 'Close'}
    </Button>
  );
};

// ============================================================================
// Dialog.Action - Action buttons (left/right positioning)
// ============================================================================

interface DialogActionProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  // side?: 'left' | 'right';
  // style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const DialogAction = ({ children, onPress, ...buttonProps }: DialogActionProps) => {
  const theme = useTheme();
  const { onOpenChange } = useDialog();

  const handlePress = () => {
    onPress?.();
    onOpenChange(false);
  };

  return (
    <Button {...buttonProps} onPress={handlePress}>
      {children}
    </Button>
  );
};

// ============================================================================
// Styles - Updated to match radix-ui proper styling
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    position: 'absolute',
    // Flexbox centering with margin: auto - proper radix-ui centering
    alignSelf: 'center',
    margin: 'auto',
    // Scroll container structure
    maxHeight: '90%',
    // Shadow applied dynamically
    elevation: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ============================================================================
// Export all Dialog components
// ============================================================================

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Action: DialogAction,
};

export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogActionProps,
};
