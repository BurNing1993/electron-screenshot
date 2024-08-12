/*eslint-env node*/
import electron from 'electron'
import { build, createLogger, createServer } from 'vite'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const ROOT = process.cwd()

/** @type import('child_process').ChildProcess  */
let electronProcess

const logger = createLogger('info', {
  prefix: '[main]',
})
const loggerInfo = logger.info
const loggerError = logger.error
logger.info = (msg, options) => loggerInfo(msg, { timestamp: true, ...options })
logger.error = (msg, options) =>
  loggerError(msg, { timestamp: true, ...options })

async function start() {
  await startRendererServer(join(ROOT, 'vite.config.ts'))
  const preloadWatcher = await build({
    configFile: join(ROOT, 'vite.preload.config.ts'),
    mode: 'development',
    build: {
      watch: {},
    },
  })
  logger.info('build preload')
  preloadWatcher.on('event', async function (event) {
    logger.info('preload event = ', JSON.stringify(event, null, 2))
    if (event.code === 'END') {
      const watcher = await build({
        configFile: join(ROOT, 'vite.main.config.ts'),
        mode: 'development',
        build: {
          watch: {},
        },
      })
      logger.info('build main')
      watcher.on('event', function (e) {
        logger.info(`main build event: ${e.code}`)
        if (e.code === 'END') {
          startElectron()
        }
      })
    }
  })
}

function startElectron() {
  logger.info('start electron')
  if (electronProcess != null) {
    // windows 上，不支持 signal 参数
    electronProcess.kill()
    // electronProcess = null
    if (process.platform === 'darwin') {
      electronProcess = null
    }
    // process.exit()
  }
  electronProcess = spawn(electron, [join(ROOT, 'dist/main.mjs')])
  electronProcess.stdout.on('data', (data) => {
    logger.info(data.toString())
  })
  electronProcess.stderr.on('data', (data) => {
    logger.error(data.toString().substring(0, 1000))
  })
  electronProcess.on('close', (code) => {
    logger.info(`child process exited with code ${code}`)
    if (code != null) {
      process.exit(code)
    }
  })
}

async function startRendererServer(configFile, port = 5174) {
  const viteDevServer = await createServer({
    configFile,
    mode: 'development',
    server: {
      port,
    },
  })
  await viteDevServer.listen()
  logger.info(`renderer server start at: http://localhost:${port}`, {
    prefix: ['renderer'],
  })
  return viteDevServer
}

start()
