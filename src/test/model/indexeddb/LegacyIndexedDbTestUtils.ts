import {IndexedDBDatabase} from '../../../model/indexeddb/IndexedDBDatabase'
import {LEGACY_SORE_NAME_V1} from '../../../model/indexeddb/LegacyIndexedDb'

export function createAndFillDbVersion1(...objects: any[]) {
  return new Promise<IDBDatabase>((resolve) => {
    // Create database as it was in version 1
    const request = indexedDB.open(IndexedDBDatabase.DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore(LEGACY_SORE_NAME_V1, {keyPath: 'timestamp'})
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
