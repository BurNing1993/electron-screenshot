import fsp from 'node:fs/promises'
import path from 'node:path'
import { app, dialog, ipcMain, nativeTheme } from 'electron/main'
import { clipboard, nativeImage, shell } from 'electron/common'
import { checkForUpdates } from './updater'
import { AppPathName, ScreenshotConfig, UpdateType } from './types'
import { hideMainWidow, setMainTitleBarOverlay } from './windows/main'
import { closeScreenshot, takeScreenshot } from './windows/screenshot'
import { createPinWindow, setPinWindowSize } from './windows/pin'

let screenshotConfig: ScreenshotConfig = null!

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
          `screenshot_${new Date()
            .toLocaleString('zh-CN')
            .replace(/\//g, '')
            .replace(/:/g, '')
            .replace(' ', '-')}.png`
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
}
