import type { RecorderConfig } from '@/vite-env'
import './index.css'

const width = window.innerWidth
const height = window.innerHeight

let mediaRecorder: MediaRecorder | null = null
let chucks: Blob[] = []

function getConfig(): RecorderConfig {
  const localData = localStorage.getItem('recorder_config')
  if (localData) {
    try {
      const json = JSON.parse(localData) as RecorderConfig
      return json
    } catch (_error) {
      /* empty */
    }
  }
  return {
    delay: 0,
    ext: 'mp4',
    savePath: '',
    systemAudio: true,
  }
}

function record() {
  return navigator.mediaDevices
    .getDisplayMedia({
      audio: true,
      video: {
        width: width,
        height: height,
        frameRate: 30,
      },
    })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()

      mediaRecorder.onstart = window.electronAPI.recorderStarted

      mediaRecorder.onstop = () => {
        const blob = new Blob(chucks, { type: 'video/mp4' })
        blob.arrayBuffer().then((arrayBuffer) => {
          window.electronAPI.saveVideo(arrayBuffer)
        })
        chucks = []
      }
      mediaRecorder.ondataavailable = (e) => {
        chucks.push(e.data)
      }
    })
    .catch((e) => console.error(e))
}

window.addEventListener(
  'beforeunload',
  window.messageAPI.onStartRecorder(() => {
    console.log('onRecordStart')
    const config = getConfig()
    if (config.delay > 0) {
      setTimeout(record, config.delay * 1000)
    } else {
      record()
    }
  })
)

function stopRecorder() {
  if (mediaRecorder) {
    mediaRecorder.stop()
    mediaRecorder = null
  }
  chucks = []
}

window.addEventListener(
  'beforeunload',
  window.messageAPI.onStopRecorder(stopRecorder)
)

window.addEventListener('beforeunload', stopRecorder)
