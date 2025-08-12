import { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useInterval } from '../hooks/useInterval';
import ManualAssemblyStation from './ManualAssemblyStation';
import TabbedInterface from './TabbedInterface';
import Terminal from './Terminal';

export default function GameInterface() {
  const {
    gameState,
    updateMoney,
    performAssembly,
    buyUpgrade,
    startResearch,
    completeResearch,
    switchTab,
    unlockStatsTab
  } = useGameState();

  // Auto income timer
  useInterval(() => {
    if (gameState.autoIncome > 0) {
      updateMoney(gameState.autoIncome);
    }
  }, 1000);

  // Research completion timer
  useEffect(() => {
    if (gameState.currentResearch) {
      const { id, startTime, duration } = gameState.currentResearch;
      const timeLeft = duration - (Date.now() - startTime);
      
      if (timeLeft <= 0) {
        completeResearch(id);
      } else {
        const timer = setTimeout(() => {
          completeResearch(id);
        }, timeLeft);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentResearch, completeResearch]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-interface show h-screen p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold terminal-glow">BUTTON TYCOON</h1>
        <p className="text-sm terminal-medium-green">TERMINAL ERA - YEAR 1975</p>
      </div>

      {/* Money Display */}
      <div className="mb-4">
        <div className="text-3xl font-bold terminal-glow">${gameState.money}</div>
        {gameState.autoIncome > 0 && (
          <div className="text-sm terminal-medium-green">Auto Income: ${gameState.autoIncome}/sec</div>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-2 gap-4 h-2/3">
        {/* Left Panel: Manual Assembly Station */}
        <ManualAssemblyStation
          gameState={gameState}
          onAssembly={performAssembly}
        />

        {/* Right Panel: Tabbed Interface */}
        <TabbedInterface
          gameState={gameState}
          onTabSwitch={switchTab}
          formatTime={formatTime}
        />
      </div>

      {/* Terminal Window (Bottom - Full Width) */}
      <div className="mt-4 h-48">
        <Terminal
          gameState={gameState}
          onBuyUpgrade={buyUpgrade}
          onStartResearch={startResearch}
          onUnlockStats={unlockStatsTab}
          onTabSwitch={switchTab}
        />
      </div>
    </div>
  );
}
