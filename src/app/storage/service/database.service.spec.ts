import { TestBed } from '@angular/core/testing'
import { AnalyticsService } from '../../analytics/analytics.service'
import { TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'
import arrayContaining = jasmine.arrayContaining

describe('DatabaseService', () => {
  let service: DatabaseService

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue'])

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        DatabaseService,
        { provide: AnalyticsService, useValue: spy },
      ],
    })

    TestBed.configureTestingModule({})
    service = TestBed.inject(DatabaseService)

    // // Clear database
    // indexedDB = new FDBFactory()
    // // dbDatabase = new IndexedDBDatabase(logger, new StubAnalytics())
    //
    // mockNavigationStorage()
  })

  it('should be created', () => {
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
    expect(result).toContain(arrayContaining([record]))
  })
})
