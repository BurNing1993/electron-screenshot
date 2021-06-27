const { BrowserWindow } = require('electron')
const path = require('path')
const os = require('os')

/**
 * @type BrowserWindow
 */
let win

function create() {
  win = new BrowserWindow({
    frame: false,
    show: false,
    fullscreen: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile(path.resolve(__dirname, '../../renderer/capture.html'))
  // win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}
/**
 * sendToCapture
 * @param {string} channel
 * @param  {...any} args
 */
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

function show(capturePath,fullscreen = true) {
  if (!capturePath) {
    // capturePath = path.join(os.homedir(), 'Pictures')
    capturePath = 'D:\\Test'
  }
  console.log(capturePath)
  win.show()
  send('capture', fullscreen, capturePath)
}

function hide(){
  win.hide()
}

module.exports = {
  create,
  show,
  send,
  hide,
}
