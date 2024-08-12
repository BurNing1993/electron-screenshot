import React, { useEffect, useRef } from 'react'
import Header from './layout/Header'

const App: React.FC = () => {
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    return window.messageAPI.onPin((url, id) => {
      const imgEl = imgRef.current
      if (imgEl) {
        imgEl.src = url
        imgEl.onload = () => {
          const { width, height } = imgEl
          window.electronAPI.setPinWindowSize(id, width, height)
        }
      }
    })
  }, [])

  return (
    <>
      <Header />
      <img ref={imgRef} alt="pin" />
    </>
  )
}

export default App
