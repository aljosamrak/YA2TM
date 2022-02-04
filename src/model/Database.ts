import {TrackedEvent} from './TrackedEvent'

type Record = {
  timestamp: number
  event: TrackedEvent
  url: string
  windows: number
  tabs: number
}

interface Database {
  insert_records(record: Record): Promise<void>

  query(startDate: number, endDate: number): Promise<Record[]>
}

export {Database, Record}
