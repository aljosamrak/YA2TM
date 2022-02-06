import React from 'react'

import fullScreenImage from '../assets/images/full-screen.png'
import settingsImage from '../assets/images/settings.png'
import headerStyle from './header.scss'
import {container} from '../inversify/inversify.config'
import {Analytics} from '../analytics/Analytics'
import {TYPES} from '../inversify/types'

export default function Header() {
  function openFullScreen() {
    chrome.tabs.create({url: chrome.runtime.getURL('build/popup.html')})
  }

  function openSetting() {
    chrome.tabs.create({url: chrome.runtime.getURL('build/options.html')})

    const analytics = container.get<Analytics>(TYPES.Analytics)
    analytics.event({
      category: 'Settings',
      action: 'Open settings',
      label: 'From popup',
    })
  }

  return (
    <div>
      <div className={headerStyle.right}>
        <h2 style={{marginBottom: 0}}>YATM</h2>
        <div className={headerStyle.grow} />
        <img
          className={headerStyle.icon}
          src={fullScreenImage}
          alt="Full screen"
          onClick={openFullScreen}
        />
        <img
          className={headerStyle.icon}
          src={settingsImage}
          alt="Go to options"
          onClick={openSetting}
        />
      </div>
    </div>
  )
}
