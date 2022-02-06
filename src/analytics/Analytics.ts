type EventArgs = {
  category: string
  action: string
  label?: string
  value?: number
}
type TimingArgs = {
  category: string
  name: string
  value: number
  label?: string
}

interface Analytics {
  event(eventArgs: EventArgs): void

  time(timeArgs: TimingArgs): void

  modalView(name: string): void
}

export {Analytics, EventArgs, TimingArgs}
