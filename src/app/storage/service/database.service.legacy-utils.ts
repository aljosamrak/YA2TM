import { DatabaseService } from './database.service'

export const LEGACY_SORE_NAME_V2 = 'tanEvents'

/**
 * Opens the database.
 *
 * If the version is provided it opens it at that version otherwise opens it at
 * the current version.
 */
export async function openDatabase(databaseName: string, dbVersion?: number) {
  if (!dbVersion) {
    dbVersion = await indexedDB
      .databases()
      .then(
        (databaseInfos) =>
          databaseInfos.find((info) => info.name === databaseName)?.version,
      )
  }

  return new Promise<IDBDatabase>((resolve) => {
    const request = indexedDB.open(DatabaseService.DATABASE_NAME, dbVersion)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => fail(request.error)
  })
}

/**
 * Creates the database with one object store with key timestamp and fills it with the given entries.
 */
export async function createAndFillDbWithEventRecord(
  databaseVersion: number,
  storeName: string,
  ...objects: any[]
) {
  await new Promise<void>((resolve) => {
    const delRequest = indexedDB.deleteDatabase(DatabaseService.DATABASE_NAME)
    delRequest.onerror = () =>
      fail(`Unable to clear Database, error: ${delRequest.error}`)
    delRequest.onsuccess = () => resolve()
  })

  const database = await new Promise<IDBDatabase>((resolve) => {
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
  })

  return new Promise<void>((resolve, reject) => {
    // Populate data with the data in that version
    const transaction = database.transaction(storeName, 'readwrite')

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => {
      database.close()
      reject()
    }

    const objectStore = transaction.objectStore(storeName)
    objects.forEach((object) => {
      objectStore.put(object)
    })

    transaction.commit()
  }).catch((error) => console.error(error))
}
