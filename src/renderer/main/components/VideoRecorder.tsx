import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { RecorderStatus, RecorderConfig } from '@/vite-env'
import { Settings2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const LOCAL_KEY = 'recorder_config'

interface Props {
  show: boolean
  toggleShow: () => void
}

const VideoRecorder: React.FC<Props> = ({ show, toggleShow }) => {
  const [config, setConfig] = useState<RecorderConfig>({
    systemAudio: true,
    delay: 0,
    savePath: '',
    ext: 'mp4',
  })
  const [status, setStatus] = useState<RecorderStatus>('stop')

  const startRecord = () => {
    if (status === 'stop') {
      window.electronAPI.startRecorder(config)
    } else if (status === 'start') {
      window.electronAPI.stopRecorder()
    }
  }

  useEffect(() => {
    return window.messageAPI.onRecorderStatusChange((status) => {
      setStatus(status)
    })
  }, [])

  useEffect(() => {
    window.electronAPI.updateRecorderConfig(config)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    const localData = localStorage.getItem(LOCAL_KEY)
    if (localData) {
      try {
        const json = JSON.parse(localData) as RecorderConfig
        if (json.savePath === '') {
          window.electronAPI.getPath('videos').then((savePath) => {
            setConfig({
              ...json,
              savePath,
            })
          })
        } else {
          setConfig(json)
        }
      } catch (_error) {
        /* empty */
      }
    }
  }, [])

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          className={`flex-1 ${status !== 'stop' ? 'text-red-500' : ''}`}
          onClick={startRecord}
        >
          {status === 'stop' ? '开始' : '停止'}录屏(<kbd>Shift</kbd> +{' '}
          <kbd>Alt</kbd> + <kbd>S</kbd>)
        </Button>
        <Button
          size="icon"
          variant={show ? 'default' : 'secondary'}
          onClick={toggleShow}
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
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0 w-20" htmlFor="systemAudio">
            音频
          </Label>
          <Switch
            id="systemAudio"
            defaultChecked={config.systemAudio}
            onCheckedChange={(checked: boolean) =>
              setConfig((c) => ({ ...c, systemAudio: checked }))
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0  w-20" htmlFor="systemAudio">
            录制延迟(s)
          </Label>
          <Input
            value={config.delay}
            type="number"
            min={0}
            onChange={(e) =>
              setConfig((c) => ({ ...c, delay: Number(e.target.value) }))
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0  w-20">保存路径</Label>
          <Input
            value={config.savePath}
            readOnly
            title="点击查看"
            onClick={() => window.electronAPI.openPath(config.savePath)}
          />
          <Button
            size="sm"
            onClick={() =>
              window.electronAPI
                .showOpenDialog({
                  defaultPath: config.savePath,
                  properties: ['openDirectory'],
                })
                .then(({ filePaths }) => {
                  const [filePath] = filePaths
                  if (filePath) {
                    setConfig((c) => ({ ...c, savePath: filePath }))
                  }
                })
            }
          >
            修改
          </Button>
        </div>
      </div>
    </>
  )
}

export default VideoRecorder
