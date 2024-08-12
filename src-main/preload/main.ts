import { contextBridge, ipcRenderer } from 'electron/renderer'
import { version } from '../../package.json'
import type { CreatePinType, PinPayload, Theme } from '../types'

/**
 * Sandboxed preload scripts can't use ESM imports
 * https://www.electronjs.org/zh/docs/latest/tutorial/esm#preload-%E8%84%9A%E6%9C%AC
 */
// renderer -> main
contextBridge.exposeInMainWorld('electronAPI', {
  toggleDevtools: () => ipcRenderer.invoke('TOGGLE_DEVTOOLS'),
  getDownloadsPath: () => ipcRenderer.invoke('GET_DOWNLOADS_PATH'),
  checkUpdate: (status?: 'auto' | 'hint' | 'manual') =>
    ipcRenderer.invoke('CHECK_FOR_UPDATE', status),
  openExternal: (url: string) => ipcRenderer.invoke('OPEN_EXTERNAL', url),
  setTheme: (theme: Theme) => ipcRenderer.invoke('SET_THEME', theme),
  showItemInFolder: (fullPath: string) =>
    ipcRenderer.invoke('SHOW_ITEM_IN_FOLDER', fullPath),
  openPath: (fullPath: string) => ipcRenderer.invoke('OPEN_PATH', fullPath),
  showOpenDialog: (options: Electron.OpenDialogOptions) =>
    ipcRenderer.invoke('OPEN_DIALOG', options),
  pin: (payload: PinPayload) => ipcRenderer.invoke('PIN', payload),
  createPin: (type: CreatePinType) => ipcRenderer.invoke('CREATE_PIN', type),
  // screenshot
  screenshot: () => ipcRenderer.invoke('SCREENSHOT'),
})

function addListener(channel: string, callback: (...args: any[]) => void) {
  const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) =>
    callback(...args)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.off(channel, listener)
}

// main -> renderer
contextBridge.exposeInMainWorld('messageAPI', {
  onNavigate: (callback: (to: string) => void) =>
    addListener('NAVIGATE', callback),
})

contextBridge.exposeInMainWorld('argv', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  version,
  platform: process.platform,
  dev: process.argv.includes('--dev'),
})
