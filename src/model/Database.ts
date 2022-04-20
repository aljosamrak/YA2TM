import { TrackedEvent } from './TrackedEvent'

export type Record = {
  timestamp: number
  event: TrackedEvent
  url: string
  windows: number
  tabs: number
}

export interface Database {
  insert_records(record: Record): Promise<void>

  query(startDate: number, endDate: number): Promise<Record[]>
}
