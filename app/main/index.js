const { app, Menu } = require('electron')
const { create: createWindow } = require('./window')

app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(null)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
