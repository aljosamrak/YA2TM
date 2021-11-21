import * as React from 'react'
const appStyles = require('./App.scss')
import Graph from './charts/Graph'
import Header from './Header'
import ReactGA, { InitializeOptions } from 'react-ga'

const options: InitializeOptions = {
  // debug: true,
  titleCase: false,
  gaOptions: {
    siteSpeedSampleRate: 100,
  },
  gaAddress: 'analytics.js',
}

ReactGA.initialize('UA-212146766-1', options)
ReactGA.ga('set', 'checkProtocolTask', () => { /* nothing */ })
ReactGA.pageview('main')

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={appStyles.app}>
        <Header />
        <Graph />
      </div>
    )
  }
}

export default App
