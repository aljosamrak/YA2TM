import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { TabData } from '../../model/TabData'
import { StubTabData } from '../../test/stub/StubTabData'
import { StubWindowData } from '../../test/stub/StubWindowData'
import { SettingsService } from '../settings/service/settings.service'
import { DeduplicationService } from './deduplication.service'

describe('DeduplicationService', () => {
  let service: DeduplicationService

  const settingsSpy = jasmine.createSpyObj('SettingsService', [
    'getUserPreferences',
  ])
  const stubTabData = new StubTabData()
  const stubWindowData = new StubWindowData()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule],

      providers: [
        DeduplicationService,
        { provide: SettingsService, useValue: settingsSpy },
        { provide: 'TabData', useValue: stubTabData },
        { provide: 'WindowData', useValue: stubWindowData },
      ],
    }).compileComponents()

    service = TestBed.inject(DeduplicationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should do nothing on disabled', async () => {
    settingsSpy.getUserPreferences.and.returnValue({ deduplicateTabs: false })
    const tab = stubTabData.createTab('url')
    stubTabData.setTabs([tab])

    await service.deduplicate(tab)

    const result = await stubTabData.query()
    expect(result).toContain(tab)
  })

  it('should remove tabs with same URL', () => {
    settingsSpy.getUserPreferences.and.returnValue({ deduplicateTabs: true })
    const tab = stubTabData.createTab('url')
    stubTabData.setTabs([tab])

    service.deduplicate(tab)

    expect(stubTabData.query).not.toContain(tab)
  })

  it('should not remove tabs with different URL', () => {
    settingsSpy.getUserPreferences.and.returnValue({ deduplicateTabs: true })
    const tab = stubTabData.createTab('url')
    stubTabData.setTabs([tab])

    service.deduplicate(stubTabData.createTab('differentUrl'))

    expect(stubTabData.query).toContain(tab)
  })
})
