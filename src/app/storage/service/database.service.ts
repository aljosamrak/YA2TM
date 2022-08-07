import { Injectable } from '@angular/core'
import Dexie, { Table } from 'dexie'
import { NGXLogger } from 'ngx-logger'

import { AnalyticsService } from '../../analytics/analytics.service'
import { EventRecord } from '../model/EventRecord'
import { TabRelation } from '../model/TabRelations'
import { convert } from './database.service.legacy-utils'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  static DATABASE_NAME = 'TabsDB'
  static DATABASE_VERSION = 3

  history!: Table<EventRecord, number>
  openedTabs!: Table<TabRelation, number>

  constructor(
    private logger: NGXLogger,
    protected analytics: AnalyticsService,
  ) {
    super(DatabaseService.DATABASE_NAME)

    this.version(1).stores({
      tabs: 'timestamp',
    })
    this.version(2)
      .stores({
        tanEvents: 'timestamp',
      })
      .upgrade((tx) => {
        tx.table('tabs')
          .toArray()
          .then((records) =>
            tx
              .table('tanEvents')
              .bulkPut(records.map((record) => convert(record))),
          )
          .then(() => tx.table('tabs').clear())
          .catch((e) => console.log(e))
      })
    this.version(DatabaseService.DATABASE_VERSION)
      .stores({
        history: '++id, timestamp, event',
        openedTabs: 'id&, windowId&, openerTabId, index, groupId, title',
      })
      .upgrade((tx) =>
        tx
          .table('tanEvents')
          .toArray()
          .then((records) => this.history.bulkPut(records))
          .then((_) => tx.table('tanEvents').clear())
          .catch((e) => console.log(e)),
      )
  }

  async deleteData(): Promise<void> {
    return this.delete()
  }

  public insert_records(record: EventRecord) {
    this.history.add(record).catch((err) => this.logger.error(err.message))
  }

  public async query(
    startDate: number,
    endDate: number,
  ): Promise<EventRecord[]> {
    const startTime = performance.now()

    const dataPromise = this.history
      .where('timestamp')
      .between(startDate, endDate, true, true)
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
