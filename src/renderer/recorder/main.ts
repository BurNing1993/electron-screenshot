import './index.css'

const width = window.innerWidth
const height = window.innerHeight

let mediaRecorder: MediaRecorder | null = null
let chucks: Blob[] = []

window.addEventListener(
  'beforeunload',
  window.messageAPI.onStartRecorder(() => {
    console.log('onRecordStart')
    navigator.mediaDevices
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
