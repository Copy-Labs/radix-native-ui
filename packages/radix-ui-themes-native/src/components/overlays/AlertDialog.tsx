import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  type StyleProp,
  ViewStyle,
  Pressable,
  Dimensions,
  TextStyle,
} from 'react-native';
import { useTheme, useThemeMode } from '../../hooks/useTheme';
import { Text } from '../typography';
import { Heading } from '../../components';
import { Button } from '../../components';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';

// ============================================================================
// AlertDialog Context
// ============================================================================

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  radii: RadiusScale | Record<number, number>;
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
  const colors = useThemeMode() === 'dark' ? theme.colors.gray.dark  : theme.colors.gray;
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
  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

// ============================================================================
// AlertDialog.Content - The actual alert dialog content
// ============================================================================

interface AlertDialogContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AlertDialogContent = ({ children, style }: AlertDialogContentProps) => {
  const { colors, radii } = useAlertDialog();
  const theme = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: colors[1],
          borderRadius: radii[3],
          maxWidth: Math.min(screenWidth - 32, 400),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// AlertDialog.Title - Accessible title for screen readers
// ============================================================================

interface AlertDialogTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

export const AlertDialogTitle = ({ children, style = {} }: AlertDialogTitleProps) => {
  const { colors } = useAlertDialog();
  const theme = useTheme();

  return (
    <Heading size={3} style={[{ color: colors[12], marginBottom: theme.space[2] }, style]}>
      {children}
    </Heading>
  );
};

// ============================================================================
// AlertDialog.Description - Accessible description
// ============================================================================

interface AlertDialogDescriptionProps {
  children: ReactNode;
  style?: TextStyle;
}

export const AlertDialogDescription = ({ children, style = {} }: AlertDialogDescriptionProps) => {
  const { colors } = useAlertDialog();
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: colors[11],
          fontSize: theme.typography.fontSizes[2].fontSize,
          lineHeight: theme.typography.fontSizes[2].lineHeight,
          marginBottom: theme.space[4],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// AlertDialog.Action - Action buttons for the dialog
// ============================================================================

interface AlertDialogActionProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
  color?: 'primary' | 'destructive';
}

export const AlertDialogAction = ({
  children,
  onPress,
  variant = 'outline',
  color = 'primary',
}: AlertDialogActionProps) => {
  const { onOpenChange } = useAlertDialog();
  const { colors } = useAlertDialog();

  const handlePress = () => {
    onPress?.();
    onOpenChange(false);
  };

  const buttonColor = color === 'destructive' ? 'crimson' : undefined;

  return (
    <Button variant={variant} onPress={handlePress} highContrast={color === 'destructive'}>
      {children}
    </Button>
  );
};

// ============================================================================
// AlertDialog.Cancel - Cancel action (exits without action)
// ============================================================================

interface AlertDialogCancelProps {
  children?: ReactNode;
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
}

export const AlertDialogCancel = ({
  children = 'Cancel',
  variant = 'ghost',
}: AlertDialogCancelProps) => {
  const { onOpenChange } = useAlertDialog();

  const handlePress = () => {
    onOpenChange(false);
  };

  return (
    <Button variant={variant} onPress={handlePress}>
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
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
    padding: 20,
    minWidth: 280,
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
