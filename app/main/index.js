const { app, Menu } = require('electron')
const { create: createMainWindow } = require('./windows/main')
const { create: createCaptureWindow } = require('./windows/capture')
const handleIpc = require('./ipc')

app.whenReady().then(() => {
  createMainWindow()
  handleIpc()
  createCaptureWindow()
  // Menu.setApplicationMenu(null)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
