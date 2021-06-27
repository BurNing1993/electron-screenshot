const { ipcRenderer, desktopCapturer } = require('electron')
const fs = require('fs/promises')
const path = require('path')
/**
 * @types HTMLVideoElement
 */
const video = document.querySelector('#video')
const canvas = document.querySelector('#canvas')
const width = window.screen.width
const height = window.screen.height
canvas.width = width
canvas.height = height
/**
 * @types CanvasRenderingContext2D
 */
const ctx = canvas.getContext('2d')

async function startCapture() {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
    })
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
        },
      },
    })
    video.srcObject = stream
    video.onloadedmetadata = (e) => {
      video.play()
      video.pause()
    }
  } catch (error) {
    console.error(e)
  }
}

async function saveCapture(url, savePath) {
  try {
    console.log(url)
    await fs.writeFile(
      path.join(savePath, `Capture_${Date.now()}.png`),
      Buffer.from(url.replace('data:image/png;base64,', ''), 'base64')
    )
  } catch (error) {
    console.error(error)
    throw '截图失败'
  }
}

function endCapture(success = true, errMsg = '') {
  ipcRenderer.invoke('end-capture', success, errMsg)
}

ipcRenderer.on('capture', async (e, fullscreen, path) => {
  await startCapture()
  video.addEventListener('pause', function () {
   
    ctx.drawImage(video, 0, 0)
    const url = canvas.toDataURL()
    saveCapture(url, path)
      .then(() => {
        endCapture()
      })
      .catch((errMsg) => {
        console.error(errMsg)
        endCapture(false, errMsg)
      })
  })
})
