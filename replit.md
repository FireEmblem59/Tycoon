# Overview

Button Tycoon is an incremental tycoon game that takes players through the history of computer user interfaces, starting from a text-only terminal and progressing through multiple eras (Terminal → GUI). The game features a Cookie Clicker-style upgrade/research progression system with dramatic gameplay evolution at each stage. Players begin by typing commands in a retro terminal interface to earn money, purchase upgrades, and conduct research to unlock new capabilities and eventually transition to GUI-based gameplay.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application follows a React-based single-page application architecture using Vite as the build tool. The component structure is organized into several key areas:

- **Game State Management**: Centralized state management through custom hooks (`useGameState`) handling all game mechanics including money, upgrades, research, and progression
- **Component Architecture**: Modular component design with clear separation of concerns:
  - `Game.tsx` - Main game controller with loading screen management
  - `GameInterface.tsx` - Primary game logic coordinator with auto-income and research timers
  - `Terminal.tsx` - Command-line interface for player interactions
  - `TabbedInterface.tsx` - Multi-tab UI for different game sections (goals, upgrades, research, stats)
  - `LoadingScreen.tsx` - Initial game boot sequence with ASCII art
  - `ManualAssemblyStation.tsx` - Interactive assembly command interface

## Styling and UI Framework

The project uses a comprehensive design system built on Tailwind CSS with shadcn/ui components:

- **Design System**: shadcn/ui component library with "new-york" style variant
- **Typography**: Monospace fonts (Courier New) for terminal authenticity
- **Theme System**: CSS variables-based theming with extensive color palette
- **Custom Styling**: Terminal-specific CSS with glowing effects, progress bars, and retro aesthetics

## Game Data and Logic

The game architecture separates data definitions from logic implementation:

- **Data Layer**: `gameData.ts` contains all upgrade and research definitions with structured interfaces
- **State Management**: Custom hooks pattern with `useGameState` managing all game state transitions
- **Timer Systems**: Multiple interval-based systems for auto-income generation and research completion
- **Progression System**: Tab-based unlocking mechanism with research dependencies

## Development Tools and Configuration

The project uses modern development tooling:

- **Build System**: Vite with React plugin and TypeScript support
- **Development**: Hot module replacement with Replit-specific plugins
- **Code Quality**: TypeScript with strict configuration and ESNext modules
- **Path Resolution**: Alias system for clean imports (@/, @shared/, @assets/)

# External Dependencies

## UI and Styling Dependencies

- **Radix UI**: Comprehensive headless UI component library for accessibility and functionality (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Class Variance Authority**: Component variant system for consistent styling
- **Lucide React**: Icon library for UI elements

## React Ecosystem

- **React 18**: Core framework with modern hooks and concurrent features
- **React Hook Form**: Form state management with validation (@hookform/resolvers)
- **TanStack Query**: Server state management and data fetching (@tanstack/react-query)
- **React DOM**: DOM rendering and manipulation

## Database and Backend Infrastructure

- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **PostgreSQL**: Primary database system with UUID generation
- **Express.js**: Backend API framework (minimal implementation)

## Development and Build Tools

- **Vite**: Modern build tool and development server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Utility Libraries

- **Date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **cmdk**: Command palette/menu implementation
- **Zod**: Runtime type validation and schema parsing
- **Embla Carousel**: Touch-friendly carousel component

The architecture prioritizes modularity, type safety, and performance while maintaining a retro terminal aesthetic that evolves throughout the game progression.