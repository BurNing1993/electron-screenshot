import React from 'react'
import { ThemeToggle } from '@/components/ThemeSelect'
// import icon from '../assets/icon.png'

const Header: React.FC = () => {
  return (
    <header className="titleBarContainer">
      <div className="titleBar px-2 flex gap-2 items-center">
        <div className="border-r h-10 flex items-center gap-2 justify-center">
          {/* <img src={icon} alt="logo" className="w-8 h-8" /> */}
          <span>截图</span>
        </div>
        <div className="flex-1 h-full draggable"></div>
        <button onClick={window.electronAPI.toggleDevtools}>devtools</button>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
