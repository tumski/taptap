import type { Circle, PlayerState } from '../types/game';
import {
  SPAWN_INTERVAL_INITIAL,
  SPAWN_INTERVAL_MIN,
  SPAWN_INTERVAL_DECREASE,
  INITIAL_SPEED,
  SPEED_INCREMENT,
} from './constants';

let circleIdCounter = 0;

export function createCircle(lane: number): Circle {
  return {
    id: `circle-${circleIdCounter++}`,
    lane,
    y: 0,
    createdAt: Date.now(),
  };
}

export function spawnCircle(): Circle {
  const lane = Math.random() < 0.5 ? 0 : 1;
  return createCircle(lane);
}

export function calculateSpeed(elapsedSeconds: number): number {
  return INITIAL_SPEED + elapsedSeconds * SPEED_INCREMENT;
}

export function calculateSpawnInterval(elapsedSeconds: number): number {
  const interval = SPAWN_INTERVAL_INITIAL - elapsedSeconds * SPAWN_INTERVAL_DECREASE;
  return Math.max(interval, SPAWN_INTERVAL_MIN);
}

export function updateCirclePositions(
  circles: Circle[],
  deltaTime: number,
  speed: number,
  _areaHeight: number
): Circle[] {
  return circles.map((circle) => ({
    ...circle,
    y: circle.y + (speed * deltaTime) / 1000,
  }));
}

export function checkMissedCircles(
  circles: Circle[],
  areaHeight: number
): { remaining: Circle[]; missed: number } {
  const remaining: Circle[] = [];
  let missed = 0;

  for (const circle of circles) {
    if (circle.y > areaHeight) {
      missed++;
    } else {
      remaining.push(circle);
    }
  }

  return { remaining, missed };
}

export function checkHit(
  circles: Circle[],
  lane: number,
  hitZoneTop: number,
  hitZoneBottom: number
): { hit: boolean; remainingCircles: Circle[] } {
  const circleInHitZone = circles.find(
    (c) => c.lane === lane && c.y >= hitZoneTop && c.y <= hitZoneBottom
  );

  if (circleInHitZone) {
    return {
      hit: true,
      remainingCircles: circles.filter((c) => c.id !== circleInHitZone.id),
    };
  }

  return { hit: false, remainingCircles: circles };
}

export function createInitialPlayerState(): PlayerState {
  return {
    score: 0,
    lives: 3,
    circles: [],
  };
}
