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
import { getGrayAlpha } from '../../theme/color-helpers';
import type { BaseColorScale, ColorScale, RadiusScale } from '../../theme';

// ============================================================================
// Dialog Context
// ============================================================================

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: ColorScale | BaseColorScale;
  grayAlpha: ReturnType<typeof getGrayAlpha>;
  radii: RadiusScale | Record<number, number>;
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
  const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;
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

  // Use alpha black/white for overlay based on theme
  const overlayColor = isDark ? `rgba(0, 0, 0, 0.7)` : `rgba(0, 0, 0, 0.5)`;

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
// Dialog.Content - The actual dialog content
// ============================================================================

interface DialogContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  hideCloseButton?: boolean;
}

export const DialogContent = ({
  children,
  style,
  hideCloseButton = false,
}: DialogContentProps) => {
  const { onOpenChange, colors, grayAlpha, radii } = useDialog();
  const theme = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: grayAlpha['2'],
          borderRadius: radii[3],
          maxWidth: Math.min(screenWidth - 32, 400),
        },
        style,
      ]}
    >
      {children}
      {!hideCloseButton && (
        <Pressable
          onPress={handleClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: grayAlpha['4'],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
        >
          <Text style={{ color: colors[11], fontSize: 16, fontWeight: '600' }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

// ============================================================================
// Dialog.Title - Accessible title for screen readers
// ============================================================================

interface DialogTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

export const DialogTitle = ({ children, style = {} }: DialogTitleProps) => {
  const { colors } = useDialog();
  const theme = useTheme();

  return (
    <Heading size={3} style={[{ color: colors[12], marginBottom: theme.space[2] }, style]}>
      {children}
    </Heading>
  );
};

// ============================================================================
// Dialog.Description - Accessible description
// ============================================================================

interface DialogDescriptionProps {
  children: ReactNode;
  style?: TextStyle;
}

export const DialogDescription = ({ children, style = {} }: DialogDescriptionProps) => {
  const { colors } = useDialog();
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
// Dialog.Close - Button to close the dialog
// ============================================================================

interface DialogCloseProps {
  children?: ReactNode;
  asChild?: boolean;
  variant?: 'classic' | 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 1 | 2 | 3;
}

export const DialogClose = ({
  children,
  asChild = true,
  variant = 'outline',
  size = 2,
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
    <Button variant={variant} size={size} onPress={handlePress}>
      {children || 'Close'}
    </Button>
  );
};

// ============================================================================
// Dialog.Action - Action buttons (left/right positioning)
// ============================================================================

interface DialogActionProps {
  children: ReactNode;
  side?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

export const DialogAction = ({ children, side = 'right', style }: DialogActionProps) => {
  const theme = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: theme?.space[3] }, style]}>
      {children}
    </View>
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
