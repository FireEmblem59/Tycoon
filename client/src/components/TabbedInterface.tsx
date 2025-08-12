import { GameState } from '../hooks/useGameState';

interface TabbedInterfaceProps {
  gameState: GameState;
  onTabSwitch: (tab: string) => void;
  formatTime: (ms: number) => string;
}

export default function TabbedInterface({ gameState, onTabSwitch, formatTime }: TabbedInterfaceProps) {
  const calculateUpgradeCost = (upgrade: any, amount: number = 1): number => {
    let totalCost = 0;
    for (let i = 0; i < amount; i++) {
      totalCost += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned + i));
    }
    return totalCost;
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const playTime = Date.now() - gameState.startTime;

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-current mb-4">
        {gameState.unlockedTabs.map(tab => (
          <div
            key={tab}
            className={`px-4 py-2 text-sm font-semibold cursor-pointer ${
              gameState.currentTab === tab ? 'tab-active' : 'tab-inactive'
            }`}
            onClick={() => onTabSwitch(tab)}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 terminal-border p-4 overflow-y-auto">
        {/* Goals Tab */}
        {gameState.currentTab === 'goals' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">CURRENT OBJECTIVES</h3>
            <div className="space-y-3 text-sm">
              {/* First Intern Goal */}
              {gameState.upgrades.find(u => u.id === 'intern')?.owned === 0 && (
                <div className="border-l-2 border-current pl-3">
                  <div className="font-semibold">Hire Your First Intern</div>
                  <div className="terminal-medium-green">Cost: $25 | Progress: ${gameState.money}/25</div>
                  <div className="w-full terminal-bg border border-current h-2 mt-1">
                    <div 
                      className="bg-current h-full" 
                      style={{ width: `${getProgressPercentage(gameState.money, 25)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Research Basic Macros Goal */}
              {(gameState.upgrades.find(u => u.id === 'intern')?.owned || 0) > 0 && 
               !(gameState.research.find(r => r.id === 'basic-macro')?.completed || false) && (
                <div className="border-l-2 border-current pl-3">
                  <div className="font-semibold">Research Basic Macros</div>
                  <div className="terminal-medium-green">Requires: 1 Intern</div>
                </div>
              )}
              
              {/* GUI Transition Goal */}
              {gameState.research.find(r => r.id === 'basic-macro')?.completed && (
                <div className="border-l-2 border-current pl-3">
                  <div className="font-semibold">Reach GUI Transition</div>
                  <div className="terminal-medium-green">Complete Project GUI research</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upgrades Tab */}
        {gameState.currentTab === 'upgrades' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">UPGRADE CATALOG</h3>
            <div className="space-y-4 text-sm">
              {gameState.upgrades.filter(u => u.unlocked).map(upgrade => {
                const cost1 = calculateUpgradeCost(upgrade, 1);
                const cost10 = calculateUpgradeCost(upgrade, 10);
                const canAfford1 = gameState.money >= cost1;
                const canAfford10 = gameState.money >= cost10;
                
                return (
                  <div key={upgrade.id} className={`border p-3 ${canAfford1 ? 'border-current' : 'border-current opacity-50'}`}>
                    <div className={`font-semibold ${canAfford1 ? 'terminal-green' : ''}`}>{upgrade.name}</div>
                    <div className="terminal-medium-green mb-2">{upgrade.description}</div>
                    <div className="terminal-medium-green">{upgrade.effect}</div>
                    <div className="mt-2">
                      <span className="terminal-green">Owned: {upgrade.owned} | </span>
                      <span className="text-xs">buy {upgrade.id} 1 buy {upgrade.id} 10</span>
                    </div>
                    {!canAfford1 && (
                      <div className="text-red-400">Need ${cost1 - gameState.money} more</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-3 border border-current text-xs terminal-medium-green">
              Use terminal: "buy &lt;upgrade-id&gt; [amount]"
            </div>
          </div>
        )}

        {/* Research Tab */}
        {gameState.currentTab === 'research' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">RESEARCH PROJECTS</h3>
            <div className="space-y-4 text-sm">
              {gameState.research.filter(r => r.unlocked && !r.completed).map(research => (
                <div key={research.id} className="border border-current p-3">
                  <div className="font-semibold terminal-green">{research.name}</div>
                  <div className="terminal-medium-green mb-2">{research.description}</div>
                  <div className="terminal-green">
                    Cost: {research.timeRequired} time units | Requires: {research.dependencies.join(', ')}
                  </div>
                  <div className="terminal-medium-green">Command: research {research.id}</div>
                  {gameState.currentResearch?.id === research.id && (
                    <div className="mt-2 text-yellow-400">Research in progress...</div>
                  )}
                </div>
              ))}
              
              {gameState.research.filter(r => !r.unlocked).map(research => (
                <div key={research.id} className="border border-current p-3 opacity-50">
                  <div className="font-semibold">{research.name}</div>
                  <div className="terminal-medium-green mb-2">{research.description}</div>
                  <div className="terminal-dark-green">Requires: {research.dependencies.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {gameState.currentTab === 'stats' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">STATISTICS</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="terminal-medium-green">Total Money Earned:</div>
                <div className="font-bold">${gameState.totalEarned}</div>
              </div>
              <div>
                <div className="terminal-medium-green">Manual Assemblies:</div>
                <div className="font-bold">{gameState.sessions}</div>
              </div>
              <div>
                <div className="terminal-medium-green">Time Played:</div>
                <div className="font-bold">{formatTime(playTime)}</div>
              </div>
              <div>
                <div className="terminal-medium-green">Research Completed:</div>
                <div className="font-bold">{gameState.researchCompleted}</div>
              </div>
              <div>
                <div className="terminal-medium-green">Auto Income Rate:</div>
                <div className="font-bold">${gameState.autoIncome}/sec</div>
              </div>
              <div>
                <div className="terminal-medium-green">Assembly Value:</div>
                <div className="font-bold">${gameState.assemblyValue}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
