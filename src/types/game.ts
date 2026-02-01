export interface Circle {
  id: string;
  lane: number; // 0 = left, 1 = right
  y: number; // percentage from spawn point (0 = spawn, 100 = target)
  createdAt: number;
}

export interface PlayerState {
  score: number;
  lives: number;
  circles: Circle[];
}

export interface GameState {
  players: PlayerState[];
  speed: number; // pixels per second
  spawnInterval: number; // ms between spawns
  gameStartTime: number;
  isGameOver: boolean;
  winner?: number; // for 2-player mode
}

export type Screen =
  | 'welcome'
  | 'playerSelect'
  | 'countdown'
  | 'game'
  | 'gameOver';

export interface AppState {
  currentScreen: Screen;
  playerCount: 1 | 2;
  finalScores: number[];
  winner?: number;
}
