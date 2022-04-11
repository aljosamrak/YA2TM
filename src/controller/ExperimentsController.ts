import 'reflect-metadata'
import {Key, LocalStorage} from '../storage/LocalStorage'
import {Analytics} from '../analytics/Analytics'
import {Inject, Injectable} from '@angular/core'
import {NGXLogger} from 'ngx-logger'

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
    @Inject('Analytics') private analytics: Analytics,
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
      const a = this
      this.experiments = result[EXPERIMENTS.key]
      const b = result[EXPERIMENTS.key]
      const c = result['key']
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

export {Experiments, ExperimentsController}
