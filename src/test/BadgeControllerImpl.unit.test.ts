import 'reflect-metadata'
import {
  BadgeControllerImpl,
  hslToHex,
} from '../background/BadgeControllerImpl'
import { USER_PREFERENCES } from '../storage/Key'
import { StubLocalStorage } from './stub/StubLocalStorage'
import { StubBadgeView } from './stub/StubBadgeView'
import { StubTabData } from './stub/StubTabData'
import { StubWindowData } from './stub/StubWindowData'
import { BadgeTextType } from '../storage/Key'

describe('BadgeControllerImpl tests', () => {
  let SUT: BadgeControllerImpl

  let stubTabData: StubTabData
  let stubWindowData: StubWindowData
  let stubLocalStorage: StubLocalStorage
  let stubBadgeView: StubBadgeView

  beforeEach(async () => {
    stubTabData = new StubTabData()
    stubWindowData = new StubWindowData()
    stubLocalStorage = new StubLocalStorage()
    stubBadgeView = new StubBadgeView()
    SUT = new BadgeControllerImpl(stubTabData, stubWindowData, stubLocalStorage, stubBadgeView)
  })

  describe('User settings enable/disable', () => {
    test('Badge disabled does not change badge text or color', async () => {
      const spySetText = jest.spyOn(stubBadgeView, 'setText')
      const spySetColor = jest.spyOn(stubBadgeView, 'setBackgroundColor')
      stubLocalStorage.set(USER_PREFERENCES, { badgeEnabled: false })

      await SUT.updateTabCount()

      expect(spySetText).toHaveBeenCalledTimes(0)
      expect(spySetColor).toHaveBeenCalledTimes(0)
    })

    test('Changing color disabled does not change badge color', async () => {
      const spySetColor = jest.spyOn(stubBadgeView, 'setBackgroundColor')
      stubLocalStorage.set(USER_PREFERENCES, { badgeEnabled: true, changingColorEnabled: false })

      await SUT.updateTabCount()

      expect(spySetColor).toHaveBeenCalledTimes(0)
    })
  })

  describe('Setting badge text', () => {
    test('ALL_TAB preference the same as tab count', async () => {
      stubLocalStorage.set(USER_PREFERENCES, { badgeEnabled: true, badgeTextType: BadgeTextType.ALL_TABS})
      stubTabData.setTabs(new Array(20))

      await SUT.updateTabCount()

      expect(stubBadgeView.getText()).toBe('20')
    })

    test('ALL_WINDOW preference the same as window count', async () => {
      stubLocalStorage.set(USER_PREFERENCES, { badgeEnabled: true, badgeTextType: BadgeTextType.ALL_WINDOW})
      stubWindowData.set(new Array(20))

      await SUT.updateTabCount()

      expect(stubBadgeView.getText()).toBe('20')
    })
  })

  describe.each([
    {tabCount: 20, desiredTabs: 20, expectedColorHue: 60},   // yellow
    {tabCount: 2, desiredTabs: 2, expectedColorHue: 60},     // yellow
    {tabCount: 1000, desiredTabs: 1, expectedColorHue: 0},   // red
    {tabCount: 20, desiredTabs: 10, expectedColorHue: 30},   // orange
    {tabCount: 1, desiredTabs: 1000, expectedColorHue: 120}, // blue
    {tabCount: 10, desiredTabs: 30, expectedColorHue: 120},  // blue
  ])('Setting badge background color: tabCount: $tabCount, desiredTabs: $desiredTabs', ({tabCount, desiredTabs, expectedColorHue}) => {
    test(`is hue ${expectedColorHue}`, () => {
      stubTabData.setTabs(new Array(tabCount))
      stubLocalStorage.set(USER_PREFERENCES, { badgeEnabled: true, changingColorEnabled: true, changingBadge: true,  desiredTabs: desiredTabs})

      return SUT.updateTabCount().then(_ =>
        expect(stubBadgeView.getBackgroundColor()).toBe(hslToHex(expectedColorHue, 50, 50))
      )
    })
  })
})
