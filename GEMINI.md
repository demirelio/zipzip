# Project Overview: Zip Zip Game

**Zip Zip** is a side-scrolling "Chrome Dino"-style game built with **Svelte 5** and **TypeScript**. The player controls a square character that must jump over various geometric obstacles. The game features dynamic animations, a platforming mechanic with solid objects, and a high-score system.

## Main Technologies
- **Svelte 5**: Utilizing Runes (`$state`, `$derived`, `$props`) for reactivity and state management.
- **Vite**: Modern frontend tooling for development and building.
- **TypeScript**: Ensuring type safety across the game engine and UI components.
- **SVG Rendering**: Entities are rendered as vector shapes for a clean, geometric aesthetic.

## Architecture
The project follows an Object-Oriented (OO) design for the game logic, separated from the Svelte UI layer:

- **Game Engine (`src/lib/game/Engine.svelte.ts`)**: 
  - Manages the main game loop (`requestAnimationFrame`).
  - Handles obstacle spawning, movement, and collision detection.
  - Controls game state (Start, Playing, Game Over) and scoring.
- **Player Logic (`src/lib/game/Player.svelte.ts`)**:
  - Manages physics (gravity, velocity, jumping).
  - Implements "Squash and Stretch" and rotation animations using reactive state.
- **Obstacle Logic (`src/lib/game/Obstacle.svelte.ts`)**:
  - Defines various shapes (Square, Triangle, Rectangle, Circle).
  - Supports "Solid" obstacles that act as platforms.
- **UI Components**:
  - `src/lib/Shape.svelte`: Reusable component for rendering entities with dynamic faces/expressions.
  - `src/routes/+page.svelte`: The main entry point, rendering the game board and handling global input events.

## Building and Running

### Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production
Build the project for production:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

### Type Checking
Run Svelte and TypeScript checks:
```bash
npm run check
```

## Development Conventions

- **Runes Mode**: Always use Svelte 5 runes (`$state`, `$derived`, etc.) for reactivity.
- **OO Logic**: Keep core game mechanics (physics, collision, loop) inside `.svelte.ts` classes to maintain a clear separation of concerns.
- **SVG first**: Prefer SVG shapes for all game entities to maintain the geometric design language.
- **SSR Safety**: Always guard browser-specific APIs (like `localStorage` or `requestAnimationFrame`) with `if (browser)` from `$app/environment`.
- **Naming**: Classes use PascalCase (e.g., `Engine`), variables and functions use camelCase.
