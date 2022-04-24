import { Injectable, Optional } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
// @ts-ignore
import loadGa from './loadGA'

declare var ga: Function

// TODO copy from react ga lib
export class AnalyticsIdConfig {
  id = ''
  scriptPath?: string
}

export type EventArgs = {
  category: string
  action: string
  label?: string
  value?: number
}

export type TimingArgs = {
  category: string
  name: string
  value: number
  label?: string
}

@Injectable({
  providedIn: 'root',
})
export class NgGoogleAnalyticsTracker {
  constructor(config: AnalyticsIdConfig, @Optional() router: Router) {
    try {
      loadGa({
        gaAddress: config.scriptPath,
      })

      this.create(config.id, {
        siteSpeedSampleRate: 100,
      })
    } catch (ex) {
      console.error('Error appending google analytics')
      console.error(ex)
    }

    // router?.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     ga('set', 'page', event.url)
    //     ga('send', 'pageview')
    //   }
    // })
  }

  public create(gaTrackingID: string, options?: any) {
    // if (options && options.gaOptions) {
    //   ga('create', gaTrackingID, options.gaOptions)
    // } else {
    //   ga('create', gaTrackingID, 'auto')
    // }
    //
    // ga('set', 'checkProtocolTask', () => {
    //   /* nothing */
    // })
  }

  event(eventArgs: EventArgs) {
    // ga('send', 'event', {
    //   eventCategory: eventArgs.category,
    //   eventLabel: eventArgs.label,
    //   eventAction: eventArgs.action,
    //   eventValue: eventArgs.value,
    // })
  }

  public time(timingArgs: TimingArgs) {
    // ga('send', 'timing', {
    //   timingCategory: timingArgs.category,
    //   timingVar: timingArgs.value,
    //   timingLabel: timingArgs.label,
    //   timingValue: timingArgs.value,
    // })
  }
}
