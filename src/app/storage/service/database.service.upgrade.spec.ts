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
  LEGACY_SORE_NAME_V1,
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

  describe('Upgrade from version 1', () => {
    it('Old entries status gets converted correctly to event', async () => {
      await createAndFillDbWithEventRecord(
        1,
        LEGACY_SORE_NAME_V1,
        { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
        { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
      )

      service = await TestBed.inject(DatabaseService)
      const result = await service.query(-1, 2)

      expect(result.length).toBe(2)
      expect(result).toEqual(
        arrayContaining([
          {
            id: 1,
            timestamp: 0,
            event: TrackedEvent.TabOpened,
            url: 'url',
            windows: 2,
            tabs: 5,
          },
          {
            id: 2,
            timestamp: 1,
            event: TrackedEvent.TabClosed,
            url: 'url',
            windows: 2,
            tabs: 5,
          },
        ]),
      )
    })

    it('Old object store gets cleared', async () => {
      // We can't delete the data store at the next version, we can just clear it.
      await createAndFillDbWithEventRecord(
        1,
        LEGACY_SORE_NAME_V1,
        { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
        { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
      )

      service = await TestBed.inject(DatabaseService)
      await service.query(-1, 0)

      // Dixie sets very high version above the version set. At the time of writing it was 20.
      const dbVersion = await getDatabaseVersion(DatabaseService.DATABASE_NAME)

      const objectStoreNames = await new Promise<any>((resolve) => {
        const request = indexedDB.open(DatabaseService.DATABASE_NAME, dbVersion)
        request.onerror = () => fail(request.error)
        request.onsuccess = () => {
          const transaction = request.result.transaction(
            LEGACY_SORE_NAME_V1,
            'readonly',
          )

          const getAllRequest = transaction
            .objectStore(LEGACY_SORE_NAME_V1)
            .getAll()
          getAllRequest.onerror = () => fail(request.error)
          getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result)
            request.result.close()
          }
        }
      })

      expect(objectStoreNames).toEqual([])
    })
  })
})

async function getDatabaseVersion(databaseName: string) {
  return indexedDB
    .databases()
    .then(
      (databaseInfos) =>
        databaseInfos.find((info) => info.name === databaseName)?.version,
    )
}
