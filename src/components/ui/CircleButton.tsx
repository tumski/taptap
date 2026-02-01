import styles from './CircleButton.module.css';

interface CircleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
  size?: number;
}

export function CircleButton({
  children,
  onClick,
  color = '#1a1a1a',
  size = 140,
}: CircleButtonProps) {
  return (
    <button
      className={styles.circleButton}
      onClick={onClick}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
    >
      {children}
    </button>
  );
}
