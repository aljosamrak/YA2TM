import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'

describe('DatabaseService', () => {
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

    service = TestBed.inject(DatabaseService)
  })

  afterEach(async () => {
    await service.ngOnDestroy()

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DatabaseService.DATABASE_NAME)
      request.onsuccess = () => resolve()
      request.onerror = (event) => reject(event)
    })
  })

  it('should be created', async () => {
    expect(service).toBeTruthy()
  })

  it('should query the same object as inserted', async () => {
    const record = {
      timestamp: 1,
      event: TrackedEvent.TabOpened,
      url: 'url',
      windows: 1,
      tabs: 5,
    }

    await service.insert_records(record)
    const result = await service.query(0, 2)

    expect(result.length).toBe(1)
    expect(result).toContain(record)
  })
})
