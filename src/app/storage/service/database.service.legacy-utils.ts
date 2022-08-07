import { EventRecord, TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'

export const LEGACY_SORE_NAME_V1 = 'tabs'
export const LEGACY_SORE_NAME_V2 = 'tanEvents'

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

/**
 * Creates tht database with one object store with key timestamp and fills it with the given entries.
 */
export function createAndFillDbWithEventRecord(
  databaseVersion: number,
  storeName: string,
  ...objects: any[]
) {
  return new Promise<IDBDatabase>((resolve) => {
    // Create database
    const request = indexedDB.open(
      DatabaseService.DATABASE_NAME,
      databaseVersion,
    )
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore(storeName, { keyPath: 'timestamp' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => fail(request.error)
  }).then((db: IDBDatabase): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Populate data with the data in that version
      const transaction = db.transaction(storeName, 'readwrite')

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }
      transaction.onerror = () => {
        db.close()
        reject()
      }

      const objectStore = transaction.objectStore(storeName)
      objects.forEach((object) => {
        objectStore.add(object)
      })
      transaction.commit()
    })
  })
}
