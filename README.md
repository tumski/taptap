# TapTap

A Guitar Hero-style tap game for touch devices, built with love during a family coding session.

## The Story

This game was born from an afternoon of creativity with my kids. We sat together, imagined what kind of game would be fun to play, and brought it to life piece by piece.

The kids came up with the core idea: black circles falling down the screen that you have to tap before they disappear. They wanted it to work on tablets so everyone could play, and they *definitely* wanted a two-player mode so they could compete against each other.

We sketched out the screens together:
- A welcome screen with a big friendly "Start" button
- Choosing between 1 or 2 players (in Polish: "1 gracz" / "2 graczy")
- A countdown to build excitement: 3... 2... 1...
- The game itself with falling circles to tap
- A game over screen to see who won

The two-player mode was their favorite part to design. Player 2 plays on the top half of the screen, rotated 180 degrees, so two people can face each other across a tablet and compete head-to-head. Blue for player 1, red for player 2.

We picked the Caveat font together because it looked like handwriting - like something the kids might draw themselves.

Building this game was as much fun as playing it.

## How to Play

- **Single Player**: Tap the falling black circles before they reach the bottom. You have 3 lives!
- **Two Player**: Each player defends their side of the screen. First to lose all lives loses.
- The game gets faster the longer you play.

## Running the Game

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploy to Vercel

```bash
npx vercel
```

Or connect this repository to Vercel for automatic deployments.

## Tech Stack

- React + TypeScript
- Vite
- CSS Modules
- Caveat font
- Lucide icons

---

*Made with kids, for kids (and kids at heart)*
