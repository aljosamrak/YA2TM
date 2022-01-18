import { BadgeView } from '../BadgeView'
import { injectable } from 'inversify'

@injectable()
class ChromeBadgeView implements BadgeView {
  setText(text: string): void {
    chrome.action.setBadgeText({ text: text })
  }

  setBackgroundColor(color: string): void {
    chrome.action.setBadgeBackgroundColor({ color: color })
  }
}

export { ChromeBadgeView }
