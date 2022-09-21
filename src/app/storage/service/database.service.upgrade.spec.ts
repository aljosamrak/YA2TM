/**
 * @jest-environment jsdom
 */
import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'
import {
  createAndFillDbWithEventRecord,
  LEGACY_SORE_NAME_V2,
  openDatabase,
} from './database.service.legacy-utils'

import arrayContaining = jasmine.arrayContaining

describe('DatabaseService upgrade tests', () => {
  const analyticSpy = jasmine.createSpyObj('AnalyticsService', [
    'event',
    'time',
  ])

  let service: DatabaseService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        DatabaseService,
        { provide: AnalyticsService, useValue: analyticSpy },
      ],
    })
  })

  afterEach(async () => {
    if (service) {
      service.close()
    }

    await new Promise<void>((resolve) => {
      const delRequest = indexedDB.deleteDatabase(DatabaseService.DATABASE_NAME)
      delRequest.onsuccess = () => resolve()
      delRequest.onerror = () =>
        fail(`Unable to clear Database, error: ${delRequest.error}`)
    })
  })

  describe('Upgrade from version 2', () => {
    const record = {
      timestamp: 0,
      event: TrackedEvent.TabOpened,
      url: 'url',
      windows: 2,
      tabs: 5,
      id: 1,
    }

    it('Old entries are preserved', async () => {
      await createAndFillDbWithEventRecord(2, LEGACY_SORE_NAME_V2, record)

      service = await TestBed.inject(DatabaseService)
      const result = await service.query(-1, 1)

      expect(result.length).toBe(1)
      expect(result).toEqual(arrayContaining([record]))
    })

    it('Old object store gets cleared', async () => {
      // We can't delete the data store at the next version, we can just clear it.
      await createAndFillDbWithEventRecord(2, LEGACY_SORE_NAME_V2, record)

      service = await TestBed.inject(DatabaseService)
      await service.query(-1, 0)

      // Dixie sets very high version above the version set. At the time of writing it was 20.
      const database = await openDatabase(DatabaseService.DATABASE_NAME)
      const objectStoreNames = database.objectStoreNames
      database.close()

      expect(objectStoreNames).not.toContain(LEGACY_SORE_NAME_V2)
    })

    it('Old object store gets removed', async () => {
      await createAndFillDbWithEventRecord(2, LEGACY_SORE_NAME_V2, record)

      service = TestBed.inject(DatabaseService)
      await service.query(-1, 0)

      // Dixie sets very high version above the version set. At the time of writing it was 20.
      const database = await openDatabase(DatabaseService.DATABASE_NAME)
      const objectStoreNames = database.objectStoreNames
      database.close()

      expect(objectStoreNames).not.toContain(LEGACY_SORE_NAME_V2)
    })
  })
})
