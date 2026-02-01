import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className={styles.container}>
      <span className={styles.score}>{score}</span>
    </div>
  );
}
