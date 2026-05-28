# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Vite dev server only (port 5173)
npm run electron:dev  # Vite + Electron concurrently (main dev workflow)
npm run build         # tsc && vite build (outputs to dist/ and dist-electron/)
npm run electron:build # Build + package with electron-builder (outputs to release/)
npm run preview       # Vite preview of built dist
```

## Architecture

Electron app with three renderer windows managed by `electron/main.ts`. Window routing uses URL hash: default = main window, `#/pet` = desktop pet overlay, `#/mini` = mini timer overlay.

**Main process** (`electron/main.ts`): Creates and manages BrowserWindows (main, pet, mini), system tray, and IPC handlers. Uses `electron-store` for persistence. Exposes IPC channels for store CRUD, window controls, notifications, and cross-window state sync.

**Preload** (`electron/preload.ts`): Bridges IPC to renderer via `contextBridge.exposeInMainWorld('electronAPI', ...)`. All renderer-to-main communication goes through this interface.

**Renderer** (`src/`): React 18 + Zustand + TypeScript. Single-page app with tab-based navigation (timer/tasks/stats). Zustand store (`src/store/appStore.ts`) holds all app state; the App component syncs it bidirectionally with `electron-store` on load and on every state change.

**Timer** (`src/hooks/useTimer.ts`): Core timer loop via `setInterval`. Auto-transitions: work finish → shortBreak (or longBreak every Nth) after 1.5s delay; break finish → idle with notification. Generates beep sounds via Web Audio API. petState derived from timerStatus + timerType.

**Component tree**: `App` → `TitleBar` + tab pages (`TimerCircle` + `TimerControls` + `DesktopPet` / `TaskList` / `StatsPanel`) + `SettingsPanel` (modal overlay). `DesktopPet` renders pet image + speech bubble + state effects (ZZZ, sweat, sparkles). `MiniTimer` is a standalone component for the mini window route.

**CSS**: CSS variables in `global.css` define the pink theme palette (`--pink-*`), ring colors, shadows, and border radii. `.drag-region` / `.no-drag` classes control frameless window dragging.
