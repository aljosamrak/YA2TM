import React from 'react'

import fullScreenImage from '../assets/images/full-screen.png'
import settingsImage from '../assets/images/settings.png'
import headerStyle from './header.scss'
import ReactGA from 'react-ga'

export default function Header() {
  function openFullScreen() {
    chrome.tabs.create({ url: chrome.runtime.getURL('build/popup.html') })
  }

  function openSetting() {
    chrome.tabs.create({ url: chrome.runtime.getURL('build/options.html') })
    ReactGA.event({
      category: 'Test',
      action: 'TEST',
      label: 'Test Analytics event clicked',
      value: 1,
    })
  }

  return (
    <div>
      <div className={headerStyle.right}>
        <h2 style={{ marginBottom: 0 }}>YATM</h2>
        <div className={headerStyle.grow} />
        <img className={headerStyle.icon} src={fullScreenImage} alt="Full screen" onClick={openFullScreen} />
        <img className={headerStyle.icon} src={settingsImage} alt="Go to options" onClick={openSetting} />
      </div>
    </div>
  )
}
