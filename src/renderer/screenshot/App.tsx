import React, { useCallback, useEffect, useState } from 'react'
import Screenshots from './Screenshots'
import type { Bounds } from './Screenshots/types'

const width = window.innerWidth
const height = window.innerHeight

const App: React.FC = () => {
  const [screenshot, setScreenshot] = useState('')

  const onSave = useCallback((blob: Blob, _bounds: Bounds) => {
    blob.arrayBuffer().then((arrayBuffer) => {
      window.electronAPI.saveScreenshot(arrayBuffer)
    })
  }, [])

  const onCancel = useCallback(() => {
    setScreenshot('')
    window.electronAPI.closeScreenshot()
  }, [])

  const onOk = useCallback((blob: Blob, _bounds: Bounds) => {
    blob.arrayBuffer().then((arrayBuffer) => {
      window.electronAPI.saveScreenshot(arrayBuffer)
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key)
      if (e.key === 'Escape') {
        setScreenshot('')
        window.electronAPI.closeScreenshot()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    setScreenshot('')
    return window.messageAPI.onScreenshot((thumbnailURL) => {
      setScreenshot(thumbnailURL)
    })
  }, [])

  if (screenshot) {
    return (
      <Screenshots
        url={screenshot}
        width={width}
        height={height}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
      />
    )
  }
  return null
}

export default App
