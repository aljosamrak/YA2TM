import { Inject, Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import 'reflect-metadata'
import { NgGoogleAnalyticsTracker } from '../app/analytics/ng-google-analytics.service'
import { Key, LocalStorage } from '../storage/LocalStorage'

class Experiments {
  tabDeduplication = true
}

const EXPERIMENTS: Key<Experiments> = {
  key: 'experiments',
  defaultValue: new Experiments(),
}

@Injectable({
  providedIn: 'root',
})
class ExperimentsController {
  experiments: Experiments | undefined

  constructor(
    private logger: NGXLogger,
    protected analytics: NgGoogleAnalyticsTracker,
    @Inject('LocalStorageService') private localStorage: LocalStorage,
  ) {}

  async getExperiments(): Promise<Experiments> {
    if (this.experiments) {
      return this.experiments
    }

    // return chrome.storage.local.get(EXPERIMENTS.key).then((result) => {
    //   if (result[EXPERIMENTS.key]) {
    //     return result
    //   }
    //   return { key: key.defaultValue }
    // })

    return await this.localStorage.get(EXPERIMENTS).then((result: any) => {
      this.experiments = result[EXPERIMENTS.key]
      return result[EXPERIMENTS.key]
    })
  }

  changeExperiment(experiment: string, checked: boolean) {
    if (this.experiments !== undefined) {
      Reflect.set(this.experiments, experiment, checked)
      this.localStorage.set(EXPERIMENTS, this.experiments)
    }
    return this.experiments
  }
}

export { Experiments, ExperimentsController }
