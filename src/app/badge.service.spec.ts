import { TestBed } from '@angular/core/testing'

import { SettingsServiceStub } from '../test/SettingsServiceStub'
import { BadgeService, hslToHex } from './badge.service'
import { ChromeApiService } from './chrome-api.service'
import { BadgeTextType } from './settings/model/user-preferences'
import { SettingsService } from './settings/service/settings.service'

import createSpyObj = jasmine.createSpyObj

describe('BadgeService', () => {
  let service: BadgeService

  let chromeApiSpy: jasmine.SpyObj<ChromeApiService>
  let settingsStub: SettingsServiceStub

  beforeEach(() => {
    chromeApiSpy = createSpyObj('ChromeApiService', {
      getTabs: () => Promise.resolve([]),
      getWindows: () => Promise.resolve([]),
      setBadgeText: () => {},
      setBadgeBackgroundColor: () => {},
    })

    TestBed.configureTestingModule({
      providers: [
        BadgeService,
        { provide: ChromeApiService, useValue: chromeApiSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    })

    service = TestBed.inject(BadgeService)
    settingsStub = TestBed.inject(
      SettingsService,
    ) as unknown as SettingsServiceStub
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('setting badge text', () => {
    it('ALL_TAB preference the same as tab count', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.badgeTextType = BadgeTextType.TABS_NUM
      chromeApiSpy.getTabs.and.returnValue(Promise.resolve(new Array(20)))

      await service.updateTabCount()

      expect(chromeApiSpy.setBadgeText).toHaveBeenCalledWith('20')
    })

    it('ALL_WINDOW preference the same as window count', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.badgeTextType = BadgeTextType.WINDOW_NUM
      chromeApiSpy.getWindows.and.returnValue(Promise.resolve(new Array(20)))

      await service.updateTabCount()

      expect(chromeApiSpy.setBadgeText).toHaveBeenCalledWith('20')
    })
  })

  describe('setting badge background color', () =>
    [
      { tabCount: 20, desiredTabs: 20, expectedColorHue: 60 }, // yellow
      { tabCount: 2, desiredTabs: 2, expectedColorHue: 60 }, // yellow
      { tabCount: 1000, desiredTabs: 1, expectedColorHue: 0 }, // red
      { tabCount: 20, desiredTabs: 10, expectedColorHue: 30 }, // orange
      { tabCount: 1, desiredTabs: 1000, expectedColorHue: 120 }, // blue
      { tabCount: 10, desiredTabs: 30, expectedColorHue: 120 }, // blue
    ].forEach(({ tabCount, desiredTabs, expectedColorHue }) => {
      it(`is hue ${expectedColorHue}`, async () => {
        settingsStub.userPreferences.badgeEnabled = true
        settingsStub.userPreferences.desiredTabs = desiredTabs
        settingsStub.userPreferences.changingColorEnabled = true
        chromeApiSpy.getTabs.and.returnValue(
          Promise.resolve(new Array(tabCount)),
        )

        await service.updateTabCount()
        expect(chromeApiSpy.setBadgeBackgroundColor).toHaveBeenCalledWith(
          hslToHex(expectedColorHue, 50, 50),
        )
      })
    }))

  describe('user settings enable/disable', () => {
    it('badge disabled does not change badge text or color', async () => {
      settingsStub.userPreferences.badgeEnabled = false

      await service.updateTabCount()

      expect(chromeApiSpy.setBadgeText).toHaveBeenCalledWith('')
      expect(chromeApiSpy.setBadgeBackgroundColor).toHaveBeenCalledTimes(0)
    })

    it('changing color disabled does not change badge color', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.changingColorEnabled = false
      chromeApiSpy.getTabs.and.returnValue(Promise.resolve(new Array(20)))

      await service.updateTabCount()

      expect(chromeApiSpy.setBadgeText).toHaveBeenCalledWith('20')
      expect(chromeApiSpy.setBadgeBackgroundColor).toHaveBeenCalledWith('blue')
    })
  })
})
