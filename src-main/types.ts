export type Theme = Electron.NativeTheme['themeSource']

export type UpdateType = 'auto' | 'hint' | 'manual'

export interface ScreenshotConfig {
  clipboard: boolean
  pin: boolean
  save: boolean
  savePath: string
}

export type AppPathName =
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
