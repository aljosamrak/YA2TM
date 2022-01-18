import 'reflect-metadata'
import {
  BadgeControllerImpl,
  hslToHex,
} from '../background/BadgeControllerImpl'
import { USER_PREFERENCES } from '../storage/Key'
import { StubLocalStorage } from './stub/StubLocalStorage'
import { StubBadgeView } from './stub/StubBadgeView'
import { StubTabData } from './stub/StubTabData'

describe('BadgeControllerImpl tests', () => {
  let SUT: BadgeControllerImpl
  let stubTabData: StubTabData
  let stubLocalStorage: StubLocalStorage
  let stubBadgeView: StubBadgeView

  beforeEach(async () => {
    stubTabData = new StubTabData()
    stubLocalStorage = new StubLocalStorage()
    stubBadgeView = new StubBadgeView()
    SUT = new BadgeControllerImpl(stubTabData, stubLocalStorage, stubBadgeView)
  })

  describe('Setting badge text', () => {
    test('the same as tab count', async () => {
      stubTabData.setTabs(new Array(20))

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
      stubLocalStorage.set(USER_PREFERENCES, { changingBadge: true,  desiredTabs: desiredTabs})

      return SUT.updateTabCount().then(_ =>
        expect(stubBadgeView.getBackgroundColor()).toBe(hslToHex(expectedColorHue, 50, 50))
      )
    })
  })

  describe('Changing badge user preference disabled', () => {
    test('does not change badge color', async () => {
      const spy = jest.spyOn(stubBadgeView, 'setBackgroundColor')
      stubLocalStorage.set(USER_PREFERENCES, { changingBadge: false })

      await SUT.updateTabCount()

      expect(spy).toHaveBeenCalledTimes(0)
    })
  })
})
