import React from 'react'
import Header from './layout/Header'
import Screenshot from './components/Screenshot'
import VideoRecorder from './components/VideoRecorder'

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main id="main" className="space-y-2 p-2">
        <Screenshot />
        <VideoRecorder />
      </main>
    </>
  )
}

export default App
