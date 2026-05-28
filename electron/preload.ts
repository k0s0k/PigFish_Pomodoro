const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
  },
  notify: (title: string, body: string) => ipcRenderer.invoke('notify', title, body),
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  pet: {
    show: () => ipcRenderer.invoke('pet:show'),
    hide: () => ipcRenderer.invoke('pet:hide'),
    updateState: (state: string, message?: string) => ipcRenderer.invoke('pet:update-state', state, message),
    onStateChanged: (callback: (state: string, message?: string) => void) => {
      ipcRenderer.on('pet:state-changed', (_event, state, message) => callback(state, message))
    }
  },
  mini: {
    show: () => ipcRenderer.invoke('mini:show'),
    hide: () => ipcRenderer.invoke('mini:hide'),
    update: (data: { time: string; progress: number; running: boolean }) =>
      ipcRenderer.invoke('mini:update', data),
    onUpdate: (callback: (data: { time: string; progress: number; running: boolean }) => void) => {
      ipcRenderer.on('mini:update', (_event, data) => callback(data))
    }
  }
})
