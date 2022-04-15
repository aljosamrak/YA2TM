import {BadgeView} from '../BadgeView'
import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ChromeBadgeView implements BadgeView {
  setText(text: string): void {
    chrome.action.setBadgeText({ text: text })
  }

  setBackgroundColor(color: string): void {
    chrome.action.setBadgeBackgroundColor({ color: color })
  }
}
