import { useEffect, useRef, useCallback } from 'react';

type GameLoopCallback = (deltaTime: number) => void;

export function useGameLoop(callback: GameLoopCallback, isRunning: boolean) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const callbackRef = useRef<GameLoopCallback>(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}
