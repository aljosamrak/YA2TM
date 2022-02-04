import { Analytics } from './Analytics'
import ReactGA, { EventArgs, TimingArgs, TrackerNames } from 'react-ga'
import { injectable } from 'inversify'

@injectable()
class GoogleAnalytics implements Analytics {
  event(args: EventArgs, trackerNames?: TrackerNames): void {
    ReactGA.event(args, trackerNames)
  }

  time(args: TimingArgs, trackerNames?: TrackerNames): void {
    ReactGA.timing(args, trackerNames)
  }
}

export { GoogleAnalytics }
