import { GameArea } from '../game/GameArea';
import { TwoPlayerGameArea } from '../game/TwoPlayerGameArea';

interface GameScreenProps {
  playerCount: 1 | 2;
  onGameOver: (scores: number[], winner?: number) => void;
}

export function GameScreen({ playerCount, onGameOver }: GameScreenProps) {
  if (playerCount === 1) {
    return <GameArea onGameOver={(score) => onGameOver([score])} />;
  }

  return <TwoPlayerGameArea onGameOver={onGameOver} />;
}
