import { contextBridge, ipcRenderer } from 'electron/renderer'

contextBridge.exposeInMainWorld('electronAPI', {
  setPinWindowSize: (id: number, width: number, height: number) =>
    ipcRenderer.invoke('SET_PIN_WINDOW_SIZE', id, width, height),
})

function addListener(channel: string, callback: (...args: any[]) => void) {
  const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) =>
    callback(...args)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.off(channel, listener)
}

contextBridge.exposeInMainWorld('messageAPI', {
  onPin: (callback: (url: string, id: number) => void) =>
    addListener('ON_PIN', callback),
  onThemeChange: (
    callback: (theme: Electron.NativeTheme['themeSource']) => void
  ) => addListener('ON_THEME_CHANGE', callback),
})
