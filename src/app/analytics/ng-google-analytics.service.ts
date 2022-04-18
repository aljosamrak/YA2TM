import { Injectable, Optional } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
const loadGa = require('./loadGA')

declare var ga: Function

// TODO copy from react ga lib
export type AnalyticsIdConfig = {
  id: string
  scriptPath?: string
}

@Injectable({
  providedIn: 'root',
})
export class NgGoogleAnalyticsTracker {
  constructor(router: Router, @Optional() config: AnalyticsIdConfig) {
    if (!config.scriptPath) {
      config.scriptPath = '/www.google-analytics.com/analytics.js'
    }
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

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.url)
        ga('send', 'pageview')
      }
    })
  }

  public eventTracker(
    eventCategory: string,
    eventAction: string,
    eventLabel: string,
    eventValue: number,
  ) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    })
  }

  public create(gaTrackingID: string, options?: any) {
    if (options && options.gaOptions) {
      ga('create', gaTrackingID, options.gaOptions)
    } else {
      ga('create', gaTrackingID, 'auto')
    }

    ga('set', 'checkProtocolTask', () => {
      /* nothing */
    })
  }
}
