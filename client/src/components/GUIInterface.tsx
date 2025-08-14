import { GameState } from '../hooks/useGameState';

interface GUIInterfaceProps {
  gameState: GameState;
  onButtonPress: () => void;
  onBuyUpgrade: (upgradeId: string, amount: number) => void;
  onStartResearch: (researchId: string) => void;
  onSwitchTab: (tab: string) => void;
}

export default function GUIInterface({ 
  gameState, 
  onButtonPress,
  onBuyUpgrade, 
  onStartResearch, 
  onSwitchTab
}: GUIInterfaceProps) {
  const calculateUpgradeCost = (upgrade: any, amount: number = 1): number => {
    let totalCost = 0;
    for (let i = 0; i < amount; i++) {
      totalCost += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned + i));
    }
    return totalCost;
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const playTime = Date.now() - gameState.startTime;
  const guiUpgrades = gameState.upgrades.filter(u => u.era === 'gui' && u.unlocked);
  const guiResearch = gameState.research.filter(r => r.era === 'gui' && r.unlocked && !r.completed);
  const guiGoals = gameState.goals.filter(g => g.era === 'gui' && g.visible);

  return (
    <div className="min-h-screen bg-gray-200 font-mono overflow-auto">
      {/* Title Bar */}
      <div className="bg-gray-300 border-b-2 border-gray-600 p-2 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Button Tycoon - GUI Era (1985)</h1>
          <div className="text-lg font-bold text-black">Money: ${gameState.money.toFixed(2)}</div>
        </div>
      </div>

      <div className="p-4">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Left Panel: Production */}
          <div className="bg-white border-2 border-gray-600 shadow-lg">
            <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
              <h2 className="font-bold text-black">Production Center</h2>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4">
                <div className="text-lg font-bold text-black mb-2">Assembly Operations</div>
                <div className="text-sm text-gray-600 mb-4">
                  Button Presses: {gameState.buttonPresses} | Auto Income: ${gameState.guiAutoIncome}/sec
                </div>
              </div>
              <button 
                onClick={onButtonPress}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-8 py-4 border-2 border-black shadow-lg text-xl font-bold transition-colors"
                style={{ fontFamily: 'monospace' }}
              >
                ASSEMBLE (+${1 + (gameState.upgrades.find(u => u.id === 'mouse-upgrade')?.owned || 0) * 0.5 + (gameState.upgrades.find(u => u.id === 'graphics-card')?.owned || 0) * 2})
              </button>
            </div>
          </div>

          {/* Right Panel: Goals */}
          <div className="bg-white border-2 border-gray-600 shadow-lg">
            <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
              <h2 className="font-bold text-black">Current Objectives</h2>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {guiGoals.length > 0 ? (
                <div className="space-y-3">
                  {guiGoals.map(goal => (
                    <div key={goal.id} className={`border-l-4 pl-3 ${goal.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'}`}>
                      <div className={`font-semibold ${goal.completed ? 'text-green-700 line-through' : 'text-black'}`}>
                        {goal.title}
                      </div>
                      <div className="text-sm text-gray-600">{goal.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center">No current objectives</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upgrades Panel */}
          <div className="bg-white border-2 border-gray-600 shadow-lg">
            <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
              <h2 className="font-bold text-black">Upgrades</h2>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {guiUpgrades.length > 0 ? (
                <div className="space-y-3">
                  {guiUpgrades.map(upgrade => {
                    const cost = calculateUpgradeCost(upgrade, 1);
                    const canAfford = gameState.money >= cost;
                    
                    return (
                      <div key={upgrade.id} className={`border p-3 ${canAfford ? 'border-gray-400' : 'border-gray-300 opacity-60'}`}>
                        <div className="font-semibold text-black">{upgrade.name}</div>
                        <div className="text-sm text-gray-600 mb-1">{upgrade.description}</div>
                        <div className="text-sm text-gray-700 mb-2">{upgrade.effect}</div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-black">Owned: {upgrade.owned} | Cost: ${cost}</span>
                          </div>
                          <button 
                            onClick={() => onBuyUpgrade(upgrade.id, 1)}
                            disabled={!canAfford}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 border border-black text-sm font-bold"
                          >
                            Buy
                          </button>
                        </div>
                        {!canAfford && (
                          <div className="text-red-600 text-xs mt-1">Need ${(cost - gameState.money).toFixed(2)} more</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center">No upgrades available</div>
              )}
            </div>
          </div>

          {/* Research Panel */}
          <div className="bg-white border-2 border-gray-600 shadow-lg">
            <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
              <h2 className="font-bold text-black">Research & Development</h2>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {guiResearch.length > 0 ? (
                <div className="space-y-3">
                  {guiResearch.map(research => {
                    const internCount = gameState.upgrades.find(u => u.id === 'intern')?.owned || 0;
                    const speedMultiplier = 1 + (internCount * 0.5);
                    const actualDuration = Math.round(research.timeRequired / speedMultiplier);
                    const isResearching = gameState.currentResearch?.id === research.id;
                    
                    return (
                      <div key={research.id} className="border p-3 border-gray-400">
                        <div className="font-semibold text-black">{research.name}</div>
                        <div className="text-sm text-gray-600 mb-1">{research.description}</div>
                        <div className="text-sm text-gray-700 mb-2">Duration: {actualDuration}s</div>
                        <button 
                          onClick={() => onStartResearch(research.id)}
                          disabled={gameState.currentResearch !== null}
                          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-1 border border-black text-sm font-bold"
                        >
                          {isResearching ? 'Researching...' : 'Start Research'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center">No research available</div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="mt-4 bg-white border-2 border-gray-600 shadow-lg">
          <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
            <h2 className="font-bold text-black">Statistics</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Earned:</div>
                <div className="font-bold text-black">${gameState.totalEarned.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600">Button Presses:</div>
                <div className="font-bold text-black">{gameState.buttonPresses}</div>
              </div>
              <div>
                <div className="text-gray-600">Time Played:</div>
                <div className="font-bold text-black">{formatTime(playTime)}</div>
              </div>
              <div>
                <div className="text-gray-600">Research Completed:</div>
                <div className="font-bold text-black">{gameState.researchCompleted}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}