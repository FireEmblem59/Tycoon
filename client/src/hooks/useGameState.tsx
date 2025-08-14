import { useState, useCallback } from "react";
import {
  initialUpgrades,
  initialResearch,
  initialGoals,
  Upgrade,
  Research,
  Goal,
} from "../data/gameData";

export interface GameState {
  money: number;
  autoIncome: number;
  sessions: number;
  stage: "terminal" | "gui";
  upgrades: Upgrade[];
  research: Research[];
  currentTab: "goals" | "upgrades" | "research" | "stats";
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
  hasUsedHelp: boolean;
  goals: Goal[];
  buttonPresses: number;
  guiAutoIncome: number;
}

const initialState: GameState = {
  money: 0,
  autoIncome: 0,
  sessions: 0,
  stage: "terminal",
  upgrades: initialUpgrades,
  research: initialResearch,
  currentTab: "goals",
  startTime: Date.now(),
  totalEarned: 0,
  researchCompleted: 0,
  currentResearch: null,
  unlockedTabs: ["goals", "upgrades"],
  assemblyValue: 1,
  assemblyCommand: "assemble",
  clipboardEnabled: false,
  asciiSchematicsEnabled: false,
  hasUsedHelp: false,
  goals: initialGoals,
  buttonPresses: 0,
  guiAutoIncome: 0,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const updateMoney = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      money: prev.money + amount,
      totalEarned: prev.totalEarned + (amount > 0 ? amount : 0),
    }));
  }, []);

  const performAssembly = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      money: prev.money + prev.assemblyValue,
      sessions: prev.sessions + 1,
      totalEarned: prev.totalEarned + prev.assemblyValue,
    }));
  }, []);

  const performButtonPress = useCallback(() => {
    setGameState((prev) => {
      const mouseUpgradeBonus =
        prev.upgrades.find((u) => u.id === "mouse-upgrade")?.owned || 0;
      const graphicsBonus =
        prev.upgrades.find((u) => u.id === "graphics-card")?.owned || 0;
      const baseValue = 1;
      const totalValue =
        baseValue + mouseUpgradeBonus * 0.5 + graphicsBonus * 2;

      return {
        ...prev,
        money: prev.money + totalValue,
        buttonPresses: prev.buttonPresses + 1,
        totalEarned: prev.totalEarned + totalValue,
      };
    });
  }, []);

  const buyUpgrade = useCallback((upgradeId: string, amount: number = 1) => {
    setGameState((prev) => {
      const upgrade = prev.upgrades.find((u) => u.id === upgradeId);
      if (!upgrade || !upgrade.unlocked) return prev;

      const totalCost = calculateUpgradeCost(upgrade, amount);
      if (prev.money < totalCost) return prev;

      const newUpgrades = prev.upgrades.map((u) => {
        if (u.id === upgradeId) {
          return { ...u, owned: u.owned + amount };
        }
        return u;
      });

      let newAutoIncome = prev.autoIncome;
      let newGuiAutoIncome = prev.guiAutoIncome;

      if (upgradeId === "coffee-machine") {
        newAutoIncome += amount * 0.5;
      } else if (upgradeId === "script") {
        const scriptEnhancerBonus =
          prev.upgrades.find((u) => u.id === "script-enhancer")?.owned || 0;
        newAutoIncome += amount * (1 + scriptEnhancerBonus * 0.5);
      } else if (upgradeId === "script-enhancer") {
        // Recalculate all script bonuses
        const scriptCount =
          prev.upgrades.find((u) => u.id === "script")?.owned || 0;
        newAutoIncome = prev.autoIncome + scriptCount * 0.5 * amount;
      } else if (upgradeId === "auto-clicker") {
        newGuiAutoIncome += amount * 1;
      }

      let newAssemblyValue = prev.assemblyValue;
      if (upgradeId === "tooling") {
        newAssemblyValue += amount;
      } else if (upgradeId === "assembly-optimizer") {
        newAssemblyValue += amount * 2;
      }

      // Check for upgrade unlocks
      const newUpgradesWithUnlocks = newUpgrades.map((u) => {
        if (!u.unlocked) {
          if (u.era !== prev.stage) return u;

          if (u.id === "tooling" && prev.money >= 50) {
            return { ...u, unlocked: true };
          } else if (
            u.id === "assembly-optimizer" &&
            prev.research.find((r) => r.id === "efficiency-research")?.completed
          ) {
            return { ...u, unlocked: true };
          } else if (
            u.id === "script-enhancer" &&
            prev.research.find((r) => r.id === "automation-theory")?.completed
          ) {
            return { ...u, unlocked: true };
          } else if (
            u.id === "intern-manager" &&
            (prev.upgrades.find((up) => up.id === "intern")?.owned || 0) >= 3
          ) {
            return { ...u, unlocked: true };
          } else if (u.id === "auto-clicker" && prev.buttonPresses >= 50) {
            return { ...u, unlocked: true };
          } else if (
            u.id === "gui-framework" &&
            prev.research.find((r) => r.id === "window-manager")?.completed
          ) {
            return { ...u, unlocked: true };
          } else if (
            u.id === "graphics-card" &&
            prev.research.find((r) => r.id === "graphics-api")?.completed
          ) {
            return { ...u, unlocked: true };
          }
        }
        return u;
      });

      // Check for research unlocks
      const newResearch = prev.research.map((r) => {
        if (
          !r.unlocked &&
          r.dependencies.every((dep) => {
            if (r.era !== prev.stage) return false;
            if (dep === "intern")
              return (
                (newUpgradesWithUnlocks.find((u) => u.id === "intern")?.owned ||
                  0) > 0
              );
            return (
              prev.research.find((res) => res.id === dep)?.completed || false
            );
          })
        ) {
          return { ...r, unlocked: true };
        }
        return r;
      });

      // Unlock research tab if first intern bought
      const newUnlockedTabs = [...prev.unlockedTabs];
      if (upgradeId === "intern" && !newUnlockedTabs.includes("research")) {
        newUnlockedTabs.push("research");
      }

      return {
        ...prev,
        money: prev.money - totalCost,
        upgrades: newUpgradesWithUnlocks,
        research: newResearch,
        autoIncome: newAutoIncome,
        guiAutoIncome: newGuiAutoIncome,
        assemblyValue: newAssemblyValue,
        unlockedTabs: newUnlockedTabs,
      };
    });
  }, []);

  const startResearch = useCallback((researchId: string) => {
    setGameState((prev) => {
      const research = prev.research.find((r) => r.id === researchId);
      if (
        !research ||
        !research.unlocked ||
        research.completed ||
        prev.currentResearch ||
        research.era !== prev.stage
      ) {
        return prev;
      }

      // Check dependencies
      const hasAllDependencies = research.dependencies.every((dep) => {
        if (dep === "intern")
          return (prev.upgrades.find((u) => u.id === "intern")?.owned || 0) > 0;
        return prev.research.find((r) => r.id === dep)?.completed || false;
      });

      if (!hasAllDependencies) return prev;

      const internCount =
        prev.upgrades.find((u) => u.id === "intern")?.owned || 0;
      const speedMultiplier = 1 + internCount * 0.5;
      const actualDuration = research.timeRequired / speedMultiplier;

      return {
        ...prev,
        currentResearch: {
          id: researchId,
          startTime: Date.now(),
          duration: actualDuration * 1000, // Convert to milliseconds
        },
      };
    });
  }, []);

  const completeResearch = useCallback((researchId: string) => {
    setGameState((prev) => {
      const newResearch = prev.research.map((r) => {
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
        case "basic-macro":
          newAssemblyCommand = "asmb";
          break;
        case "advanced-macro":
          newAssemblyCommand = "a";
          break;
        case "clipboard-api":
          newClipboardEnabled = true;
          break;
        case "ascii-schematics":
          newAsciiSchematicsEnabled = true;
          break;
        case "stats-dashboard":
          if (!newUnlockedTabs.includes("stats")) {
            newUnlockedTabs.push("stats");
          }
          break;
      }

      // Unlock new research based on completed research
      const updatedResearch = newResearch.map((r) => {
        if (
          !r.unlocked &&
          r.dependencies.every((dep) => {
            if (dep === "intern")
              return (
                (prev.upgrades.find((u) => u.id === "intern")?.owned || 0) > 0
              );
            return (
              newResearch.find((res) => res.id === dep)?.completed || false
            );
          })
        ) {
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
        unlockedTabs: newUnlockedTabs,
      };
    });
  }, []);

  const switchTab = useCallback((tab: string) => {
    setGameState((prev) => {
      if (!prev.unlockedTabs.includes(tab)) return prev;
      return { ...prev, currentTab: tab as any };
    });
  }, []);

  const unlockStatsTab = useCallback(() => {
    setGameState((prev) => {
      const newUnlockedTabs = [...prev.unlockedTabs];
      if (!newUnlockedTabs.includes("stats")) {
        newUnlockedTabs.push("stats");
      }
      return { ...prev, unlockedTabs: newUnlockedTabs };
    });
  }, []);

  const addMoney = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      money: prev.money + amount,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  const setHasUsedHelp = useCallback((used: boolean) => {
    setGameState((prev) => ({
      ...prev,
      hasUsedHelp: used,
    }));
  }, []);

  const transitionToGUI = useCallback(() => {
    setGameState((prev) => ({
      ...initialState,
      stage: "gui",
      startTime: Date.now(),
      upgrades: initialUpgrades.map((u) => ({
        ...u,
        unlocked: u.era === "gui" && u.unlocked,
      })),
      research: initialResearch.map((r) => ({
        ...r,
        unlocked: r.era === "gui" && r.unlocked,
      })),
      goals: initialGoals.map((g) => ({
        ...g,
        visible: g.era === "gui" && g.visible,
      })),
      unlockedTabs: ["goals", "upgrades"],
    }));
  }, []);

  const transitionToTerminal = useCallback(() => {
    setGameState((prev) => ({
      ...initialState,
      goals: initialGoals.map((g) => ({
        ...g,
        visible: g.era === "terminal" && g.visible,
      })),
    }));
  }, []);

  const updateGoals = useCallback(() => {
    setGameState((prev) => {
      const updatedGoals = prev.goals.map((goal) => {
        let completed = goal.completed;
        let visible = goal.visible;

        switch (goal.id) {
          case "first-help":
            completed = prev.hasUsedHelp;
            break;
          case "first-assembly":
            visible = prev.hasUsedHelp;
            completed = prev.sessions > 0;
            break;
          case "hire-intern":
            visible = prev.sessions > 0 && prev.hasUsedHelp;
            completed =
              (prev.upgrades.find((u) => u.id === "intern")?.owned || 0) > 0;
            break;
          case "first-research":
            visible =
              (prev.upgrades.find((u) => u.id === "intern")?.owned || 0) > 0;
            completed = prev.researchCompleted > 0;
            break;
          case "gui-transition":
            visible = prev.researchCompleted > 0;
            completed =
              prev.research.find((r) => r.id === "project-gui")?.completed ||
              false;
            break;
          case "first-click":
            completed = prev.buttonPresses > 0;
            break;
          case "gui-upgrade":
            visible = prev.buttonPresses > 0;
            completed = prev.upgrades.some(
              (u) => u.era === "gui" && u.owned > 0
            );
            break;
          case "automation":
            visible = prev.upgrades.some((u) => u.era === "gui" && u.owned > 0);
            completed = prev.research.some(
              (r) => r.era === "gui" && r.completed
            );
            break;
        }

        return { ...goal, completed, visible };
      });

      return { ...prev, goals: updatedGoals };
    });
  }, []);
  return {
    gameState,
    updateMoney,
    performAssembly,
    performButtonPress,
    buyUpgrade,
    startResearch,
    completeResearch,
    switchTab,
    unlockStatsTab,
    addMoney,
    resetGame,
    setHasUsedHelp,
    transitionToGUI,
    transitionToTerminal,
    updateGoals,
  };
}

function calculateUpgradeCost(upgrade: Upgrade, amount: number): number {
  let totalCost = 0;
  for (let i = 0; i < amount; i++) {
    totalCost += Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned + i)
    );
  }
  return totalCost;
}
