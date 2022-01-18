import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { LocalStorage } from '../storage/LocalStorage'
import { USER_PREFERENCES } from '../storage/Key'
import { BadgeController } from './BadgeController'
import { TYPES } from '../inversify/types'
import { BadgeView } from '../view/BadgeView'
import { TabData } from '../model/TabData'

@injectable()
class BadgeControllerImpl implements BadgeController {

  constructor(
    @inject(TYPES.TabData) private tabData: TabData,
    @inject(TYPES.LocalStorageService) private localStorage: LocalStorage,
    @inject(TYPES.BadgeView) private badgeView: BadgeView) {
    this.localStorage.addOnChangedListener(() => this.updateTabCount())
  }

  async updateTabCount(): Promise<void> {
    const [tabs, localStorageResult] = await Promise.all([
      this.tabData.query(),
      this.localStorage.get(USER_PREFERENCES),
    ])

    // Set tab number
    this.badgeView.setText(tabs.length.toString())

    // Set badge color
    if (localStorageResult[USER_PREFERENCES.key].changingBadge) {
      this.badgeView.setBackgroundColor(
        this.getBadgeColor(
          tabs.length,
          localStorageResult[USER_PREFERENCES.key].desiredTabs
        )
      )
    }
  }

  getBadgeColor(tabsNum: number, desiredTabs: number) {
    // Map number of tabs to a color so that below desired tabs is blue, around is yellow, and above is red.
    const hue = clamp(-3 * (tabsNum - desiredTabs) + 60, 0, 120)
    return hslToHex(hue, 50, 50)
  }
}

function hslToHex(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100
  let r
  let g
  let b
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (_p: number, _q: number, _t: number) => {
      if (_t < 0) {
        _t += 1
      }
      if (_t > 1) {
        _t -= 1
      }
      if (_t < 1 / 6) {
        return _p + (_q - _p) * 6 * _t
      }
      if (_t < 1 / 2) {
        return _q
      }
      if (_t < 2 / 3) {
        return _p + (_q - _p) * (2 / 3 - _t) * 6
      }
      return _p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (value * 255).clamp(0, 255)
 *
 * @param {Number} value The value that will be clamped
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export { BadgeControllerImpl, hslToHex }
