import { Analytics } from '../../analytics/Analytics'
import { EventArgs, TimingArgs, TrackerNames } from 'react-ga'

class StubAnalytics implements Analytics {

  event(args: EventArgs, trackerNames?: TrackerNames): void {
  }

  time(args: TimingArgs, trackerNames?: TrackerNames): void {
  }
}

export { StubAnalytics }
