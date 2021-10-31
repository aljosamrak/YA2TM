import * as React from 'react'
import Graph from './Graph'
import Header from './Header'

const appStyles = require('./App.css')
// const logo = require('./logo.svg')

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
