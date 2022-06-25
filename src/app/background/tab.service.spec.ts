import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { SettingsServiceStub } from '../../test/SettingsServiceStub'
import { AnalyticsService } from '../analytics/analytics.service'
import { ChromeApiService } from '../chrome/chrome-api.service'
import { SettingsService } from '../settings/service/settings.service'
import { DatabaseService } from '../storage/service/database.service'
import { BadgeService } from './badge.service'
import { DeduplicationService } from './deduplication.service'
import { TabService } from './tab.service'

const chrome = {
  tabs: {
    onCreated: { addListener: () => {} },
    onUpdated: { addListener: () => {} },
    onRemoved: { addListener: () => {} },
  },
  windows: {
    onCreated: { addListener: () => {} },
    onRemoved: { addListener: () => {} },
  },
}

describe('TabService', () => {
  let service: TabService

  const analyticSpy = jasmine.createSpyObj('AnalyticsService', [''])
  const badgeSpy = jasmine.createSpyObj('BadgeService', ['updateTabCount'])
  const chromeApiSpy = jasmine.createSpyObj('ChromeApiService', [''])
  const databaseSpy = jasmine.createSpyObj('DatabaseService', [''])
  const deduplicationSpy = jasmine.createSpyObj('DeduplicationService', [''])

  beforeEach(() => {
    // @ts-ignore
    global.chrome = chrome

    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        TabService,
        { provide: AnalyticsService, useValue: analyticSpy },
        { provide: BadgeService, useValue: badgeSpy },
        { provide: ChromeApiService, useValue: chromeApiSpy },
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: DeduplicationService, useValue: deduplicationSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    })
    service = TestBed.inject(TabService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
