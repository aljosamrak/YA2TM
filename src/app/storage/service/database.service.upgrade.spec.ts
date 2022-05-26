/**
 * @jest-environment jsdom
 */
import { DatabaseService } from './database.service'
import { mockNavigationStorage } from './MockHelper'

require('fake-indexeddb/auto')
const FDBFactory = require('fake-indexeddb/lib/FDBFactory')

describe('IndexedDBDatabase upgrade tests', () => {
  beforeEach(async () => {
    // Clear database
    indexedDB = new FDBFactory()
    mockNavigationStorage()
  })

  describe('Downgrade version', () => {
    it('Fails creating database', async () => {
      await new Promise<IDBDatabase>((resolve) => {
        // Create a database with a newer version
        const request = indexedDB.open(
          DatabaseService.DATABASE_NAME,
          DatabaseService.DATABASE_VERSION + 1,
        )
        request.onsuccess = () => {
          resolve(request.result)
        }
      })

      // try {
      //   // Await for the database to initialize
      //   await new DatabaseService(logger, new StubAnalytics()).query(0, 0)
      //   assert.fail('Fail!')
      // } catch (error: any) {
      //   expect(error.message).not.toBe('error opening database VersionError')
      // }
    })
  })

  describe('Upgrade from version 1', () => {
    // it('Old entries status gets converted correctly to event', async () => {
    //   await createAndFillDbVersion1(
    //     { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
    //     { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
    //   )
    //
    //   const database = new DatabaseService(logger, new StubAnalytics())
    //   const result = await database.query(-1, 1)
    //
    //   expect(result.length).toBe(2)
    //   expect(result).toEqual(
    //     arrayContaining([
    //       {
    //         timestamp: 0,
    //         event: TrackedEvent.TabOpened,
    //         url: 'url',
    //         windows: 2,
    //         tabs: 5,
    //       },
    //       {
    //         timestamp: 1,
    //         event: TrackedEvent.TabClosed,
    //         url: 'url',
    //         windows: 2,
    //         tabs: 5,
    //       },
    //     ]),
    //   )
    // })
    // it('Old object store gets removed', async () => {
    //   await createAndFillDbVersion1(
    //     { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
    //     { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
    //   )
    //
    //   const database = new IndexedDBDatabase(logger, new StubAnalytics())
    //   await database.query(-1, 0)
    //
    //   const objectStoreNames = await new Promise<DOMStringList>((resolve) => {
    //     const request = indexedDB.open(
    //       IndexedDBDatabase.DATABASE_NAME,
    //       IndexedDBDatabase.DATABASE_VERSION,
    //     )
    //     request.onsuccess = () => {
    //       resolve(request.result.objectStoreNames)
    //     }
    //   })
    //   expect(objectStoreNames).not.toContain(LEGACY_SORE_NAME_V1)
    // })
  })
})