import { Button } from '../ui/Button';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TapTap</h1>
      <Button onClick={onStart}>Start</Button>
    </div>
  );
}
