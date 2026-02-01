# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

TapTap is a Guitar Hero-style mobile tap game built with React + TypeScript + Vite.

### Screen Flow

`App.tsx` manages screen transitions via state machine:
```
welcome → playerSelect → countdown → game → gameOver
                                       ↑        ↓
                                       └────────┘ (restart)
```

### Game State

- **`useGameState` hook** (`src/hooks/useGameState.ts`): Central game logic via `useReducer`. Manages players, circles, scoring, lives, and difficulty scaling.
- **`gameLogic.ts`** (`src/utils/gameLogic.ts`): Pure functions for circle spawning, movement, hit detection.
- **`useGameLoop` hook** (`src/hooks/useGameLoop.ts`): RequestAnimationFrame-based game loop with delta time.

### Hit Detection

Circles must be tapped directly (not just the lane). `checkHit()` in `gameLogic.ts` verifies tap coordinates overlap with circle bounds using `CIRCLE_SIZE` and `LANE_POSITIONS`.

### Two-Player Mode

`TwoPlayerGameArea.tsx` splits screen vertically. Player 2's area is CSS-rotated 180° so players face each other across a tablet. **Important**: Player 2's tap coordinates must be inverted to compensate for rotation.

### Key Constants (`src/utils/constants.ts`)

- `CIRCLE_SIZE`: 80px - used for hit detection bounds
- `LANE_POSITIONS`: [0.25, 0.75] - circles spawn at 25% and 75% width
- Difficulty increases over time via `SPEED_INCREMENT` and `SPAWN_INTERVAL_DECREASE`

### Touch Handling Pattern

Uses ref pattern to avoid stale closures:
```typescript
const handleTapRef = useRef<(x: number, y: number) => void>(() => {});
handleTapRef.current = (x, y) => { /* always has fresh state */ };
const onPointerDown = useCallback((e) => {
  handleTapRef.current(e.clientX, e.clientY);
}, []); // stable handler, never recreated
```

## Deployment

Connected to Vercel via GitHub. Push to `main` triggers auto-deploy.
