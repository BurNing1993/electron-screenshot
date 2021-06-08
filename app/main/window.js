const { BrowserWindow } = require('electron')
const path = require('path')

/**
 * @type BrowserWindow
 */
let win

function create() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    maximizable:false,
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, '../renderer/preload.js'),
    },
  })
  win.loadFile(path.resolve(__dirname, '../renderer/index.html'))
  win.on('ready-to-show', () => {
    win.show()
  })
}

module.exports = {
  create,
}
