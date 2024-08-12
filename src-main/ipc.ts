import fsp from 'node:fs/promises'
import path from 'node:path'
import { app, dialog, ipcMain, nativeTheme, Notification } from 'electron/main'
import { clipboard, nativeImage, shell } from 'electron/common'
import { checkForUpdates } from './updater'
import {
  AppPathName,
  RecorderConfig,
  ScreenshotConfig,
  UpdateType,
} from './types'
import {
  hideMainWidow,
  sendToMain,
  setMainTitleBarOverlay,
} from './windows/main'
import { closeScreenshot, takeScreenshot } from './windows/screenshot'
import { createPinWindow, setPinWindowSize } from './windows/pin'
import { startRecorder, stopRecorder } from './windows/recorder'
import { setNormalTray, setStopRecordTray } from './menu'
import { successIcon } from './icons'

let screenshotConfig: ScreenshotConfig = null!
let notification: Notification = null!

function dateFileName() {
  return new Date()
    .toLocaleString('zh-CN')
    .replace(/\//g, '')
    .replace(/:/g, '')
    .replace(' ', '_')
}

export default function handleIPC() {
  ipcMain.handle('TOGGLE_DEVTOOLS', (event) => {
    event.sender.toggleDevTools()
  })

  ipcMain.handle('CHECK_FOR_UPDATE', (_e, type: UpdateType = 'auto') => {
    return checkForUpdates(type).then((res) =>
      res ? res.updateInfo.version : ''
    )
  })

  ipcMain.handle(
    'SET_THEME',
    (_e, theme: Electron.NativeTheme['themeSource']) => {
      nativeTheme.themeSource = theme
      if (process.platform === 'win32') {
        setMainTitleBarOverlay()
      }
    }
  )

  ipcMain.handle('OPEN_EXTERNAL', (_e, url: string) => {
    return shell.openExternal(url)
  })

  ipcMain.handle('SHOW_ITEM_IN_FOLDER', (_e, fullPath: string) => {
    shell.showItemInFolder(fullPath)
  })

  ipcMain.handle('OPEN_PATH', (_e, fullPath: string) => {
    return shell.openPath(fullPath)
  })

  ipcMain.handle('OPEN_DIALOG', (_e, options: Electron.OpenDialogOptions) => {
    return dialog.showOpenDialog(options)
  })

  ipcMain.handle('GET_PATH', (_e, name: AppPathName) => {
    return app.getPath(name)
  })

  ipcMain.handle('SCREENSHOT', (_e, config: ScreenshotConfig) => {
    screenshotConfig = config
    hideMainWidow()
    takeScreenshot()
  })

  ipcMain.handle('CLOSE_SCREENSHOT', () => {
    closeScreenshot()
  })

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

  ipcMain.handle(
    'SET_PIN_WINDOW_SIZE',
    (_e, id: number, width: number, height: number) => {
      setPinWindowSize(id, width, height)
    }
  )

  ipcMain.handle('START_RECORD', (_e, config: RecorderConfig) => {
    startRecorder(config)
  })

  ipcMain.handle('STOP_RECORD', (_e) => {
    stopRecorder()
  })

  ipcMain.handle('SAVE_VIDEO', (_e, arrayBuffer: ArrayBuffer) => {
    console.log('SAVE_VIDEO')
    setNormalTray()
    const buffer = Buffer.from(arrayBuffer)
    const videoPath = path.join(
      app.getPath('downloads'),
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

  // ipcMain.handle('SEND_TO_MAIN', (_e, channel: string, ...args: any[]) => {
  //   sendToMain(channel, ...args)
  // })

  ipcMain.handle('RECORDER_STARTED', () => {
    sendToMain('RECORDER_STATUS_CHANGE', 'start')
    setStopRecordTray()
  })
}
