import { useRef, useState, useCallback } from 'react';
import { View, findNodeHandle, UIManager, Platform } from 'react-native';

export interface AnchorPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseAnchorPositionReturn {
  anchorRef: React.RefObject<View | null>;
  anchorPosition: AnchorPosition;
  measureAnchor: () => void;
}

const defaultPosition: AnchorPosition = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

/**
 * Hook to measure the position of an anchor element in the window.
 * This is used for positioning overlays like Popovers and DropdownMenus
 * relative to their trigger elements.
 */
export function useAnchorPosition(): UseAnchorPositionReturn {
  const anchorRef = useRef<View | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition>(defaultPosition);

  const measureAnchor = useCallback(() => {
    const node = anchorRef.current;
    if (!node) {
      return;
    }

    const handle = findNodeHandle(node);
    if (!handle) {
      return;
    }

    // Use measureInWindow for accurate screen position
    node.measureInWindow((x, y, width, height) => {
      setAnchorPosition({
        x,
        y,
        width,
        height,
      });
    });
  }, []);

  return {
    anchorRef,
    anchorPosition,
    measureAnchor,
  };
}

/**
 * Calculate the position for overlay content based on anchor position,
 * side, alignment, and offsets.
 */
export interface ContentSize {
  width: number;
  height: number;
}

export interface ScreenSize {
  width: number;
  height: number;
}

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface CalculatedPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  actualSide: PopoverSide;
}

export function calculatePopoverPosition(
  anchor: AnchorPosition,
  contentSize: ContentSize,
  screenSize: ScreenSize,
  side: PopoverSide,
  align: PopoverAlign,
  sideOffset: number,
  alignOffset: number,
  avoidCollisions: boolean = true
): CalculatedPosition {
  let actualSide = side;
  const { x: anchorX, y: anchorY, width: anchorWidth, height: anchorHeight } = anchor;
  const { width: contentWidth, height: contentHeight } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenSize;

  // Calculate initial position for each side
  const positions: Record<PopoverSide, { top?: number; left?: number }> = {
    top: {
      top: anchorY - contentHeight - sideOffset,
      left: calculateHorizontalPosition(anchorX, anchorWidth, contentWidth, align, alignOffset),
    },
    bottom: {
      top: anchorY + anchorHeight + sideOffset,
      left: calculateHorizontalPosition(anchorX, anchorWidth, contentWidth, align, alignOffset),
    },
    left: {
      top: calculateVerticalPosition(anchorY, anchorHeight, contentHeight, align, alignOffset),
      left: anchorX - contentWidth - sideOffset,
    },
    right: {
      top: calculateVerticalPosition(anchorY, anchorHeight, contentHeight, align, alignOffset),
      left: anchorX + anchorWidth + sideOffset,
    },
  };

  // Check for collisions and flip if needed
  if (avoidCollisions) {
    const collision = checkCollision(positions[side], contentSize, screenSize);
    if (collision) {
      const oppositeSide = getOppositeSide(side);
      const oppositeCollision = checkCollision(positions[oppositeSide], contentSize, screenSize);

      if (!oppositeCollision) {
        actualSide = oppositeSide;
      }
    }
  }

  const position = positions[actualSide];

  // Clamp to screen bounds
  const clampedPosition = clampToScreen(position, contentSize, screenSize);

  return {
    ...clampedPosition,
    actualSide,
  };
}

function calculateHorizontalPosition(
  anchorX: number,
  anchorWidth: number,
  contentWidth: number,
  align: PopoverAlign,
  alignOffset: number
): number {
  switch (align) {
    case 'start':
      return anchorX + alignOffset;
    case 'center':
      return anchorX + (anchorWidth - contentWidth) / 2 + alignOffset;
    case 'end':
      return anchorX + anchorWidth - contentWidth + alignOffset;
    default:
      return anchorX + alignOffset;
  }
}

function calculateVerticalPosition(
  anchorY: number,
  anchorHeight: number,
  contentHeight: number,
  align: PopoverAlign,
  alignOffset: number
): number {
  switch (align) {
    case 'start':
      return anchorY + alignOffset;
    case 'center':
      return anchorY + (anchorHeight - contentHeight) / 2 + alignOffset;
    case 'end':
      return anchorY + anchorHeight - contentHeight + alignOffset;
    default:
      return anchorY + alignOffset;
  }
}

function checkCollision(
  position: { top?: number; left?: number },
  contentSize: ContentSize,
  screenSize: ScreenSize
): boolean {
  const { top = 0, left = 0 } = position;
  const { width, height } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenSize;

  // Check if content would overflow any edge
  const overflowsTop = top < 0;
  const overflowsBottom = top + height > screenHeight;
  const overflowsLeft = left < 0;
  const overflowsRight = left + width > screenWidth;

  return overflowsTop || overflowsBottom || overflowsLeft || overflowsRight;
}

function getOppositeSide(side: PopoverSide): PopoverSide {
  const opposites: Record<PopoverSide, PopoverSide> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return opposites[side];
}

function clampToScreen(
  position: { top?: number; left?: number },
  contentSize: ContentSize,
  screenSize: ScreenSize
): { top?: number; left?: number } {
  const { top = 0, left = 0 } = position;
  const { width, height } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenSize;

  // Add small padding from screen edges
  const padding = 8;

  let clampedTop = top;
  let clampedLeft = left;

  // Clamp top
  if (clampedTop < padding) {
    clampedTop = padding;
  } else if (clampedTop + height > screenHeight - padding) {
    clampedTop = Math.max(padding, screenHeight - height - padding);
  }

  // Clamp left
  if (clampedLeft < padding) {
    clampedLeft = padding;
  } else if (clampedLeft + width > screenWidth - padding) {
    clampedLeft = Math.max(padding, screenWidth - width - padding);
  }

  return {
    top: clampedTop,
    left: clampedLeft,
  };
}

// ============================================================================
// ContextMenu Position Calculation
// ============================================================================

/**
 * Side preference for context menu positioning
 * - 'bottom': Menu appears below the touch point (default)
 * - 'top': Menu appears above the touch point
 */
export type ContextMenuSide = 'top' | 'bottom';

/**
 * Horizontal alignment for context menu relative to touch point
 * - 'start': Menu left edge aligns with touch point
 * - 'center': Menu center aligns with touch point
 * - 'end': Menu right edge aligns with touch point
 */
export type ContextMenuAlign = 'start' | 'center' | 'end';

/**
 * Result of context menu position calculation
 */
export interface ContextMenuPosition {
  top: number;
  left: number;
  actualSide: ContextMenuSide;
}

/**
 * Calculate the position for a context menu based on touch point.
 * Handles collision detection and automatic flipping.
 *
 * @param touchPoint - The x, y coordinates of the touch/long-press
 * @param contentSize - Width and height of the menu content
 * @param screenSize - Width and height of the screen
 * @param side - Preferred side ('top' or 'bottom')
 * @param align - Horizontal alignment relative to touch point
 * @param sideOffset - Distance from touch point to menu
 * @param alignOffset - Horizontal offset from aligned position
 * @param avoidCollisions - Whether to flip when colliding with screen edges
 */
export function calculateContextMenuPosition(
  touchPoint: { x: number; y: number },
  contentSize: ContentSize,
  screenSize: ScreenSize,
  side: ContextMenuSide = 'bottom',
  align: ContextMenuAlign = 'start',
  sideOffset: number = 4,
  alignOffset: number = 0,
  avoidCollisions: boolean = true
): ContextMenuPosition {
  const { x, y } = touchPoint;
  const { width: contentWidth, height: contentHeight } = contentSize;
  const { width: screenWidth, height: screenHeight } = screenSize;

  // Calculate horizontal position based on alignment
  let left: number;
  switch (align) {
    case 'start':
      left = x + alignOffset;
      break;
    case 'center':
      left = x - contentWidth / 2 + alignOffset;
      break;
    case 'end':
      left = x - contentWidth + alignOffset;
      break;
    default:
      left = x + alignOffset;
  }

  // Calculate vertical position based on side
  let top: number;
  if (side === 'bottom') {
    top = y + sideOffset;
  } else {
    top = y - contentHeight - sideOffset;
  }

  // Check for collisions and flip if needed
  let actualSide = side;
  if (avoidCollisions) {
    const wouldOverflowBottom = top + contentHeight > screenHeight;
    const wouldOverflowTop = top < 0;

    if (side === 'bottom' && wouldOverflowBottom) {
      // Flip to top if there's room
      const topPosition = y - contentHeight - sideOffset;
      if (topPosition >= 0) {
        actualSide = 'top';
        top = topPosition;
      }
    } else if (side === 'top' && wouldOverflowTop) {
      // Flip to bottom if there's room
      const bottomPosition = y + sideOffset;
      if (bottomPosition + contentHeight <= screenHeight) {
        actualSide = 'bottom';
        top = bottomPosition;
      }
    }
  }

  // Clamp to screen bounds with padding
  const padding = 8;

  // Clamp left position
  if (left < padding) {
    left = padding;
  } else if (left + contentWidth > screenWidth - padding) {
    left = Math.max(padding, screenWidth - contentWidth - padding);
  }

  // Clamp top position
  if (top < padding) {
    top = padding;
  } else if (top + contentHeight > screenHeight - padding) {
    top = Math.max(padding, screenHeight - contentHeight - padding);
  }

  return {
    top,
    left,
    actualSide,
  };
}
