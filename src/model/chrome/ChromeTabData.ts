import { injectable } from 'inversify'
import { TabData } from '../TabData'
import Tab = chrome.tabs.Tab

@injectable()
class ChromeTabData implements TabData {

  async query(): Promise<Tab[]> {
    return chrome.tabs.query({})
  }
}

export { ChromeTabData }
