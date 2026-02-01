import styles from './Lane.module.css';

interface LaneProps {
  position: number; // 0-1 as percentage
  children?: React.ReactNode;
}

export function Lane({ position, children }: LaneProps) {
  return (
    <div
      className={styles.lane}
      style={{ left: `${position * 100}%` }}
    >
      {children}
    </div>
  );
}
