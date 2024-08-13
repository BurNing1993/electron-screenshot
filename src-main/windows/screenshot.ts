import path from 'node:path'
import fsp from 'node:fs/promises'
import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  screen,
} from 'electron/main'
import { ROOT } from '../constant'
import { ScreenshotConfig } from '../types'
import { hideMainWidow } from './main'
import { createPinWindow } from './pin'
import { clipboard, nativeImage } from 'electron/common'
import { dateFileName } from '../utils'

let win: BrowserWindow = null!
let quit = false
let screenshotConfig: ScreenshotConfig = {
  clipboard: true,
  pin: false,
  save: false,
  savePath: '',
}

export function createScreenshotWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    show: false,
    // titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false,
    skipTaskbar: import.meta.env.PROD,
    frame: false,
    fullscreen: true,
    transparent: true,
    webPreferences: {
      preload: path.join(ROOT, 'screenshot-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })

  win.once('ready-to-show', () => {
    takeScreenshot()
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
    win.loadURL('http://localhost:5174/screenshot.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/screenshot.html'))
  }
}

export function takeScreenshot() {
  hideMainWidow()
  if (win === null) {
    createScreenshotWindow()
    return
  } else {
    win.show()
  }
  const { width, height } = win.getBounds()
  desktopCapturer
    .getSources({
      types: ['screen'],
      thumbnailSize: {
        width,
        height,
      },
    })
    .then((sources) => {
      const cursor = screen.getCursorScreenPoint()
      const currentDisplay = screen.getDisplayNearestPoint(cursor)
      const source = sources.find(
        (s) => Number(s.display_id) === currentDisplay.id
      )
      if (source) {
        return source
      }
      return sources[0]
    })
    .then((s) => {
      win.webContents.send('ON_SCREENSHOT', s.thumbnail.toDataURL())
    })
}

export function closeScreenshot() {
  win.hide()
}

export function beforeScreenshotQuit() {
  quit = true
}

// IPC
app.whenReady().then(() => {
  ipcMain.handle('UPDATE_SCREENSHOT_CONFIG', (_e, config: ScreenshotConfig) => {
    screenshotConfig = config
  })

  ipcMain.handle('SCREENSHOT', takeScreenshot)

  ipcMain.handle('CLOSE_SCREENSHOT', closeScreenshot)

  ipcMain.handle('SAVE_SCREENSHOT', async (_e, arrayBuffer: ArrayBuffer) => {
    closeScreenshot()
    const buffer = Buffer.from(arrayBuffer)
    if (screenshotConfig.pin) {
      const url = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString(
        'base64'
      )}`
      createPinWindow(url)
    }
    if (screenshotConfig.clipboard) {
      clipboard.writeImage(nativeImage.createFromBuffer(buffer))
    }
    if (screenshotConfig.save) {
      await fsp.writeFile(
        path.join(
          screenshotConfig.savePath,
          `screenshot_${dateFileName()}.png`
        ),
        buffer
      )
    }
  })
})
