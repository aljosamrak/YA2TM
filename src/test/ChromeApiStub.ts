import { createTab } from '../app/background/deduplication.service.spec'

import Tab = chrome.tabs.Tab

export class ChromeApiStub {
  private tabs: Tab[] = []

  async getTabs(): Promise<chrome.tabs.Tab[]> {
    return Promise.resolve(this.tabs)
  }

  setTabs(urls: string[]) {
    let id = 1
    this.tabs = urls.map((url) => createTab(url, id++))
  }
}
