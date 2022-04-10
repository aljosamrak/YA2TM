import {Analytics, EventArgs, TimingArgs} from './Analytics'
import {Injectable} from '@angular/core'

const TRACKING_ID = '${__TRACKING_ID__}'

@Injectable({
  providedIn: 'root',
})
class GoogleAnalytics implements Analytics {
  async event(eventArgs: EventArgs) {
    // return measure(TRACKING_ID)
    //   .event(
    //     eventArgs.category,
    //     eventArgs.action,
    //     eventArgs.label,
    //     eventArgs.value,
    //   )
    //   .send()
  }

  async time(timeArgs: TimingArgs) {
    // return measure(TRACKING_ID)
    //   .timing(timeArgs.category, timeArgs.name, timeArgs.value, timeArgs.label)
    //   .send()
  }

  async modalView(name: string) {
    // return measure(TRACKING_ID).screenview(name).send()
  }
}

export {GoogleAnalytics}
