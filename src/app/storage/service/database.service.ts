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
    this.version(2).stores({
      tanEvents: 'timestamp',
      tabs: null,
    })

    // opening the database
    this.open().catch((err) => this.logger.error(err.message))
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
    return this.tanEvents
      .where('timestamp')
      .between(startDate, endDate)
      .toArray()
  }
}
