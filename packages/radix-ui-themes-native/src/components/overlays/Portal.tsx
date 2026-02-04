import React, { useContext, useEffect, useState, type ReactNode, useRef } from 'react';
import { Modal, View, findNodeHandle, type HostComponent, AccessibilityRole } from 'react-native';
import type { ViewProps } from '../primitives';

// ============================================================================
// Portal Component
//
// Renders children into a Modal at the root level of the application.
// This ensures proper z-index management and positioning for overlays.
// ============================================================================

interface PortalProps {
  /**
   * Children to render in the portal
   */
  children: ReactNode;
  /**
   * Optional host component ref to attach portal to
   */
  hostId?: string | null;
  /**
   * Whether the portal is visible
   * @default true
   */
  visible?: boolean;
  /**
   * Animation type for the modal
   * @default 'fade'
   */
  animationType?: 'none' | 'fade' | 'slide';
  /**
   * Callback when the modal requests to close
   */
  onRequestClose?: () => void;
  /**
   * Supported device orientations
   */
  supportedOrientations?: Array<'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right'>;
  /**
   * Whether the modal is transparent
   * @default false
   */
  transparent?: boolean;
  /**
   * Accessibility label for the portal/modal
   */
  accessibilityLabel?: string;
  /**
   * Accessibility role
   * @default 'dialog'
   */
  accessibilityRole?: AccessibilityRole;
  /**
   * Style prop for the container
   */
  style?: any;
}

export const Portal = ({
  children,
  hostId,
  visible = true,
  animationType = 'fade',
  onRequestClose,
  supportedOrientations = ['portrait', 'landscape'],
  transparent = false,
  accessibilityLabel = 'Portal',
  style,
}: PortalProps) => {
  // For React Native, we use Modal as the portal container
  // The Modal component renders children at the root level

  return (
    <Modal
      transparent={transparent}
      visible={visible}
      animationType={animationType}
      supportedOrientations={supportedOrientations}
      onRequestClose={onRequestClose}
      accessibilityLabel={accessibilityLabel}
      statusBarTranslucent={true}
    >
      {children}
    </Modal>
  );
};

// ============================================================================
// Portal.Host - Manages multiple portals
// ============================================================================

interface PortalHostState {
  portals: Array<{
    id: string;
    children: ReactNode;
    animationType?: 'none' | 'fade' | 'slide';
    onRequestClose?: () => void;
    visible?: boolean;
  }>;
}

interface PortalHostProps {
  children: ReactNode;
}

// Simple portal host context
const PortalHostContext = React.createContext<{
  addPortal: (id: string, children: ReactNode) => void;
  removePortal: (id: string) => void;
  updatePortal: (id: string, children: ReactNode) => void;
} | null>(null);

export const PortalProvider = ({ children }: PortalHostProps) => {
  const [portals, setPortals] = useState<PortalHostState['portals']>([]);

  const addPortal = (id: string, children: ReactNode) => {
    setPortals((prev) => [...prev, { id, children, animationType: 'fade', visible: true }]);
  };

  const removePortal = (id: string) => {
    setPortals((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePortal = (id: string, children: ReactNode) => {
    setPortals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, children } : p))
    );
  };

  return (
    <PortalHostContext.Provider value={{ addPortal, removePortal, updatePortal }}>
      {children}
      {/* Render all active portals */}
      {portals.map((portal) => (
        <Portal
          key={portal.id}
          visible={portal.visible}
          animationType={portal.animationType}
          onRequestClose={portal.onRequestClose}
        >
          {portal.children}
        </Portal>
      ))}
    </PortalHostContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalHostContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

// ============================================================================
// Portal.FlatList - Portal version for FlatList
// ============================================================================

export interface PortalFlatListProps<T> extends Omit<ViewProps, 'data' | 'renderItem'> {
  data: T[];
  renderItem: (item: { item: T; index: number }) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  portalKey: string;
}

export function PortalFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  portalKey,
  style,
  ...props
}: PortalFlatListProps<T>) {
  const { addPortal, removePortal } = usePortal();

  useEffect(() => {
    const items = data.map((item, index) => ({
      key: keyExtractor(item, index),
      element: renderItem({ item, index }),
    }));

    addPortal(
      portalKey,
      <View style={[{ flex: 1 }, style]} {...props}>
        {items.map((item) => item.element)}
      </View>
    );

    return () => {
      removePortal(portalKey);
    };
  }, [data, portalKey, keyExtractor, renderItem, addPortal, removePortal, style, props]);

  return null;
}

// ============================================================================
// Portal with Context - Managed portal that auto-cleanup
// ============================================================================

interface ManagedPortalProps {
  children: ReactNode;
  name: string;
  visible?: boolean;
  animationType?: 'none' | 'fade' | 'slide';
}

export const ManagedPortal = ({
  children,
  name,
  visible = true,
  animationType = 'fade',
}: ManagedPortalProps) => {
  const { addPortal, removePortal } = usePortal();

  useEffect(() => {
    if (visible) {
      addPortal(name, children);
    }
    return () => {
      removePortal(name);
    };
  }, [name, visible, children, addPortal, removePortal]);

  return null;
};

export type {
  PortalProps,
  PortalHostProps,
  ManagedPortalProps,
};

export default Portal;
