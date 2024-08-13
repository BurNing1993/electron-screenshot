import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface ScreenshotConfig {
  clipboard: boolean
  pin: boolean
  save: boolean
  savePath: string
}

const LOCAL_KEY = 'screenshot_config'

interface Props {
  show: boolean
  toggleShow: () => void
}

const Screenshot: React.FC<Props> = ({ show, toggleShow }) => {
  const [config, setConfig] = useState<ScreenshotConfig>({
    clipboard: true,
    pin: false,
    save: false,
    savePath: '',
  })

  useEffect(() => {
    const localData = localStorage.getItem(LOCAL_KEY)
    if (localData) {
      try {
        const json = JSON.parse(localData) as ScreenshotConfig
        if (json.savePath === '') {
          window.electronAPI.getPath('pictures').then((p) => {
            setConfig({
              ...json,
              savePath: p,
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

  useEffect(() => {
    window.electronAPI.updateScreenshotConfig(config)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(config))
  }, [config])

  const onScreenshot = () => {
    window.electronAPI.screenshot(config)
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button className="flex-1" onClick={onScreenshot}>
          截图(<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>)
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
          <Label className="flex-shrink-0" htmlFor="clipboard">
            复制到剪切板
          </Label>
          <Switch
            id="clipboard"
            defaultChecked={config.clipboard}
            onCheckedChange={(checked: boolean) =>
              setConfig((c) => ({ ...c, clipboard: checked }))
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0 w-20" htmlFor="pin">
            钉到桌面
          </Label>
          <Switch
            id="pin"
            defaultChecked={config.pin}
            onCheckedChange={(checked: boolean) =>
              setConfig((c) => ({ ...c, pin: checked }))
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0 w-20" htmlFor="save">
            保存截图
          </Label>
          <Switch
            id="save"
            defaultChecked={config.save}
            onCheckedChange={(checked: boolean) =>
              setConfig((c) => ({ ...c, save: checked }))
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="flex-shrink-0 w-20">保存路径</Label>
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

export default Screenshot
