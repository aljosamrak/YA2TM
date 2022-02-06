import {Analytics, EventArgs, TimingArgs} from './Analytics'
import {injectable} from 'inversify'
import {measure} from 'measurement-protocol'
import {IncomingMessage} from 'http'

const TRACKING_ID = '${__TRACKING_ID__}'

@injectable()
class GoogleAnalytics implements Analytics {
  async event(eventArgs: EventArgs): Promise<Response | IncomingMessage> {
    return measure(TRACKING_ID)
      .event(
        eventArgs.category,
        eventArgs.action,
        eventArgs.label,
        eventArgs.value,
      )
      .send()
  }

  async time(timeArgs: TimingArgs): Promise<Response | IncomingMessage> {
    return measure(TRACKING_ID)
      .timing(timeArgs.category, timeArgs.name, timeArgs.value, timeArgs.label)
      .send()
  }

  async modalView(name: string): Promise<Response | IncomingMessage> {
    return measure(TRACKING_ID).screenview(name).send()
  }
}

export {GoogleAnalytics}
