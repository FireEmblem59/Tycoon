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
    id: "script",
    name: "Automated Script",
    description: "Generates passive income.",
    baseCost: 75,
    owned: 0,
    effect: "+$1/sec per script",
    unlocked: true,
    costMultiplier: 2.0
  },
  {
    id: "tooling",
    name: "Development Tooling",
    description: "Improves assembly efficiency.",
    baseCost: 200,
    owned: 0,
    effect: "+$1 per manual assembly",
    unlocked: false,
    costMultiplier: 1.8
  }
];

export const initialResearch: Research[] = [
  {
    id: "basic-macro",
    name: "Basic Macro",
    description: 'Shortens "assemble" to "asmb"',
    cost: 0,
    timeRequired: 60,
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
    timeRequired: 120,
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
    timeRequired: 90,
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
    timeRequired: 45,
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
    timeRequired: 75,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Enhanced terminal interface"
  },
  {
    id: "project-gui",
    name: "Project GUI",
    description: "Unlocks transition to GUI era",
    cost: 0,
    timeRequired: 300,
    dependencies: ["basic-macro", "advanced-macro", "clipboard-api", "ascii-schematics"],
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
