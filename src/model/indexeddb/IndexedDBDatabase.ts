import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import 'reflect-metadata'
import { AnalyticsService } from '../../app/analytics/analytics.service'
import { Database, Record } from '../Database'
import { convert, LEGACY_SORE_NAME_V1, OldRecord } from './LegacyIndexedDb'

@Injectable({
  providedIn: 'root',
})
class IndexedDBDatabase implements Database {
  static DATABASE_NAME = 'TabsDB'
  static DATABASE_VERSION = 2
  static OBJECT_STORE = 'tanEvents'

  private _databasePromise

  constructor(
    private logger: NGXLogger,
    protected analytics: AnalyticsService,
  ) {
    if (!indexedDB) {
      this.logger.error(
        "Your browser doesn't support a stable version of IndexedDB. Unable to save tab usages.",
      )
    }

    this._databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const start = performance.now()
      const request = indexedDB.open(
        IndexedDBDatabase.DATABASE_NAME,
        IndexedDBDatabase.DATABASE_VERSION,
      )
      request.onerror = (event) => {
        const openRequest = event.target as IDBOpenDBRequest
        logger.error('Database error: ' + openRequest.error)
        reject('error opening database ' + openRequest.error)
      }
      request.onsuccess = () => {
        navigator.storage.estimate().then((estimate: StorageEstimate) => {
          if (estimate.usage && estimate.quota) {
            analytics.event({
              category: 'Database',
              action: 'Open size',
              value: (estimate?.usage / estimate?.quota) * 100,
              label: `usage: ${estimate.usage}, quota: ${estimate.quota}`,
            })
          }
        })
        this.analytics.time({
          category: 'Database',
          name: 'Open time',
          value: performance.now() - start,
        })

        resolve(request.result)
      }
      request.onupgradeneeded = (event) => {
        const upgradeStartTime = performance.now()
        const db = request.result

        if (!db.objectStoreNames.contains(IndexedDBDatabase.OBJECT_STORE)) {
          db.createObjectStore(IndexedDBDatabase.OBJECT_STORE, {
            keyPath: 'timestamp',
          })
        }

        // No update
        if (event.oldVersion <= 0) {
          return
        }

        if (event.oldVersion < 2) {
          analytics.event({
            category: 'Database',
            action: 'Upgrade',
            value: event.oldVersion,
          })
          if (!request.transaction) {
            logger.error(
              `Unable to upgrade database. Transaction is '${request.transaction}'`,
            )
            reject()
            return
          }

          // Event status from string to enum
          const oldObjectStore =
            request.transaction.objectStore(LEGACY_SORE_NAME_V1)
          const newObjectStore = request.transaction.objectStore(
            IndexedDBDatabase.OBJECT_STORE,
          )
          const getAllRequest = oldObjectStore.getAll()
          getAllRequest.onsuccess = (getAllEvent: Event) => {
            if (getAllEvent.target === null) {
              reject('"getEvent" is undefined')
            }
            getAllRequest.result.forEach((oldEntry: OldRecord) => {
              newObjectStore.add(convert(oldEntry))
            })
            db.deleteObjectStore(LEGACY_SORE_NAME_V1)

            this.analytics.time({
              category: 'Database',
              name: 'Upgrade v1 time',
              value: performance.now() - upgradeStartTime,
            })
          }
        }
      }
    })
  }

  public insert_records(record: Record): Promise<void> {
    return this._databasePromise.then((db: IDBDatabase): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(
          IndexedDBDatabase.OBJECT_STORE,
          'readwrite',
        )
        const objectStore = transaction.objectStore(
          IndexedDBDatabase.OBJECT_STORE,
        )
        transaction.oncomplete = () => {
          resolve()
        }
        transaction.onerror = (event: Event) => {
          reject(event)
        }
        const request = objectStore.add(record)
        request.onsuccess = () => {
          resolve()
        }
      })
    })
  }

  public async query(startDate: number, endDate: number): Promise<Record[]> {
    const startTime = performance.now()
    return this._databasePromise.then((db: IDBDatabase): Promise<Record[]> => {
      return new Promise<Record[]>((resolve, reject) => {
        const keyRangeValue = IDBKeyRange.bound(startDate, endDate, true)

        const transaction = db.transaction(
          IndexedDBDatabase.OBJECT_STORE,
          'readonly',
        )
        const objectStore = transaction.objectStore(
          IndexedDBDatabase.OBJECT_STORE,
        )
        const request = objectStore.openCursor(keyRangeValue)

        const data: Record[] = []
        request.onsuccess = function () {
          const cursor = this.result
          if (!cursor) {
            return
          }
          data.push(cursor.value)
          cursor.continue()
        }
        transaction.oncomplete = () => {
          this.analytics.time({
            category: 'Database',
            name: 'Query time',
            value: performance.now() - startTime,
            label: `Window: ${endDate - startTime}, size: ${data.length}`,
          })
          resolve(data)
        }
        transaction.onerror = (event: Event) => {
          reject(event)
        }
      })
    })
  }
}

export { IndexedDBDatabase }
