const { ipcRenderer, desktopCapturer } = require('electron')

document.querySelector('#start-capture').onclick = function capture(e) {
  const hidden = document.querySelector('#hidden-tool').checked
  ipcRenderer.invoke('start-capture', hidden, false)
}

document.querySelector('#start-capture-all').onclick = function capture(e) {
  const hidden = document.querySelector('#hidden-tool').checked
  ipcRenderer.invoke('start-capture', hidden, true)
}
