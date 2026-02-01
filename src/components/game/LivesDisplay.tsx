import styles from './LivesDisplay.module.css';
import { LIVES } from '../../utils/constants';

interface LivesDisplayProps {
  lives: number;
}

export function LivesDisplay({ lives }: LivesDisplayProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: LIVES }).map((_, i) => (
        <div
          key={i}
          className={`${styles.life} ${i < lives ? styles.filled : styles.empty}`}
        />
      ))}
    </div>
  );
}
