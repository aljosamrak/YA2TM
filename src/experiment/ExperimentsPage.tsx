import 'reflect-metadata'
import * as React from 'react'
import { UserPreferences } from '../storage/Key'
import { Experiments } from './Experiments'

class ExperimentsPage extends React.Component<{}, { prefs: UserPreferences }> {
  experiments = new Experiments()

  public render() {
    return (
      <div>
        <h1>Experiments</h1>
        { this.createExperimentList(this.experiments) }
      </div>
    )
  }

  private createExperimentList(experiments: Experiments) {
    const a = Object.keys(experiments).map((experiment) => (
      <div>
        <input type='checkbox' checked={Boolean(Reflect.get(experiments, experiment)).valueOf()}/>
        {experiment}
      </div>
    ))
    return a
  }
}

export default ExperimentsPage
