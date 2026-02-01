import type { Circle, PlayerState } from '../types/game';
import {
  SPAWN_INTERVAL_INITIAL,
  SPAWN_INTERVAL_MIN,
  SPAWN_INTERVAL_DECREASE,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  LANE_POSITIONS,
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
  tapX: number,
  tapY: number,
  areaWidth: number,
  _areaHeight: number,
  circleSize: number
): { hit: boolean; remainingCircles: Circle[] } {
  // Find the circle that was actually tapped (tap coordinates within circle bounds)
  let hitCircle: Circle | null = null;

  for (const circle of circles) {
    // Circle center X position in pixels
    const circleCenterX = LANE_POSITIONS[circle.lane] * areaWidth;
    // Circle Y spans from circle.y (top) to circle.y + circleSize (bottom)
    const circleTop = circle.y;
    const circleBottom = circle.y + circleSize;

    // Check if tap is within circle bounds
    const withinX = Math.abs(tapX - circleCenterX) <= circleSize / 2;
    const withinY = tapY >= circleTop && tapY <= circleBottom;

    if (withinX && withinY) {
      // If multiple circles overlap, hit the one closest to tap point
      if (!hitCircle) {
        hitCircle = circle;
      } else {
        // Prefer the circle whose center is closer to the tap
        const currentDist = Math.abs(tapY - (circle.y + circleSize / 2));
        const hitDist = Math.abs(tapY - (hitCircle.y + circleSize / 2));
        if (currentDist < hitDist) {
          hitCircle = circle;
        }
      }
    }
  }

  if (!hitCircle) {
    return { hit: false, remainingCircles: circles };
  }

  return {
    hit: true,
    remainingCircles: circles.filter((c) => c.id !== hitCircle!.id),
  };
}

export function createInitialPlayerState(): PlayerState {
  return {
    score: 0,
    lives: 3,
    circles: [],
  };
}
