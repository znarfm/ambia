# GEMINI.md - Ambia Project Context

## Project Overview

Ambia "Sensory Sanctuary" PWA. Focus, sleep, relaxation via procedural noise (White, Pink, Brown). "Quiet UI" aesthetic, editorial feel. Avoid high-friction layouts. Depth + negative space.

### Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **Runtime**: Bun (lockfile present)
- **UI**: React 19, Tailwind CSS 4, Lucide React
- **Theme**: `next-themes` (System/Dark/Light)
- **Typography**: Manrope (Google Font)
- **PWA**: Service worker (`sw.js`) + manifest.

## Building and Running

Use **Bun** (preferred) or **NPM**:

- `bun dev`: Start dev server.
- `bun build`: Production build.
- `bun start`: Start prod server.
- `bun lint`: Run ESLint.
- `bun format`: Format via Prettier.

## Development Conventions

### 1. Design Philosophy ("Sensory Sanctuary")

Follow `DESIGN.md`. Rules:

- **No-Line Rule**: No 1px solid borders. Use bg color shifts (`surface` vs `surface-container`).
- **Editorial Typography**: `Manrope`. Display scale `-0.02em` tracking. Labels All-Caps `0.05em` tracking.
- **Negative Space**: Prioritize white space. Balance by weight/tone, not rigid grids.
- **Dynamic Theming**: Colors + accents shift by noise type (White = Pure/Sky, Pink = Rose/Rain, Brown = Deep/Earthy).

### 2. Implementation Patterns

- **Audio Logic**: `hooks/use-noise.ts`. Procedural gen > static files.
- **Snap Scrolling**: Main UI use vertical snap-scroll (`.snap-section`).
- **State Persistence**: Volume, noise, timer in `localStorage`.
- **Client Components**: `app/page.tsx` is `"use client"` (audio + intersection observer).

## Architecture & Key Files

- `app/page.tsx`: Main controller (playback, timer, nav).
- `components/noise-section.tsx`: Soundscapes + "Aura" bg.
- `hooks/use-noise.ts`: Web Audio API noise gen.
- `DESIGN.md`: UI/UX standards.
- `public/sw.js`: SW for offline PWA.
