import React, { useState } from 'react'
import Header from './layout/Header'
import Screenshot from './components/Screenshot'
import VideoRecorder from './components/VideoRecorder'

const App: React.FC = () => {
  const [screenshotShow, setScreenshotShow] = useState(false)
  const [videoShow, setVideoShow] = useState(false)
  return (
    <>
      <Header />
      <main id="main" className="space-y-5 px-2 py-4">
        <Screenshot
          show={screenshotShow}
          toggleShow={() => {
            setScreenshotShow((s) => !s)
            setVideoShow(false)
          }}
        />
        <VideoRecorder
          show={videoShow}
          toggleShow={() => {
            setVideoShow((s) => !s)
            setScreenshotShow(false)
          }}
        />
      </main>
    </>
  )
}

export default App
