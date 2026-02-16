// ============================================================================
// Overlay Components - Radix Themes for React Native
// ============================================================================
//
// This module exports all overlay components including:
// - Dialog: Modal dialogs with accessible patterns
// - AlertDialog: Confirmation dialogs
// - Portal: Render content at root level
// - Popover: Anchored overlay with arrow
// - Tooltip: Helpful hint overlays
// - DropdownMenu: Dropdown menu with keyboard navigation
// - ContextMenu: Long-press context menus
// ============================================================================

// Dialog
export { Dialog } from './Dialog';
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
} from './Dialog';

// AlertDialog
export { AlertDialogComponent as AlertDialog } from './AlertDialog';
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
} from './AlertDialog';

// Portal
export { Portal, PortalProvider, ManagedPortal, usePortal } from './Portal';
export type {
  PortalProps,
  PortalHostProps,
  ManagedPortalProps,
} from './Portal';

// Popover
export { Popover } from './Popover';
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverOverlayProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverCloseProps,
} from './Popover';

// Tooltip
export { Tooltip } from './Tooltip';
export type {
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipContentProps,
  TooltipArrowProps,
  SimpleTooltipProps,
  TooltipSide,
  TooltipAlign,
} from './Tooltip';

// DropdownMenu
export { DropdownMenu } from './DropdownMenu';
export type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuPortalProps,
  DropdownMenuOverlayProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
} from './DropdownMenu';

// ContextMenu
export { ContextMenu } from './ContextMenu';
export type {
  ContextMenuProviderProps,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuOverlayProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
} from './ContextMenu';
