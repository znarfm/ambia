# GEMINI.md - Ambia Project Context

## Project Overview

Ambia is a "Sensory Sanctuary" Progressive Web App (PWA) designed for focus, sleep, and relaxation through procedural noise generation (White, Pink, and Brown noise). It prioritizes a "Quiet UI" aesthetic with an editorial feel, avoiding high-friction layouts in favor of atmospheric depth and negative space.

### Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **Runtime**: Bun (lockfile present)
- **UI**: React 19, Tailwind CSS 4, Lucide React (Icons)
- **Theme**: `next-themes` (System/Dark/Light)
- **Typography**: Manrope (Google Font)
- **PWA**: Service worker (`sw.js`) and manifest.

## Building and Running

Commands assume usage of **Bun** (preferred) or **NPM**:

- `bun dev`: Start development server.
- `bun build`: Build for production.
- `bun start`: Start production server.
- `bun lint`: Run ESLint.
- `bun format`: Format code with Prettier.

## Development Conventions

### 1. Design Philosophy ("Sensory Sanctuary")

Strictly follow `DESIGN.md`. Key rules:

- **No-Line Rule**: Prohibit 1px solid borders for sectioning. Use background color shifts (`surface` vs `surface-container`) to define boundaries.
- **Editorial Typography**: Use `Manrope`. Display scales use `-0.02em` tracking. Labels use All-Caps with `0.05em` tracking.
- **Negative Space**: Prioritize white space. elements are balanced by weight/tone rather than rigid grids.
- **Dynamic Theming**: Surface colors and accents shift based on the active noise type (White = Pure/Sky, Pink = Rose/Rain, Brown = Deep/Earthy).

### 2. Implementation Patterns

- **Audio Logic**: Contained in `hooks/use-noise.ts`. Procedural generation is preferred over static files.
- **Snap Scrolling**: The main interface uses vertical snap-scroll sections (`.snap-section`) to switch between noise types.
- **State Persistence**: Volume, active noise, and timer states are persisted in `localStorage`.
- **Client Components**: The main UI (`app/page.tsx`) is a `"use client"` directive due to audio and intersection observer dependencies.

## Architecture & Key Files

- `app/page.tsx`: Main interaction controller (playback, timer, navigation).
- `components/noise-section.tsx`: Visual representation of soundscapes with "Aura" background effects.
- `hooks/use-noise.ts`: Web Audio API implementation for noise generation.
- `DESIGN.md`: The definitive guide for UI/UX standards.
- `public/sw.js`: Service worker for offline PWA capabilities.

## TODO / Future Directions

- [ ] Add more procedural soundscapes (Blue, Violet, Gray noise).
- [ ] Implement audio visualization in `BackgroundAura`.
- [ ] Enhance offline caching for icon/font assets.
