/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

interface ElectronAPI {
  store: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<boolean>
  }
  notify: (title: string, body: string) => Promise<void>
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
  }
  pet: {
    show: () => Promise<void>
    hide: () => Promise<void>
    updateState: (state: string, message?: string) => Promise<void>
    onStateChanged: (callback: (state: string, message?: string) => void) => void
  }
  mini: {
    show: () => Promise<void>
    hide: () => Promise<void>
    update: (data: { time: string; progress: number; running: boolean }) => Promise<void>
    onUpdate: (callback: (data: { time: string; progress: number; running: boolean }) => void) => void
  }
}

interface Window {
  electronAPI?: ElectronAPI
}
