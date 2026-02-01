import { useState, useEffect } from 'react';
import styles from './CountdownScreen.module.css';

interface CountdownScreenProps {
  onComplete: () => void;
  playerCount: 1 | 2;
}

export function CountdownScreen({ onComplete, playerCount }: CountdownScreenProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const bgColor = playerCount === 1 ? '#8B5CF6' : '#1a1a1a';

  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }}>
      <span className={styles.number}>{count > 0 ? count : ''}</span>
    </div>
  );
}
