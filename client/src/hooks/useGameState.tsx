import { useState, useCallback } from 'react';
import { initialUpgrades, initialResearch, Upgrade, Research } from '../data/gameData';

export interface GameState {
  money: number;
  autoIncome: number;
  sessions: number;
  stage: 'terminal' | 'gui';
  upgrades: Upgrade[];
  research: Research[];
  currentTab: 'goals' | 'upgrades' | 'research' | 'stats';
  startTime: number;
  totalEarned: number;
  researchCompleted: number;
  currentResearch: {
    id: string;
    startTime: number;
    duration: number;
  } | null;
  unlockedTabs: string[];
  assemblyValue: number;
  assemblyCommand: string;
  clipboardEnabled: boolean;
  asciiSchematicsEnabled: boolean;
}

const initialState: GameState = {
  money: 2,
  autoIncome: 0,
  sessions: 0,
  stage: 'terminal',
  upgrades: initialUpgrades,
  research: initialResearch,
  currentTab: 'goals',
  startTime: Date.now(),
  totalEarned: 2,
  researchCompleted: 0,
  currentResearch: null,
  unlockedTabs: ['goals', 'upgrades'],
  assemblyValue: 1,
  assemblyCommand: 'assemble',
  clipboardEnabled: false,
  asciiSchematicsEnabled: false
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const updateMoney = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + amount,
      totalEarned: prev.totalEarned + (amount > 0 ? amount : 0)
    }));
  }, []);

  const performAssembly = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + prev.assemblyValue,
      sessions: prev.sessions + 1,
      totalEarned: prev.totalEarned + prev.assemblyValue
    }));
  }, []);

  const buyUpgrade = useCallback((upgradeId: string, amount: number = 1) => {
    setGameState(prev => {
      const upgrade = prev.upgrades.find(u => u.id === upgradeId);
      if (!upgrade || !upgrade.unlocked) return prev;

      const totalCost = calculateUpgradeCost(upgrade, amount);
      if (prev.money < totalCost) return prev;

      const newUpgrades = prev.upgrades.map(u => {
        if (u.id === upgradeId) {
          return { ...u, owned: u.owned + amount };
        }
        return u;
      });

      let newAutoIncome = prev.autoIncome;
      if (upgradeId === 'script') {
        newAutoIncome += amount;
      }

      let newAssemblyValue = prev.assemblyValue;
      if (upgradeId === 'tooling') {
        newAssemblyValue += amount;
      }

      // Check for research unlocks
      const newResearch = prev.research.map(r => {
        if (!r.unlocked && r.dependencies.every(dep => {
          if (dep === 'intern') return (newUpgrades.find(u => u.id === 'intern')?.owned || 0) > 0;
          return prev.research.find(res => res.id === dep)?.completed || false;
        })) {
          return { ...r, unlocked: true };
        }
        return r;
      });

      // Unlock research tab if first intern bought
      const newUnlockedTabs = [...prev.unlockedTabs];
      if (upgradeId === 'intern' && !newUnlockedTabs.includes('research')) {
        newUnlockedTabs.push('research');
      }

      return {
        ...prev,
        money: prev.money - totalCost,
        upgrades: newUpgrades,
        research: newResearch,
        autoIncome: newAutoIncome,
        assemblyValue: newAssemblyValue,
        unlockedTabs: newUnlockedTabs
      };
    });
  }, []);

  const startResearch = useCallback((researchId: string) => {
    setGameState(prev => {
      const research = prev.research.find(r => r.id === researchId);
      if (!research || !research.unlocked || research.completed || prev.currentResearch) {
        return prev;
      }

      // Check dependencies
      const hasAllDependencies = research.dependencies.every(dep => {
        if (dep === 'intern') return (prev.upgrades.find(u => u.id === 'intern')?.owned || 0) > 0;
        return prev.research.find(r => r.id === dep)?.completed || false;
      });

      if (!hasAllDependencies) return prev;

      const internCount = prev.upgrades.find(u => u.id === 'intern')?.owned || 0;
      const speedMultiplier = 1 + (internCount * 0.5);
      const actualDuration = research.timeRequired / speedMultiplier;

      return {
        ...prev,
        currentResearch: {
          id: researchId,
          startTime: Date.now(),
          duration: actualDuration * 1000 // Convert to milliseconds
        }
      };
    });
  }, []);

  const completeResearch = useCallback((researchId: string) => {
    setGameState(prev => {
      const newResearch = prev.research.map(r => {
        if (r.id === researchId) {
          return { ...r, completed: true };
        }
        return r;
      });

      // Apply research effects
      let newAssemblyCommand = prev.assemblyCommand;
      let newClipboardEnabled = prev.clipboardEnabled;
      let newAsciiSchematicsEnabled = prev.asciiSchematicsEnabled;
      let newUnlockedTabs = [...prev.unlockedTabs];

      switch (researchId) {
        case 'basic-macro':
          newAssemblyCommand = 'asmb';
          break;
        case 'advanced-macro':
          newAssemblyCommand = 'a';
          break;
        case 'clipboard-api':
          newClipboardEnabled = true;
          break;
        case 'ascii-schematics':
          newAsciiSchematicsEnabled = true;
          break;
      }

      // Unlock new research based on completed research
      const updatedResearch = newResearch.map(r => {
        if (!r.unlocked && r.dependencies.every(dep => {
          if (dep === 'intern') return (prev.upgrades.find(u => u.id === 'intern')?.owned || 0) > 0;
          return newResearch.find(res => res.id === dep)?.completed || false;
        })) {
          return { ...r, unlocked: true };
        }
        return r;
      });

      return {
        ...prev,
        research: updatedResearch,
        researchCompleted: prev.researchCompleted + 1,
        currentResearch: null,
        assemblyCommand: newAssemblyCommand,
        clipboardEnabled: newClipboardEnabled,
        asciiSchematicsEnabled: newAsciiSchematicsEnabled,
        unlockedTabs: newUnlockedTabs
      };
    });
  }, []);

  const switchTab = useCallback((tab: string) => {
    setGameState(prev => {
      if (!prev.unlockedTabs.includes(tab)) return prev;
      return { ...prev, currentTab: tab as any };
    });
  }, []);

  const unlockStatsTab = useCallback(() => {
    setGameState(prev => {
      const newUnlockedTabs = [...prev.unlockedTabs];
      if (!newUnlockedTabs.includes('stats')) {
        newUnlockedTabs.push('stats');
      }
      return { ...prev, unlockedTabs: newUnlockedTabs };
    });
  }, []);

  return {
    gameState,
    updateMoney,
    performAssembly,
    buyUpgrade,
    startResearch,
    completeResearch,
    switchTab,
    unlockStatsTab
  };
}

function calculateUpgradeCost(upgrade: Upgrade, amount: number): number {
  let totalCost = 0;
  for (let i = 0; i < amount; i++) {
    totalCost += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned + i));
  }
  return totalCost;
}
