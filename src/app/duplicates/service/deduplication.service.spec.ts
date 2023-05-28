import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { ChromeApiService } from '../../chrome/chrome-api.service'
import { SettingsService } from '../../settings/service/settings.service'
import { DatabaseService } from '../../storage/service/database.service'
import { DeduplicationService } from './deduplication.service'
import createSpyObj = jasmine.createSpyObj
import Tab = chrome.tabs.Tab

describe('DeduplicationService', () => {
  let service: DeduplicationService

  let chromeApiSpy: jasmine.SpyObj<ChromeApiService>
  let databaseSpy: jasmine.SpyObj<DatabaseService>
  let settingsStub: SettingsServiceStub

  beforeEach(async () => {
    chromeApiSpy = createSpyObj('ChromeApiService', {
      getTabs: () => Promise.resolve([]),
      getWindows: () => Promise.resolve([]),
      updateTab: () => {},
      updateWindow: () => {},
      removeTab: () => {},
    })
    databaseSpy = jasmine.createSpyObj('DatabaseService', ['insert_records'])

    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule],

      providers: [
        DeduplicationService,
        { provide: ChromeApiService, useValue: chromeApiSpy },
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    }).compileComponents()

    service = TestBed.inject(DeduplicationService)
    settingsStub = TestBed.inject(
      SettingsService,
    ) as unknown as SettingsServiceStub
    settingsStub.userPreferences.deduplicateTabs = true
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should do nothing on disabled', async () => {
    settingsStub.userPreferences.deduplicateTabs = false
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(tab)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
  })

  it('should remove tabs with same URL', async () => {
    withExistingTabs('url')
    const tab = createTab('url')

    await service.deduplicate(tab)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledWith(tab.id!)
  })

  it('should not remove tabs with different URL', async () => {
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(createTab('differentUrl'))

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
  })

  it('should deduplicate tabs with different openerTabId', async () => {
    const tab = createTab('url')
    tab.openerTabId = 1
    const differentTabWithSameUrl = createTab('url')
    differentTabWithSameUrl.openerTabId = 2
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(differentTabWithSameUrl)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(1)
  })

  describe('do not deduplicate URLs', () => {
    it('not on the list', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = ''
      withExistingTabs()
      withExistingTabs('url')

      await service.deduplicate(createTab('url'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(1)
    })

    it('on the list', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = 'url'
      withExistingTabs('url')

      await service.deduplicate(createTab('url'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
    })

    it('multiple URLs', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = 'url1, url2'
      withExistingTabs('url1', 'url2')

      await service.deduplicate(createTab('url1'))
      await service.deduplicate(createTab('url2'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
    })

    it('full URL must match', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls =
        'long part with URL'
      withExistingTabs('URL')

      await service.deduplicate(createTab('URL'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(1)
    })
  })

  function withExistingTabs(...urls: string[]) {
    chromeApiSpy.getTabs.and.returnValue(
      Promise.resolve(urls.map((url) => createTab(url))),
    )
  }
})

let id = 1
export function createTab(url: string): Tab {
  return {
    id: id++,
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
