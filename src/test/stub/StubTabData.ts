import { TabData } from '../../model/TabData'

import Tab = chrome.tabs.Tab

class StubTabData implements TabData {
  private _tabs: chrome.tabs.Tab[] = []

  query(): Promise<chrome.tabs.Tab[]> {
    return Promise.resolve(this._tabs)
  }

  setTabs(tabs: chrome.tabs.Tab[]) {
    this._tabs = tabs
  }

  remove(id: number): Promise<void> {
    this._tabs = this._tabs.splice(id, 1)
    return Promise.resolve(undefined)
  }

  update(
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties,
  ): Promise<chrome.tabs.Tab> {
    return Promise.resolve(this._tabs[tabId])
  }

  createTab(url: string): Tab {
    return {
      index: 1,
      url: url,
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false,
      groupId: -1,
    }
  }
}

export { StubTabData }
