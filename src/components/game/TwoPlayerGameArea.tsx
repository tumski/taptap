import { useEffect, useRef, useCallback, useState } from 'react';
import { FallingCircle } from './FallingCircle';
import { Lane } from './Lane';
import { LivesDisplay } from './LivesDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useGameState } from '../../hooks/useGameState';
import { LANE_POSITIONS } from '../../utils/constants';
import styles from './TwoPlayerGameArea.module.css';

interface TwoPlayerGameAreaProps {
  onGameOver: (scores: number[], winner: number) => void;
}

export function TwoPlayerGameArea({ onGameOver }: TwoPlayerGameAreaProps) {
  const player1Ref = useRef<HTMLDivElement>(null);
  const player2Ref = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef<{ [key: number]: number }>({ 0: Date.now(), 1: Date.now() });
  const [areaHeight, setAreaHeight] = useState(0);
  const [areaWidth, setAreaWidth] = useState(0);

  const { state, startGame, update, spawnCircle, handleHit } = useGameState(2);

  // Measure container dimensions (half of screen for each player)
  useEffect(() => {
    const updateDimensions = () => {
      if (player1Ref.current) {
        setAreaHeight(player1Ref.current.clientHeight);
        setAreaWidth(player1Ref.current.clientWidth);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
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

      // Spawn circles for both players
      const now = Date.now();
      for (let i = 0; i < 2; i++) {
        if (now - lastSpawnRef.current[i] > state.spawnInterval) {
          spawnCircle(i);
          lastSpawnRef.current[i] = now;
        }
      }
    },
    [state.isGameOver, state.spawnInterval, areaHeight, update, spawnCircle]
  );

  useGameLoop(gameLoop, !state.isGameOver && areaHeight > 0);

  // Handle game over
  useEffect(() => {
    if (state.isGameOver && state.winner !== undefined) {
      onGameOver(
        state.players.map((p) => p.score),
        state.winner
      );
    }
  }, [state.isGameOver, state.players, state.winner, onGameOver]);

  // Store latest handler logic in refs (always up-to-date, avoids stale closures)
  const handleTapRef1 = useRef<(tapX: number, tapY: number) => void>(() => {});
  const handleTapRef2 = useRef<(tapX: number, tapY: number) => void>(() => {});

  handleTapRef1.current = (tapX: number, tapY: number) => {
    if (state.isGameOver || areaHeight === 0 || areaWidth === 0) return;
    handleHit(0, tapX, tapY, areaWidth, areaHeight);
  };

  handleTapRef2.current = (tapX: number, tapY: number) => {
    if (state.isGameOver || areaHeight === 0 || areaWidth === 0) return;
    handleHit(1, tapX, tapY, areaWidth, areaHeight);
  };

  // Stable event handlers (never change, avoids re-attachment issues)
  const onPointerDown1 = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;
    handleTapRef1.current(tapX, tapY);
  }, []);

  const onPointerDown2 = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    // Player 2's area is rotated 180°, so we need to invert the coordinates
    const tapX = rect.width - (e.clientX - rect.left);
    const tapY = rect.height - (e.clientY - rect.top);
    handleTapRef2.current(tapX, tapY);
  }, []);

  return (
    <div className={styles.container}>
      {/* Player 2 area (top, rotated 180°) */}
      <div
        ref={player2Ref}
        className={`${styles.playerArea} ${styles.player2}`}
        onPointerDown={onPointerDown2}
      >
        {/* Lane guides */}
        {LANE_POSITIONS.map((pos, i) => (
          <Lane key={i} position={pos} />
        ))}

        {/* Falling circles */}
        {state.players[1].circles.map((circle) => (
          <FallingCircle key={circle.id} y={circle.y} lane={circle.lane} />
        ))}

        {/* HUD */}
        <div className={styles.hud}>
          <LivesDisplay lives={state.players[1].lives} />
          <ScoreDisplay score={state.players[1].score} />
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Player 1 area (bottom) */}
      <div
        ref={player1Ref}
        className={`${styles.playerArea} ${styles.player1}`}
        onPointerDown={onPointerDown1}
      >
        {/* Lane guides */}
        {LANE_POSITIONS.map((pos, i) => (
          <Lane key={i} position={pos} />
        ))}

        {/* Falling circles */}
        {state.players[0].circles.map((circle) => (
          <FallingCircle key={circle.id} y={circle.y} lane={circle.lane} />
        ))}

        {/* HUD */}
        <div className={styles.hud}>
          <LivesDisplay lives={state.players[0].lives} />
          <ScoreDisplay score={state.players[0].score} />
        </div>
      </div>
    </div>
  );
}
