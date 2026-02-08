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
import type { BaseColorScale, Color, ColorScale, RadiusScale, SpaceScale } from '../../theme';
import { getShadow } from '../../theme/shadows';
import type { HeadingProps } from '../typography/Heading';
import type { TextProps } from '../typography/Text';

// ============================================================================
// AlertDialog Context
// ============================================================================

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialog.Root');
  }
  return context;
};

// ============================================================================
// AlertDialog.Root - Main component that manages state
// ============================================================================

interface AlertDialogRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AlertDialogRoot = ({
  children,
  open: controlledOpen,
  onOpenChange,
}: AlertDialogRootProps) => {
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
  const radii = theme.radii;

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange, colors, radii }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

// ============================================================================
// AlertDialog.Trigger - The button that opens the alert dialog
// ============================================================================

interface AlertDialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const AlertDialogTrigger = ({ children, asChild = true }: AlertDialogTriggerProps) => {
  const { onOpenChange } = useAlertDialog();

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
// AlertDialog.Portal - Renders content at root level using Modal
// ============================================================================

interface AlertDialogPortalProps {
  children: ReactNode;
  hostId?: string;
}

export const AlertDialogPortal = ({ children, hostId }: AlertDialogPortalProps) => {
  const { open } = useAlertDialog();

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
// AlertDialog.Overlay - The backdrop that dims the background
// ============================================================================

interface AlertDialogOverlayProps {
  style?: StyleProp<ViewStyle>;
}

export const AlertDialogOverlay = ({ style }: AlertDialogOverlayProps) => {
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
// AlertDialog.Content - The actual alert dialog content
// ============================================================================

interface AlertDialogContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
  size?: 1 | 2 | 3 | 4;
}

export const AlertDialogContent = ({
  children,
  style,
  hideCloseButton = true,
  size = 2,
}: AlertDialogContentProps) => {
  const { onOpenChange, radii } = useAlertDialog();
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

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: isDark ? theme.colors.gray.dark[2] : theme.colors.gray[1],
          // borderRadius: radii.medium,
          borderRadius: sizeStyles.radius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          minWidth: Math.min(screenWidth - 128, 400),
          maxWidth: Math.min(screenWidth - 64, 400),
          top: screenHeight / 2 - 100, // Approximate vertical centering
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
};;

// ============================================================================
// AlertDialog.Title - Accessible title for screen readers
// Extends HeadingProps to allow all Heading default props
// ============================================================================

interface AlertDialogTitleProps extends Omit<HeadingProps, 'children'> {
  children: ReactNode;
  /**
   * @deprecated Use 'asChild' directly on the component if needed
   */
  style?: HeadingProps['style'];
}

export const AlertDialogTitle = ({
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
}: AlertDialogTitleProps) => {
  const { colors } = useAlertDialog();
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
// AlertDialog.Description - Accessible description
// Extends TextProps to allow all Text default props
// ============================================================================

interface AlertDialogDescriptionProps extends Omit<TextProps, 'children'> {
  children: ReactNode;
  /**
   * @deprecated Use 'asChild' directly on the component if needed
   */
  style?: TextProps['style'];
}

export const AlertDialogDescription = ({
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
}: AlertDialogDescriptionProps) => {
  const { colors } = useAlertDialog();
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
// AlertDialog.Action - Action buttons for the dialog
// ============================================================================

interface AlertDialogActionProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
  onPress?: () => void;
}

export const AlertDialogAction = ({
  children,
  onPress,
  ...buttonProps  // Pass remaining props to Button
}: AlertDialogActionProps) => {
  const { onOpenChange } = useAlertDialog();

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
// AlertDialog.Cancel - Cancel action (exits without action)
// ============================================================================

interface AlertDialogCancelProps extends Omit<ButtonProps, 'children'> {
  children?: ReactNode;
}

export const AlertDialogCancel = ({
  children = 'Cancel',
  ...buttonProps
}: AlertDialogCancelProps) => {
  const { onOpenChange } = useAlertDialog();

  const handlePress = () => {
    onOpenChange(false);
  };

  return (
    <Button variant={'soft'} {...buttonProps} onPress={handlePress}>
      {children}
    </Button>
  );
};

// ============================================================================
// AlertDialog - Convenience component for common alert patterns
// ============================================================================

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  cancel?: {
    label?: string;
    onPress?: () => void;
  };
  action?: {
    label: string;
    onPress: () => void;
    variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
    color?: 'primary' | 'destructive';
  };
  children?: ReactNode;
}

// Convenience component that wraps the AlertDialog pattern
export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  cancel,
  action,
  children,
}: AlertDialogProps) => {
  const theme = useTheme();

  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {children}
          <View style={styles.actionRow}>
            {cancel && (
              <AlertDialogCancel variant="ghost">
                {cancel.label || 'Cancel'}
              </AlertDialogCancel>
            )}
            {action && (
              <AlertDialogAction
                variant={action.variant || 'solid'}
                color={action.color || 'primary'}
                onPress={action.onPress}
              >
                {action.label}
              </AlertDialogAction>
            )}
          </View>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
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
    // alignItems: 'center',
    // Flexbox centering with margin: auto - proper radix-ui centering
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 'auto',
    // Scroll container structure
    maxHeight: '90%',
    // Padding for alert dialog content
    padding: 20,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
});

// ============================================================================
// Export all AlertDialog components
// ============================================================================

export const AlertDialogComponent = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  AlertDialog: AlertDialog,
};

export type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogProps,
};

// For backward compatibility
const AlertDialogExport = AlertDialogComponent;
export default AlertDialogExport;
