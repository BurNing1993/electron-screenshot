/// <reference types="vite/client" />
import Electron from 'electron'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type RecorderStatus = 'start' | 'stop'

interface ScreenshotConfig {
  clipboard: boolean
  pin: boolean
  save: boolean
  savePath: string
}

interface RecorderConfig {
  systemAudio: boolean
}

type AppPathName =
  | 'home'
  | 'appData'
  | 'userData'
  | 'sessionData'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'logs'
  | 'crashDumps'

interface IElectronAPI {
  // main
  toggleDevtools: () => Promise<void>
  checkUpdate: (type?: 'auto' | 'hint' | 'manual') => Promise<string>
  openExternal: (url: string) => Promise<void>
  setTheme: (theme: Theme) => Promise<void>
  showItemInFolder: (fullPath: string) => Promise<void>
  openPath: (fullPath: string) => Promise<string>
  showOpenDialog: (
    options: Electron.OpenDialogOptions
  ) => Promise<Electron.OpenDialogReturnValue>
  getPath: (name: AppPathName) => Promise<string>
  screenshot: (config: ScreenshotConfig) => Promise<void>
  startRecorder: (config: RecorderConfig) => Promise<void>
  stopRecorder: () => Promise<void>
  // other
  // sendToMain: (channel: string, ...args: any[]) => Promise<void>
  // screenshot
  closeScreenshot: () => Promise<void>
  saveScreenshot: (arrayBuffer: ArrayBuffer) => Promise<void>
  pinScreenshot: (arrayBuffer: ArrayBuffer) => Promise<void>
  // pin
  setPinWindowSize: (id: number, width: number, height: number) => Promise<void>
  // video
  saveVideo: (arrayBuffer: ArrayBuffer) => Promise<void>
  recorderStarted: () => Promise<void>
}

type RemoveListener = () => void

interface MessageAPI {
  // main
  onRecorderStatusChange: (
    callback: (status: RecorderStatus) => void
  ) => RemoveListener
  // common
  onThemeChange: (
    callback: (theme: Electron.NativeTheme['themeSource']) => void
  ) => RemoveListener
  // pin
  onPin: (callback: (url: string, id: number) => void) => RemoveListener
  // screenshot
  onScreenshot: (callback: (thumbnailURL: string) => void) => RemoveListener
  // recorder
  onStartRecorder: (callback: () => void) => RemoveListener
  onStopRecorder: (callback: () => void) => RemoveListener
}

interface Argv {
  node: string
  chrome: string
  electron: string
  version: string
  dev: boolean
  platform:
    | 'aix'
    | 'darwin'
    | 'freebsd'
    | 'linux'
    | 'openbsd'
    | 'sunos'
    | 'win32'
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    messageAPI: MessageAPI
    argv: Argv
  }
}
