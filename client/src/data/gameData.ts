export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  owned: number;
  effect: string;
  unlocked: boolean;
  costMultiplier: number;
  era: 'terminal' | 'gui' | 'internet';
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
  era: 'terminal' | 'gui' | 'internet';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  visible: boolean;
  requirement: () => boolean;
  era: 'terminal' | 'gui' | 'internet';
}

export const initialUpgrades: Upgrade[] = [
  // Terminal Era Upgrades
  {
    id: "intern",
    name: "Hire Intern",
    description: "Enables research and speeds up projects.",
    baseCost: 25,
    owned: 0,
    effect: "+50% research speed per intern",
    unlocked: true,
    costMultiplier: 1.5,
    era: 'terminal'
  },
  {
    id: "coffee-machine",
    name: "Coffee Machine",
    description: "Generates small passive income from vending.",
    baseCost: 10,
    owned: 0,
    effect: "+$0.5/sec per machine",
    unlocked: true,
    costMultiplier: 1.3,
    era: 'terminal'
  },
  {
    id: "script",
    name: "Automated Script",
    description: "Generates passive income.",
    baseCost: 50,
    owned: 0,
    effect: "+$1/sec per script",
    unlocked: true,
    costMultiplier: 1.8,
    era: 'terminal'
  },
  {
    id: "tooling",
    name: "Development Tooling",
    description: "Improves assembly efficiency.",
    baseCost: 100,
    owned: 0,
    effect: "+$1 per manual assembly",
    unlocked: false,
    costMultiplier: 1.6,
    era: 'terminal'
  },
  {
    id: "assembly-optimizer",
    name: "Assembly Optimizer",
    description: "Increases income per assembly.",
    baseCost: 150,
    owned: 0,
    effect: "+$2 per manual assembly",
    unlocked: false,
    costMultiplier: 1.7,
    era: 'terminal'
  },
  {
    id: "script-enhancer",
    name: "Script Enhancer",
    description: "Boosts script output.",
    baseCost: 300,
    owned: 0,
    effect: "+$0.5/sec to each script",
    unlocked: false,
    costMultiplier: 1.9,
    era: 'terminal'
  },
  {
    id: "intern-manager",
    name: "Intern Manager",
    description: "Improves intern productivity.",
    baseCost: 500,
    owned: 0,
    effect: "+25% additional research speed boost per intern",
    unlocked: false,
    costMultiplier: 2.0,
    era: 'terminal'
  },
  // GUI Era Upgrades
  {
    id: "mouse-upgrade",
    name: "Ergonomic Mouse",
    description: "Increases button press efficiency.",
    baseCost: 15,
    owned: 0,
    effect: "+$0.5 per button press",
    unlocked: true,
    costMultiplier: 1.4,
    era: 'gui'
  },
  {
    id: "auto-clicker",
    name: "Auto-Clicker",
    description: "Automatically presses buttons.",
    baseCost: 100,
    owned: 0,
    effect: "+1 button press/sec",
    unlocked: false,
    costMultiplier: 1.6,
    era: 'gui'
  },
  {
    id: "gui-framework",
    name: "GUI Framework",
    description: "Unlocks advanced interface features.",
    baseCost: 250,
    owned: 0,
    effect: "Enables window management",
    unlocked: false,
    costMultiplier: 1.8,
    era: 'gui'
  },
  {
    id: "graphics-card",
    name: "Graphics Accelerator",
    description: "Improves visual rendering speed.",
    baseCost: 500,
    owned: 0,
    effect: "+$2 per button press",
    unlocked: false,
    costMultiplier: 2.0,
    era: 'gui'
  }
];

export const initialResearch: Research[] = [
  // Terminal Era Research
  {
    id: "basic-macro",
    name: "Basic Macro",
    description: 'Shortens "assemble" to "asmb"',
    cost: 0,
    timeRequired: 30,
    dependencies: ["intern"],
    unlocked: false,
    completed: false,
    effect: "Assembly command shortened",
    era: 'terminal'
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
    effect: "Assembly command further shortened",
    era: 'terminal'
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
    effect: "Allows pasting assembly command",
    era: 'terminal'
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
    effect: "Visual assembly station enhancement",
    era: 'terminal'
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
    effect: "Enhanced terminal interface",
    era: 'terminal'
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
    effect: "Enables stats tab",
    era: 'terminal'
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
    effect: "Unlocks efficiency upgrades",
    era: 'terminal'
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
    effect: "Unlocks script upgrades",
    era: 'terminal'
  },
  {
    id: "project-gui",
    name: "Project GUI",
    description: "WIMP Interface Development - Unlocks transition to GUI era",
    cost: 0,
    timeRequired: 300,
    dependencies: ["basic-macro", "advanced-macro", "clipboard-api", "ascii-schematics", "stats-dashboard"],
    unlocked: false,
    completed: false,
    effect: "Enables stage transition to GUI era",
    era: 'terminal'
  },
  // GUI Era Research
  {
    id: "window-manager",
    name: "Window Manager",
    description: "Enables multiple window support",
    cost: 0,
    timeRequired: 60,
    dependencies: [],
    unlocked: true,
    completed: false,
    effect: "Unlocks window management features",
    era: 'gui'
  },
  {
    id: "event-system",
    name: "Event System",
    description: "Improves user interaction handling",
    cost: 0,
    timeRequired: 90,
    dependencies: ["window-manager"],
    unlocked: false,
    completed: false,
    effect: "Enables advanced UI interactions",
    era: 'gui'
  },
  {
    id: "graphics-api",
    name: "Graphics API",
    description: "Accelerated graphics rendering",
    cost: 0,
    timeRequired: 120,
    dependencies: ["event-system"],
    unlocked: false,
    completed: false,
    effect: "Improves visual performance",
    era: 'gui'
  },
  {
    id: "networking-stack",
    name: "Networking Stack",
    description: "Enables network communication",
    cost: 0,
    timeRequired: 180,
    dependencies: ["graphics-api"],
    unlocked: false,
    completed: false,
    effect: "Prepares for Internet era transition",
    era: 'gui'
  }
];

export const initialGoals: Goal[] = [
  // Terminal Era Goals
  {
    id: "first-help",
    title: "Learn the Interface",
    description: "Type 'help' in the terminal to see available commands",
    completed: false,
    visible: true,
    requirement: () => false, // Will be set by game state
    era: 'terminal'
  },
  {
    id: "first-assembly",
    title: "First Assembly",
    description: "Type 'assemble' in the Manual Assembly Station to earn your first dollar",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'terminal'
  },
  {
    id: "hire-intern",
    title: "Hire Your First Intern",
    description: "Purchase an intern to unlock research capabilities",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'terminal'
  },
  {
    id: "first-research",
    title: "Begin Research",
    description: "Start your first research project to improve efficiency",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'terminal'
  },
  {
    id: "gui-transition",
    title: "Reach GUI Era",
    description: "Complete 'Project GUI' research, then type 'transition gui' to advance to the next era",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'terminal'
  },
  // GUI Era Goals
  {
    id: "first-click",
    title: "First Button Press",
    description: "Click the button to start earning in the GUI era",
    completed: false,
    visible: true,
    requirement: () => false,
    era: 'gui'
  },
  {
    id: "gui-upgrade",
    title: "Improve Your Setup",
    description: "Purchase your first GUI-era upgrade",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'gui'
  },
  {
    id: "automation",
    title: "Automate Production",
    description: "Research and implement automated systems",
    completed: false,
    visible: false,
    requirement: () => false,
    era: 'gui'
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