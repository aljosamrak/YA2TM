import { TestBed } from '@angular/core/testing'
import { AnalyticsService } from './analytics.service'

describe('NgGoogleAnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AnalyticsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
