import { EventArgs, TimingArgs, TrackerNames } from 'react-ga'

interface Analytics {

  event(args: EventArgs, trackerNames?: TrackerNames): void

  time(args: TimingArgs, trackerNames?: TrackerNames): void
}

export { Analytics }
