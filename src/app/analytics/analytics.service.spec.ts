import { TestBed } from '@angular/core/testing'
import { LocalStorageService } from '../storage/service/local-storage.service'

import { AnalyticsIdConfig, AnalyticsService } from './analytics.service'

describe('AnalyticsService', () => {
  let service: AnalyticsService

  const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get'])

  beforeEach(() => {
    const id = 'UA-XXX-X'

    localStorageSpy.get.and.returnValue(Promise.resolve(id))

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: AnalyticsIdConfig, useValue: { id: id } },
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    })

    service = TestBed.inject(AnalyticsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
