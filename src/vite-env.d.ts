/// <reference types="vite/client" />
import Electron from 'electron'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

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
  pin: (payload: PinPayload) => Promise<void>
  screenshot: () => Promise<void>
  createPin: (type: CreatePinType) => Promise<void>
  // screenshot
  closeScreenshot: () => Promise<void>
  saveScreenshot: (arrayBuffer: ArrayBuffer) => Promise<void>
  pinScreenshot: (arrayBuffer: ArrayBuffer) => Promise<void>
  // editor
}

type RemoveListener = () => void

interface MessageAPI {
  // main
  // pin
  onPin: (callback: (payload: PinPayload) => void) => RemoveListener
  onThemeChange: (
    callback: (theme: Electron.NativeTheme['themeSource']) => void
  ) => RemoveListener
  // screenshot
  onScreenshot: (callback: (thumbnailURL: string) => void) => RemoveListener
  // editor
  onCreatePin: (callback: (type: CreatePinType) => void) => RemoveListener
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
