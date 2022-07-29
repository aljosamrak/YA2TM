import { Injectable } from '@angular/core'
import Dexie, { Table } from 'dexie'
import { NGXLogger } from 'ngx-logger'

import { AnalyticsService } from '../../analytics/analytics.service'
import { EventRecord } from '../model/EventRecord'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  static DATABASE_NAME = 'TabsDB'
  static DATABASE_VERSION = 2

  tanEvents!: Table<EventRecord, number>

  constructor(
    private logger: NGXLogger,
    protected analytics: AnalyticsService,
  ) {
    super(DatabaseService.DATABASE_NAME)

    const start = performance.now()

    this.version(2).stores({
      tanEvents: 'timestamp',
      tabs: null,
    })
  }

  async deleteData(): Promise<void> {
    return this.delete()
  }

  public insert_records(record: EventRecord) {
    this.tanEvents.add(record).catch((err) => console.log(err.message))
  }

  public async query(
    startDate: number,
    endDate: number,
  ): Promise<EventRecord[]> {
    const startTime = performance.now()

    const dataPromise = this.tanEvents
      .where('timestamp')
      .between(startDate, endDate)
      .toArray()

    dataPromise.then((records) => {
      this.analytics.time({
        category: 'Database',
        name: 'Query time',
        value: performance.now() - startTime,
        label: `Window: ${endDate - startTime}, size: ${records.length}`,
      })
    })

    return dataPromise
  }
}
