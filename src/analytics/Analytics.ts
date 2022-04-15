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

export interface Analytics {
  event(eventArgs: EventArgs): void

  time(timeArgs: TimingArgs): void

  modalView(name: string): void
}
