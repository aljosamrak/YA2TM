import { Analytics, EventArgs, TimingArgs } from '../../analytics/Analytics'

class StubAnalytics implements Analytics {
  event(args: EventArgs): void {}

  time(args: TimingArgs): void {}

  modalView(path: string): void {}
}

export { StubAnalytics }
