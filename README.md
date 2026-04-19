# Ambia

**Sensory Sanctuary PWA.** Focus, sleep, and relaxation through procedural noise.

Ambia is a minimalist procedural noise generator designed to create a "Sensory Sanctuary". Unlike static audio loops, Ambia generates White, Pink, and Brown noise in real-time using the Web Audio API, providing a seamless and infinite soundscape tailored for deep focus or restful sleep.

> [!NOTE]
> This project was developed as part of the **"Current Trends and Topics in Computing"** course.

## Features

- **Procedural Audio**: Real-time noise generation (White, Pink, Brown/Red) using the Web Audio API.
- **Quiet UI**: An editorial-inspired aesthetic prioritizing negative space, editorial typography (Manrope), and a "No-Line Rule" design philosophy.
- **Keyboard Navigation**: Full control over playback, volume, navigation, and theme via intuitive keyboard shortcuts.
- **Editorial Tooltips**: Discover shortcuts through minimalist, 3D-styled keycap tooltips that appear on hover.
- **Dynamic Theming**: Interface colors, accents, and "Aura" backgrounds shift dynamically based on the active noise type.
- **PWA & Offline**: Installable on mobile and desktop with robust offline support via Serwist.
- **Focus Timer**: Integrated session timer with subtle haptic feedback and persistence.

## Keyboard Shortcuts

| Action               | Shortcut  |
| :------------------- | :-------- |
| **Play / Pause**     | `SPACE`   |
| **Previous Noise**   | `↑`       |
| **Next Noise**       | `↓`       |
| **Volume Up / Down** | `→` / `←` |
| **Custom Timer**     | `T`       |
| **Toggle Theme**     | `M`       |
| **About / Settings** | `A`       |

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: React 19, Tailwind CSS 4, Lucide React
- **Audio**: Web Audio API (Procedural Generation)
- **Haptics**: Web Haptics API
- **PWA**: Serwist
- **Runtime**: Bun

## Getting Started

### Installation

Ensure you have [Bun](https://bun.sh/) installed.

```bash
# Clone the repository
git clone https://github.com/znarfm/ambia
cd ambia

# Install dependencies
bun i
```

### Running Locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the sanctuary.

## Development

- `bun build`: Production build.
- `bun lint`: Run ESLint to ensure code quality and prevent cascading renders.
- `bun format`: Format code via Prettier.
