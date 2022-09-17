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
    settingsStub.userPreferences.deduplicateTabs = true
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([createTab('url')]))

    await service.deduplicate(tab)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledWith(tab.id!)
  })

  it('should not remove tabs with different URL', async () => {
    settingsStub.userPreferences.deduplicateTabs = true
    const tab = createTab('url')
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(createTab('differentUrl'))

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
  })

  it('should deduplicate tabs with different openerTabId', async () => {
    settingsStub.userPreferences.deduplicateTabs = true
    const tab = createTab('url')
    tab.openerTabId = 1
    const differentTabWithSameUrl = createTab('url')
    differentTabWithSameUrl.openerTabId = 2
    chromeApiSpy.getTabs.and.returnValue(Promise.resolve([tab]))

    await service.deduplicate(differentTabWithSameUrl)

    expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(1)
  })

  describe('deduplicate empty tab', () => {
    it('disabled, should not deduplicate empty tabs', async () => {
      settingsStub.userPreferences.deduplicateTabs = true
      settingsStub.userPreferences.deduplicateNewTab = false
      chromeApiSpy.getTabs.and.returnValue(
        Promise.resolve([createTab('chrome://newtab/')]),
      )

      await service.deduplicate(createTab('chrome://newtab/'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(0)
    })

    it('enabled, should not deduplicate empty tabs', async () => {
      settingsStub.userPreferences.deduplicateTabs = true
      settingsStub.userPreferences.deduplicateNewTab = true
      chromeApiSpy.getTabs.and.returnValue(
        Promise.resolve([createTab('chrome://newtab/')]),
      )

      await service.deduplicate(createTab('chrome://newtab/'))

      expect(chromeApiSpy.removeTab).toHaveBeenCalledTimes(1)
    })
  })
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
