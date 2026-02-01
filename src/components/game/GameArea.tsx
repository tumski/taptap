import { useEffect, useRef, useCallback, useState } from 'react';
import { FallingCircle } from './FallingCircle';
import { Lane } from './Lane';
import { LivesDisplay } from './LivesDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useGameState } from '../../hooks/useGameState';
import { LANE_POSITIONS } from '../../utils/constants';
import styles from './GameArea.module.css';

interface GameAreaProps {
  onGameOver: (score: number) => void;
}

export function GameArea({ onGameOver }: GameAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef<number>(Date.now());
  const [areaHeight, setAreaHeight] = useState(0);
  const [areaWidth, setAreaWidth] = useState(0);
  const [tapFeedback, setTapFeedback] = useState<{ x: number; y: number; id: number } | null>(null);
  const tapIdRef = useRef(0);

  const { state, startGame, update, spawnCircle, handleHit } = useGameState(1);

  // Measure container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setAreaHeight(containerRef.current?.clientHeight || 0);
        setAreaWidth(containerRef.current?.clientWidth || 0);
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Start game on mount
  useEffect(() => {
    startGame();
  }, [startGame]);

  // Game loop
  const gameLoop = useCallback(
    (deltaTime: number) => {
      if (state.isGameOver || areaHeight === 0) return;

      update(deltaTime, areaHeight);

      // Check if we need to spawn a new circle
      const now = Date.now();
      if (now - lastSpawnRef.current > state.spawnInterval) {
        spawnCircle(0);
        lastSpawnRef.current = now;
      }
    },
    [state.isGameOver, state.spawnInterval, areaHeight, update, spawnCircle]
  );

  useGameLoop(gameLoop, !state.isGameOver && areaHeight > 0);

  // Handle game over
  useEffect(() => {
    if (state.isGameOver) {
      onGameOver(state.players[0].score);
    }
  }, [state.isGameOver, state.players, onGameOver]);

  // Store latest handler logic in a ref (always up-to-date, avoids stale closures)
  const handleTapRef = useRef<(tapX: number, tapY: number) => void>(() => {});
  handleTapRef.current = (tapX: number, tapY: number) => {
    if (state.isGameOver || areaHeight === 0 || areaWidth === 0) return;

    // Pass actual tap coordinates for precise hit detection
    handleHit(0, tapX, tapY, areaWidth, areaHeight);

    // Show tap feedback at tap location
    const xPercent = (tapX / areaWidth) * 100;
    const id = ++tapIdRef.current;
    setTapFeedback({ x: xPercent, y: tapY, id });
    setTimeout(() => {
      setTapFeedback((prev) => (prev?.id === id ? null : prev));
    }, 200);
  };

  // Stable event handler (never changes, avoids re-attachment issues)
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;
    handleTapRef.current(tapX, tapY);
  }, []);

  const player = state.players[0];

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerDown={onPointerDown}
    >
      {/* Lane guides */}
      {LANE_POSITIONS.map((pos, i) => (
        <Lane key={i} position={pos} />
      ))}

      {/* Falling circles */}
      {player.circles.map((circle) => (
        <FallingCircle key={circle.id} y={circle.y} lane={circle.lane} />
      ))}

      {/* Tap feedback */}
      {tapFeedback && (
        <div
          className={styles.tapFeedback}
          style={{
            left: `${tapFeedback.x}%`,
            top: tapFeedback.y,
          }}
        />
      )}

      {/* HUD */}
      <div className={styles.hud}>
        <LivesDisplay lives={player.lives} />
        <ScoreDisplay score={player.score} />
      </div>
    </div>
  );
}
