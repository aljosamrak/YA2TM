import { TestBed } from '@angular/core/testing'

import { ChromeApiStub } from '../../test/ChromeApiStub'

import { SettingsServiceStub } from '../../test/SettingsServiceStub'
import { ChromeApiService } from '../chrome/chrome-api.service'
import { BadgeTextType } from '../settings/model/user-preferences'
import { SettingsService } from '../settings/service/settings.service'
import { BadgeService, hslToHex } from './badge.service'

describe('BadgeService', () => {
  let service: BadgeService

  let chromeApiStub: ChromeApiStub
  let settingsStub: SettingsServiceStub

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        BadgeService,
        { provide: ChromeApiService, useClass: ChromeApiStub },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    })
  })

  beforeEach(() => {
    service = TestBed.inject(BadgeService)
    chromeApiStub = TestBed.inject(ChromeApiService) as unknown as ChromeApiStub
    settingsStub = TestBed.inject(SettingsService) as unknown as SettingsServiceStub
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('setting badge text', () => {
    it('ALL_TAB preference the same as tab count', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.badgeTextType = BadgeTextType.TABS_NUM
      chromeApiStub.setTabs(...Array(20).map((it) => it.toString()))

      await service.updateTabCount()

      expect(chromeApiStub.getBadgeText()).toEqual('20')
    })

    it('ALL_WINDOW preference the same as window count', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.badgeTextType = BadgeTextType.WINDOW_NUM
      chromeApiStub.setWindows(20)

      await service.updateTabCount()

      expect(chromeApiStub.getBadgeText()).toEqual('20')
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
        chromeApiStub.setTabs(...Array(tabCount).map((it) => it.toString()))

        await service.updateTabCount()
        expect(chromeApiStub.getBadgeBackgroundColor()).toEqual(hslToHex(expectedColorHue, 50, 50))
      })
    }))

  describe('user settings enable/disable', () => {
    it('badge disabled does not change badge text or color', async () => {
      settingsStub.userPreferences.badgeEnabled = false

      await service.updateTabCount()

      expect(chromeApiStub.getBadgeText()).toEqual('')
      expect(chromeApiStub.getBadgeBackgroundColor()).toEqual('')
    })

    it('changing color disabled does not change badge color', async () => {
      settingsStub.userPreferences.badgeEnabled = true
      settingsStub.userPreferences.changingColorEnabled = false
      chromeApiStub.setTabs(...Array(20).map((it) => it.toString()))

      await service.updateTabCount()

      expect(chromeApiStub.getBadgeText()).toEqual('20')
      expect(chromeApiStub.getBadgeBackgroundColor()).toEqual('blue')
    })
  })
})
