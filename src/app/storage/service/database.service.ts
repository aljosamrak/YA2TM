import { Injectable } from '@angular/core'
import Dexie, { Table } from 'dexie'
import { NGXLogger } from 'ngx-logger'

import { AnalyticsService } from '../../analytics/analytics.service'
import { SnoozedTab } from '../../snooze/model/SnoozedTab'
import { EventRecord } from '../model/EventRecord'
import { OpenTab } from '../model/OpenTab'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  static DATABASE_NAME = 'TabsDB'
  static DATABASE_VERSION = 4

  history!: Table<EventRecord, number>
  openedTabs!: Table<OpenTab, number>
  snoozedTabs!: Table<SnoozedTab, number>

  constructor(private logger: NGXLogger, protected analytics: AnalyticsService) {
    super(DatabaseService.DATABASE_NAME)

    this.version(3)
      .stores({
        history: '++, timestamp, event',
        openedTabs: '++, windowId, openerTabId, index, groupId, title',
      })
      .upgrade((tx) => {
        tx.table('tanEvents')
          .toArray()
          .then((records: EventRecord[]) => this.history.bulkPut(records))
          .then((_) => tx.table('tanEvents').clear())
          .catch((e) => logger.error(e))
      })
    this.version(DatabaseService.DATABASE_VERSION).stores({
      snoozedTabs: '++, unsnoozedTimestamp',
    })
  }

  async deleteData(): Promise<void> {
    return this.delete()
  }

  public insert_records(record: EventRecord) {
    this.history.add(record).catch((err) => this.logger.error(err.message))
  }

  public async query(startDate: number, endDate: number): Promise<EventRecord[]> {
    const startTime = performance.now()

    const dataPromise = this.history.where('timestamp').between(startDate, endDate, true, true).toArray()

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

  addOpenTab(param: OpenTab) {
    this.openedTabs.add(param).catch((err) => this.logger.error(err.message))
  }

  updateOpenTab(param: OpenTab) {
    this.openedTabs
      .update(param.id!, {
        title: param.title,
      })
      .catch((err) => this.logger.error(err.message))
  }

  closeTab(tabId: number) {
    this.openedTabs.delete(tabId).catch((err) => this.logger.error(err.message))
  }

  getOpenTabs(): Promise<OpenTab[]> {
    return this.openedTabs.toArray()
  }

  addSnoozedTab(snoozedTab: SnoozedTab) {
    this.snoozedTabs.put(snoozedTab).catch((err) => this.logger.error(err.message))
  }

  getSnoozedTabs() {
    return this.snoozedTabs.toArray()
  }

  removeSnoozedTab(key: number) {
    this.snoozedTabs.delete(key).catch((err) => this.logger.error(err.message))
  }
}
