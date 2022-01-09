type Record = {
  timestamp: number
  url: string
  status: string
  windows: number
  tabs: number,
}

interface Database {
  connect_database(): Promise<any>

  insert_records(record: Record): Promise<boolean>

  query(startDate: number, endDate: number): Promise<Record[]>
}

export { Database, Record }
