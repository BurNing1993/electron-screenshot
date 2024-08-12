import React from 'react'
// import icon from '../assets/icon.png'

const Header: React.FC = () => {
  return (
    <header className="titleBarContainer draggable">
      <div className="titleBar px-2 flex gap-2 items-center">
        {/* <div className="border-r h-10 flex items-center gap-2 justify-center">
         <img src={icon} alt="logo" className="w-8 h-8" /> 
          <span>Pin</span>
        </div>*/}
        <div className="flex-1 h-full draggable"></div>
        {/* <button onClick={window.electronAPI.toggleDevtools}>devtools</button> */}
      </div>
    </header>
  )
}

export default Header
