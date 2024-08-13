import fsp from 'node:fs/promises'
import path from 'node:path'
import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  screen,
  session,
  Notification,
} from 'electron/main'
import { ROOT } from '../constant'
import type { RecorderConfig } from '../types'
import { setNormalTray, setStopRecordTray } from '../menu'
import { dateFileName } from '../utils'
import { shell } from 'electron/common'
import { sendToMain } from './main'
import { successIcon } from '../icons'

let win: BrowserWindow = null!
let quit = false
let recorderConfig: RecorderConfig = {
  systemAudio: false,
  delay: 0,
  savePath: '',
  ext: 'mp4',
}
let notification: Notification = null!

export function createRecorderWindow() {
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
    startRecorder()
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

export function startRecorder() {
  if (win === null) {
    createRecorderWindow()
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
      const audio = recorderConfig.systemAudio ? 'loopback' : 'loopbackWithMute'
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

/**
 * IPC
 */
app.whenReady().then(() => {
  ipcMain.handle('UPDATE_RECORDER_CONFIG', (_e, config: RecorderConfig) => {
    recorderConfig = config
  })

  ipcMain.handle('START_RECORD', startRecorder)

  ipcMain.handle('STOP_RECORD', stopRecorder)

  ipcMain.handle('SAVE_VIDEO', (_e, arrayBuffer: ArrayBuffer) => {
    console.log('SAVE_VIDEO')
    setNormalTray()
    const buffer = Buffer.from(arrayBuffer)
    const videoPath = path.join(
      recorderConfig.savePath,
      `video_record_${dateFileName()}.mp4`
    )
    return fsp
      .writeFile(videoPath, buffer)
      .then(() => {
        notification = new Notification({
          title: '视频录制完成',
          body: `保存路径为：${videoPath}`,
          icon: successIcon,
        })
        notification.show()
        notification.on('click', () => {
          shell.openPath(videoPath)
        })
      })
      .finally(() => {
        sendToMain('RECORDER_STATUS_CHANGE', 'stop')
      })
  })

  ipcMain.handle('RECORDER_STARTED', () => {
    sendToMain('RECORDER_STATUS_CHANGE', 'start')
    setStopRecordTray()
  })
})
