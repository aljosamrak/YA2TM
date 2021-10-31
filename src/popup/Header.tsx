import React from 'react'

const appStyles = require('./App.css')
// const logo = require("./logo.svg");

export default function Header() {

  const formattedTime: string = new Date().toLocaleTimeString('en-us', {
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
    month: "numeric",
    second: "2-digit",
    year: "numeric",
  })

  return (
    <div id="header"
    // style="display: flex;"
    >


      {/* <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h2>Welcome to React</h2>
        </div> */}

      <h2>Tab Insights</h2>

      <div id="about"
      //  style="flex-grow: 1;"
      > </div>

      <div id="about">

        <div className="siteFooterBar">
          <img src="s logo.png" width="15px" height="15px" />
        </div>

        <p className="social">
          <a id="social-twitter" href="#" target="_blank" className="twitter-share-button-xxx" data-count="none"
            data-related="fero8:Developer">Tweet</a>
          |
          <a id="social-fb" href="#" target="_blank">Share on Facebook</a>
        </p>


      </div>
      <img id="expand" src="img_519106.png" alt="Full screen" width="25px" height="25px"
      // margin="15px"
      />
      <img id="go-to-options" src="settings.png" alt="Go to options" width="25px" height="25px"
      // margin="15px"
      />

      <p>Rendered at {formattedTime}</p>

    </div>
  )
}
