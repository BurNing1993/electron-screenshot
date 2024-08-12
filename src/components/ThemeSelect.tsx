import { SunIcon, MoonIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'

type Theme = Electron.NativeTheme['themeSource']

const LOCAL_THEME = 'local_theme'

function getTheme(): Theme {
  const localData = localStorage.getItem(LOCAL_THEME)
  if (localData != null) {
    return localData as Theme
  }
  return 'system'
}

function setLocalTheme(theme: Theme) {
  localStorage.setItem(LOCAL_THEME, theme)
  window.electronAPI.setTheme(theme).then(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    let systemTheme = theme
    if (theme === 'system') {
      systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    root.classList.add(systemTheme)
  })
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme())

  useEffect(() => {
    setLocalTheme(theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          浅 色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          深 色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          系 统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
