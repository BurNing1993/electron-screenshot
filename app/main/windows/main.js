const { BrowserWindow } = require('electron')
const path = require('path')

/**
 * @type BrowserWindow
 */
let win

function create() {
  win = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation:false
    },
  })
  win.loadFile(path.resolve(__dirname, '../../renderer/index.html'))
  win.on('ready-to-show', () => {
    win.show()
  })
  win.on('closed', () => {
    win = null
  })
}

function hide(){
  win.hide()
}
function show(){
  win.show()
}

module.exports = {
  create,
  hide,
  show,
}
