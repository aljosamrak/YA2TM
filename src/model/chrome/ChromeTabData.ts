import { injectable } from 'inversify'
import { TabData } from '../TabData'
import Tab = chrome.tabs.Tab

@injectable()
class ChromeTabData implements TabData {

  async query(): Promise<Tab[]> {
    return chrome.tabs.query({})
  }

  async remove(tabId: number): Promise<void> {
    return chrome.tabs.remove(tabId)
  }
}

export { ChromeTabData }
