import { nativeImage } from 'electron'
import winIconImg from './assets/icon32.png'
import appImg from './assets/icon16.png'
import appleIconImg from './assets/appleIcon.png'
import logoutImg from './assets/logout.png'
import iconImg from './assets/icon192.png'
import appleStop from './assets/appleStop.png'
import stop from './assets/stop.png'
import success from './assets/success.png'
import recorder from './assets/recorder.png'
import about from './assets/about.png'

/**
 * @see https://cn.vitejs.dev/config/build-options.html#build-assetsinlinelimit
 * build.lib 全为内联
 * 小于4kB 的导入或引用资源将内联为 base64 编码，使用createFromDataURL
 * #4488EE
 * tray icon 16 * 16
 */

export const winIcon = nativeImage.createFromDataURL(winIconImg)

export const appleIcon = nativeImage.createFromDataURL(appleIconImg) // 16 *16

export const icon = nativeImage.createFromDataURL(iconImg)

export const appIcon = process.platform === 'darwin' ? appleIcon : winIcon

const appleStopIcon = nativeImage.createFromDataURL(appleStop)

const stopIcon = nativeImage.createFromDataURL(stop)

export const appStopIcon =
  process.platform === 'darwin' ? appleStopIcon : stopIcon

export const trayAppIcon = nativeImage.createFromDataURL(appImg) // 16 * 16

export const logoutIcon = nativeImage.createFromDataURL(logoutImg)

export const recorderIcon = nativeImage.createFromDataURL(recorder)

export const aboutIcon = nativeImage.createFromDataURL(about)

export const successIcon = nativeImage.createFromDataURL(success)
