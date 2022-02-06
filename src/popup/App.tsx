import React from 'react'
import Graph from './charts/Graph'
import Header from './Header'
import {container} from '../inversify/inversify.config'
import {TYPES} from '../inversify/types'
import {Analytics} from '../analytics/Analytics'
const appStyles = require('./App.scss')

const analytics = container.get<Analytics>(TYPES.Analytics)
analytics.modalView('main-app')

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
