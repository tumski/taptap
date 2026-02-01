import { CircleButton } from '../ui/CircleButton';
import styles from './PlayerSelectScreen.module.css';

interface PlayerSelectScreenProps {
  onSelect: (playerCount: 1 | 2) => void;
}

export function PlayerSelectScreen({ onSelect }: PlayerSelectScreenProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ilu graczy?</h2>
      <div className={styles.buttons}>
        <CircleButton onClick={() => onSelect(1)} color="#8B5CF6">
          1 gracz
        </CircleButton>
        <CircleButton onClick={() => onSelect(2)} color="#1a1a1a">
          2 graczy
        </CircleButton>
      </div>
    </div>
  );
}
