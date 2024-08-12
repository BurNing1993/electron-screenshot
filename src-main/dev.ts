// import { app, session } from 'electron/main'
// import * as path from 'node:path'
// import * as fsp from 'node:fs/promises'
// import * as os from 'node:os'

/** @link https://www.electronjs.org/zh/docs/latest/tutorial/devtools-extension */
export async function loadDevTools() {
  // try {
  //   // on windows
  //   const reactDevToolsDir = path.join(
  //     os.homedir(),
  //     '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/'
  //   )
  //   const dirs = await fsp.readdir(reactDevToolsDir)
  //   if (dirs.length > 0) {
  //     const dir = dirs[0]
  //     const reactDevToolsPath = path.join(reactDevToolsDir, dir)
  //     const stat = await fsp.stat(reactDevToolsPath)
  //     if (stat.isDirectory()) {
  //       await app.whenReady()
  //       const ext = await session.defaultSession.loadExtension(
  //         reactDevToolsPath
  //       )
  //       console.log('loadDevTools success', ext)
  //     }
  //   }
  // } catch (error) {
  //   console.log('loadDevTools error', error)
  // }
}
