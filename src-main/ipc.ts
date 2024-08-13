import { app, dialog, ipcMain, nativeTheme } from 'electron/main'
import { shell } from 'electron/common'
import { checkForUpdates } from './updater'
import { AppPathName, UpdateType } from './types'
import { setMainTitleBarOverlay } from './windows/main'

/**
 * 通用IPC
 */
app.whenReady().then(() => {
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
})
