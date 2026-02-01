import { useCallback, useRef } from 'react';

interface TouchHandlerOptions {
  onLaneTap: (lane: number) => void;
}

export function useTouchHandler({ onLaneTap }: TouchHandlerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (clientX - rect.left) / rect.width;

      // Determine which lane was tapped
      // Lane 0 is left (0-50%), Lane 1 is right (50-100%)
      const lane = relativeX < 0.5 ? 0 : 1;
      onLaneTap(lane);
    },
    [onLaneTap]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        handleInteraction(e.touches[i].clientX);
      }
    },
    [handleInteraction]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleInteraction(e.clientX);
    },
    [handleInteraction]
  );

  return {
    containerRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onMouseDown: handleMouseDown,
    },
  };
}
