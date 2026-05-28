import { app, BrowserWindow, ipcMain, Tray, Menu, Notification, nativeImage } from 'electron'
import path from 'path'
import Store from 'electron-store'

const store = new Store({
  defaults: {
    tasks: [],
    sessions: [],
    settings: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      volume: 0.8
    }
  }
})

let mainWindow: BrowserWindow | null = null
let petWindow: BrowserWindow | null = null
let miniWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV !== 'production' || process.argv.includes('--dev')

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 680,
    minWidth: 380,
    minHeight: 600,
    frame: false,
    transparent: true,
    resizable: true,
    skipTaskbar: false,
    icon: path.join(__dirname, '../resources/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createPetWindow() {
  petWindow = new BrowserWindow({
    width: 180,
    height: 200,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    petWindow.loadURL('http://localhost:5173/#/pet')
  } else {
    petWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/pet' })
  }

  petWindow.setIgnoreMouseEvents(false)
  petWindow.on('closed', () => {
    petWindow = null
  })
}

function createMiniWindow() {
  miniWindow = new BrowserWindow({
    width: 200,
    height: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    miniWindow.loadURL('http://localhost:5173/#/mini')
  } else {
    miniWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/mini' })
  }

  miniWindow.on('closed', () => {
    miniWindow = null
  })
}

function createTray() {
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示主窗口', click: () => mainWindow?.show() },
    { label: '显示/隐藏宠物', type: 'checkbox', checked: true, click: (e) => {
      if (petWindow?.isVisible()) petWindow.hide(); else petWindow?.show()
    }},
    { label: '迷你窗口', type: 'checkbox', checked: false, click: (e) => {
      if (miniWindow) miniWindow.close(); else createMiniWindow()
    }},
    { type: 'separator' },
    { label: '退出', click: () => {
      app.isQuitting = true
      app.quit()
    }}
  ])
  tray.setToolTip('番茄宠物')
  tray.setContextMenu(contextMenu)
}

// IPC handlers
ipcMain.handle('store:get', (_event, key: string) => {
  return store.get(key)
})

ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
  store.set(key, value)
  return true
})

ipcMain.handle('store:delete', (_event, key: string) => {
  store.delete(key)
  return true
})

ipcMain.handle('notify', (_event, title: string, body: string) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: false }).show()
  }
})

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.hide()
})

ipcMain.handle('pet:show', () => {
  if (!petWindow) createPetWindow()
  else petWindow.show()
})

ipcMain.handle('pet:hide', () => {
  petWindow?.hide()
})

ipcMain.handle('pet:update-state', (_event, state: string, message?: string) => {
  petWindow?.webContents.send('pet:state-changed', state, message)
  miniWindow?.webContents.send('pet:state-changed', state, message)
})

ipcMain.handle('mini:show', () => {
  if (!miniWindow) createMiniWindow()
  else miniWindow.show()
})

ipcMain.handle('mini:hide', () => {
  miniWindow?.hide()
})

ipcMain.handle('mini:update', (_event, data: { time: string; progress: number; running: boolean }) => {
  miniWindow?.webContents.send('mini:update', data)
})

// app lifecycle
app.whenReady().then(() => {
  createMainWindow()
  createTray()

  app.on('activate', () => {
    if (mainWindow === null) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  petWindow?.close()
  miniWindow?.close()
})
