export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  owned: number;
  effect: string;
  unlocked: boolean;
  costMultiplier: number;
}

export interface Research {
  id: string;
  name: string;
  description: string;
  cost: number;
  timeRequired: number;
  dependencies: string[];
  unlocked: boolean;
  completed: boolean;
  effect: string;
}

export const initialUpgrades: Upgrade[] = [
  {
    id: "intern",
    name: "Hire Intern",
    description: "Enables research and speeds up projects.",
    baseCost: 25,
    owned: 0,
    effect: "+50% research speed per intern",
    unlocked: true,
    costMultiplier: 1.5
  },
  {
    id: "coffee-machine",
    name: "Coffee Machine",
    description: "Generates small passive income from vending.",
    baseCost: 10,
    owned: 0,
    effect: "+$0.5/sec per machine",
    unlocked: true,
    costMultiplier: 1.3
  },
  {
    id: "script",
    name: "Automated Script",
    description: "Generates passive income.",
    baseCost: 50,
    owned: 0,
    effect: "+$1/sec per script",
    unlocked: true,
    costMultiplier: 1.8
  },
  {
    id: "tooling",
    name: "Development Tooling",
    description: "Improves assembly efficiency.",
    baseCost: 100,
    owned: 0,
    effect: "+$1 per manual assembly",
    unlocked: false,
    costMultiplier: 1.6
  },
  {
    id: "assembly-optimizer",
    name: "Assembly Optimizer",
    description: "Increases income per assembly.",
    baseCost: 150,
    owned: 0,
    effect: "+$2 per manual assembly",
    unlocked: false,
    costMultiplier: 1.7
  },
  {
    id: "script-enhancer",
    name: "Script Enhancer",
    description: "Boosts script output.",
    baseCost: 300,
    owned: 0,
    effect: "+$0.5/sec to each script",
    unlocked: false,
    costMultiplier: 1.9
  },
  {
    id: "intern-manager",
    name: "Intern Manager",
    description: "Improves intern productivity.",
    baseCost: 500,
    owned: 0,
    effect: "+25% additional research speed boost per intern",
    unlocked: false,
    costMultiplier: 2.0
  }
];

export const initialResearch: Research[] = [
  {
    id: "basic-macro",
    name: "Basic Macro",
    description: 'Shortens "assemble" to "asmb"',
    cost: 0,
    timeRequired: 30,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Assembly command shortened"
  },
  {
    id: "advanced-macro",
    name: "Advanced Macro",
    description: 'Shortens "asmb" to "a"',
    cost: 0,
    timeRequired: 45,
    dependencies: ["basic-macro"],
    unlocked: false,
    completed: false,
    effect: "Assembly command further shortened"
  },
  {
    id: "clipboard-api",
    name: "Clipboard API",
    description: "Enables copy-paste functionality",
    cost: 0,
    timeRequired: 60,
    dependencies: ["basic-macro", "advanced-macro"],
    unlocked: false,
    completed: false,
    effect: "Allows pasting assembly command"
  },
  {
    id: "ascii-schematics",
    name: "ASCII Art Schematics",
    description: "Adds visual assembly diagrams",
    cost: 0,
    timeRequired: 25,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Visual assembly station enhancement"
  },
  {
    id: "improved-cli",
    name: "Improved CLI",
    description: "Adds color-coding and better output",
    cost: 0,
    timeRequired: 40,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Enhanced terminal interface"
  },
  {
    id: "stats-dashboard",
    name: "Stats Dashboard",
    description: "Unlocks detailed statistics tracking",
    cost: 0,
    timeRequired: 35,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Enables stats tab"
  },
  {
    id: "efficiency-research",
    name: "Efficiency Research",
    description: "Unlocks advanced tooling upgrades",
    cost: 0,
    timeRequired: 90,
    dependencies: ["improved-cli"],
    unlocked: false,
    completed: false,
    effect: "Unlocks efficiency upgrades"
  },
  {
    id: "automation-theory",
    name: "Automation Theory",
    description: "Unlocks script enhancement upgrades",
    cost: 0,
    timeRequired: 120,
    dependencies: ["basic-macro"],
    unlocked: false,
    completed: false,
    effect: "Unlocks script upgrades"
  },
  {
    id: "project-gui",
    name: "Project GUI",
    description: "Unlocks transition to GUI era",
    cost: 0,
    timeRequired: 300,
    dependencies: ["basic-macro", "advanced-macro", "clipboard-api", "ascii-schematics", "stats-dashboard"],
    unlocked: false,
    completed: false,
    effect: "Enables stage transition"
  }
];

export const commands = {
  help: "Available commands: buy [upgrade] [amount], research [project], help, stats, transition",
  buy: {
    description: "Purchase upgrades",
    syntax: "buy [upgrade-id] [amount]",
    examples: ["buy intern 1", "buy script 5"]
  },
  research: {
    description: "Start research projects",
    syntax: "research [project-id]",
    examples: ["research basic-macro"]
  }
};
