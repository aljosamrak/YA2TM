import { Injectable } from '@angular/core'
import { TabData } from '../TabData'
import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class ChromeTabData implements TabData {
  async query(): Promise<Tab[]> {
    return chrome.tabs.query({})
  }

  async remove(tabId: number): Promise<void> {
    return chrome.tabs.remove(tabId)
  }
}
