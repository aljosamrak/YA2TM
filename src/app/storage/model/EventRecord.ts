export enum TrackedEvent {
  TabOpened,
  TabClosed,
  WindowOpened,
  WindowClosed,
  TabDeduplicated,
}

export type EventRecord = {
  timestamp: number
  event: TrackedEvent
  url: string
  windows: number
  tabs: number
}
