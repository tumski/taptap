import { useEffect, useRef, useCallback, useState } from 'react';
import { FallingCircle } from './FallingCircle';
import { Lane } from './Lane';
import { LivesDisplay } from './LivesDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useGameState } from '../../hooks/useGameState';
import { useTouchHandler } from '../../hooks/useTouchHandler';
import { LANE_POSITIONS, HIT_ZONE_HEIGHT, CIRCLE_SIZE } from '../../utils/constants';
import styles from './GameArea.module.css';

interface GameAreaProps {
  onGameOver: (score: number) => void;
}

export function GameArea({ onGameOver }: GameAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef<number>(Date.now());
  const [areaHeight, setAreaHeight] = useState(0);
  const [tapFeedback, setTapFeedback] = useState<{ x: number; y: number; id: number } | null>(null);
  const tapIdRef = useRef(0);

  const { state, startGame, update, spawnCircle, handleHit } = useGameState(1);

  // Measure container height
  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        setAreaHeight(containerRef.current?.clientHeight || 0);
      };
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
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

  // Handle lane tap
  const onLaneTap = useCallback(
    (lane: number) => {
      if (state.isGameOver || areaHeight === 0) return;

      const hitZoneTop = areaHeight - HIT_ZONE_HEIGHT - CIRCLE_SIZE;
      const hitZoneBottom = areaHeight;

      handleHit(0, lane, hitZoneTop, hitZoneBottom);

      // Show tap feedback
      const x = LANE_POSITIONS[lane] * 100;
      const id = ++tapIdRef.current;
      setTapFeedback({ x, y: areaHeight - HIT_ZONE_HEIGHT / 2, id });
      setTimeout(() => {
        setTapFeedback((prev) => (prev?.id === id ? null : prev));
      }, 200);
    },
    [state.isGameOver, areaHeight, handleHit]
  );

  const { handlers } = useTouchHandler({ onLaneTap });

  const player = state.players[0];

  return (
    <div
      ref={containerRef}
      className={styles.container}
      {...handlers}
    >
      {/* Lane guides */}
      {LANE_POSITIONS.map((pos, i) => (
        <Lane key={i} position={pos} />
      ))}

      {/* Hit zone indicator */}
      <div
        className={styles.hitZone}
        style={{ height: HIT_ZONE_HEIGHT }}
      />

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
