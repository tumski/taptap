import { useCallback } from 'react';

interface TouchHandlerOptions {
  onLaneTap: (lane: number) => void;
}

export function useTouchHandler({ onLaneTap }: TouchHandlerOptions) {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const relativeX = (touch.clientX - rect.left) / rect.width;
        const lane = relativeX < 0.5 ? 0 : 1;
        onLaneTap(lane);
      }
    },
    [onLaneTap]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      const lane = relativeX < 0.5 ? 0 : 1;
      onLaneTap(lane);
    },
    [onLaneTap]
  );

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onMouseDown: handleMouseDown,
    },
  };
}
