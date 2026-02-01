import { useEffect, useRef, useCallback, useState } from 'react';
import { FallingCircle } from './FallingCircle';
import { Lane } from './Lane';
import { LivesDisplay } from './LivesDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useGameState } from '../../hooks/useGameState';
import { LANE_POSITIONS, HIT_ZONE_HEIGHT, CIRCLE_SIZE } from '../../utils/constants';
import styles from './TwoPlayerGameArea.module.css';

interface TwoPlayerGameAreaProps {
  onGameOver: (scores: number[], winner: number) => void;
}

export function TwoPlayerGameArea({ onGameOver }: TwoPlayerGameAreaProps) {
  const player1Ref = useRef<HTMLDivElement>(null);
  const player2Ref = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef<{ [key: number]: number }>({ 0: Date.now(), 1: Date.now() });
  const [areaHeight, setAreaHeight] = useState(0);

  const { state, startGame, update, spawnCircle, handleHit } = useGameState(2);

  // Measure container height (half of screen for each player)
  useEffect(() => {
    const updateHeight = () => {
      if (player1Ref.current) {
        setAreaHeight(player1Ref.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
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

  // Handle tap for a specific player
  const handlePlayerTap = useCallback(
    (playerIndex: number, clientX: number, containerRect: DOMRect) => {
      if (state.isGameOver || areaHeight === 0) return;

      const relativeX = (clientX - containerRect.left) / containerRect.width;
      const lane = relativeX < 0.5 ? 0 : 1;

      const hitZoneTop = areaHeight - HIT_ZONE_HEIGHT - CIRCLE_SIZE;
      const hitZoneBottom = areaHeight;

      handleHit(playerIndex, lane, hitZoneTop, hitZoneBottom);
    },
    [state.isGameOver, areaHeight, handleHit]
  );

  // Touch handlers
  const handleTouchStart1 = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!player1Ref.current) return;
      const rect = player1Ref.current.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          handlePlayerTap(0, touch.clientX, rect);
        }
      }
    },
    [handlePlayerTap]
  );

  const handleTouchStart2 = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!player2Ref.current) return;
      const rect = player2Ref.current.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          handlePlayerTap(1, touch.clientX, rect);
        }
      }
    },
    [handlePlayerTap]
  );

  const handleMouseDown1 = useCallback(
    (e: React.MouseEvent) => {
      if (!player1Ref.current) return;
      handlePlayerTap(0, e.clientX, player1Ref.current.getBoundingClientRect());
    },
    [handlePlayerTap]
  );

  const handleMouseDown2 = useCallback(
    (e: React.MouseEvent) => {
      if (!player2Ref.current) return;
      handlePlayerTap(1, e.clientX, player2Ref.current.getBoundingClientRect());
    },
    [handlePlayerTap]
  );

  return (
    <div className={styles.container}>
      {/* Player 2 area (top, rotated 180°) */}
      <div
        ref={player2Ref}
        className={`${styles.playerArea} ${styles.player2}`}
        onTouchStart={handleTouchStart2}
        onMouseDown={handleMouseDown2}
      >
        {/* Lane guides */}
        {LANE_POSITIONS.map((pos, i) => (
          <Lane key={i} position={pos} />
        ))}

        {/* Hit zone indicator */}
        <div className={styles.hitZone} style={{ height: HIT_ZONE_HEIGHT }} />

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
        onTouchStart={handleTouchStart1}
        onMouseDown={handleMouseDown1}
      >
        {/* Lane guides */}
        {LANE_POSITIONS.map((pos, i) => (
          <Lane key={i} position={pos} />
        ))}

        {/* Hit zone indicator */}
        <div className={styles.hitZone} style={{ height: HIT_ZONE_HEIGHT }} />

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
