import { Button } from '@/components/ui/button'
import type { RecorderStatus } from '@/vite-env'
import { Settings2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const VideoRecorder: React.FC = () => {
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState<RecorderStatus>('stop')

  const startRecord = () => {
    if (status === 'stop') {
      window.electronAPI.startRecorder({
        systemAudio: true,
      })
    } else if (status === 'start') {
      window.electronAPI.stopRecorder()
    }
  }

  useEffect(() => {
    return window.messageAPI.onRecorderStatusChange((status) => {
      setStatus(status)
    })
  }, [])

  return (
    <>
      <div className="flex items-center gap-1">
        <Button className="flex-1" onClick={startRecord}>
          {status === 'stop' ? '开始' : '停止'}录屏
        </Button>
        <Button
          size="icon"
          variant={show ? 'default' : 'secondary'}
          onClick={() => setShow((s) => !s)}
        >
          <Settings2 />
        </Button>
      </div>
      <div
        className="space-y-2"
        style={{
          display: show ? 'block' : 'none',
        }}
      >
        <div className="flex items-center space-x-2"></div>
      </div>
    </>
  )
}

export default VideoRecorder
