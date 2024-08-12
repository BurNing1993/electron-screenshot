import path from 'node:path'
import { BrowserWindow, desktopCapturer, screen, session } from 'electron/main'
import { ROOT } from '../constant'
import type { RecorderConfig } from '../types'

let win: BrowserWindow = null!
let quit = false

export function createRecorderWindow(config: RecorderConfig) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
    width,
    height,
    show: false,
    skipTaskbar: import.meta.env.PROD,
    webPreferences: {
      preload: path.join(ROOT, 'recorder-preload.cjs'),
      webSecurity: import.meta.env.PROD,
    },
  })

  win.once('ready-to-show', () => {
    startRecorder(config)
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
    win.loadURL('http://localhost:5174/recorder.html')
  } else {
    win.loadFile(path.join(ROOT, 'renderer/recorder.html'))
  }
}

export function startRecorder(config: RecorderConfig) {
  if (win === null) {
    createRecorderWindow(config)
    return
  }
  if (import.meta.env.DEV) {
    win.show()
  }
  desktopCapturer
    .getSources({
      types: ['screen'],
    })
    .then((sources) => {
      const cursor = screen.getCursorScreenPoint()
      const currentDisplay = screen.getDisplayNearestPoint(cursor)
      const source = sources.find(
        (s) => Number(s.display_id) === currentDisplay.id
      )
      if (source) {
        return source
      } else {
        return sources[0]
      }
    })
    .then((source) => {
      const audio = config.systemAudio ? 'loopback' : 'loopbackWithMute'
      session.defaultSession.setDisplayMediaRequestHandler(
        (_request, callback) => {
          callback({
            video: source,
            audio,
          })
        }
      )
    })
    .finally(() => {
      win.webContents.send('ON_START_RECORDER')
    })
}

export function closeRecorder() {
  win.hide()
}

export function beforeRecorderQuit() {
  quit = true
}

export function stopRecorder() {
  closeRecorder()
  win.webContents.send('ON_STOP_RECORDER')
}
