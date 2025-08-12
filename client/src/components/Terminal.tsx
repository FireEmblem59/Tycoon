import { useState, useRef, useEffect } from 'react';
import { GameState } from '../hooks/useGameState';

interface TerminalProps {
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string, amount: number) => void;
  onStartResearch: (researchId: string) => void;
  onUnlockStats: () => void;
  onTabSwitch: (tab: string) => void;
  onAddMoney: (amount: number) => void;
  onResetGame: () => void;
  hasUsedHelp: boolean;
  setHasUsedHelp: (used: boolean) => void;
  onTransitionToGUI?: () => void;
}

interface TerminalLine {
  text: string;
  className: string;
}

export default function Terminal({ 
  gameState, 
  onBuyUpgrade, 
  onStartResearch, 
  onUnlockStats, 
  onTabSwitch,
  onAddMoney,
  onResetGame,
  hasUsedHelp,
  setHasUsedHelp,
  onTransitionToGUI
}: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'TERMINAL v1.1 - Awaiting commands...', className: 'terminal-medium-green' }
  ]);
  
  // hasUsedHelp is now a prop from parent component
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const addToHistory = (command: string, response: string, responseClass: string = 'terminal-green') => {
    setHistory(prev => [
      ...prev,
      { text: `> ${command}`, className: 'terminal-medium-green' },
      { text: response, className: responseClass }
    ]);
  };

  const calculateUpgradeCost = (upgrade: any, amount: number): number => {
    let totalCost = 0;
    for (let i = 0; i < amount; i++) {
      totalCost += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned + i));
    }
    return totalCost;
  };

  const handleCommand = (command: string) => {
    const parts = command.trim().toLowerCase().split(' ');
    const cmd = parts[0];

    switch (cmd) {
      case 'buy':
        if (parts.length < 2) {
          addToHistory(command, 'ERROR: Specify upgrade to buy. Usage: buy [upgrade-id] [amount]', 'text-red-400');
          return;
        }

        const upgradeId = parts[1];
        const amount = parseInt(parts[2]) || 1;
        const upgrade = gameState.upgrades.find(u => u.id === upgradeId);

        if (!upgrade) {
          addToHistory(command, `ERROR: Unknown upgrade "${upgradeId}". Available: ${gameState.upgrades.filter(u => u.unlocked).map(u => u.id).join(', ')}`, 'text-red-400');
          return;
        }

        if (!upgrade.unlocked) {
          addToHistory(command, `ERROR: Upgrade "${upgradeId}" not unlocked yet`, 'text-red-400');
          return;
        }

        const cost = calculateUpgradeCost(upgrade, amount);
        if (gameState.money < cost) {
          addToHistory(command, `ERROR: Insufficient funds. Need $${cost - gameState.money} more`, 'text-red-400');
          return;
        }

        onBuyUpgrade(upgradeId, amount);
        addToHistory(command, `SUCCESS: Purchased ${amount}x ${upgrade.name} for $${cost}`);
        break;

      case 'research':
        if (parts.length < 2) {
          addToHistory(command, 'ERROR: Specify research project. Usage: research [project-id]', 'text-red-400');
          return;
        }

        const researchId = parts[1];
        const research = gameState.research.find(r => r.id === researchId);

        if (!research) {
          addToHistory(command, `ERROR: Unknown research "${researchId}". Available: ${gameState.research.filter(r => r.unlocked && !r.completed).map(r => r.id).join(', ')}`, 'text-red-400');
          return;
        }

        if (!research.unlocked) {
          addToHistory(command, `ERROR: Research "${researchId}" not unlocked yet`, 'text-red-400');
          return;
        }

        if (research.completed) {
          addToHistory(command, `ERROR: Research "${researchId}" already completed`, 'text-red-400');
          return;
        }

        if (gameState.currentResearch) {
          addToHistory(command, 'ERROR: Already researching. Wait for current research to complete', 'text-red-400');
          return;
        }

        // Check dependencies
        const hasAllDeps = research.dependencies.every(dep => {
          if (dep === 'intern') return (gameState.upgrades.find(u => u.id === 'intern')?.owned || 0) > 0;
          return gameState.research.find(r => r.id === dep)?.completed || false;
        });

        if (!hasAllDeps) {
          addToHistory(command, `ERROR: Missing dependencies: ${research.dependencies.join(', ')}`, 'text-red-400');
          return;
        }

        onStartResearch(researchId);
        const internCount = gameState.upgrades.find(u => u.id === 'intern')?.owned || 0;
        const speedMultiplier = 1 + (internCount * 0.5);
        const actualDuration = research.timeRequired / speedMultiplier;
        addToHistory(command, `SUCCESS: Started ${research.name} research (${Math.round(actualDuration)} seconds)`);
        break;

      case 'stats':
        onUnlockStats();
        onTabSwitch('stats');
        addToHistory(command, 'SUCCESS: Stats tab unlocked and displayed');
        break;

      case 'help':
        setHasUsedHelp(true);
        const availableCommands = ['buy [upgrade] [amount]', 'research [project]', 'help', 'clear'];
        
        // Add stats if not unlocked yet
        if (!gameState.unlockedTabs.includes('stats')) {
          availableCommands.push('stats');
        }
        
        // Add transition only if project-gui is completed
        const projectGUI = gameState.research.find(r => r.id === 'project-gui');
        if (projectGUI?.completed) {
          availableCommands.push('transition gui');
        }
        
        addToHistory(command, `Available commands: ${availableCommands.join(', ')}`);
        break;

      case 'transition':
        if (parts[1] === 'gui') {
          const projectGUI = gameState.research.find(r => r.id === 'project-gui');
          if (projectGUI?.completed) {
            addToHistory(command, 'WARNING: Transitioning will reset all progress. Type "confirm-transition" to proceed', 'text-yellow-400');
          } else {
            addToHistory(command, 'ERROR: Must complete "Project GUI" research first', 'text-red-400');
          }
        } else {
          addToHistory(command, 'ERROR: Unknown transition. Try: transition gui', 'text-red-400');
        }
        break;

      case 'confirm-transition':
        if (onTransitionToGUI) {
          onTransitionToGUI();
          addToHistory(command, 'SUCCESS: Transitioning to GUI era...', 'terminal-green');
        } else {
          addToHistory(command, 'ERROR: GUI transition not available', 'text-red-400');
        }
        break;

      case 'clear':
        setHistory([{ text: 'TERMINAL v1.1 - Awaiting commands...', className: 'terminal-medium-green' }]);
        return;

      // Debug commands (not shown in help)
      case 'reset':
        onResetGame();
        setHasUsedHelp(false);
        setHistory([{ text: 'TERMINAL v1.1 - Game reset. Awaiting commands...', className: 'terminal-medium-green' }]);
        return;

      case 'addmoney':
        if (parts.length < 2) {
          addToHistory(command, 'DEBUG: Usage: addmoney [amount]', 'text-yellow-400');
          return;
        }
        const debugAmount = parseInt(parts[1]);
        if (isNaN(debugAmount)) {
          addToHistory(command, 'DEBUG: Invalid amount', 'text-red-400');
          return;
        }
        onAddMoney(debugAmount);
        addToHistory(command, `DEBUG: Added $${debugAmount} to your money`, 'text-yellow-400');
        break;

      default:
        if (command.trim() === '') return;
        addToHistory(command, 'ERROR: Unknown command. Type "help" for available commands', 'text-red-400');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="terminal-border p-4 h-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold terminal-glow">TERMINAL v1.1</span>
        <span className="text-sm terminal-medium-green">AUTOMATED ASSEMBLY CORP.</span>
      </div>
      
      {/* Terminal Output */}
      <div ref={outputRef} className="text-sm h-32 overflow-y-auto mb-4 font-mono border terminal-border p-2" style={{ scrollBehavior: 'smooth' }}>
        {history.map((line, index) => (
          <div key={index} className={line.className}>
            {line.text}
          </div>
        ))}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center">
        <span className="mr-2 text-lg">{'>'}</span>
        <input 
          type="text" 
          className="terminal-input flex-1 text-sm" 
          placeholder="Enter command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onPaste={(e) => {
            if (!gameState.clipboardEnabled) {
              e.preventDefault();
              addToHistory(input, 'ERROR: Clipboard disabled - research "clipboard-api"', 'text-red-400');
            }
          }}
        />
      </div>
    </div>
  );
}
