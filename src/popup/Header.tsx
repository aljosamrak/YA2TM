import React from 'react';

export default function Header() {
  return (
    <div id="header"
    // style="display: flex;"
    >

      <h2>Tab Insights</h2>

      <div id="about"
      //  style="flex-grow: 1;"
      > </div>

      <div id="about">

        <div className="siteFooterBar">
          <img src="s logo.png" width="15px" height="15px"/>
          <div className="foot">2015 © All rights reserved.</div>
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

    </div>
  )
}