# Atlas OS — System Architecture

## Overview

Atlas OS is structured as a pnpm monorepo consisting of a desktop application (Electron + Vite + React + TypeScript), a backend server (NestJS/Node.js), shared libraries, and infrastructure configurations.

```
atlas-os/
├── apps/
│   ├── desktop/          # Electron Main Process + Preload + React Renderer UI
│   └── backend/          # NestJS Server (Auth, Memory, Indexer, Gateway, Health)
├── packages/
│   ├── shared/           # Types, DTOs, IPC Channel Contracts, State Definitions
│   ├── character/        # State Machine (14 States), Character Controller
│   └── ui/               # Design Tokens, Glassmorphism CSS, Digital Eyes Canvas
└── infra/
    └── docker/           # Postgres (pgvector) & Redis compose config
```

---

## 1. Desktop Shell (`apps/desktop`)

- **Main Process:** Manages application lifecycle, native menus, system tray, global hotkeys (`Ctrl+Space`), and two primary web contents windows:
  1. **Main Window:** 1400x900 frameless window running the primary OS interface.
  2. **Floating Companion Window:** 240x240 frameless, transparent, always-on-top window housing Atlas's desktop presence.
- **IPC Layer:** Strict IPC channel contracts using Electron `contextBridge`. No raw Node.js API access exposed to renderers.

---

## 2. Character State Machine (`packages/character`)

Centralized state management controlling Atlas's digital face and animations.

States:
`IDLE` | `LISTENING` | `THINKING` | `SEARCHING` | `PLANNING` | `WORKING` | `SPEAKING` | `SUCCESS` | `WARNING` | `ERROR` | `SLEEP` | `EXCITED` | `PAUSED` | `AWAITING_PERMISSION`

Controlled programmatically via `CharacterStateMachine` API:
```typescript
const character = new CharacterStateMachine();
character.setState(AtlasState.THINKING);
```

---

## 3. Backend System (`apps/backend`)

Built with NestJS:
- **Health Module:** `/health` endpoint returning system status, DB connectivity, and memory metrics.
- **WebSockets Gateway:** Pushes realtime Atlas state, task progress, and file indexing events to the desktop app.
- **Database Layer:** Prisma ORM connecting to PostgreSQL + pgvector for persistent memory and file index metadata.
- **Cache & Queue Layer:** Redis + BullMQ for asynchronous chunking, embedding, and background workflow runs.
