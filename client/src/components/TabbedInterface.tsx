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
  const terminalGoals = gameState.goals.filter(g => g.era === 'terminal' && g.visible);
  const terminalUpgrades = gameState.upgrades.filter(u => u.era === 'terminal' && u.unlocked);
  const terminalResearch = gameState.research.filter(r => r.era === 'terminal' && r.unlocked && !r.completed);

  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-1 terminal-border p-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {/* Goals Tab */}
        {gameState.currentTab === 'goals' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">CURRENT OBJECTIVES</h3>
            <div className="space-y-3 text-sm">
              {terminalGoals.length > 0 ? (
                terminalGoals.map(goal => (
                  <div key={goal.id} className={`border-l-2 pl-3 ${goal.completed ? 'border-green-500 opacity-60' : 'border-current'}`}>
                    <div className={`font-semibold ${goal.completed ? 'line-through terminal-dark-green' : ''}`}>
                      {goal.title}
                    </div>
                    <div className="terminal-medium-green">{goal.description}</div>
                    {goal.id === 'hire-intern' && !goal.completed && (
                      <div className="mt-2">
                        <div className="terminal-medium-green">Progress: ${gameState.money}/25</div>
                        <div className="w-full terminal-bg border border-current h-2 mt-1">
                          <div 
                            className="bg-current h-full" 
                            style={{ width: `${getProgressPercentage(gameState.money, 25)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {goal.id === 'gui-transition' && !goal.completed && (
                      <div className="mt-2">
                        <div className="terminal-medium-green">
                          {gameState.research.find(r => r.id === 'project-gui')?.completed 
                            ? "✓ Ready! Type 'transition gui' in terminal" 
                            : "Complete Project GUI research first"}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="terminal-medium-green">All objectives completed!</div>
              )}
            </div>
          </div>
        )}

        {/* Upgrades Tab */}
        {gameState.currentTab === 'upgrades' && (
          <div>
            <h3 className="text-lg font-bold mb-4 terminal-glow">UPGRADE CATALOG</h3>
            <div className="space-y-4 text-sm">
              {terminalUpgrades.map(upgrade => {
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
              {terminalResearch.map(research => {
                const internCount = gameState.upgrades.find(u => u.id === 'intern')?.owned || 0;
                const speedMultiplier = 1 + (internCount * 0.5);
                const actualDuration = Math.round(research.timeRequired / speedMultiplier);
                
                return (
                  <div key={research.id} className="border border-current p-3">
                    <div className="font-semibold terminal-green">{research.name}</div>
                    <div className="terminal-medium-green mb-2">{research.description}</div>
                    <div className="terminal-green">
                      Duration: {actualDuration}s | Requires: {research.dependencies.join(', ')}
                    </div>
                    <div className="terminal-medium-green">Command: research {research.id}</div>
                    {gameState.currentResearch?.id === research.id && (
                      <div className="mt-2 text-yellow-400">Research in progress...</div>
                    )}
                  </div>
                );
              })}
              
              {terminalResearch.length === 0 && (
                <div className="terminal-medium-green">
                  No research available. Purchase upgrades to unlock new projects.
                </div>
              )}
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
