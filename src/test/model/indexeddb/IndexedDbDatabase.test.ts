/**
 * @jest-environment jsdom
 */

import {mockNavigationStorage} from './MockHelper'

require('fake-indexeddb/auto')
const FDBFactory = require('fake-indexeddb/lib/FDBFactory')
import {IndexedDBDatabase} from '../../../model/indexeddb/IndexedDBDatabase'
import {logger} from '../../../services/Logger'
import {TrackedEvent} from '../../../model/TrackedEvent'
import {StubAnalytics} from '../../stub/StubAnalytics'

describe('IndexedDBDatabase tests', () => {
  let dbDatabase: IndexedDBDatabase

  beforeEach(async () => {
    // Clear database
    indexedDB = new FDBFactory()
    dbDatabase = new IndexedDBDatabase(logger, new StubAnalytics())

    mockNavigationStorage()
  })

  describe('Database query', () => {
    test('Query the same object as inserted', async () => {
      const record = {
        timestamp: 1,
        event: TrackedEvent.TabOpened,
        url: 'url',
        windows: 1,
        tabs: 5,
      }

      await dbDatabase.insert_records(record)
      const result = await dbDatabase.query(0, 2)

      expect(result).toHaveLength(1)
      expect(result).toEqual(expect.arrayContaining([record]))
    })
  })
})
