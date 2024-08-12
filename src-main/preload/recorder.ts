import { contextBridge, ipcRenderer } from 'electron/renderer'
import type { RecorderStatus } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {
  saveVideo: (buffer: ArrayBuffer) => ipcRenderer.invoke('SAVE_VIDEO', buffer),
  sendToMain: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke('SEND_TO_MAIN', channel, ...args),
  recorderStarted: () => ipcRenderer.invoke('RECORDER_STARTED'),
})

function addListener(channel: string, callback: (...args: any[]) => void) {
  const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) =>
    callback(...args)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.off(channel, listener)
}

contextBridge.exposeInMainWorld('messageAPI', {
  onStartRecorder: (callback: (status: RecorderStatus) => void) =>
    addListener('ON_START_RECORDER', callback),
  onStopRecorder: (callback: () => void) =>
    addListener('ON_STOP_RECORDER', callback),
})
