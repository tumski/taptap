import styles from './FallingCircle.module.css';
import { CIRCLE_SIZE, LANE_POSITIONS } from '../../utils/constants';

interface FallingCircleProps {
  y: number;
  lane: number;
}

export function FallingCircle({ y, lane }: FallingCircleProps) {
  const left = `${LANE_POSITIONS[lane] * 100}%`;

  return (
    <div
      className={styles.circle}
      style={{
        transform: `translate(-50%, 0)`,
        left,
        top: y,
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
      }}
    />
  );
}
