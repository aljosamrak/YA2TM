import { EventRecord, TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'

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

export function createAndFillDbVersion1(...objects: any[]) {
  return new Promise<IDBDatabase>((resolve) => {
    // Create database as it was in version 1
    const request = indexedDB.open(DatabaseService.DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore(LEGACY_SORE_NAME_V1, { keyPath: 'timestamp' })
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  }).then((db: IDBDatabase): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Populate data with the data in that version
      const transaction = db.transaction(LEGACY_SORE_NAME_V1, 'readwrite')

      objects.forEach((object) => {
        transaction.objectStore(LEGACY_SORE_NAME_V1).add(object)
      })

      transaction.oncomplete = () => {
        db.close()
        resolve()
      }
      transaction.onerror = () => {
        db.close()
        reject()
      }
    })
  })
}
