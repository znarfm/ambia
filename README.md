# Ambia

**Sensory Sanctuary PWA.** Focus, sleep, and relaxation through procedural noise.

Ambia is a minimalist procedural noise generator designed to create a "Sensory Sanctuary". Unlike static audio loops, Ambia generates White, Pink, and Brown (*or Brownian or Red*) noise in real-time using the Web Audio API, providing a seamless and infinite soundscape tailored for deep focus or restful sleep.

> [!NOTE]
> This project was developed as part of the **"Current Trends and Topics in Computing"** course.

## Features

- **Procedural Audio**: Real-time noise generation (White, Pink, Brown/Red) using the Web Audio API.
- **Quiet UI**: An editorial-inspired aesthetic prioritizing negative space and typography.
- **Dynamic Theming**: Interface colors and accents shift based on the selected noise type.
- **PWA Ready**: Installable on mobile and desktop with full offline support.
- **Focus Timer**: Integrated session timer with subtle haptic feedback.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: React 19, Tailwind CSS 4, Lucide React
- **Audio**: Web Audio API
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
- `bun lint`: Run ESLint.
- `bun format`: Format via Prettier.
