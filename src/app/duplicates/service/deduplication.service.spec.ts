import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'
import { ChromeApiStub } from '../../../test/ChromeApiStub'

import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { ChromeApiService } from '../../chrome/chrome-api.service'
import { UserPreferences } from '../../settings/model/user-preferences'
import { SettingsService } from '../../settings/service/settings.service'
import { DatabaseService } from '../../storage/service/database.service'
import { DeduplicationService } from './deduplication.service'

describe('DeduplicationService', () => {
  let service: DeduplicationService

  let chromeApiStub: ChromeApiStub
  let databaseSpy: jasmine.SpyObj<DatabaseService>
  let settingsStub: SettingsServiceStub

  beforeEach(async () => {
    databaseSpy = jasmine.createSpyObj('DatabaseService', ['insert_records'])

    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule],

      providers: [
        DeduplicationService,
        { provide: ChromeApiService, useClass: ChromeApiStub },
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    }).compileComponents()

    service = TestBed.inject(DeduplicationService)
    settingsStub = TestBed.inject(SettingsService) as unknown as SettingsServiceStub
    chromeApiStub = TestBed.inject(ChromeApiService) as unknown as ChromeApiStub
    settingsStub.userPreferences.deduplicateTabs = true
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should do nothing on disabled', async () => {
    settingsStub.userPreferences.deduplicateTabs = false
    const tab = chromeApiStub.createTab('url')
    chromeApiStub.setTabs(tab)

    await service.deduplicate(tab)

    expect(chromeApiStub.getTabs()).toContain(tab)
  })

  it('should remove tabs with same URL', async () => {
    chromeApiStub.setTabUrls('url')
    const tab = chromeApiStub.createTab('url')

    await service.deduplicate(tab)

    expect(chromeApiStub.getTabs()).toHaveSize(0)
  })

  it('should not remove tabs with different URL', async () => {
    const tab = chromeApiStub.createTab('url')
    chromeApiStub.setTabs(tab)

    await service.deduplicate(chromeApiStub.createTab('differentUrl'))

    expect(chromeApiStub.getTabs()).toContain(tab)
  })

  it('should deduplicate tabs with different openerTabId', async () => {
    const tab = chromeApiStub.createTab('url')
    tab.openerTabId = 1
    const differentTabWithSameUrl = chromeApiStub.createTab('url')
    differentTabWithSameUrl.openerTabId = 2
    chromeApiStub.setTabs(tab)

    await service.deduplicate(differentTabWithSameUrl)

    expect(chromeApiStub.getTabs()).toHaveSize(0)
  })

  describe('do not deduplicate URLs', () => {
    it('not on the list', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = ''
      chromeApiStub.setTabUrls('url')

      await service.deduplicate(chromeApiStub.createTab('url'))

      expect(chromeApiStub.getTabs()).toHaveSize(0)
    })

    it('on the list', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = 'url'
      chromeApiStub.setTabUrls('url')

      await service.deduplicate(chromeApiStub.createTab('url'))

      expect(chromeApiStub.getTabsUrls()).toContain('url')
    })

    it('multiple URLs', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = 'url1, url2'
      chromeApiStub.setTabUrls('url1', 'url2')

      await service.deduplicate(chromeApiStub.createTab('url1'))
      await service.deduplicate(chromeApiStub.createTab('url2'))

      expect(chromeApiStub.getTabsUrls()).toContain('url1')
      expect(chromeApiStub.getTabsUrls()).toContain('url2')
    })

    it('full URL must match', async () => {
      settingsStub.userPreferences.deduplicateDontDeduplicateUrls = 'long part with URL'
      chromeApiStub.setTabUrls('URL')

      await service.deduplicate(chromeApiStub.createTab('URL'))

      expect(chromeApiStub.getTabs()).toHaveSize(0)
    })
  })

  describe('strip URL', () => {
    it('suspend tab regex extracts URL', async () => {
      const preferences = new UserPreferences()
      preferences.deduplicateStripUrlParts =
        'chrome-extension:\\/\\/jaekigmcljkkalnicnjoafgfjoefkpeg\\/suspended\\.html#.*uri='

      const formattedUrl = DeduplicationService.formatUrl(
        'chrome-extension://jaekigmcljkkalnicnjoafgfjoefkpeg/suspended.html#ttl=YA2TM&pos=0&uri=url#/',
        preferences,
      )

      expect(formattedUrl).toEqual('url#/')
    })

    it('multiple strip URLs works for different URLs', async () => {
      const pref = new UserPreferences()
      pref.deduplicateStripUrlParts = 'prefix1=, prefix2='

      expect(DeduplicationService.formatUrl('prefix1=url', pref)).toEqual('url')
      expect(DeduplicationService.formatUrl('prefix2=url', pref)).toEqual('url')
    })

    it('multiple strip URLs strip all in same URLs', async () => {
      const pref = new UserPreferences()
      pref.deduplicateStripUrlParts = 'prefix1=, prefix2='

      expect(DeduplicationService.formatUrl('prefix1=prefix2=url', pref)).toEqual('url')
    })
  })
})
