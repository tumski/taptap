import { Home, RotateCcw } from 'lucide-react';
import styles from './GameOverScreen.module.css';

interface GameOverScreenProps {
  scores: number[];
  winner?: number;
  playerCount: 1 | 2;
  onHome: () => void;
  onRestart: () => void;
}

export function GameOverScreen({
  scores,
  winner,
  playerCount,
  onHome,
  onRestart,
}: GameOverScreenProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Koniec gry!</h1>

      {playerCount === 1 ? (
        <div className={styles.scoreSection}>
          <span className={styles.scoreLabel}>Wynik</span>
          <span className={styles.score}>{scores[0]}</span>
        </div>
      ) : (
        <div className={styles.twoPlayerScores}>
          <div className={`${styles.playerScore} ${winner === 0 ? styles.winner : ''}`}>
            <span className={styles.playerLabel}>Gracz 1</span>
            <span className={styles.score}>{scores[0]}</span>
            {winner === 0 && <span className={styles.winnerBadge}>Wygrana!</span>}
          </div>
          <div className={`${styles.playerScore} ${winner === 1 ? styles.winner : ''}`}>
            <span className={styles.playerLabel}>Gracz 2</span>
            <span className={styles.score}>{scores[1]}</span>
            {winner === 1 && <span className={styles.winnerBadge}>Wygrana!</span>}
          </div>
        </div>
      )}

      <div className={styles.buttons}>
        <button className={styles.iconButton} onClick={onHome}>
          <Home size={32} />
        </button>
        <button className={styles.iconButton} onClick={onRestart}>
          <RotateCcw size={32} />
        </button>
      </div>
    </div>
  );
}
