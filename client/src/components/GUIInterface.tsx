import { GameState } from '../hooks/useGameState';

interface GUIInterfaceProps {
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string, amount: number) => void;
  onStartResearch: (researchId: string) => void;
  onSwitchTab: (tab: string) => void;
  onBackToTerminal: () => void;
}

export default function GUIInterface({ 
  gameState, 
  onBuyUpgrade, 
  onStartResearch, 
  onSwitchTab,
  onBackToTerminal 
}: GUIInterfaceProps) {
  return (
    <div className="gui-interface h-screen bg-gray-100 p-4 font-sans">
      {/* GUI Header */}
      <div className="bg-gray-300 border-2 border-gray-600 mb-4 p-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Button Tycoon - GUI Era (1985)</h1>
          <div className="text-lg font-bold">Money: ${gameState.money}</div>
        </div>
      </div>

      {/* GUI Windows Layout */}
      <div className="grid grid-cols-2 gap-4 h-5/6">
        {/* Left Window: Production */}
        <div className="bg-white border-2 border-gray-600 shadow-md">
          <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
            <h2 className="font-bold">Production Center</h2>
          </div>
          <div className="p-4">
            <button 
              onClick={() => {/* Handle button production */}}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 border-2 border-black shadow-md"
            >
              Create Button (+$1)
            </button>
          </div>
        </div>

        {/* Right Window: Upgrades */}
        <div className="bg-white border-2 border-gray-600 shadow-md">
          <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
            <h2 className="font-bold">Upgrades</h2>
          </div>
          <div className="p-4 space-y-2">
            {gameState.upgrades.filter(u => u.unlocked).map(upgrade => (
              <div key={upgrade.id} className="border p-2">
                <div className="font-semibold">{upgrade.name}</div>
                <div className="text-sm text-gray-600">{upgrade.description}</div>
                <div className="text-sm">Cost: ${Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned))}</div>
                <button 
                  onClick={() => onBuyUpgrade(upgrade.id, 1)}
                  disabled={gameState.money < Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned))}
                  className="mt-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 border border-black text-xs"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Window: Research */}
        <div className="col-span-2 bg-white border-2 border-gray-600 shadow-md">
          <div className="bg-gray-300 border-b-2 border-gray-600 p-2">
            <h2 className="font-bold">Research & Development</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {gameState.research.filter(r => r.unlocked && !r.completed).map(research => (
              <div key={research.id} className="border p-2">
                <div className="font-semibold">{research.name}</div>
                <div className="text-sm text-gray-600">{research.description}</div>
                <button 
                  onClick={() => onStartResearch(research.id)}
                  disabled={gameState.currentResearch !== null}
                  className="mt-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-2 py-1 border border-black text-xs"
                >
                  {gameState.currentResearch?.id === research.id ? 'Researching...' : 'Start Research'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Terminal Button */}
      <div className="mt-4">
        <button 
          onClick={onBackToTerminal}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 border-2 border-black shadow-md"
        >
          Back to Terminal
        </button>
      </div>
    </div>
  );
}