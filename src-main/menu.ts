import { Menu, app, Tray, dialog } from 'electron'
import { APP_NAME } from './constant'
import {
  appIcon,
  logoutIcon,
  icon,
  trayAppIcon,
  appStopIcon,
  recorderIcon,
  aboutIcon,
} from './icons'
import { focus } from './windows/main'
import { version } from '../package.json'
import { startRecorder, stopRecorder } from './windows/recorder'
import { takeScreenshot } from './windows/screenshot'

function about() {
  dialog.showMessageBox({
    icon: icon,
    type: 'info',
    title: APP_NAME,
    message: APP_NAME,
    detail: `版本: v${version}node: ${process.versions.node}\nchrome: ${process.versions.chrome}\nelectron: ${process.versions.electron}\nplatform: ${process.platform}\nv8: ${process.versions.v8}\n`,
    // buttons: ['检查更新', '关闭'],
  })
  // .then((res) => {
  //   if (res.response === 0) {
  //     checkForUpdates('hint')
  //   }
  // })
}

if (process.platform === 'darwin') {
  const menu = Menu.buildFromTemplate([
    {
      label: APP_NAME,
      submenu: [
        { label: '关于' + APP_NAME, click: about },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '全部显示' },
        { type: 'separator' },
        { label: '退出 ' + APP_NAME, role: 'quit' },
      ],
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'forceReload', label: '强制刷新' },
        // { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '缩小' },
        { role: 'zoomOut', label: '放大' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        { type: 'separator' },
        { role: 'front', label: '置顶' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    },
  ])

  const dockMenu = Menu.buildFromTemplate([
    {
      id: 'screenshot',
      label: '截图',
      icon: trayAppIcon,
      click: takeScreenshot,
    },
    { id: 'record', label: '录屏', icon: recorderIcon, click: startRecorder },
  ])
  Menu.setApplicationMenu(menu)
  app.whenReady().then(() => {
    app.dock.setMenu(dockMenu)
  })
} else {
  Menu.setApplicationMenu(null)
}

/**
 * Tray
 */
let tray: Tray

app.whenReady().then(() => {
  tray = new Tray(appIcon)
  tray.setToolTip(APP_NAME)
  const contextMenu = Menu.buildFromTemplate([
    { id: 'app', label: APP_NAME, icon: trayAppIcon, click: focus },
    {
      id: 'screenshot',
      label: '截图',
      icon: trayAppIcon,
      click: takeScreenshot,
    },
    { id: 'record', label: '录屏', icon: recorderIcon, click: startRecorder },
    { type: 'separator' },
    { id: 'about', label: '关于', icon: aboutIcon, click: about },
    { type: 'separator' },
    { label: '退出', icon: logoutIcon, role: 'quit' },
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', focus)
})

export function setStopRecordTray() {
  tray.setImage(appStopIcon)
  tray.once('click', () => {
    stopRecorder()
    tray.setImage(appIcon)
  })
}

export function setNormalTray() {
  tray.setImage(appIcon)
}
