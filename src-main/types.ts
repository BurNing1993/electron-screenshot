export type Theme = Electron.NativeTheme['themeSource']

export type UpdateType = 'auto' | 'hint' | 'manual'

interface PinBasePayload {
  id: number
}

export interface PinImagePayload extends PinBasePayload {
  type: 'image'
  filePath: string
}

export interface PinScreenshotPayload extends PinBasePayload {
  type: 'screenshot'
  url: string
}

export type PinPayload = PinImagePayload | PinScreenshotPayload

export type CreatePinType = 'todo' | 'note'
