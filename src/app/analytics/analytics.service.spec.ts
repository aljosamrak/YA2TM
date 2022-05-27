import { TestBed } from '@angular/core/testing'

import { AnalyticsIdConfig, AnalyticsService } from './analytics.service'

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: AnalyticsIdConfig, useValue: { id: 'UA-XXX-X' } },
      ],
    })

    service = TestBed.inject(AnalyticsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
