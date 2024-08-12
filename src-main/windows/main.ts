import { BrowserWindow, nativeTheme } from 'electron/main'
import * as path from 'node:path'
import { DARK_BACK_COLOR, ROOT } from '../constant'

let win: BrowserWindow = null!
let quit = false

export function create() {
  win = new BrowserWindow({
    width: 400,
    height: 800,
    show: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false,
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
    },
    webPreferences: {
      preload: path.join(ROOT, 'preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })
  win.once('ready-to-show', () => {
    win.show()
    if (import.meta.env.DEV || process.argv.includes('--dev')) {
      win.webContents.openDevTools({ mode: 'bottom' })
    }
  })

  win.on('close', (e) => {
    if (!quit) {
      e.preventDefault()
      win.hide()
    }
  })

  if (import.meta.env.DEV) {
    win.loadURL('http://localhost:5174')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/index.html'))
  }
}

export function focus() {
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.show()
    win.focus()
  }
}

export function send(channel: string, ...args: unknown[]) {
  win.webContents.send(channel, ...args)
}

export function setMainTitleBarOverlay() {
  if (win) {
    win.setTitleBarOverlay({
      color: nativeTheme.shouldUseDarkColors ? DARK_BACK_COLOR : '#fff',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#fff' : DARK_BACK_COLOR,
    })
  }
}

export function mainNavigate(to: string) {
  send('NAVIGATE', to)
}

export function beforeQuit() {
  quit = true
}

export function hideMainWidow() {
  win.hide()
}