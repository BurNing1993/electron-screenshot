import { BrowserWindow, app } from 'electron/main'
import log from 'electron-log/main'
import type { LogFile } from 'electron-log'
import path from 'node:path'
import fsp from 'node:fs/promises'
import { loadDevTools } from './dev'
import {
  beforeQuit,
  create as createMainWindow,
  focus as focusMainWindow,
} from './windows/main'
import handleIPC from './ipc'
import './menu'

log.initialize()

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到Window这个窗口
    focusMainWindow()
    // windows 命令行是一个字符串数组，其中最后一个元素是深度链接的URL。
    // dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`
  })
  app.whenReady().then(() => {
    createMainWindow()
    handleIPC()
  })
}

if (import.meta.env.DEV) {
  loadDevTools()
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  } else {
    focusMainWindow()
  }
})

app.on('before-quit', () => {
  beforeQuit()
})

// 日志文件设置
if (import.meta.env.PROD) {
  log.transports.file.archiveLogFn = (oldLogFile: LogFile) => {
    const file = oldLogFile.toString()
    const info = path.parse(file)
    fsp
      .rename(
        file,
        path.join(info.dir, info.name + new Date().toLocaleString() + info.ext)
      )
      .then(() => {
        log.info(`Log file archived: ${file}`)
      })
      .catch((err) => {
        log.error(err)
      })
  }
  // log.transports.file.resolvePathFn = () =>
  //   path.join(app.getAppPath(), 'logs/app.log')
}
