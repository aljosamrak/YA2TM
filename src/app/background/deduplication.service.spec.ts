import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { ChromeApiService } from '../chrome-api.service'
import { UserPreferences } from '../settings/model/user-preferences'
import { SettingsService } from '../settings/service/settings.service'
import { DatabaseService } from '../storage/service/database.service'
import { DeduplicationService } from './deduplication.service'

import createSpyObj = jasmine.createSpyObj
import Tab = chrome.tabs.Tab

describe('DeduplicationService', () => {
  let service: DeduplicationService

  let userPreferences: UserPreferences
  let chromeApiSpy: jasmine.SpyObj<ChromeApiService>
  let databaseSpy: jasmine.SpyObj<DatabaseService>
  let settingsSpy: jasmine.SpyObj<SettingsService>

  beforeEach(async () => {
    userPreferences = new UserPreferences()
    chromeApiSpy = createSpyObj('ChromeApiService', {
      getTabs: () => Promise.resolve([]),
      getWindows: () => Promise.resolve([]),
      updateTab: () => {},
      updateWindow: () => {},
      removeTab: () => {},
    })
    databaseSpy = jasmine.createSpyObj('DatabaseService', ['insert_records'])
    settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getUserPreferences',
    ])

    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule],

      providers: [
        DeduplicationService,
        { provide: ChromeApiService, useValue: chromeApiSpy },
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: SettingsService, useValue: settingsSpy },
      ],
    }).compileComponents()

    service = TestBed.inject(DeduplicationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should do nothing on disabled', async () => {
    userPreferences.deduplicateTabs = false
    settingsSpy.getUserPreferences.and.returnValue(userPreferences)
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(tab)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
  })

  it('should remove tabs with same URL', async () => {
    userPreferences.deduplicateTabs = true
    settingsSpy.getUserPreferences.and.returnValue(userPreferences)
    const tab = createTab('url', 1)
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([createTab('url', 2)]))

    await service.deduplicate(tab)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledWith(tab.id!)
  })

  it('should not remove tabs with different URL', async () => {
    userPreferences.deduplicateTabs = true
    settingsSpy.getUserPreferences.and.returnValue(userPreferences)
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(createTab('differentUrl'))

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
  })
})
function createTab(url: string, id = 1): Tab {
  return {
    id: id,
    index: 1,
    url: url,
    pinned: false,
    highlighted: false,
    windowId: 1,
    active: true,
    incognito: false,
    selected: false,
    discarded: false,
    autoDiscardable: false,
    groupId: -1,
  }
}
