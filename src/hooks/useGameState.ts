import { useReducer, useCallback } from 'react';
import type { GameState, PlayerState } from '../types/game';
import { LIVES } from '../utils/constants';
import {
  spawnCircle,
  updateCirclePositions,
  checkMissedCircles,
  checkHit,
  calculateSpeed,
  calculateSpawnInterval,
} from '../utils/gameLogic';

type GameAction =
  | { type: 'START_GAME'; playerCount: number }
  | { type: 'UPDATE'; deltaTime: number; areaHeight: number }
  | { type: 'SPAWN_CIRCLE'; playerIndex: number }
  | { type: 'HIT'; playerIndex: number; lane: number; hitZoneTop: number; hitZoneBottom: number }
  | { type: 'GAME_OVER'; winner?: number };

function createInitialState(playerCount: number): GameState {
  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      score: 0,
      lives: LIVES,
      circles: [],
    });
  }

  return {
    players,
    speed: 200,
    spawnInterval: 1500,
    gameStartTime: Date.now(),
    isGameOver: false,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return createInitialState(action.playerCount);

    case 'UPDATE': {
      if (state.isGameOver) return state;

      const elapsedSeconds = (Date.now() - state.gameStartTime) / 1000;
      const newSpeed = calculateSpeed(elapsedSeconds);
      const newSpawnInterval = calculateSpawnInterval(elapsedSeconds);

      const newPlayers = state.players.map((player) => {
        const updatedCircles = updateCirclePositions(
          player.circles,
          action.deltaTime,
          newSpeed,
          action.areaHeight
        );

        const { remaining, missed } = checkMissedCircles(
          updatedCircles,
          action.areaHeight
        );

        const newLives = Math.max(0, player.lives - missed);

        return {
          ...player,
          circles: remaining,
          lives: newLives,
        };
      });

      // Check for game over
      const anyPlayerDead = newPlayers.some((p) => p.lives <= 0);
      if (anyPlayerDead) {
        let winner: number | undefined;
        if (newPlayers.length === 2) {
          if (newPlayers[0].lives <= 0 && newPlayers[1].lives > 0) {
            winner = 1;
          } else if (newPlayers[1].lives <= 0 && newPlayers[0].lives > 0) {
            winner = 0;
          } else {
            // Both dead or comparing scores
            winner = newPlayers[0].score >= newPlayers[1].score ? 0 : 1;
          }
        }

        return {
          ...state,
          players: newPlayers,
          speed: newSpeed,
          spawnInterval: newSpawnInterval,
          isGameOver: true,
          winner,
        };
      }

      return {
        ...state,
        players: newPlayers,
        speed: newSpeed,
        spawnInterval: newSpawnInterval,
      };
    }

    case 'SPAWN_CIRCLE': {
      if (state.isGameOver) return state;

      const newCircle = spawnCircle();
      const newPlayers = state.players.map((player, index) => {
        if (index === action.playerIndex) {
          return {
            ...player,
            circles: [...player.circles, newCircle],
          };
        }
        return player;
      });

      return {
        ...state,
        players: newPlayers,
      };
    }

    case 'HIT': {
      if (state.isGameOver) return state;

      const player = state.players[action.playerIndex];
      const { hit, remainingCircles } = checkHit(
        player.circles,
        action.lane,
        action.hitZoneTop,
        action.hitZoneBottom
      );

      if (!hit) return state;

      const newPlayers = state.players.map((p, index) => {
        if (index === action.playerIndex) {
          return {
            ...p,
            score: p.score + 1,
            circles: remainingCircles,
          };
        }
        return p;
      });

      return {
        ...state,
        players: newPlayers,
      };
    }

    case 'GAME_OVER':
      return {
        ...state,
        isGameOver: true,
        winner: action.winner,
      };

    default:
      return state;
  }
}

export function useGameState(playerCount: number) {
  const [state, dispatch] = useReducer(
    gameReducer,
    playerCount,
    createInitialState
  );

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME', playerCount });
  }, [playerCount]);

  const update = useCallback((deltaTime: number, areaHeight: number) => {
    dispatch({ type: 'UPDATE', deltaTime, areaHeight });
  }, []);

  const spawnCircle = useCallback((playerIndex: number) => {
    dispatch({ type: 'SPAWN_CIRCLE', playerIndex });
  }, []);

  const handleHit = useCallback(
    (playerIndex: number, lane: number, hitZoneTop: number, hitZoneBottom: number) => {
      dispatch({ type: 'HIT', playerIndex, lane, hitZoneTop, hitZoneBottom });
    },
    []
  );

  return {
    state,
    startGame,
    update,
    spawnCircle,
    handleHit,
  };
}
