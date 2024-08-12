import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const APP_NAME = '截图'

const __filename = fileURLToPath(import.meta.url)

export const ROOT = path.dirname(__filename)

export const DARK_BACK_COLOR = '#0c0a09'
