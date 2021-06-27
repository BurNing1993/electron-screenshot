const { ipcMain } = require('electron')
const os = require('os')
const { hide: hideMainWindow,show:showMainWindow } = require('./windows/main')
const {
  show: showCaptureWindow,
  hide: hideCaptureWindow,
} = require('./windows/capture')

module.exports = function () {
  ipcMain.handle('start-capture', (e, hidden, fullscreen = false, path) => {
    if (hidden) {
      // hideMainWindow()
    }
    showCaptureWindow()
  })

  ipcMain.handle('end-capture',(e,success)=>{
    console.log(success)
    showMainWindow()
    // hideCaptureWindow()
  })
}
