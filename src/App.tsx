import { useState, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { PlayerSelectScreen } from './components/screens/PlayerSelectScreen';
import { CountdownScreen } from './components/screens/CountdownScreen';
import { GameScreen } from './components/screens/GameScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import type { Screen } from './types/game';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [playerCount, setPlayerCount] = useState<1 | 2>(1);
  const [finalScores, setFinalScores] = useState<number[]>([0]);
  const [winner, setWinner] = useState<number | undefined>();

  const handleStart = useCallback(() => {
    setCurrentScreen('playerSelect');
  }, []);

  const handlePlayerSelect = useCallback((count: 1 | 2) => {
    setPlayerCount(count);
    setCurrentScreen('countdown');
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleGameOver = useCallback((scores: number[], gameWinner?: number) => {
    setFinalScores(scores);
    setWinner(gameWinner);
    setCurrentScreen('gameOver');
  }, []);

  const handleHome = useCallback(() => {
    setCurrentScreen('welcome');
    setFinalScores([0]);
    setWinner(undefined);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentScreen('countdown');
  }, []);

  return (
    <div className="app">
      {currentScreen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {currentScreen === 'playerSelect' && (
        <PlayerSelectScreen onSelect={handlePlayerSelect} />
      )}
      {currentScreen === 'countdown' && (
        <CountdownScreen onComplete={handleCountdownComplete} playerCount={playerCount} />
      )}
      {currentScreen === 'game' && (
        <GameScreen playerCount={playerCount} onGameOver={handleGameOver} />
      )}
      {currentScreen === 'gameOver' && (
        <GameOverScreen
          scores={finalScores}
          winner={winner}
          playerCount={playerCount}
          onHome={handleHome}
          onRestart={handleRestart}
        />
      )}
      <Analytics />
    </div>
  );
}

export default App;
