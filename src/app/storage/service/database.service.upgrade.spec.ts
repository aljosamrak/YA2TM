/**
 * @jest-environment jsdom
 */
import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'
import {
  LEGACY_SORE_NAME_V1,
  createAndFillDbVersion1,
} from './database.service.legacy-utils'

import arrayContaining = jasmine.arrayContaining

describe('IndexedDBDatabase upgrade tests', () => {
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
      service.ngOnDestroy()
    }

    await new Promise<void>((resolve, reject) => {
      const delRequest = indexedDB.deleteDatabase(DatabaseService.DATABASE_NAME)
      delRequest.onsuccess = () => resolve()
      delRequest.onerror = function (event) {
        console.log('Unable to clear Database, error: ', event)
        reject(event)
      }
    })
  })

  describe('Downgrade version', () => {
    it('Fails creating database', async () => {
      await new Promise<IDBDatabase>((resolve, reject) => {
        // Create a database with a newer version
        const request = indexedDB.open(
          DatabaseService.DATABASE_NAME,
          DatabaseService.DATABASE_VERSION + 1,
        )
        request.onerror = () => reject()
        request.onsuccess = () => {
          request.result.close()
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
    it('Old entries status gets converted correctly to event', async () => {
      await createAndFillDbVersion1(
        { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
        { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
      )

      service = TestBed.inject(DatabaseService)
      const result = await service.query(-1, 1)

      expect(result.length).toBe(2)
      expect(result).toEqual(
        arrayContaining([
          {
            timestamp: 0,
            event: TrackedEvent.TabOpened,
            url: 'url',
            windows: 2,
            tabs: 5,
          },
          {
            timestamp: 1,
            event: TrackedEvent.TabClosed,
            url: 'url',
            windows: 2,
            tabs: 5,
          },
        ]),
      )
    })

    it('Old object store gets removed', async () => {
      await createAndFillDbVersion1(
        { timestamp: 0, url: 'url', status: 'opened', windows: 2, tabs: 5 },
        { timestamp: 1, url: 'url', status: 'closed', windows: 2, tabs: 5 },
      )

      service = TestBed.inject(DatabaseService)
      await service.query(-1, 0)

      const objectStoreNames = await new Promise<DOMStringList>(
        (resolve, reject) => {
          const request = indexedDB.open(
            DatabaseService.DATABASE_NAME,
            DatabaseService.DATABASE_VERSION,
          )
          request.onsuccess = () => resolve(request.result.objectStoreNames)
          request.onerror = () => reject()
        },
      )
      expect(objectStoreNames).not.toContain(LEGACY_SORE_NAME_V1)
    })
  })
})
