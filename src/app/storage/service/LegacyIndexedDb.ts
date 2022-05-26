import { EventRecord, TrackedEvent } from '../model/EventRecord'

export const LEGACY_SORE_NAME_V1 = 'tabs'

export type OldRecord = {
  timestamp: number
  url: string
  status: string
  windows: number
  tabs: number
}

export function convert(oldEntry: OldRecord): EventRecord {
  return {
    timestamp: oldEntry.timestamp,
    event:
      oldEntry.status === 'opened'
        ? TrackedEvent.TabOpened
        : TrackedEvent.TabClosed,
    url: oldEntry.url,
    windows: oldEntry.windows,
    tabs: oldEntry.tabs,
  }
}