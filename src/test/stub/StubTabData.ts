import { TabData } from '../../model/TabData'

class StubTabData implements TabData {

  private _tabs: chrome.tabs.Tab[] = []

  query(): Promise<chrome.tabs.Tab[]> {
    return Promise.resolve(this._tabs)
  }

  setTabs(tabs: chrome.tabs.Tab[]) {
    this._tabs = tabs
  }
}

export { StubTabData }
