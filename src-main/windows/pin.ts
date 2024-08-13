import * as path from 'node:path'
import { app, BrowserWindow, ipcMain, nativeTheme, screen } from 'electron/main'
import { DARK_BACK_COLOR, ROOT } from '../constant'

let screenWidth = 1920

app.whenReady().then(() => {
  screenWidth = screen.getPrimaryDisplay().workAreaSize.width
})

let count = 0
const map = new Map<number, BrowserWindow>()

export function createPinWindow(url: string) {
  const win = new BrowserWindow({
    width: 400,
    height: 800,
    show: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    // resizable: false,
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
    },
    webPreferences: {
      preload: path.join(ROOT, 'pin-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })
  const id = count
  map.set(id, win)
  count += 1
  win.once('ready-to-show', () => {
    win.webContents.send('ON_PIN', url, id)
    win.show()
    if (import.meta.env.DEV || process.argv.includes('--dev')) {
      win.webContents.openDevTools({ mode: 'bottom' })
    }
  })

  win.once('closed', () => {
    map.delete(count)
  })

  if (import.meta.env.DEV) {
    win.loadURL('http://localhost:5174/pin.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/pin.html'))
  }
}

export function sendToAllPinWindow(channel: string, ...args: any[]) {
  Array.from(map.values()).forEach((w) => {
    w.webContents.send(channel, ...args)
  })
}

export function setPinWindowSize(id: number, width: number, height: number) {
  const win = map.get(id)
  if (win) {
    if (width > screenWidth / 2) {
      const imageWidth = screenWidth / 2
      const imageHeight = Math.round((imageWidth * height) / width)
      win.setSize(imageWidth, imageHeight)
    } else {
      win.setSize(width, height)
    }
  }
}

app.whenReady().then(() => {
  ipcMain.handle(
    'SET_PIN_WINDOW_SIZE',
    (_e, id: number, width: number, height: number) => {
      setPinWindowSize(id, width, height)
    }
  )
})
